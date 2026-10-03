import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";

import {
  school,
  submission,
  teamMember,
  user,
  userProfile,
} from "@byte-quest/db";
import { eq } from "drizzle-orm";

import { teamsRouter } from "../teams/router";
import type { TestDb } from "../test/test-env";
import { call, createTestDb, fakeSession, makeContext } from "../test/test-env";
import { submissionsRouter } from "./router";

let testDb: TestDb;

beforeEach(async () => {
  testDb = await createTestDb();
});

afterEach(async () => {
  await testDb.cleanup();
});

interface World {
  leaderUserId: string;
  leaderGrade: string;
  teamId: string;
  schoolId: string;
  adminUserId: string;
}

const seedStudent = async (grade: string): Promise<string> => {
  const userId = randomUUID();
  await testDb.db.insert(user).values({
    id: userId,
    name: `Student ${grade}`,
    email: `${userId}@test.local`,
  });
  await testDb.db.insert(userProfile).values({
    userId,
    role: "student",
    fullName: `Student ${grade}`,
    nationalId: randomUUID(),
    birthday: "2010-06-15",
    grade,
  });
  return userId;
};

const seedAdmin = async (): Promise<string> => {
  const userId = randomUUID();
  await testDb.db.insert(user).values({
    id: userId,
    name: "Admin",
    email: `${userId}@test.local`,
  });
  await testDb.db.insert(userProfile).values({
    userId,
    role: "admin",
    fullName: "Admin",
    nationalId: "ADMIN-ID",
    birthday: "1990-01-01",
    grade: "13",
  });
  return userId;
};

/** Leader + team + school + admin, ready for submissions. */
const seedWorld = async (division: "primary" | "secondary"): Promise<World> => {
  const leaderGrade = division === "primary" ? "8" : "12";
  const leaderUserId = await seedStudent(leaderGrade);
  const adminUserId = await seedAdmin();
  const [schoolRow] = await testDb.db
    .insert(school)
    .values({ name: `School ${randomUUID()}`, city: "Testville" })
    .returning();
  if (!schoolRow) {
    throw new Error("Failed to seed school");
  }

  const teamRow = await call(teamsRouter.teams.create, {
    context: makeContext(testDb.db, {
      session: fakeSession(leaderUserId),
      profile: { userId: leaderUserId, grade: leaderGrade },
    }),
    input: { name: `Team ${randomUUID()}`, schoolId: schoolRow.id, division },
  });

  return {
    leaderUserId,
    leaderGrade,
    teamId: teamRow.id,
    schoolId: schoolRow.id,
    adminUserId,
  };
};

const leaderCtx = (w: World) =>
  makeContext(testDb.db, {
    session: fakeSession(w.leaderUserId),
    profile: { userId: w.leaderUserId, grade: w.leaderGrade },
  });

const adminCtx = (w: World) =>
  makeContext(testDb.db, {
    session: fakeSession(w.adminUserId),
    profile: { userId: w.adminUserId, role: "admin", grade: "13" },
  });

describe("submissions lifecycle (draft → forward → review)", () => {
  test("leader opens a draft; only one per team", async () => {
    const w = await seedWorld("primary");

    const created = await call(submissionsRouter.submissions.open, {
      context: leaderCtx(w),
      input: {
        title: "RecycleQuest",
        description: "Gamified recycling.",
        repoUrl: "https://github.com/team/recyclequest",
      },
    });
    expect(created.status).toBe("draft");

    await expect(
      call(submissionsRouter.submissions.open, {
        context: leaderCtx(w),
        input: { title: "Second", description: "Nope" },
      })
    ).rejects.toThrow("already has a submission");
  });

  test("non-leader cannot open a submission", async () => {
    const w = await seedWorld("primary");

    const memberUserId = await seedStudent("9");
    await testDb.db.insert(teamMember).values({
      teamId: w.teamId,
      userId: memberUserId,
      teamRole: "developer",
      grade: "9",
      fullName: "Dev",
      nationalId: "X",
      birthday: "2010-01-01",
    });

    await expect(
      call(submissionsRouter.submissions.open, {
        context: makeContext(testDb.db, {
          session: fakeSession(memberUserId),
          profile: { userId: memberUserId, grade: "9" },
        }),
        input: { title: "Nope", description: "Nope" },
      })
    ).rejects.toThrow("Only the team leader");
  });

  test("forward routes the submission to the chosen school", async () => {
    const w = await seedWorld("primary");

    const draft = await call(submissionsRouter.submissions.open, {
      context: leaderCtx(w),
      input: { title: "Forward Me", description: "..." },
    });

    const forwarded = await call(submissionsRouter.submissions.forward, {
      context: leaderCtx(w),
      input: { submissionId: draft.id, schoolId: w.schoolId },
    });

    expect(forwarded.status).toBe("submitted");
    expect(forwarded.schoolId).toBe(w.schoolId);
    expect(forwarded.forwardedAt).not.toBeNull();
  });

  test("cannot forward to a nonexistent school", async () => {
    const w = await seedWorld("primary");
    const draft = await call(submissionsRouter.submissions.open, {
      context: leaderCtx(w),
      input: { title: "X", description: "..." },
    });

    await expect(
      call(submissionsRouter.submissions.forward, {
        context: leaderCtx(w),
        input: { submissionId: draft.id, schoolId: randomUUID() },
      })
    ).rejects.toThrow("School not found");
  });

  test("drafts cannot be forwarded twice", async () => {
    const w = await seedWorld("primary");
    const draft = await call(submissionsRouter.submissions.open, {
      context: leaderCtx(w),
      input: { title: "X", description: "..." },
    });
    await call(submissionsRouter.submissions.forward, {
      context: leaderCtx(w),
      input: { submissionId: draft.id, schoolId: w.schoolId },
    });

    await expect(
      call(submissionsRouter.submissions.forward, {
        context: leaderCtx(w),
        input: { submissionId: draft.id, schoolId: w.schoolId },
      })
    ).rejects.toThrow("Only draft submissions");
  });

  test("admin approves a submitted submission; review is recorded", async () => {
    const w = await seedWorld("primary");
    const draft = await call(submissionsRouter.submissions.open, {
      context: leaderCtx(w),
      input: { title: "Approve Me", description: "..." },
    });
    await call(submissionsRouter.submissions.forward, {
      context: leaderCtx(w),
      input: { submissionId: draft.id, schoolId: w.schoolId },
    });

    const reviewed = await call(submissionsRouter.submissions.review, {
      context: adminCtx(w),
      input: { submissionId: draft.id, approve: true, note: "Great work" },
    });

    expect(reviewed.status).toBe("approved");
    expect(reviewed.reviewNote).toBe("Great work");

    const [row] = await testDb.db
      .select()
      .from(submission)
      .where(eq(submission.id, draft.id));
    expect(row?.reviewedByUserId).toBe(w.adminUserId);
    expect(row?.reviewedAt).not.toBeNull();
  });

  test("admin rejects with a note", async () => {
    const w = await seedWorld("primary");
    const draft = await call(submissionsRouter.submissions.open, {
      context: leaderCtx(w),
      input: { title: "Reject Me", description: "..." },
    });
    await call(submissionsRouter.submissions.forward, {
      context: leaderCtx(w),
      input: { submissionId: draft.id, schoolId: w.schoolId },
    });

    const reviewed = await call(submissionsRouter.submissions.review, {
      context: adminCtx(w),
      input: { submissionId: draft.id, approve: false, note: "Incomplete" },
    });
    expect(reviewed.status).toBe("rejected");
  });

  test("draft submissions cannot be reviewed yet", async () => {
    const w = await seedWorld("primary");
    const draft = await call(submissionsRouter.submissions.open, {
      context: leaderCtx(w),
      input: { title: "Too Early", description: "..." },
    });

    await expect(
      call(submissionsRouter.submissions.review, {
        context: adminCtx(w),
        input: { submissionId: draft.id, approve: true },
      })
    ).rejects.toThrow("Only forwarded (submitted) submissions");
  });

  test("adminList filters by status", async () => {
    const w = await seedWorld("primary");
    const draft = await call(submissionsRouter.submissions.open, {
      context: leaderCtx(w),
      input: { title: "Filter Me", description: "..." },
    });

    const drafts = await call(submissionsRouter.submissions.adminList, {
      context: adminCtx(w),
      input: { status: "draft" },
    });
    expect(drafts.some((s) => s.id === draft.id)).toBe(true);

    const approved = await call(submissionsRouter.submissions.adminList, {
      context: adminCtx(w),
      input: { status: "approved" },
    });
    expect(approved.some((s) => s.id === draft.id)).toBe(false);
  });

  test("mine returns the leader's team submission or null", async () => {
    const w = await seedWorld("primary");

    expect(
      await call(submissionsRouter.submissions.mine, { context: leaderCtx(w) })
    ).toBeNull();

    await call(submissionsRouter.submissions.open, {
      context: leaderCtx(w),
      input: { title: "Mine", description: "..." },
    });
    const mine = await call(submissionsRouter.submissions.mine, {
      context: leaderCtx(w),
    });
    expect(mine?.title).toBe("Mine");
  });

  test("leader can update a draft but not after forwarding", async () => {
    const w = await seedWorld("primary");
    const draft = await call(submissionsRouter.submissions.open, {
      context: leaderCtx(w),
      input: { title: "Draft", description: "..." },
    });

    const updated = await call(submissionsRouter.submissions.update, {
      context: leaderCtx(w),
      input: { submissionId: draft.id, title: "Draft v2" },
    });
    expect(updated.title).toBe("Draft v2");

    await call(submissionsRouter.submissions.forward, {
      context: leaderCtx(w),
      input: { submissionId: draft.id, schoolId: w.schoolId },
    });
    await expect(
      call(submissionsRouter.submissions.update, {
        context: leaderCtx(w),
        input: { submissionId: draft.id, title: "Late edit" },
      })
    ).rejects.toThrow("Only draft submissions can be edited");
  });

  test("cannot review a nonexistent submission", async () => {
    const w = await seedWorld("primary");
    await expect(
      call(submissionsRouter.submissions.review, {
        context: adminCtx(w),
        input: { submissionId: randomUUID(), approve: true },
      })
    ).rejects.toThrow("Submission not found");
  });
});

describe("schools feature", () => {
  test("list returns all schools sorted by name", async () => {
    await testDb.db.insert(school).values([
      { name: "B School", city: "B" },
      { name: "A School", city: "A" },
    ]);
    const { schoolsRouter } = await import("../schools/router");
    const rows = await call(schoolsRouter.schools.list, {
      context: makeContext(testDb.db),
    });
    const names = rows.map((r) => r.name);
    expect(names.indexOf("A School")).toBeLessThan(names.indexOf("B School"));
  });

  test("get reports division slot usage", async () => {
    const w = await seedWorld("primary");
    const { schoolsRouter } = await import("../schools/router");
    const detail = await call(schoolsRouter.schools.get, {
      context: makeContext(testDb.db),
      input: { id: w.schoolId },
    });
    expect(detail.primarySlotsUsed).toBe(1);
    expect(detail.secondarySlotsUsed).toBe(0);
  });

  test("admin can create and update schools", async () => {
    const adminUserId = await seedAdmin();
    const ctx = makeContext(testDb.db, {
      session: fakeSession(adminUserId),
      profile: { userId: adminUserId, role: "admin", grade: "13" },
    });

    const { schoolsRouter } = await import("../schools/router");
    const created = await call(schoolsRouter.schools.create, {
      context: ctx,
      input: { name: "New School", city: "New City" },
    });
    expect(created.name).toBe("New School");

    const updated = await call(schoolsRouter.schools.update, {
      context: ctx,
      input: { id: created.id, city: "Renamed City" },
    });
    expect(updated.city).toBe("Renamed City");
  });
});

describe("access feature (RBAC)", () => {
  test("me returns the caller profile", async () => {
    const userId = await seedStudent("8");
    const { accessRouter } = await import("../access/router");
    const me = await call(accessRouter.access.me, {
      context: makeContext(testDb.db, {
        session: fakeSession(userId),
        profile: { userId, grade: "8" },
      }),
    });
    expect(me.role).toBe("student");
    expect(me.grade).toBe("8");
  });

  test("admin setRole promotes a student to admin", async () => {
    const adminUserId = await seedAdmin();
    const studentId = await seedStudent("8");
    const ctx = makeContext(testDb.db, {
      session: fakeSession(adminUserId),
      profile: { userId: adminUserId, role: "admin", grade: "13" },
    });

    const { accessRouter } = await import("../access/router");
    const result = await call(accessRouter.access.setRole, {
      context: ctx,
      input: { userId: studentId, role: "admin" },
    });
    expect(result.role).toBe("admin");

    const [profile] = await testDb.db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, studentId));
    expect(profile?.role).toBe("admin");
  });

  test("admin cannot change their own role", async () => {
    const adminUserId = await seedAdmin();
    const ctx = makeContext(testDb.db, {
      session: fakeSession(adminUserId),
      profile: { userId: adminUserId, role: "admin", grade: "13" },
    });

    const { accessRouter } = await import("../access/router");
    await expect(
      call(accessRouter.access.setRole, {
        context: ctx,
        input: { userId: adminUserId, role: "student" },
      })
    ).rejects.toThrow("Cannot change your own role");
  });

  test("signup creates a profile for a fresh session", async () => {
    const userId = randomUUID();
    await testDb.db.insert(user).values({
      id: userId,
      name: "Fresh",
      email: `${userId}@test.local`,
    });
    const ctx = makeContext(testDb.db, {
      session: fakeSession(userId),
    });

    const { accessRouter } = await import("../access/router");
    const result = await call(accessRouter.access.signup, {
      context: ctx,
      input: {
        fullName: "Fresh Person",
        nationalId: "FRESH-1",
        birthday: "2011-04-04",
        grade: "7",
      },
    });
    expect(result.profileId).toBeDefined();

    // Duplicate signup is rejected.
    await expect(
      call(accessRouter.access.signup, {
        context: ctx,
        input: {
          fullName: "Fresh Person",
          nationalId: "FRESH-1",
          birthday: "2011-04-04",
          grade: "7",
        },
      })
    ).rejects.toThrow("Profile already exists");
  });
});

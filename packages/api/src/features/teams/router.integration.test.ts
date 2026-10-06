import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";

import { school, teamMember, user, userProfile } from "@byte-quest/db";
import { eq } from "drizzle-orm";

import type { TestDb } from "../test/test-env";
import { call, createTestDb, fakeSession, makeContext } from "../test/test-env";
import { teamsRouter } from "./router";

let testDb: TestDb;

beforeEach(async () => {
  testDb = await createTestDb();
});

afterEach(async () => {
  await testDb.cleanup();
});

interface SeededStudent {
  userId: string;
  profileId: string;
  grade: string;
}

const seedStudent = async (grade: string): Promise<SeededStudent> => {
  const userId = randomUUID();
  await testDb.db.insert(user).values({
    id: userId,
    name: `Student ${grade}`,
    email: `${userId}@test.local`,
  });
  const [profile] = await testDb.db
    .insert(userProfile)
    .values({
      userId,
      role: "student",
      fullName: `Student ${grade}`,
      nationalId: randomUUID(),
      birthday: "2010-06-15",
      grade,
    })
    .returning();
  if (!profile) {
    throw new Error("Failed to seed profile");
  }
  return { userId, profileId: profile.id, grade };
};

const seedSchool = async (): Promise<string> => {
  const [row] = await testDb.db
    .insert(school)
    .values({ name: `School ${randomUUID()}`, city: "Testville" })
    .returning();
  if (!row) {
    throw new Error("Failed to seed school");
  }
  return row.id;
};

const ctxFor = (userId: string, grade: string) =>
  makeContext(testDb.db, {
    session: fakeSession(userId),
    profile: { userId, grade },
  });

const member = (grade: string, suffix: string) => ({
  fullName: `Student ${suffix}`,
  grade,
  className: `10${suffix}`,
  admissionNumber: `ADM-${suffix}`,
});

const basePayload = (overrides: Partial<Record<string, unknown>> = {}) => ({
  teamName: "Byte Falcons",
  division: "primary" as const,
  school: {
    name: `Register School ${randomUUID()}`,
    province: "Southern",
    city: "Galle",
  },
  members: [member("6", "A"), member("7", "B"), member("8", "C")],
  leaderIndex: 0,
  teacher: {
    name: "Jane MIC",
    designation: "ICT Teacher",
    phone: "0712345678",
    email: "jane@school.lk",
  },
  ...overrides,
});

describe("teams.create (division + one-team-per-school rules)", () => {
  test("leader creates a primary team and becomes its only member", async () => {
    const leader = await seedStudent("8");
    const schoolId = await seedSchool();
    const ctx = ctxFor(leader.userId, "8");

    const created = await call(teamsRouter.teams.create, {
      context: ctx,
      input: { name: "Byte Sharks", schoolId, division: "primary" },
    });

    expect(created.name).toBe("Byte Sharks");
    expect(created.division).toBe("primary");
    expect(created.memberCount).toBe(1);

    const members = await testDb.db
      .select()
      .from(teamMember)
      .where(eq(teamMember.teamId, created.id));
    expect(members).toHaveLength(1);
    expect(members[0]?.teamRole).toBe("leader");
  });

  test("rejects a grade-10 student creating a primary team", async () => {
    const leader = await seedStudent("10");
    const schoolId = await seedSchool();
    const ctx = ctxFor(leader.userId, "10");

    await expect(
      call(teamsRouter.teams.create, {
        context: ctx,
        input: { name: "Wrong Division", schoolId, division: "primary" },
      })
    ).rejects.toThrow("does not match");
  });

  test("rejects a grade-6 student creating a secondary team", async () => {
    const leader = await seedStudent("6");
    const schoolId = await seedSchool();
    const ctx = ctxFor(leader.userId, "6");

    await expect(
      call(teamsRouter.teams.create, {
        context: ctx,
        input: { name: "Wrong Division", schoolId, division: "secondary" },
      })
    ).rejects.toThrow("does not match");
  });

  test("rejects a second team for the same school + division", async () => {
    const leader1 = await seedStudent("7");
    const leader2 = await seedStudent("9");
    const schoolId = await seedSchool();

    await call(teamsRouter.teams.create, {
      context: ctxFor(leader1.userId, "7"),
      input: { name: "First Team", schoolId, division: "primary" },
    });

    await expect(
      call(teamsRouter.teams.create, {
        context: ctxFor(leader2.userId, "9"),
        input: { name: "Second Team", schoolId, division: "primary" },
      })
    ).rejects.toThrow("already has a primary team");
  });

  test("allows one primary AND one secondary team per school", async () => {
    const primaryLeader = await seedStudent("8");
    const secondaryLeader = await seedStudent("12");
    const schoolId = await seedSchool();

    const primary = await call(teamsRouter.teams.create, {
      context: ctxFor(primaryLeader.userId, "8"),
      input: { name: "Primary Team", schoolId, division: "primary" },
    });
    const secondary = await call(teamsRouter.teams.create, {
      context: ctxFor(secondaryLeader.userId, "12"),
      input: { name: "Secondary Team", schoolId, division: "secondary" },
    });

    expect(primary.division).toBe("primary");
    expect(secondary.division).toBe("secondary");
  });
});

describe("teams join flow (request → approve → membership)", () => {
  test("full happy path: leader approves a matching-grade request", async () => {
    const leader = await seedStudent("8");
    const schoolId = await seedSchool();
    const teamRow = await call(teamsRouter.teams.create, {
      context: ctxFor(leader.userId, "8"),
      input: { name: "Joiners", schoolId, division: "primary" },
    });

    const joiner = await seedStudent("9");
    const request = await call(teamsRouter.teams.requestToJoin, {
      context: ctxFor(joiner.userId, "9"),
      input: { teamId: teamRow.id, specialty: "ui" },
    });
    expect(request.status).toBe("pending");

    const decided = await call(teamsRouter.teams.decideJoinRequest, {
      context: ctxFor(leader.userId, "8"),
      input: { requestId: request.id, approve: true },
    });
    expect(decided.status).toBe("approved");

    const members = await testDb.db
      .select()
      .from(teamMember)
      .where(eq(teamMember.teamId, teamRow.id));
    expect(members).toHaveLength(2);
    const joinerMembership = members.find((m) => m.userId === joiner.userId);
    expect(joinerMembership?.teamRole).toBe("developer");
    expect(joinerMembership?.specialty).toBe("ui");
    // Identification snapshot copied from profile:
    expect(joinerMembership?.fullName).toBe("Student 9");
  });

  test("rejects joiner from the wrong division", async () => {
    const leader = await seedStudent("8");
    const schoolId = await seedSchool();
    const teamRow = await call(teamsRouter.teams.create, {
      context: ctxFor(leader.userId, "8"),
      input: { name: "Primary Only", schoolId, division: "primary" },
    });

    const joiner = await seedStudent("12");
    await expect(
      call(teamsRouter.teams.requestToJoin, {
        context: ctxFor(joiner.userId, "12"),
        input: { teamId: teamRow.id },
      })
    ).rejects.toThrow("does not match");
  });

  test("user already on a team cannot request to join another", async () => {
    const leader = await seedStudent("8");
    const schoolId = await seedSchool();
    const teamRow = await call(teamsRouter.teams.create, {
      context: ctxFor(leader.userId, "8"),
      input: { name: "Alpha", schoolId, division: "primary" },
    });
    const joiner = await seedStudent("9");
    const request = await call(teamsRouter.teams.requestToJoin, {
      context: ctxFor(joiner.userId, "9"),
      input: { teamId: teamRow.id },
    });
    await call(teamsRouter.teams.decideJoinRequest, {
      context: ctxFor(leader.userId, "8"),
      input: { requestId: request.id, approve: true },
    });

    const schoolId2 = await seedSchool();
    const otherLeader = await seedStudent("7");
    const otherTeam = await call(teamsRouter.teams.create, {
      context: ctxFor(otherLeader.userId, "7"),
      input: { name: "Beta", schoolId: schoolId2, division: "primary" },
    });

    await expect(
      call(teamsRouter.teams.requestToJoin, {
        context: ctxFor(joiner.userId, "9"),
        input: { teamId: otherTeam.id },
      })
    ).rejects.toThrow("already on a team");
  });

  test("rejecting a request creates no membership", async () => {
    const leader = await seedStudent("8");
    const schoolId = await seedSchool();
    const teamRow = await call(teamsRouter.teams.create, {
      context: ctxFor(leader.userId, "8"),
      input: { name: "Rejectors", schoolId, division: "primary" },
    });

    const joiner = await seedStudent("9");
    const request = await call(teamsRouter.teams.requestToJoin, {
      context: ctxFor(joiner.userId, "9"),
      input: { teamId: teamRow.id },
    });

    const decided = await call(teamsRouter.teams.decideJoinRequest, {
      context: ctxFor(leader.userId, "8"),
      input: { requestId: request.id, approve: false },
    });
    expect(decided.status).toBe("rejected");

    const members = await testDb.db
      .select()
      .from(teamMember)
      .where(eq(teamMember.teamId, teamRow.id));
    expect(members).toHaveLength(1);
  });

  test("non-leader cannot decide join requests", async () => {
    const leader = await seedStudent("8");
    const schoolId = await seedSchool();
    const teamRow = await call(teamsRouter.teams.create, {
      context: ctxFor(leader.userId, "8"),
      input: { name: "Leaderless", schoolId, division: "primary" },
    });

    const joiner = await seedStudent("9");
    const request = await call(teamsRouter.teams.requestToJoin, {
      context: ctxFor(joiner.userId, "9"),
      input: { teamId: teamRow.id },
    });

    await expect(
      call(teamsRouter.teams.decideJoinRequest, {
        context: ctxFor(joiner.userId, "9"),
        input: { requestId: request.id, approve: true },
      })
    ).rejects.toThrow("Only the team leader");
  });

  test("team cannot exceed 5 members", async () => {
    const leader = await seedStudent("8");
    const schoolId = await seedSchool();
    const teamRow = await call(teamsRouter.teams.create, {
      context: ctxFor(leader.userId, "8"),
      input: { name: "Full House", schoolId, division: "primary" },
    });

    // Fill to 5 members (leader + 4 approved joiners).
    const joiners = await Promise.all([
      seedStudent("9"),
      seedStudent("9"),
      seedStudent("9"),
      seedStudent("9"),
    ]);
    await Promise.all(
      joiners.map(async (joiner) => {
        const request = await call(teamsRouter.teams.requestToJoin, {
          context: ctxFor(joiner.userId, "9"),
          input: { teamId: teamRow.id },
        });
        await call(teamsRouter.teams.decideJoinRequest, {
          context: ctxFor(leader.userId, "8"),
          input: { requestId: request.id, approve: true },
        });
      })
    );

    // 6th member: request fails because the team is full.
    const sixth = await seedStudent("9");
    await expect(
      call(teamsRouter.teams.requestToJoin, {
        context: ctxFor(sixth.userId, "9"),
        input: { teamId: teamRow.id },
      })
    ).rejects.toThrow("Team is full");
  });

  test("leader cannot leave; developer can", async () => {
    const leader = await seedStudent("8");
    const schoolId = await seedSchool();
    const teamRow = await call(teamsRouter.teams.create, {
      context: ctxFor(leader.userId, "8"),
      input: { name: "Leavers", schoolId, division: "primary" },
    });

    await expect(
      call(teamsRouter.teams.leave, {
        context: ctxFor(leader.userId, "8"),
        input: { teamId: teamRow.id },
      })
    ).rejects.toThrow("Leaders must transfer leadership");

    const joiner = await seedStudent("9");
    const request = await call(teamsRouter.teams.requestToJoin, {
      context: ctxFor(joiner.userId, "9"),
      input: { teamId: teamRow.id },
    });
    await call(teamsRouter.teams.decideJoinRequest, {
      context: ctxFor(leader.userId, "8"),
      input: { requestId: request.id, approve: true },
    });

    const result = await call(teamsRouter.teams.leave, {
      context: ctxFor(joiner.userId, "9"),
      input: { teamId: teamRow.id },
    });
    expect(result.success).toBe(true);

    const members = await testDb.db
      .select()
      .from(teamMember)
      .where(eq(teamMember.teamId, teamRow.id));
    expect(members).toHaveLength(1);
  });

  test("myTeam returns null when not on a team, data when on one", async () => {
    const leader = await seedStudent("8");
    const ctx = ctxFor(leader.userId, "8");

    expect(await call(teamsRouter.teams.myTeam, { context: ctx })).toBeNull();

    const schoolId = await seedSchool();
    const teamRow = await call(teamsRouter.teams.create, {
      context: ctx,
      input: { name: "Mine", schoolId, division: "primary" },
    });

    const myTeam = await call<
      typeof teamsRouter.teams.myTeam,
      {
        id: string;
        memberCount: number;
      } | null
    >(teamsRouter.teams.myTeam, { context: ctx });
    expect(myTeam?.id).toBe(teamRow.id);
    expect(myTeam?.memberCount).toBe(1);
  });

  test("adminList includes school name and size bounds", async () => {
    const leader = await seedStudent("8");
    const schoolId = await seedSchool();
    await call(teamsRouter.teams.create, {
      context: ctxFor(leader.userId, "8"),
      input: { name: "Admin Team", schoolId, division: "primary" },
    });

    const adminUserId = randomUUID();
    await testDb.db.insert(user).values({
      id: adminUserId,
      name: "Admin",
      email: `${adminUserId}@test.local`,
    });
    await testDb.db.insert(userProfile).values({
      userId: adminUserId,
      role: "admin",
      fullName: "Admin",
      nationalId: "ADMIN-ID",
      birthday: "1990-01-01",
      grade: "13",
    });

    const adminCtx = makeContext(testDb.db, {
      session: fakeSession(adminUserId),
      profile: { userId: adminUserId, role: "admin", grade: "13" },
    });

    const rows = await call<
      typeof teamsRouter.teams.adminList,
      {
        name: string;
        memberCount: number;
        minMembers: number;
        maxMembers: number;
      }[]
    >(teamsRouter.teams.adminList, { context: adminCtx });
    const row = rows.find((r) => r.name === "Admin Team");
    expect(row).toBeDefined();
    expect(row?.memberCount).toBe(1);
    expect(row?.minMembers).toBe(3);
    expect(row?.maxMembers).toBe(5);
  });
});

describe("teams.register (public, no-auth school registration)", () => {
  test("registers a team with no session and inserts every member", async () => {
    const noAuthContext = makeContext(testDb.db);

    const result = await call(teamsRouter.teams.register, {
      context: noAuthContext,
      input: basePayload(),
    });

    expect(result.name).toBe("Byte Falcons");
    expect(result.memberCount).toBe(3);

    const members = await testDb.db
      .select()
      .from(teamMember)
      .where(eq(teamMember.teamId, result.id));
    expect(members).toHaveLength(3);
    expect(members.every((m) => m.userId === null)).toBe(true);
    const leader = members.find((m) => m.teamRole === "leader");
    expect(leader?.fullName).toBe("Student A");
    expect(leader?.admissionNumber).toBe("ADM-A");
  });

  test("rejects a member whose grade does not match the division", async () => {
    const noAuthContext = makeContext(testDb.db);

    await expect(
      call(teamsRouter.teams.register, {
        context: noAuthContext,
        input: basePayload({
          members: [member("6", "A"), member("12", "B"), member("8", "C")],
        }),
      })
    ).rejects.toThrow("does not match");
  });

  test("rejects a leaderIndex outside the member list", async () => {
    const noAuthContext = makeContext(testDb.db);

    await expect(
      call(teamsRouter.teams.register, {
        context: noAuthContext,
        input: basePayload({ leaderIndex: 3 }),
      })
    ).rejects.toThrow("must be one of the registered members");
  });

  test("rejects fewer than 3 members", async () => {
    const noAuthContext = makeContext(testDb.db);

    await expect(
      call(teamsRouter.teams.register, {
        context: noAuthContext,
        input: basePayload({ members: [member("6", "A"), member("7", "B")] }),
      })
    ).rejects.toThrow();
  });

  test("a school cannot register two teams in the same division", async () => {
    const noAuthContext = makeContext(testDb.db);
    const schoolInput = {
      name: `Capped School ${randomUUID()}`,
      province: "Western",
      city: "Colombo",
    };

    await call(teamsRouter.teams.register, {
      context: noAuthContext,
      input: basePayload({ school: schoolInput }),
    });

    await expect(
      call(teamsRouter.teams.register, {
        context: noAuthContext,
        input: basePayload({
          teamName: "Second Team",
          school: schoolInput,
        }),
      })
    ).rejects.toThrow("already has a primary team");
  });

  test("a school can register one junior and one senior team", async () => {
    const noAuthContext = makeContext(testDb.db);
    const schoolInput = {
      name: `Two Division School ${randomUUID()}`,
      province: "Central",
      city: "Kandy",
    };

    const primary = await call(teamsRouter.teams.register, {
      context: noAuthContext,
      input: basePayload({ school: schoolInput }),
    });

    const secondary = await call(teamsRouter.teams.register, {
      context: noAuthContext,
      input: basePayload({
        teamName: "Senior Team",
        division: "secondary" as const,
        school: schoolInput,
        members: [member("9", "D"), member("10", "E"), member("11", "F")],
      }),
    });

    expect(primary.division).toBe("primary");
    expect(secondary.division).toBe("secondary");
    expect(primary.schoolId).toBe(secondary.schoolId);
  });

  test("reuses an existing school by exact name match", async () => {
    const noAuthContext = makeContext(testDb.db);
    const schoolInput = {
      name: `Reused School ${randomUUID()}`,
      province: "Uva",
      city: "Badulla",
    };

    const first = await call(teamsRouter.teams.register, {
      context: noAuthContext,
      input: basePayload({ school: schoolInput }),
    });
    const second = await call(teamsRouter.teams.register, {
      context: noAuthContext,
      input: basePayload({
        teamName: "Senior Reuse",
        division: "secondary" as const,
        school: schoolInput,
        members: [member("9", "D"), member("10", "E"), member("11", "F")],
      }),
    });

    expect(first.schoolId).toBe(second.schoolId);

    const schools = await testDb.db
      .select()
      .from(school)
      .where(eq(school.name, schoolInput.name));
    expect(schools).toHaveLength(1);
  });
});

describe("teams.register editToken + teams.update/getByEditToken", () => {
  test("register returns a usable editToken, and getByEditToken reads it back", async () => {
    const noAuthContext = makeContext(testDb.db);

    const result = await call(teamsRouter.teams.register, {
      context: noAuthContext,
      input: basePayload(),
    });
    expect(result.editToken).toBeTruthy();

    const fetched = await call(teamsRouter.teams.getByEditToken, {
      context: noAuthContext,
      input: { editToken: result.editToken },
    });
    expect(fetched.teamId).toBe(result.id);
    expect(fetched.teamName).toBe("Byte Falcons");
    expect(fetched.members).toHaveLength(3);
    expect(fetched.members[0]?.fullName).toBe("Student A");
  });

  test("update revises team, school, and roster in place without changing the reference", async () => {
    const noAuthContext = makeContext(testDb.db);

    const created = await call(teamsRouter.teams.register, {
      context: noAuthContext,
      input: basePayload(),
    });

    const updated = await call(teamsRouter.teams.update, {
      context: noAuthContext,
      input: basePayload({
        teamName: "Byte Falcons Renamed",
        members: [member("6", "X"), member("7", "Y"), member("8", "Z")],
        editToken: created.editToken,
      }),
    });

    expect(updated.id).toBe(created.id);
    expect(updated.name).toBe("Byte Falcons Renamed");

    const members = await testDb.db
      .select()
      .from(teamMember)
      .where(eq(teamMember.teamId, created.id));
    expect(members).toHaveLength(3);
    expect(members.map((m) => m.fullName).toSorted()).toEqual([
      "Student X",
      "Student Y",
      "Student Z",
    ]);
  });

  test("update rejects an unknown edit token", async () => {
    const noAuthContext = makeContext(testDb.db);

    await expect(
      call(teamsRouter.teams.update, {
        context: noAuthContext,
        input: basePayload({ editToken: "not-a-real-token" }),
      })
    ).rejects.toThrow("not found");
  });

  test("update rejects a payload that changes the division", async () => {
    const noAuthContext = makeContext(testDb.db);

    const created = await call(teamsRouter.teams.register, {
      context: noAuthContext,
      input: basePayload(),
    });

    await expect(
      call(teamsRouter.teams.update, {
        context: noAuthContext,
        input: basePayload({
          division: "secondary" as const,
          members: [member("9", "D"), member("10", "E"), member("11", "F")],
          editToken: created.editToken,
        }),
      })
    ).rejects.toThrow("division cannot be changed");
  });
});

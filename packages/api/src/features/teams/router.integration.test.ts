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

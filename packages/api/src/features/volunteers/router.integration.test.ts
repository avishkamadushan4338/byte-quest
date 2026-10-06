import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { randomUUID } from "node:crypto";

import { user, userProfile } from "@byte-quest/db";

import type { TestDb } from "../test/test-env";
import { call, createTestDb, fakeSession, makeContext } from "../test/test-env";
import { volunteersRouter } from "./router";

let testDb: TestDb;

beforeEach(async () => {
  testDb = await createTestDb();
});

afterEach(async () => {
  await testDb.cleanup();
});

const basePayload = (overrides: Partial<Record<string, unknown>> = {}) => ({
  teams: ["design-team", "media-crew"],
  student: {
    fullName: "Amaya Perera",
    school: "St. Aloysius' College",
    admissionNumber: "12345",
    grade: "10",
    className: "10B",
    contactNumber: "0712345678",
  },
  guardian: {
    name: "Nilmini Perera",
    contactNumber: "0778765432",
  },
  ...overrides,
});

const seedAdmin = async (): Promise<string> => {
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
  return adminUserId;
};

const adminCtx = (adminUserId: string) =>
  makeContext(testDb.db, {
    session: fakeSession(adminUserId),
    profile: { userId: adminUserId, role: "admin" },
  });

describe("volunteers.apply + adminList (public application intake)", () => {
  test("accepts an application with no session and returns a reference", async () => {
    const noAuthContext = makeContext(testDb.db);

    const result = await call(volunteersRouter.volunteers.apply, {
      context: noAuthContext,
      input: basePayload(),
    });

    expect(result.status).toBe("pending");
    expect(result.reference).toMatch(/^BQ-VOL-/u);
    expect(result.fullName).toBe("Amaya Perera");
    expect(result.teams).toEqual(["design-team", "media-crew"]);
  });

  test("rejects an application with no team selected", async () => {
    const noAuthContext = makeContext(testDb.db);

    await expect(
      call(volunteersRouter.volunteers.apply, {
        context: noAuthContext,
        input: basePayload({ teams: [] }),
      })
    ).rejects.toThrow();
  });

  test("adminList lists newest first and filters by status", async () => {
    const noAuthContext = makeContext(testDb.db);
    await call(volunteersRouter.volunteers.apply, {
      context: noAuthContext,
      input: basePayload({
        student: { ...basePayload().student, fullName: "First" },
      }),
    });
    await call(volunteersRouter.volunteers.apply, {
      context: noAuthContext,
      input: basePayload({
        student: { ...basePayload().student, fullName: "Second" },
      }),
    });

    const adminUserId = await seedAdmin();
    const all = await call(volunteersRouter.volunteers.adminList, {
      context: adminCtx(adminUserId),
      input: {},
    });
    expect(all.map((row) => row.fullName)).toEqual(["Second", "First"]);
    expect(all.every((row) => row.accountIssued === false)).toBe(true);

    const pendingOnly = await call(volunteersRouter.volunteers.adminList, {
      context: adminCtx(adminUserId),
      input: { status: "pending" },
    });
    expect(pendingOnly).toHaveLength(2);

    const approvedOnly = await call(volunteersRouter.volunteers.adminList, {
      context: adminCtx(adminUserId),
      input: { status: "approved" },
    });
    expect(approvedOnly).toHaveLength(0);
  });
});

describe("volunteers.decide (admin review)", () => {
  test("rejecting an application records the note and leaves no account", async () => {
    const noAuthContext = makeContext(testDb.db);
    const created = await call(volunteersRouter.volunteers.apply, {
      context: noAuthContext,
      input: basePayload(),
    });

    const adminUserId = await seedAdmin();
    const decided = await call(volunteersRouter.volunteers.decide, {
      context: adminCtx(adminUserId),
      input: {
        applicationId: created.id,
        approve: false,
        note: "Not this year",
      },
    });

    expect(decided.status).toBe("rejected");
    expect(decided.username).toBeNull();
    expect(decided.password).toBeNull();

    const [row] = await call(volunteersRouter.volunteers.adminList, {
      context: adminCtx(adminUserId),
      input: { status: "rejected" },
    });
    expect(row?.reviewNote).toBe("Not this year");
  });

  test("rejects deciding an application twice", async () => {
    const noAuthContext = makeContext(testDb.db);
    const created = await call(volunteersRouter.volunteers.apply, {
      context: noAuthContext,
      input: basePayload(),
    });
    const adminUserId = await seedAdmin();
    await call(volunteersRouter.volunteers.decide, {
      context: adminCtx(adminUserId),
      input: { applicationId: created.id, approve: false },
    });

    await expect(
      call(volunteersRouter.volunteers.decide, {
        context: adminCtx(adminUserId),
        input: { applicationId: created.id, approve: false },
      })
    ).rejects.toThrow("already decided");
  });

  test("rejects deciding an unknown application", async () => {
    const adminUserId = await seedAdmin();
    await expect(
      call(volunteersRouter.volunteers.decide, {
        context: adminCtx(adminUserId),
        input: { applicationId: randomUUID(), approve: false },
      })
    ).rejects.toThrow("not found");
  });
});

describe("volunteers.mine (self lookup)", () => {
  test("returns null when the caller has no approved application", async () => {
    const studentUserId = randomUUID();
    await testDb.db.insert(user).values({
      id: studentUserId,
      name: "Student",
      email: `${studentUserId}@test.local`,
    });
    await testDb.db.insert(userProfile).values({
      userId: studentUserId,
      role: "volunteer",
      fullName: "Student",
      nationalId: "VOL-TEST",
      birthday: "2010-01-01",
      grade: "10",
    });

    const result = await call(volunteersRouter.volunteers.mine, {
      context: makeContext(testDb.db, {
        session: fakeSession(studentUserId),
        profile: { userId: studentUserId, role: "student" },
      }),
    });
    expect(result).toBeNull();
  });
});

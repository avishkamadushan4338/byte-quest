import { randomUUID } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import type { Session } from "@byte-quest/auth";
import type { AnyProcedure, InferSchemaOutput, Procedure } from "@orpc/server";
import { createProcedureClient } from "@orpc/server";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";

/** Output type a procedure resolves to, read off its output schema. */
type ProcedureOutput<P> =
  P extends Procedure<
    infer _InitialContext,
    infer _CurrentContext,
    infer _InputSchema,
    infer OutputSchema,
    infer _ErrorMap,
    infer _Meta
  >
    ? InferSchemaOutput<OutputSchema>
    : never;

const CONNECTION_STRING =
  process.env.TEST_DATABASE_URL ??
  "postgresql://postgres:password@localhost:4000/byte_quest_test";

const exists = (target: string): boolean => {
  try {
    readdirSync(target);
    return true;
  } catch {
    return false;
  }
};

const existsFile = (target: string): boolean => {
  try {
    return statSync(target).isFile();
  } catch {
    return false;
  }
};

const resolveMigrationsDir = (): string => {
  const candidates = [
    path.join(process.cwd(), "..", "db", "src", "migrations"),
    path.join(process.cwd(), "src", "migrations"),
    path.join(process.cwd(), "packages", "db", "src", "migrations"),
  ];
  for (const candidate of candidates) {
    if (exists(candidate)) {
      return candidate;
    }
  }
  throw new Error(
    `Migrations directory not found (looked at: ${candidates.join(", ")})`
  );
};

/** Run an ordered list of statements sequentially (DDL depends on order). */
const runSequentially = async (
  run: (statement: string) => Promise<unknown>,
  statements: string[]
): Promise<void> => {
  const [head, ...tail] = statements;
  if (head === undefined) {
    return;
  }
  await run(head);
  await runSequentially(run, tail);
};

/**
 * Pin `search_path` on the connection string so every pooled connection
 * resolves to the per-test schema. A plain `SET search_path` would only apply
 * to whichever connection happened to run it, which breaks under concurrency.
 */
const withSearchPath = (
  connectionString: string,
  schemaName: string
): string => {
  const url = new URL(connectionString);
  url.searchParams.set("options", `-c search_path=${schemaName}`);
  return url.toString();
};

/**
 * Creates a fresh PostgreSQL schema per test run and applies the migration
 * DDL into it, so tests run against the real schema without colliding.
 */
export const createTestDb = async (): Promise<TestDb> => {
  const schemaName = `test_${randomUUID().replaceAll("-", "")}`;
  const admin = drizzle(CONNECTION_STRING);
  await admin.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`));

  const db = drizzle(withSearchPath(CONNECTION_STRING, schemaName));

  const migrationsDir = resolveMigrationsDir();
  const migrationDirs = readdirSync(migrationsDir, {
    withFileTypes: true,
  }).toSorted((a, b) => a.name.localeCompare(b.name));

  const statements = migrationDirs.flatMap((dir) => {
    if (!dir.isDirectory()) {
      return [];
    }
    const migrationSql = path.join(migrationsDir, dir.name, "migration.sql");
    if (!existsFile(migrationSql)) {
      return [];
    }
    return readFileSync(migrationSql, "utf-8")
      .split("--> statement-breakpoint")
      .map((statement) => statement.trim())
      .filter(Boolean);
  });

  await runSequentially(
    (statement) => db.execute(sql.raw(statement)),
    statements
  );

  return {
    db,
    schemaName,
    cleanup: async () => {
      await admin.execute(
        sql.raw(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`)
      );
      const adminClient = (
        admin as unknown as { $client: { end: () => Promise<void> } }
      ).$client;
      const dbClient = (
        db as unknown as { $client: { end: () => Promise<void> } }
      ).$client;
      await adminClient.end();
      await dbClient.end();
    },
  };
};

export interface TestDb {
  db: NodePgDatabase;
  schemaName: string;
  cleanup: () => Promise<void>;
}

/** Build a Better-Auth-shaped session for a profile. */
export const fakeSession = (userId: string): Session => ({
  session: {
    id: randomUUID(),
    token: randomUUID(),
    userId,
    expiresAt: new Date(Date.now() + 3_600_000),
    createdAt: new Date(),
    updatedAt: new Date(),
    ipAddress: null,
    userAgent: null,
  } as Session["session"],
  user: {
    id: userId,
    name: "Test User",
    email: `${userId}@test.local`,
    emailVerified: true,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Session["user"],
});

export interface TestProfileInput {
  userId: string;
  role?: "admin" | "student";
  fullName?: string;
  nationalId?: string;
  birthday?: string;
  grade?: string;
}

export interface MakeContextOptions {
  session?: Session | null;
  profile?: TestProfileInput | null;
}

/** Build the API Context shape used by procedure handlers. */
export const makeContext = (
  db: NodePgDatabase,
  options?: MakeContextOptions
) => {
  const profile = options?.profile;
  return {
    db,
    session: options?.session ?? null,
    profile: profile
      ? {
          id: randomUUID(),
          userId: profile.userId,
          role: (profile.role ?? "student") as "admin" | "student",
          fullName: profile.fullName ?? "Test User",
          nationalId: profile.nationalId ?? "TEST-ID",
          birthday: profile.birthday ?? "2010-01-01",
          grade: profile.grade ?? "8",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      : null,
  };
};

/**
 * Invoke a procedure through oRPC's own client pipeline (middleware +
 * validation included) with a synthetic context. Input/output types are
 * inferred from the procedure itself.
 */
export const call = async <P extends AnyProcedure, R = ProcedureOutput<P>>(
  procedure: P,
  opts: { context: unknown; input?: unknown }
): Promise<R> => {
  const client = createProcedureClient(procedure, {
    context: opts.context as never,
  });
  return (await client(opts.input as never)) as R;
};

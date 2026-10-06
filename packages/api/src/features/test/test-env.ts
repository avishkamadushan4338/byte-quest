import { randomUUID } from "node:crypto";
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import type { Session } from "@byte-quest/auth";
import type { Database } from "@byte-quest/db";
import { createDb } from "@byte-quest/db";
import type { AnyProcedure, InferSchemaOutput, Procedure } from "@orpc/server";
import { createProcedureClient } from "@orpc/server";
import { sql } from "drizzle-orm";

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

/** Run an ordered list of statements sequentially. */
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
 * Creates a fresh SQLite file per test run and applies the migration DDL into it.
 */
export const createTestDb = async (): Promise<TestDb> => {
  const dir = mkdtempSync(path.join(tmpdir(), "bq-test-db-"));
  const dbPath = path.join(dir, "test.db");

  const db = await createDb({ TURSO_DATABASE_URL: `file:${dbPath}` });

  const migrationsDir = resolveMigrationsDir();
  const migrationDirs = readdirSync(migrationsDir, {
    withFileTypes: true,
  }).toSorted((a, b) => a.name.localeCompare(b.name));

  const statements = migrationDirs.flatMap((dirEntry) => {
    if (!dirEntry.isDirectory()) {
      return [];
    }
    const migrationSql = path.join(
      migrationsDir,
      dirEntry.name,
      "migration.sql"
    );
    if (!existsFile(migrationSql)) {
      return [];
    }
    return readFileSync(migrationSql, "utf-8")
      .split("--> statement-breakpoint")
      .map((statement) => statement.trim())
      .filter(Boolean);
  });

  await runSequentially((statement) => db.run(sql.raw(statement)), statements);

  return {
    db,
    schemaName: dbPath,
    cleanup: () => {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {
        // Temp dirs are cleaned by OS eventually
      }
      return Promise.resolve();
    },
  };
};

export interface TestDb {
  db: Database;
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
export const makeContext = (db: Database, options?: MakeContextOptions) => {
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
 * validation included) with a synthetic context.
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

import path from "node:path";

import { createClient } from "@libsql/client";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { readMigrationFiles } from "drizzle-orm/migrator";

import { resolveDatabaseUrl } from "../src/path";

/**
 * Deploy-time migration runner for build pipelines.
 * Skips gracefully instead of failing when no database URL is set.
 */
const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  console.log(
    "[migrate] Neither TURSO_DATABASE_URL nor DATABASE_URL set, skipping migration"
  );
  process.exit(0);
}

const client = createClient({ url: resolveDatabaseUrl(url), authToken });
const db = drizzle(client);

const migrationsFolder = path.join(import.meta.dirname, "../src/migrations");

/**
 * drizzle-orm's built-in `drizzle-orm/libsql/migrator` creates the bookkeeping
 * table with Postgres' `SERIAL PRIMARY KEY`, which libsql/SQLite rejects
 * outright (HTTP 400 from the Turso server) - see
 * https://github.com/drizzle-team/drizzle-orm/issues/5678 and #1227
 * (open/unfixed on the installed 0.45.x line). This reimplements the same
 * migration bookkeeping logic with the correct `INTEGER PRIMARY KEY` instead.
 */
const migrateLibsql = async (
  dbInstance: typeof db,
  { migrationsFolder: folder }: { migrationsFolder: string }
) => {
  const migrations = readMigrationFiles({ migrationsFolder: folder });
  const migrationsTable = "__drizzle_migrations";

  const migrationTableCreate = sql`
		CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
			id INTEGER PRIMARY KEY,
			hash text NOT NULL,
			created_at numeric
		)
	`;
  await dbInstance.session.run(migrationTableCreate);

  const dbMigrations = await dbInstance.values(
    sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
  );
  const [lastDbMigration] = dbMigrations;

  const statementToBatch = [];
  for (const migration of migrations) {
    if (
      !lastDbMigration ||
      Number((lastDbMigration as unknown[])[2]) < migration.folderMillis
    ) {
      for (const stmt of migration.sql) {
        statementToBatch.push(dbInstance.run(sql.raw(stmt)));
      }
      statementToBatch.push(
        dbInstance.run(
          sql`INSERT INTO ${sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
        )
      );
    }
  }
  await dbInstance.session.migrate(statementToBatch);
};

console.log(`[migrate] Running migrations from ${migrationsFolder}...`);
try {
  await migrateLibsql(db, { migrationsFolder });
  console.log("[migrate] Database is up to date");
} catch (error) {
  console.error("[migrate] Migration failed:", error);
  process.exit(1);
} finally {
  client.close();
}

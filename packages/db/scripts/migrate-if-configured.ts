import path from "node:path";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

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

const client = createClient({ url, authToken });
const db = drizzle(client);

const migrationsFolder = path.join(import.meta.dirname, "../src/migrations");

console.log(`[migrate] Running migrations from ${migrationsFolder}...`);
try {
  await migrate(db, { migrationsFolder });
  console.log("[migrate] Database is up to date");
} catch (error) {
  console.error("[migrate] Migration failed:", error);
  process.exit(1);
} finally {
  client.close();
}

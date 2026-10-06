import { spawnSync } from "node:child_process";

/**
 * Deploy-time migration runner for build pipelines.
 * Skips gracefully instead of failing when no database URL is set.
 */
const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;

if (!url) {
  console.log(
    "[migrate] Neither TURSO_DATABASE_URL nor DATABASE_URL set, skipping migration"
  );
  process.exit(0);
}

const result = spawnSync(
  "bunx",
  ["drizzle-kit", "migrate", "--config=drizzle.config.ts"],
  {
    stdio: "inherit",
  }
);
process.exit(result.status ?? 1);

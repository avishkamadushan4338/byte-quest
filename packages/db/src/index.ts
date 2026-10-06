import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import type { Client } from "@libsql/client";
import type { LibSQLDatabase } from "drizzle-orm/libsql/driver-core";

import type { DatabaseConfig } from "./config";
import {
  isRemoteDatabaseUrl,
  resolveDatabasePath,
  resolveDatabaseUrl,
} from "./path";
import * as schema from "./schema";

export {
  resolveDatabasePath,
  resolveDatabaseUrl,
  isRemoteDatabaseUrl,
} from "./path";
export type { DatabaseConfig } from "./config";

export type Database = LibSQLDatabase<typeof schema> & { $client: Client };

export async function createDb(envConfig?: DatabaseConfig): Promise<Database> {
  const url =
    envConfig?.TURSO_DATABASE_URL ||
    envConfig?.DATABASE_URL ||
    process.env.TURSO_DATABASE_URL ||
    process.env.DATABASE_URL ||
    "file:./local.db";
  const authToken = envConfig?.TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

  if (isRemoteDatabaseUrl(url)) {
    const { drizzle } = await import("drizzle-orm/libsql/web");
    return drizzle({
      connection: { url, authToken },
      schema,
    }) as unknown as Database;
  }

  mkdirSync(dirname(resolveDatabasePath(url)), { recursive: true });
  const { drizzle } = await import("drizzle-orm/libsql/node");
  return drizzle({
    connection: { url: resolveDatabaseUrl(url) },
    schema,
  }) as unknown as Database;
}

export * from "./schema";

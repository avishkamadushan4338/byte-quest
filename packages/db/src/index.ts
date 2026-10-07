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
  const cfg = envConfig as Record<string, string | undefined> | undefined;

  const getVal = (key: string): string | undefined => {
    if (process.env[key]) return process.env[key];
    if (cfg) {
      try {
        return cfg[key];
      } catch {
        return undefined;
      }
    }
    return undefined;
  };

  const url =
    getVal("TURSO_DATABASE_URL") || getVal("DATABASE_URL") || "file:./local.db";
  const authToken = getVal("TURSO_AUTH_TOKEN");

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

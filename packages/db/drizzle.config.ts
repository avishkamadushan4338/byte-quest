import { resolveDatabaseUrl } from "./src/path";

const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "";

export default {
  schema: "./src/schema/index.ts",
  out: "./src/migrations",
  dialect: "turso",
  dbCredentials: {
    url: url ? resolveDatabaseUrl(url) : url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
};

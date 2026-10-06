export default {
  schema: "./src/schema/index.ts",
  out: "./src/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
};

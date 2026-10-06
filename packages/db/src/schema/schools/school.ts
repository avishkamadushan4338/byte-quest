import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Schools participating in the hackathon. Every school can register at most
 * one primary-division team and one secondary-division team.
 */
export const school = sqliteTable("school", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  city: text("city").notNull(),
  province: text("province"),
  address: text("address"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

export type School = typeof school.$inferSelect;
export type NewSchool = typeof school.$inferInsert;

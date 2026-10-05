import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Schools participating in the hackathon. Every school can register at most
 * one primary-division team and one secondary-division team.
 */
export const school = pgTable("school", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  province: text("province"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type School = typeof school.$inferSelect;
export type NewSchool = typeof school.$inferInsert;

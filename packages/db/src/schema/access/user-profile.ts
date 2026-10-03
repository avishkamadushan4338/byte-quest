import {
  date,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "../auth";

export const userRoleEnum = pgEnum("user_role", ["admin", "student"]);

/**
 * Application-level profile attached 1:1 to a Better-Auth user.
 * `role` drives role-based access control (admin sees/controls submissions).
 * Identification data (fullName / nationalId / birthday) is collected for
 * every account holder.
 */
export const userProfile = pgTable("user_profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  role: userRoleEnum("role").default("student").notNull(),
  fullName: text("full_name").notNull(),
  nationalId: text("national_id").notNull(),
  birthday: date("birthday", { mode: "string" }).notNull(),
  grade: text("grade").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;

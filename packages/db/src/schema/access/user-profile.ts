import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

import { user } from "../auth";

export const userRoles = [
  "admin",
  "mic",
  "leader",
  "student",
  "volunteer",
] as const;
export type UserRole = (typeof userRoles)[number];

export const userRoleEnum = {
  enumValues: userRoles,
};

/**
 * Application-level profile attached 1:1 to a Better-Auth user.
 * `role` drives role-based access control (admin sees/controls submissions).
 * Identification data (fullName / nationalId / birthday) is collected for
 * every account holder.
 */
export const userProfile = sqliteTable("user_profile", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").$type<UserRole>().default("student").notNull(),
  fullName: text("full_name").notNull(),
  nationalId: text("national_id").notNull(),
  birthday: text("birthday").notNull(),
  grade: text("grade").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

export type UserProfile = typeof userProfile.$inferSelect;
export type NewUserProfile = typeof userProfile.$inferInsert;

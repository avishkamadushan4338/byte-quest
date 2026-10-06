import {
  date,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { user } from "../auth";

/**
 * Programme role driving route access and permissions.
 *
 * - `admin`   organising committee; full oversight. Never self-assigned — an
 *             existing admin must approve an admin application.
 * - `mic`     Master-In-Charge, the teacher in charge for a school. Allowed to
 *             register a team on the school's behalf.
 * - `leader`  team leader; allowed to register their own team.
 * - `student` ordinary team member.
 * - `volunteer` approved student volunteer; no team, sees their volunteer card.
 */
export const userRoleEnum = pgEnum("user_role", [
  "admin",
  "mic",
  "leader",
  "student",
  "volunteer",
]);

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

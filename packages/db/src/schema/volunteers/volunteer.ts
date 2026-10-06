import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

import { userProfile } from "../access/user-profile";

export const volunteerApplicationStatuses = [
  "pending",
  "approved",
  "rejected",
] as const;
export type VolunteerApplicationStatus =
  (typeof volunteerApplicationStatuses)[number];

export const volunteerApplicationStatusEnum = {
  enumValues: volunteerApplicationStatuses,
};

/**
 * A student's application to volunteer on BYTE QUEST.
 */
export const volunteerApplication = sqliteTable("volunteer_application", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  teams: text("teams", { mode: "json" }).$type<string[]>().notNull(),
  fullName: text("full_name").notNull(),
  school: text("school").notNull(),
  admissionNumber: text("admission_number"),
  grade: text("grade").notNull(),
  className: text("class_name").notNull(),
  contactNumber: text("contact_number").notNull(),
  email: text("email"),
  guardianName: text("guardian_name").notNull(),
  guardianRelationship: text("guardian_relationship"),
  guardianContactNumber: text("guardian_contact_number").notNull(),
  guardianAlternateContactNumber: text("guardian_alternate_contact_number"),
  status: text("status")
    .$type<VolunteerApplicationStatus>()
    .default("pending")
    .notNull(),
  userId: text("user_id").references(() => userProfile.userId, {
    onDelete: "set null",
  }),
  reviewedByUserId: text("reviewed_by_user_id").references(
    () => userProfile.userId,
    { onDelete: "set null" }
  ),
  reviewedAt: integer("reviewed_at", { mode: "timestamp_ms" }),
  reviewNote: text("review_note"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

export type VolunteerApplication = typeof volunteerApplication.$inferSelect;
export type NewVolunteerApplication = typeof volunteerApplication.$inferInsert;

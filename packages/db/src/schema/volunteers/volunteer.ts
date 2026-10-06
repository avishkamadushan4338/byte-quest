import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { userProfile } from "../access/user-profile";

/** Lifecycle of a volunteer application, decided by an admin. */
export const volunteerApplicationStatusEnum = pgEnum(
  "volunteer_application_status",
  ["pending", "approved", "rejected"]
);

/**
 * A student's application to volunteer on BYTE QUEST, submitted through the
 * public form (no account needed). An admin approves or rejects it; approval
 * issues a login (role `volunteer`) and links `userId` so the volunteer can
 * sign in and see their status/ID card. `teams` holds the crew identifiers
 * they'd like to join (content-creator, design-team, etc.) as free-form
 * text, matching the checkbox values on the form rather than a lookup table.
 */
export const volunteerApplication = pgTable("volunteer_application", {
  id: uuid("id").primaryKey().defaultRandom(),
  teams: text("teams").array().notNull(),
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
  status: volunteerApplicationStatusEnum("status").default("pending").notNull(),
  userId: text("user_id").references(() => userProfile.userId, {
    onDelete: "set null",
  }),
  reviewedByUserId: text("reviewed_by_user_id").references(
    () => userProfile.userId,
    { onDelete: "set null" }
  ),
  reviewedAt: timestamp("reviewed_at"),
  reviewNote: text("review_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type VolunteerApplicationStatus =
  (typeof volunteerApplicationStatusEnum.enumValues)[number];
export type VolunteerApplication = typeof volunteerApplication.$inferSelect;
export type NewVolunteerApplication = typeof volunteerApplication.$inferInsert;

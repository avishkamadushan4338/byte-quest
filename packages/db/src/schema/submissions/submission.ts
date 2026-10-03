import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { userProfile } from "../access/user-profile";
import { school } from "../schools/school";
import { team } from "../teams/team";

/** Lifecycle of a submission, controlled by admins. */
export const submissionStatusEnum = pgEnum("submission_status", [
  "draft",
  "submitted",
  "approved",
  "rejected",
]);

/**
 * A hackathon submission. Opened by a team's leader, optionally forwarded
 * to a school, then reviewed (approved/rejected) by an admin with
 * role-based access control.
 */
export const submission = pgTable(
  "submission",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    repoUrl: text("repo_url"),
    status: submissionStatusEnum("status").default("draft").notNull(),
    schoolId: uuid("school_id").references(() => school.id, {
      onDelete: "set null",
    }),
    forwardedByUserId: text("forwarded_by_user_id").references(
      () => userProfile.userId,
      { onDelete: "set null" }
    ),
    forwardedAt: timestamp("forwarded_at"),
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
  },
  (table) => [unique("submission_team_unique").on(table.teamId)]
);

export type SubmissionStatus = (typeof submissionStatusEnum.enumValues)[number];
export type Submission = typeof submission.$inferSelect;
export type NewSubmission = typeof submission.$inferInsert;

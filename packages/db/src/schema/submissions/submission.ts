import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import { userProfile } from "../access/user-profile";
import { school } from "../schools/school";
import { team } from "../teams/team";

export const submissionStatuses = [
  "draft",
  "submitted",
  "approved",
  "rejected",
] as const;
export type SubmissionStatus = (typeof submissionStatuses)[number];

export const submissionStatusEnum = {
  enumValues: submissionStatuses,
};

/**
 * A hackathon submission. Opened by a team's leader, optionally forwarded
 * to a school, then reviewed (approved/rejected) by an admin with
 * role-based access control.
 */
export const submission = sqliteTable(
  "submission",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    teamId: text("team_id")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    repoUrl: text("repo_url"),
    status: text("status").$type<SubmissionStatus>().default("draft").notNull(),
    schoolId: text("school_id").references(() => school.id, {
      onDelete: "set null",
    }),
    forwardedByUserId: text("forwarded_by_user_id").references(
      () => userProfile.userId,
      { onDelete: "set null" }
    ),
    forwardedAt: integer("forwarded_at", { mode: "timestamp_ms" }),
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
  },
  (table) => [uniqueIndex("submission_team_unique").on(table.teamId)]
);

export type Submission = typeof submission.$inferSelect;
export type NewSubmission = typeof submission.$inferInsert;

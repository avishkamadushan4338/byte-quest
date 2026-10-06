import { sql } from "drizzle-orm";
import {
  index,
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import { userProfile } from "../access/user-profile";

export const adminApplicationStatuses = [
  "pending",
  "approved",
  "rejected",
] as const;
export type AdminApplicationStatus = (typeof adminApplicationStatuses)[number];

export const adminApplicationStatusEnum = {
  enumValues: adminApplicationStatuses,
};

/**
 * An application for admin (organising committee) access. Anyone may apply;
 * an existing admin approves or rejects. Approval provisions the account with
 * the `admin` role, so this table is the only route to admin.
 */
export const adminApplication = sqliteTable(
  "admin_application",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    /** Requested sign-in handle; must be unique across applications. */
    username: text("username").notNull(),
    organization: text("organization").notNull(),
    role: text("role").notNull(),
    experience: text("experience").notNull(),
    status: text("status")
      .$type<AdminApplicationStatus>()
      .default("pending")
      .notNull(),
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
  (table) => [
    uniqueIndex("admin_application_username_unique").on(table.username),
    index("admin_application_status_idx").on(table.status),
    // One live application per person; decided rows may be re-applied for.
    uniqueIndex("admin_application_pending_unique")
      .on(table.email)
      .where(sql`${table.status} = 'pending'`),
  ]
);

export type AdminApplication = typeof adminApplication.$inferSelect;
export type NewAdminApplication = typeof adminApplication.$inferInsert;

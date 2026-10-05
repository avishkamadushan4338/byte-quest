import { sql } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { userProfile } from "../access/user-profile";

/** Lifecycle of an admin access request, decided by an existing admin. */
export const adminApplicationStatusEnum = pgEnum("admin_application_status", [
  "pending",
  "approved",
  "rejected",
]);

/**
 * An application for admin (organising committee) access. Anyone may apply;
 * an existing admin approves or rejects. Approval provisions the account with
 * the `admin` role, so this table is the only route to admin.
 */
export const adminApplication = pgTable(
  "admin_application",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    /** Requested sign-in handle; must be unique across applications. */
    username: text("username").notNull(),
    organization: text("organization").notNull(),
    role: text("role").notNull(),
    experience: text("experience").notNull(),
    status: adminApplicationStatusEnum("status").default("pending").notNull(),
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
  (table) => [
    uniqueIndex("admin_application_username_unique").on(table.username),
    index("admin_application_status_idx").on(table.status),
    // One live application per person; decided rows may be re-applied for.
    uniqueIndex("admin_application_pending_unique")
      .on(table.email)
      .where(sql`${table.status} = 'pending'`),
  ]
);

export type AdminApplicationStatus =
  (typeof adminApplicationStatusEnum.enumValues)[number];
export type AdminApplication = typeof adminApplication.$inferSelect;
export type NewAdminApplication = typeof adminApplication.$inferInsert;

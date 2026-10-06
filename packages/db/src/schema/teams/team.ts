import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import { userProfile } from "../access/user-profile";
import { school } from "../schools/school";

export const divisions = ["primary", "secondary"] as const;
export type Division = (typeof divisions)[number];

export const divisionEnum = {
  enumValues: divisions,
};

export const memberSpecialties = ["ui", "architecture", "business"] as const;
export type MemberSpecialty = (typeof memberSpecialties)[number];

export const memberSpecialtyEnum = {
  enumValues: memberSpecialties,
};

export const teamRoles = ["leader", "developer"] as const;
export type TeamRole = (typeof teamRoles)[number];

export const teamRoleEnum = {
  enumValues: teamRoles,
};

export const joinRequestStatuses = ["pending", "approved", "rejected"] as const;
export type JoinRequestStatus = (typeof joinRequestStatuses)[number];

export const joinRequestStatusEnum = {
  enumValues: joinRequestStatuses,
};

/**
 * A hackathon team. Each school fields at most one team per division,
 * enforced by the unique index on (schoolId, division).
 */
export const team = sqliteTable(
  "team",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    division: text("division").$type<Division>().notNull(),
    schoolId: text("school_id")
      .notNull()
      .references(() => school.id, { onDelete: "cascade" }),
    idea: text("idea"),
    teacherName: text("teacher_name"),
    teacherDesignation: text("teacher_designation"),
    teacherPhone: text("teacher_phone"),
    teacherEmail: text("teacher_email"),
    principalName: text("principal_name"),
    /**
     * Opaque token handed to the registrant on submission so they can reopen
     * and edit this team's registration without an account.
     */
    editToken: text("edit_token").unique(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("team_school_division_unique").on(
      table.schoolId,
      table.division
    ),
  ]
);

/**
 * Team membership. All members are developers; exactly one is the leader.
 */
export const teamMember = sqliteTable(
  "team_member",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    teamId: text("team_id")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => userProfile.userId, {
      onDelete: "cascade",
    }),
    teamRole: text("team_role")
      .$type<TeamRole>()
      .default("developer")
      .notNull(),
    specialty: text("specialty").$type<MemberSpecialty>(),
    grade: text("grade").notNull(),
    fullName: text("full_name").notNull(),
    className: text("class_name"),
    admissionNumber: text("admission_number"),
    nationalId: text("national_id"),
    birthday: text("birthday"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("team_member_team_user_unique").on(table.teamId, table.userId),
    uniqueIndex("team_member_leader_unique")
      .on(table.teamId)
      .where(sql`${table.teamRole} = 'leader'`),
  ]
);

/**
 * A user asking to join a team. The team leader approves or rejects.
 */
export const joinRequest = sqliteTable(
  "join_request",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    teamId: text("team_id")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "cascade" }),
    status: text("status")
      .$type<JoinRequestStatus>()
      .default("pending")
      .notNull(),
    grade: text("grade").notNull(),
    specialty: text("specialty").$type<MemberSpecialty>(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("join_request_team_user_unique").on(table.teamId, table.userId),
  ]
);

export type Team = typeof team.$inferSelect;
export type NewTeam = typeof team.$inferInsert;
export type TeamMember = typeof teamMember.$inferSelect;
export type NewTeamMember = typeof teamMember.$inferInsert;
export type JoinRequest = typeof joinRequest.$inferSelect;
export type NewJoinRequest = typeof joinRequest.$inferInsert;

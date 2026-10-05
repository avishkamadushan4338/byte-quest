import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { userProfile } from "../access/user-profile";
import { school } from "../schools/school";

/** Team division: primary (grades 6-9) or secondary (grades 10-13). */
export const divisionEnum = pgEnum("division", ["primary", "secondary"]);

/** Specialties a member brings to the team. */
export const memberSpecialtyEnum = pgEnum("member_specialty", [
  "ui",
  "architecture",
  "business",
]);

/** Role inside the team: exactly one leader per team, everyone is a developer. */
export const teamRoleEnum = pgEnum("team_role", ["leader", "developer"]);

/** Join-request status. Approved requests create the team membership row. */
export const joinRequestStatusEnum = pgEnum("join_request_status", [
  "pending",
  "approved",
  "rejected",
]);

/**
 * A hackathon team. Each school fields at most one team per division,
 * enforced by the unique index on (schoolId, division).
 */
export const team = pgTable(
  "team",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    division: divisionEnum("division").notNull(),
    schoolId: uuid("school_id")
      .notNull()
      .references(() => school.id, { onDelete: "cascade" }),
    idea: text("idea"),
    teacherName: text("teacher_name"),
    teacherDesignation: text("teacher_designation"),
    teacherPhone: text("teacher_phone"),
    teacherEmail: text("teacher_email"),
    principalName: text("principal_name"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("team_school_division_unique").on(table.schoolId, table.division),
  ]
);

/**
 * Team membership. All members are developers; exactly one is the leader
 * (validated by the API layer and this partial unique index). Member
 * personal data (full name, grade, class, admission number) is a snapshot
 * taken at team registration time. `userId` is null for members added
 * directly by the school (no account required); it is only set when a
 * member joins by requesting to join their own account's team.
 */
export const teamMember = pgTable(
  "team_member",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => userProfile.userId, {
      onDelete: "cascade",
    }),
    teamRole: teamRoleEnum("team_role").default("developer").notNull(),
    specialty: memberSpecialtyEnum("specialty"),
    grade: text("grade").notNull(),
    fullName: text("full_name").notNull(),
    className: text("class_name"),
    admissionNumber: text("admission_number"),
    nationalId: text("national_id"),
    birthday: text("birthday"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("team_member_team_user_unique").on(table.teamId, table.userId),
    uniqueIndex("team_member_leader_unique")
      .on(table.teamId)
      .where(sql`${table.teamRole} = 'leader'`),
  ]
);

/**
 * A user asking to join a team. The team leader approves or rejects;
 * approval turns the request into a membership.
 */
export const joinRequest = pgTable(
  "join_request",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => userProfile.userId, { onDelete: "cascade" }),
    status: joinRequestStatusEnum("status").default("pending").notNull(),
    grade: text("grade").notNull(),
    specialty: memberSpecialtyEnum("specialty"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("join_request_team_user_unique").on(table.teamId, table.userId),
  ]
);

export type Division = (typeof divisionEnum.enumValues)[number];
export type MemberSpecialty = (typeof memberSpecialtyEnum.enumValues)[number];
export type TeamRole = (typeof teamRoleEnum.enumValues)[number];
export type JoinRequestStatus =
  (typeof joinRequestStatusEnum.enumValues)[number];
export type Team = typeof team.$inferSelect;
export type NewTeam = typeof team.$inferInsert;
export type TeamMember = typeof teamMember.$inferSelect;
export type NewTeamMember = typeof teamMember.$inferInsert;
export type JoinRequest = typeof joinRequest.$inferSelect;
export type NewJoinRequest = typeof joinRequest.$inferInsert;

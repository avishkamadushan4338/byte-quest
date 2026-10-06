import { randomBytes } from "node:crypto";

import type { Database, MemberSpecialty } from "@byte-quest/db";
import {
  joinRequest,
  school,
  team,
  teamMember,
  userProfile,
} from "@byte-quest/db";
import { and, count, eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
} from "../../index";
import { inferDivision } from "../access/router";
import { findOrCreateSchool } from "../schools/router";

const MIN_MEMBERS = 3;
const MAX_MEMBERS = 5;

/** Registrations (new or edited) are no longer accepted after this date. */
export const REGISTRATION_CLOSES_AT = new Date("2027-01-10T23:59:59+05:30");

const generateEditToken = () => randomBytes(16).toString("hex");

const assertRegistrationOpen = () => {
  if (Date.now() > REGISTRATION_CLOSES_AT.getTime()) {
    throw new Error(
      "Registration closed on 10 January 2027. Contact the organising committee for changes."
    );
  }
};

/**
 * Grades allowed per division for the public registration form. Junior
 * (primary) is grades 6-8, senior (secondary) is grades 9-13 — this is the
 * division boundary shown to schools, distinct from `inferDivision`'s
 * registrant-grade inference used by the authenticated self-service flow.
 */
const DIVISION_GRADES: Record<"primary" | "secondary", string[]> = {
  primary: ["6", "7", "8"],
  secondary: ["9", "10", "11", "12", "13"],
};

/** Every specialty must be covered by at least one member. */
const REQUIRED_SPECIALTIES: MemberSpecialty[] = [
  "ui",
  "architecture",
  "business",
];

export const teamOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  division: z.enum(["primary", "secondary"]),
  schoolId: z.string(),
  memberCount: z.number(),
});

const registerInputSchema = z.object({
  teamName: z.string().min(1, "Team name is required"),
  division: z.enum(["primary", "secondary"]),
  idea: z.string().trim().optional(),
  school: z.object({
    name: z.string().min(1, "School name is required"),
    province: z.string().min(1, "Province is required"),
    city: z.string().min(1, "District or city is required"),
    address: z.string().optional(),
  }),
  members: z
    .array(
      z.object({
        fullName: z.string().min(1, "Full name is required"),
        grade: z.string().min(1, "Grade is required"),
        className: z.string().min(1, "Class is required"),
        admissionNumber: z.string().min(1, "Admission number is required"),
      })
    )
    .min(MIN_MEMBERS, `A team needs at least ${MIN_MEMBERS} members`)
    .max(MAX_MEMBERS, `A team can have at most ${MAX_MEMBERS} members`),
  leaderIndex: z.number().int().min(0),
  teacher: z.object({
    name: z.string().min(1, "Teacher name is required"),
    designation: z.string().min(1, "Designation is required"),
    phone: z.string().min(1, "Phone is required"),
    email: z.email("Enter a valid email"),
  }),
  principal: z.string().optional(),
});

const assertValidRoster = (input: z.infer<typeof registerInputSchema>) => {
  if (input.leaderIndex >= input.members.length) {
    throw new Error("Team leader must be one of the registered members");
  }
  const allowedGrades = DIVISION_GRADES[input.division];
  for (const member of input.members) {
    if (!allowedGrades.includes(member.grade)) {
      throw new Error(
        `${member.fullName || "A member"}'s grade (${member.grade}) does not match the ${input.division} division`
      );
    }
  }
};

const memberOutputSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  fullName: z.string(),
  grade: z.string(),
  teamRole: z.enum(["leader", "developer"]),
  specialty: z.enum(["ui", "architecture", "business"]).nullable(),
});

const joinRequestOutputSchema = z.object({
  id: z.string(),
  teamId: z.string(),
  userId: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
  grade: z.string(),
  specialty: z.enum(["ui", "architecture", "business"]).nullable(),
});

const specialtySchema = z.enum(["ui", "architecture", "business"]);

const countMembers = async (db: Database, teamId: string) => {
  const [row] = await db
    .select({ value: count() })
    .from(teamMember)
    .where(eq(teamMember.teamId, teamId));
  return row?.value ?? 0;
};

export const teamsRouter = {
  teams: {
    /**
     * Register a team from the public wizard. No account or session is
     * required — the school's MIC or principal submits the full roster
     * directly. Resolves (or registers) the school, enforces the
     * one-team-per-division-per-school rule, then inserts the team and every
     * member in one go (members have no `userId`; they are not accounts).
     */
    register: publicProcedure
      .input(registerInputSchema)
      .output(
        teamOutputSchema.extend({
          schoolName: z.string(),
          editToken: z.string(),
        })
      )
      .handler(async ({ context, input }) => {
        assertRegistrationOpen();
        assertValidRoster(input);

        const resolved = await findOrCreateSchool(context.db, {
          name: input.school.name,
          city: input.school.city,
          province: input.school.province,
          address: input.school.address,
        });

        const [existingTeam] = await context.db
          .select({ id: team.id })
          .from(team)
          .where(
            and(
              eq(team.schoolId, resolved.id),
              eq(team.division, input.division)
            )
          );
        if (existingTeam) {
          throw new Error(`This school already has a ${input.division} team`);
        }

        const editToken = generateEditToken();
        const [created] = await context.db
          .insert(team)
          .values({
            name: input.teamName,
            division: input.division,
            schoolId: resolved.id,
            idea: input.idea?.trim() || null,
            teacherName: input.teacher.name.trim(),
            teacherDesignation: input.teacher.designation.trim(),
            teacherPhone: input.teacher.phone.trim(),
            teacherEmail: input.teacher.email.trim(),
            principalName: input.principal?.trim() || null,
            editToken,
          })
          .returning();
        if (!created) {
          throw new Error("Failed to create team");
        }

        await context.db.insert(teamMember).values(
          input.members.map((member, index) => ({
            teamId: created.id,
            teamRole: (index === input.leaderIndex ? "leader" : "developer") as
              | "leader"
              | "developer",
            grade: member.grade,
            fullName: member.fullName.trim(),
            className: member.className.trim(),
            admissionNumber: member.admissionNumber.trim(),
          }))
        );

        return {
          ...created,
          memberCount: input.members.length,
          schoolName: resolved.name,
          editToken,
        };
      }),

    /**
     * Look up a previously-submitted registration by its edit token, for
     * prefilling the wizard so the MIC/principal can revise it before the
     * closing date.
     */
    getByEditToken: publicProcedure
      .input(z.object({ editToken: z.string().min(1) }))
      .output(
        registerInputSchema.extend({
          teamId: z.string(),
          editToken: z.string(),
        })
      )
      .handler(async ({ context, input }) => {
        const [teamRow] = await context.db
          .select()
          .from(team)
          .where(eq(team.editToken, input.editToken));
        if (!teamRow) {
          throw new Error("Registration not found");
        }
        const [schoolRow] = await context.db
          .select()
          .from(school)
          .where(eq(school.id, teamRow.schoolId));
        if (!schoolRow) {
          throw new Error("School not found");
        }
        const members = await context.db
          .select()
          .from(teamMember)
          .where(eq(teamMember.teamId, teamRow.id))
          .orderBy(teamMember.createdAt);
        const leaderIndex = members.findIndex((m) => m.teamRole === "leader");

        return {
          teamId: teamRow.id,
          editToken: teamRow.editToken ?? input.editToken,
          teamName: teamRow.name,
          division: teamRow.division,
          idea: teamRow.idea ?? undefined,
          school: {
            name: schoolRow.name,
            province: schoolRow.province ?? "",
            city: schoolRow.city,
            address: schoolRow.address ?? undefined,
          },
          members: members.map((m) => ({
            fullName: m.fullName,
            grade: m.grade,
            className: m.className ?? "",
            admissionNumber: m.admissionNumber ?? "",
          })),
          leaderIndex: leaderIndex === -1 ? 0 : leaderIndex,
          teacher: {
            name: teamRow.teacherName ?? "",
            designation: teamRow.teacherDesignation ?? "",
            phone: teamRow.teacherPhone ?? "",
            email: teamRow.teacherEmail ?? "",
          },
          principal: teamRow.principalName ?? undefined,
        };
      }),

    /**
     * Revise a previously-submitted registration (same division, same
     * team) up to the closing date. Replaces the team/school fields and the
     * full member roster; the edit token and reference stay the same.
     */
    update: publicProcedure
      .input(registerInputSchema.extend({ editToken: z.string().min(1) }))
      .output(teamOutputSchema.extend({ schoolName: z.string() }))
      .handler(async ({ context, input }) => {
        assertRegistrationOpen();
        assertValidRoster(input);

        const [existing] = await context.db
          .select()
          .from(team)
          .where(eq(team.editToken, input.editToken));
        if (!existing) {
          throw new Error("Registration not found");
        }
        if (existing.division !== input.division) {
          throw new Error("A registration's division cannot be changed");
        }

        await context.db
          .update(school)
          .set({
            name: input.school.name.trim(),
            city: input.school.city.trim(),
            province: input.school.province.trim(),
            address: input.school.address?.trim() || null,
          })
          .where(eq(school.id, existing.schoolId));

        const [updated] = await context.db
          .update(team)
          .set({
            name: input.teamName,
            idea: input.idea?.trim() || null,
            teacherName: input.teacher.name.trim(),
            teacherDesignation: input.teacher.designation.trim(),
            teacherPhone: input.teacher.phone.trim(),
            teacherEmail: input.teacher.email.trim(),
            principalName: input.principal?.trim() || null,
          })
          .where(eq(team.id, existing.id))
          .returning();
        if (!updated) {
          throw new Error("Failed to update team");
        }

        await context.db
          .delete(teamMember)
          .where(eq(teamMember.teamId, existing.id));
        await context.db.insert(teamMember).values(
          input.members.map((member, index) => ({
            teamId: existing.id,
            teamRole: (index === input.leaderIndex ? "leader" : "developer") as
              | "leader"
              | "developer",
            grade: member.grade,
            fullName: member.fullName.trim(),
            className: member.className.trim(),
            admissionNumber: member.admissionNumber.trim(),
          }))
        );

        return {
          ...updated,
          memberCount: input.members.length,
          schoolName: input.school.name.trim(),
        };
      }),

    /**
     * Create a team. Creator becomes leader; their grade must match the
     * division: primary grades 6-9, secondary grades 10-13.
     */
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          schoolId: z.string(),
          division: z.enum(["primary", "secondary"]),
        })
      )
      .output(teamOutputSchema)
      .handler(async ({ context, input }) => {
        if (inferDivision(context.profile.grade) !== input.division) {
          throw new Error(
            `Grade ${context.profile.grade} does not match the ${input.division} division (primary 6-9, secondary 10-13)`
          );
        }

        const [existingTeam] = await context.db
          .select({ id: team.id })
          .from(team)
          .where(
            and(
              eq(team.schoolId, input.schoolId),
              eq(team.division, input.division)
            )
          );
        if (existingTeam) {
          throw new Error(`This school already has a ${input.division} team`);
        }

        const [created] = await context.db
          .insert(team)
          .values({
            name: input.name,
            division: input.division,
            schoolId: input.schoolId,
          })
          .returning();
        if (!created) {
          throw new Error("Failed to create team");
        }

        await context.db.insert(teamMember).values({
          teamId: created.id,
          userId: context.profile.userId,
          teamRole: "leader",
          grade: context.profile.grade,
          fullName: context.profile.fullName,
          nationalId: context.profile.nationalId,
          birthday: context.profile.birthday,
        });

        return { ...created, memberCount: 1 };
      }),

    /** Members of a team (identification snapshot + role/specialty). */
    listMembers: protectedProcedure
      .input(z.object({ teamId: z.string() }))
      .output(z.array(memberOutputSchema))
      .handler(({ context, input }) =>
        context.db
          .select({
            id: teamMember.id,
            userId: teamMember.userId,
            fullName: teamMember.fullName,
            grade: teamMember.grade,
            teamRole: teamMember.teamRole,
            specialty: teamMember.specialty,
          })
          .from(teamMember)
          .where(eq(teamMember.teamId, input.teamId))
      ),

    /** Ask to join a team (choose your specialty). */
    requestToJoin: protectedProcedure
      .input(
        z.object({ teamId: z.string(), specialty: specialtySchema.optional() })
      )
      .output(joinRequestOutputSchema)
      .handler(async ({ context, input }) => {
        const [existingMembership] = await context.db
          .select({ id: teamMember.id })
          .from(teamMember)
          .where(eq(teamMember.userId, context.profile.userId));
        if (existingMembership) {
          throw new Error("You are already on a team");
        }

        const [target] = await context.db
          .select()
          .from(team)
          .where(eq(team.id, input.teamId));
        if (!target) {
          throw new Error("Team not found");
        }
        if (inferDivision(context.profile.grade) !== target.division) {
          throw new Error(
            `Grade ${context.profile.grade} does not match the ${target.division} division`
          );
        }

        const memberCount = await countMembers(context.db, input.teamId);
        if (memberCount >= MAX_MEMBERS) {
          throw new Error("Team is full (max 5 members)");
        }

        // A previous rejected request may be re-issued; a pending one may not.
        const [existingRequest] = await context.db
          .select()
          .from(joinRequest)
          .where(
            and(
              eq(joinRequest.teamId, input.teamId),
              eq(joinRequest.userId, context.profile.userId)
            )
          );
        if (existingRequest) {
          if (existingRequest.status === "pending") {
            throw new Error("You already have a pending request for this team");
          }
          const [reactivated] = await context.db
            .update(joinRequest)
            .set({
              status: "pending",
              grade: context.profile.grade,
              specialty: input.specialty ?? null,
            })
            .where(eq(joinRequest.id, existingRequest.id))
            .returning();
          if (!reactivated) {
            throw new Error("Failed to re-issue join request");
          }
          return reactivated;
        }

        const [request] = await context.db
          .insert(joinRequest)
          .values({
            teamId: input.teamId,
            userId: context.profile.userId,
            grade: context.profile.grade,
            specialty: input.specialty ?? null,
          })
          .returning();
        if (!request) {
          throw new Error("Failed to create join request");
        }
        return request;
      }),

    /** Leader: incoming join requests for my team. */
    listJoinRequests: protectedProcedure
      .output(z.array(joinRequestOutputSchema))
      .handler(async ({ context }) => {
        const [membership] = await context.db
          .select()
          .from(teamMember)
          .where(eq(teamMember.userId, context.profile.userId));
        if (!membership || membership.teamRole !== "leader") {
          throw new Error("Only the team leader can view join requests");
        }
        return context.db
          .select({
            id: joinRequest.id,
            teamId: joinRequest.teamId,
            userId: joinRequest.userId,
            status: joinRequest.status,
            grade: joinRequest.grade,
            specialty: joinRequest.specialty,
          })
          .from(joinRequest)
          .where(eq(joinRequest.teamId, membership.teamId));
      }),

    /**
     * Leader: approve/reject a join request. Approval enforces team size
     * (max 5) and division grade rules, then snapshots identification data.
     */
    decideJoinRequest: protectedProcedure
      .input(z.object({ requestId: z.string(), approve: z.boolean() }))
      .output(joinRequestOutputSchema)
      .handler(async ({ context, input }) => {
        const [membership] = await context.db
          .select()
          .from(teamMember)
          .where(eq(teamMember.userId, context.profile.userId));
        if (!membership || membership.teamRole !== "leader") {
          throw new Error("Only the team leader can decide join requests");
        }

        const [request] = await context.db
          .select()
          .from(joinRequest)
          .where(eq(joinRequest.id, input.requestId));
        if (!request || request.teamId !== membership.teamId) {
          throw new Error("Join request not found");
        }
        if (request.status !== "pending") {
          throw new Error("Join request already decided");
        }

        if (!input.approve) {
          const [rejected] = await context.db
            .update(joinRequest)
            .set({ status: "rejected" })
            .where(eq(joinRequest.id, request.id))
            .returning();
          if (!rejected) {
            throw new Error("Failed to reject join request");
          }
          return rejected;
        }

        const memberCount = await countMembers(context.db, membership.teamId);
        if (memberCount >= MAX_MEMBERS) {
          throw new Error("Team is full (max 5 members)");
        }

        const [profile] = await context.db
          .select()
          .from(userProfile)
          .where(eq(userProfile.userId, request.userId));
        if (!profile) {
          throw new Error("Requester profile not found");
        }
        const [teamRow] = await context.db
          .select()
          .from(team)
          .where(eq(team.id, membership.teamId));
        if (!teamRow) {
          throw new Error("Team not found");
        }
        if (inferDivision(profile.grade) !== teamRow.division) {
          throw new Error(
            `Requester grade ${profile.grade} does not match the ${teamRow.division} division`
          );
        }

        const [approved] = await context.db
          .update(joinRequest)
          .set({ status: "approved" })
          .where(eq(joinRequest.id, request.id))
          .returning();
        if (!approved) {
          throw new Error("Failed to approve join request");
        }

        await context.db.insert(teamMember).values({
          teamId: membership.teamId,
          userId: request.userId,
          teamRole: "developer",
          specialty: request.specialty,
          grade: profile.grade,
          fullName: profile.fullName,
          nationalId: profile.nationalId,
          birthday: profile.birthday,
        });

        return approved;
      }),

    /** Leave a team (leader cannot leave while still leading). */
    leave: protectedProcedure
      .input(z.object({ teamId: z.string() }))
      .output(z.object({ success: z.boolean() }))
      .handler(async ({ context, input }) => {
        const [membership] = await context.db
          .select()
          .from(teamMember)
          .where(
            and(
              eq(teamMember.teamId, input.teamId),
              eq(teamMember.userId, context.profile.userId)
            )
          );
        if (!membership) {
          throw new Error("You are not a member of this team");
        }
        if (membership.teamRole === "leader") {
          throw new Error("Leaders must transfer leadership before leaving");
        }
        await context.db
          .delete(teamMember)
          .where(eq(teamMember.id, membership.id));
        return { success: true };
      }),

    /** My team, if any. */
    myTeam: protectedProcedure
      .output(teamOutputSchema.nullable())
      .handler(async ({ context }) => {
        const [membership] = await context.db
          .select()
          .from(teamMember)
          .where(eq(teamMember.userId, context.profile.userId));
        if (!membership) {
          return null;
        }
        const [teamRow] = await context.db
          .select()
          .from(team)
          .where(eq(team.id, membership.teamId));
        if (!teamRow) {
          return null;
        }
        const memberCount = await countMembers(context.db, membership.teamId);
        return {
          id: teamRow.id,
          name: teamRow.name,
          division: teamRow.division,
          schoolId: teamRow.schoolId,
          memberCount,
        };
      }),

    /** Admin: teams with member counts (oversight of group structure). */
    adminList: adminProcedure
      .output(
        z.array(
          teamOutputSchema.extend({
            schoolName: z.string(),
            minMembers: z.number(),
            maxMembers: z.number(),
            idea: z.string().nullable(),
            teacherName: z.string().nullable(),
            teacherDesignation: z.string().nullable(),
            teacherPhone: z.string().nullable(),
            teacherEmail: z.string().nullable(),
            principalName: z.string().nullable(),
          })
        )
      )
      .handler(async ({ context }) => {
        const rows = await context.db
          .select({
            id: team.id,
            name: team.name,
            division: team.division,
            schoolId: team.schoolId,
            schoolName: school.name,
            memberCount: sql<number>`count(${teamMember.id})`.mapWith(Number),
            minMembers: sql<number>`3`.mapWith(Number),
            maxMembers: sql<number>`5`.mapWith(Number),
            idea: team.idea,
            teacherName: team.teacherName,
            teacherDesignation: team.teacherDesignation,
            teacherPhone: team.teacherPhone,
            teacherEmail: team.teacherEmail,
            principalName: team.principalName,
          })
          .from(team)
          .innerJoin(school, eq(team.schoolId, school.id))
          .leftJoin(teamMember, eq(teamMember.teamId, team.id))
          .groupBy(team.id, school.name);
        return rows;
      }),
  },
};

export const TEAM_LIMITS = {
  MIN_MEMBERS,
  MAX_MEMBERS,
  REQUIRED_SPECIALTIES,
} as const;

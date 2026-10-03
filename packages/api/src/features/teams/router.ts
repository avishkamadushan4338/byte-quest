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

import { adminProcedure, protectedProcedure } from "../../index";
import { inferDivision } from "../access/router";

const MIN_MEMBERS = 3;
const MAX_MEMBERS = 5;

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

const memberOutputSchema = z.object({
  userId: z.string(),
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

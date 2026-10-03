import type { Database, Submission } from "@byte-quest/db";
import { school, submission, teamMember } from "@byte-quest/db";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { adminProcedure, protectedProcedure } from "../../index";

const statusSchema = z.enum(["draft", "submitted", "approved", "rejected"]);

const submissionOutputSchema = z.object({
  id: z.string(),
  teamId: z.string(),
  title: z.string(),
  description: z.string(),
  repoUrl: z.string().nullable(),
  status: statusSchema,
  schoolId: z.string().nullable(),
  forwardedAt: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  reviewNote: z.string().nullable(),
});

const toOutput = (s: Submission) => ({
  id: s.id,
  teamId: s.teamId,
  title: s.title,
  description: s.description,
  repoUrl: s.repoUrl,
  status: s.status,
  schoolId: s.schoolId,
  forwardedAt: s.forwardedAt ? s.forwardedAt.toISOString() : null,
  reviewedAt: s.reviewedAt ? s.reviewedAt.toISOString() : null,
  reviewNote: s.reviewNote,
});

/** Resolve the caller's leader membership or throw. */
const requireLeaderMembership = async (db: Database, userId: string) => {
  const [membership] = await db
    .select()
    .from(teamMember)
    .where(eq(teamMember.userId, userId));
  if (!membership || membership.teamRole !== "leader") {
    throw new Error("Only the team leader can manage submissions");
  }
  return membership;
};

/** Fetch a submission owned by the leader's team or throw. */
const requireOwnSubmission = async (
  db: Database,
  userId: string,
  submissionId: string
) => {
  const membership = await requireLeaderMembership(db, userId);
  const [row] = await db
    .select()
    .from(submission)
    .where(
      and(
        eq(submission.id, submissionId),
        eq(submission.teamId, membership.teamId)
      )
    );
  if (!row) {
    throw new Error("Submission not found");
  }
  return row;
};

export const submissionsRouter = {
  submissions: {
    /** Leader: open a new submission (draft) for their team. */
    open: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1, "Title is required"),
          description: z.string().min(1),
          repoUrl: z.string().url().optional(),
        })
      )
      .output(submissionOutputSchema)
      .handler(async ({ context, input }) => {
        const membership = await requireLeaderMembership(
          context.db,
          context.profile.userId
        );
        const [existing] = await context.db
          .select({ id: submission.id })
          .from(submission)
          .where(eq(submission.teamId, membership.teamId));
        if (existing) {
          throw new Error("Your team already has a submission");
        }
        const [created] = await context.db
          .insert(submission)
          .values({
            teamId: membership.teamId,
            title: input.title,
            description: input.description,
            repoUrl: input.repoUrl ?? null,
            status: "draft",
          })
          .returning();
        if (!created) {
          throw new Error("Failed to create submission");
        }
        return toOutput(created);
      }),

    /** Leader: update the draft. */
    update: protectedProcedure
      .input(
        z.object({
          submissionId: z.string(),
          title: z.string().min(1).optional(),
          description: z.string().min(1).optional(),
          repoUrl: z.string().url().nullable().optional(),
        })
      )
      .output(submissionOutputSchema)
      .handler(async ({ context, input }) => {
        const row = await requireOwnSubmission(
          context.db,
          context.profile.userId,
          input.submissionId
        );
        if (row.status !== "draft") {
          throw new Error("Only draft submissions can be edited");
        }
        const { submissionId, ...changes } = input;
        const [updated] = await context.db
          .update(submission)
          .set(changes)
          .where(eq(submission.id, submissionId))
          .returning();
        if (!updated) {
          throw new Error("Failed to update submission");
        }
        return toOutput(updated);
      }),

    /**
     * Leader: forward the submission to a school. Selecting a school is how
     * the submission is routed onward for review.
     */
    forward: protectedProcedure
      .input(z.object({ submissionId: z.string(), schoolId: z.string() }))
      .output(submissionOutputSchema)
      .handler(async ({ context, input }) => {
        const row = await requireOwnSubmission(
          context.db,
          context.profile.userId,
          input.submissionId
        );
        if (row.status !== "draft") {
          throw new Error("Only draft submissions can be forwarded");
        }
        const [schoolRow] = await context.db
          .select({ id: school.id })
          .from(school)
          .where(eq(school.id, input.schoolId));
        if (!schoolRow) {
          throw new Error("School not found");
        }
        const [updated] = await context.db
          .update(submission)
          .set({
            schoolId: input.schoolId,
            status: "submitted",
            forwardedByUserId: context.profile.userId,
            forwardedAt: new Date(),
          })
          .where(eq(submission.id, input.submissionId))
          .returning();
        if (!updated) {
          throw new Error("Failed to forward submission");
        }
        return toOutput(updated);
      }),

    /** Leader: view their team's submission. */
    mine: protectedProcedure
      .output(submissionOutputSchema.nullable())
      .handler(async ({ context }) => {
        const [membership] = await context.db
          .select()
          .from(teamMember)
          .where(eq(teamMember.userId, context.profile.userId));
        if (!membership) {
          return null;
        }
        const [row] = await context.db
          .select()
          .from(submission)
          .where(eq(submission.teamId, membership.teamId));
        return row ? toOutput(row) : null;
      }),

    /** Admin: list submissions, filterable by status (RBAC oversight). */
    adminList: adminProcedure
      .input(z.object({ status: statusSchema.optional() }).optional())
      .output(z.array(submissionOutputSchema))
      .handler(async ({ context, input }) => {
        const rows = await context.db
          .select()
          .from(submission)
          .where(
            input?.status ? eq(submission.status, input.status) : undefined
          )
          .orderBy(desc(submission.createdAt));
        return rows.map(toOutput);
      }),

    /** Admin: review (approve/reject) a forwarded submission. */
    review: adminProcedure
      .input(
        z.object({
          submissionId: z.string(),
          approve: z.boolean(),
          note: z.string().optional(),
        })
      )
      .output(submissionOutputSchema)
      .handler(async ({ context, input }) => {
        const [row] = await context.db
          .select()
          .from(submission)
          .where(eq(submission.id, input.submissionId));
        if (!row) {
          throw new Error("Submission not found");
        }
        if (row.status !== "submitted") {
          throw new Error(
            "Only forwarded (submitted) submissions can be reviewed"
          );
        }
        const [updated] = await context.db
          .update(submission)
          .set({
            status: input.approve ? "approved" : "rejected",
            reviewedByUserId: context.profile.userId,
            reviewedAt: new Date(),
            reviewNote: input.note ?? null,
          })
          .where(eq(submission.id, input.submissionId))
          .returning();
        if (!updated) {
          throw new Error("Failed to review submission");
        }
        return toOutput(updated);
      }),
  },
};

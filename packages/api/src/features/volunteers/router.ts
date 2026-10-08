import type { VolunteerApplication } from "@byte-quest/db";
import { user, userProfile, volunteerApplication } from "@byte-quest/db";
import { ORPCError } from "@orpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
} from "../../index";
import { generatePassword, generateUsername } from "../../lib/credentials";

const statusSchema = z.enum(["pending", "approved", "rejected"]);

const applyInputSchema = z.object({
  teams: z.array(z.string()).min(1, "Choose at least one team"),
  student: z.object({
    fullName: z.string().min(1, "Full name is required"),
    school: z.string().min(1, "School is required"),
    admissionNumber: z.string().optional(),
    grade: z.string().min(1, "Grade is required"),
    className: z.string().min(1, "Class is required"),
    contactNumber: z.string().min(1, "Contact number is required"),
    email: z.string().optional(),
  }),
  guardian: z.object({
    name: z.string().min(1, "Guardian name is required"),
    relationship: z.string().optional(),
    contactNumber: z.string().min(1, "Guardian contact number is required"),
    alternateContactNumber: z.string().optional(),
  }),
  photoDataUrl: z.string().optional(),
});

const applicationOutputSchema = z.object({
  id: z.string(),
  reference: z.string(),
  teams: z.array(z.string()),
  fullName: z.string(),
  school: z.string(),
  admissionNumber: z.string().nullable(),
  grade: z.string(),
  className: z.string(),
  contactNumber: z.string(),
  email: z.string().nullable(),
  guardianName: z.string(),
  guardianRelationship: z.string().nullable(),
  guardianContactNumber: z.string(),
  guardianAlternateContactNumber: z.string().nullable(),
  photoDataUrl: z.string().nullable(),
  status: statusSchema,
  reviewNote: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  createdAt: z.string(),
  userId: z.string().nullable(),
  username: z.string().nullable(),
  accountEmail: z.string().nullable(),
});

/** Shapes a stored application row plus its derived reference for output. */
const toOutput = (
  row: VolunteerApplication,
  reference: string,
  credentials?: { accountEmail: string | null; username: string | null }
) => ({
  id: row.id,
  reference,
  teams: row.teams,
  fullName: row.fullName,
  school: row.school,
  admissionNumber: row.admissionNumber,
  grade: row.grade,
  className: row.className,
  contactNumber: row.contactNumber,
  email: row.email,
  guardianName: row.guardianName,
  guardianRelationship: row.guardianRelationship,
  guardianContactNumber: row.guardianContactNumber,
  guardianAlternateContactNumber: row.guardianAlternateContactNumber,
  photoDataUrl: row.photoDataUrl,
  status: row.status,
  reviewNote: row.reviewNote,
  reviewedAt: row.reviewedAt ? row.reviewedAt.toISOString() : null,
  createdAt: row.createdAt.toISOString(),
  userId: row.userId,
  username: credentials?.username ?? null,
  accountEmail: credentials?.accountEmail ?? null,
});

/** The reference shown to an applicant is just their row id, BQ-formatted. */
const referenceFor = (row: VolunteerApplication) =>
  `BQ-VOL-${row.id.slice(0, 8).toUpperCase()}`;

export const volunteersRouter = {
  volunteers: {
    /** Public: submit a volunteer application. No account required. */
    apply: publicProcedure
      .input(applyInputSchema)
      .output(applicationOutputSchema)
      .handler(async ({ context, input }) => {
        const [created] = await context.db
          .insert(volunteerApplication)
          .values({
            teams: input.teams,
            fullName: input.student.fullName.trim(),
            school: input.student.school.trim(),
            admissionNumber: input.student.admissionNumber?.trim() || null,
            grade: input.student.grade,
            className: input.student.className.trim(),
            contactNumber: input.student.contactNumber.trim(),
            email: input.student.email?.trim() || null,
            guardianName: input.guardian.name.trim(),
            guardianRelationship: input.guardian.relationship?.trim() || null,
            guardianContactNumber: input.guardian.contactNumber.trim(),
            guardianAlternateContactNumber:
              input.guardian.alternateContactNumber?.trim() || null,
            photoDataUrl: input.photoDataUrl ?? null,
          })
          .returning();
        if (!created) {
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message: "Failed to submit application",
          });
        }
        return toOutput(created, referenceFor(created));
      }),

    /** Admin: list volunteer applications, newest first, optionally by status. */
    adminList: adminProcedure
      .input(z.object({ status: statusSchema.optional() }).optional())
      .output(
        z.array(applicationOutputSchema.extend({ accountIssued: z.boolean() }))
      )
      .handler(async ({ context, input }) => {
        const rows = await context.db
          .select({
            app: volunteerApplication,
            username: user.username,
            userEmail: user.email,
          })
          .from(volunteerApplication)
          .leftJoin(user, eq(volunteerApplication.userId, user.id))
          .where(
            input?.status
              ? eq(volunteerApplication.status, input.status)
              : undefined
          )
          .orderBy(desc(volunteerApplication.createdAt));

        return rows.map(({ app, userEmail, username }) => ({
          ...toOutput(app, referenceFor(app), {
            accountEmail: userEmail ?? null,
            username: username ?? null,
          }),
          accountIssued: app.userId !== null,
        }));
      }),

    /**
     * Admin: approve or reject a volunteer application. Approval provisions
     * a login (role `volunteer`) with a generated username and password,
     * returned once to the reviewing admin.
     */
    decide: adminProcedure
      .input(
        z.object({
          applicationId: z.string(),
          approve: z.boolean(),
          note: z.string().optional(),
        })
      )
      .output(
        z.object({
          id: z.string(),
          status: z.enum(["approved", "rejected"]),
          username: z.string().nullable(),
          password: z.string().nullable(),
        })
      )
      .handler(async ({ context, input }) => {
        const [row] = await context.db
          .select()
          .from(volunteerApplication)
          .where(eq(volunteerApplication.id, input.applicationId));
        if (!row) {
          throw new ORPCError("NOT_FOUND", {
            message: "Application not found",
          });
        }
        if (row.status !== "pending") {
          throw new ORPCError("CONFLICT", {
            message: "Application already decided",
          });
        }

        if (!input.approve) {
          const [rejected] = await context.db
            .update(volunteerApplication)
            .set({
              status: "rejected",
              reviewedByUserId: context.profile.userId,
              reviewedAt: new Date(),
              reviewNote: input.note ?? null,
            })
            .where(eq(volunteerApplication.id, row.id))
            .returning();
          if (!rejected) {
            throw new ORPCError("INTERNAL_SERVER_ERROR", {
              message: "Failed to reject application",
            });
          }
          return {
            id: rejected.id,
            status: "rejected" as const,
            username: null,
            password: null,
          };
        }

        const username = generateUsername(row.fullName);
        const password = generatePassword();
        const email = `${username}@volunteers.bytequest.lk`;

        let userId: string;
        try {
          const createdUser = await context.auth.api.signUpEmail({
            body: { email, name: row.fullName, password, username },
          });
          userId = createdUser.user.id;
        } catch (error) {
          throw new ORPCError("CONFLICT", {
            message:
              error instanceof Error && error.message
                ? error.message
                : "Could not provision the volunteer's account",
          });
        }

        await context.db.insert(userProfile).values({
          userId,
          fullName: row.fullName,
          nationalId: `VOL-${row.id.slice(0, 8).toUpperCase()}`,
          birthday: "2010-01-01",
          grade: row.grade,
          role: "volunteer",
        });

        const [approved] = await context.db
          .update(volunteerApplication)
          .set({
            status: "approved",
            userId,
            reviewedByUserId: context.profile.userId,
            reviewedAt: new Date(),
            reviewNote: input.note ?? null,
          })
          .where(eq(volunteerApplication.id, row.id))
          .returning();
        if (!approved) {
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message: "Failed to approve application",
          });
        }

        return {
          id: approved.id,
          status: "approved" as const,
          username,
          password,
        };
      }),

    /** The signed-in volunteer's own application (for their portal/ID card). */
    mine: protectedProcedure
      .output(applicationOutputSchema.nullable())
      .handler(async ({ context }) => {
        const [row] = await context.db
          .select()
          .from(volunteerApplication)
          .where(
            and(
              eq(volunteerApplication.userId, context.profile.userId),
              eq(volunteerApplication.status, "approved")
            )
          );
        return row ? toOutput(row, referenceFor(row)) : null;
      }),
  },
};

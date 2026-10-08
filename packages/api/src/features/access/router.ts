import { account, adminApplication, user, userProfile } from "@byte-quest/db";
import { ORPCError } from "@orpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
} from "../../index";
import { generatePassword, generateUsername } from "../../lib/credentials";

/** Primary division covers grades 6-9; secondary covers grades 10-13. */
export const inferDivision = (grade: string): "primary" | "secondary" =>
  Number(grade) <= 9 ? "primary" : "secondary";

export const gradeSchema = z
  .string()
  .regex(/^(?:6|7|8|9|10|11|12|13)$/u, "Grade must be between 6 and 13");

/**
 * Roles a person may pick for themselves at sign-up. `admin` is deliberately
 * absent — the only route to admin is an approved admin application.
 */
export const selfServiceRoles = ["student", "leader", "mic"] as const;

export const selfServiceRoleSchema = z.enum(selfServiceRoles);

/** Human-facing labels for the self-service roles. */
export const selfServiceRoleLabels = {
  student: "Student",
  leader: "Team Leader",
  mic: "MIC (Teacher in charge)",
} satisfies Record<(typeof selfServiceRoles)[number], string>;

const USERNAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/u;

const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(32, "Username must be 32 characters or fewer")
  .regex(
    USERNAME_PATTERN,
    "Use letters, digits, dots, underscores or hyphens, starting with a letter or digit"
  );

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be 128 characters or fewer");

const emailSchema = z.email("Enter a valid email address");

const profileFieldsSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  nationalId: z.string().min(1, "National ID is required"),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u, "Use YYYY-MM-DD"),
  grade: gradeSchema,
});

const signupInputSchema = profileFieldsSchema.extend({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  role: selfServiceRoleSchema.default("student"),
  schoolId: z.string().nullable().optional(),
});

const signupOutputSchema = z.object({
  userId: z.string(),
  profileId: z.string(),
  role: selfServiceRoleSchema,
});

const meOutputSchema = z.object({
  userId: z.string(),
  username: z.string().nullable(),
  role: z.enum(["admin", "mic", "leader", "student", "volunteer"]),
  fullName: z.string(),
  nationalId: z.string(),
  birthday: z.string(),
  grade: z.string(),
});

const adminApplicationInputSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: emailSchema,
  username: usernameSchema,
  organization: z.string().min(1, "Organisation is required"),
  role: z.string().min(1, "Role is required"),
  experience: z.string().min(1, "Tell us why you should join"),
});

const adminApplicationOutputSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  username: z.string(),
  organization: z.string(),
  role: z.string(),
  experience: z.string(),
  status: z.enum(["pending", "approved", "rejected"]),
  reviewNote: z.string().nullable(),
  reviewedAt: z.string().nullable(),
  createdAt: z.string(),
});

export const accessRouter = {
  access: {
    /** Roles a new account may choose for itself. */
    selfServiceRoles: publicProcedure.handler(() => selfServiceRoles),

    /**
     * Register a new account with a username and password. The chosen role is
     * restricted to student / team leader / MIC.
     */
    register: publicProcedure
      .input(signupInputSchema)
      .output(signupOutputSchema)
      .handler(async ({ context, input }) => {
        let created: Awaited<ReturnType<typeof context.auth.api.signUpEmail>>;
        try {
          created = await context.auth.api.signUpEmail({
            body: {
              email: input.email,
              name: input.fullName,
              password: input.password,
              username: input.username.toLowerCase(),
            },
          });
        } catch (error) {
          throw new ORPCError("CONFLICT", {
            message:
              error instanceof Error && error.message
                ? error.message
                : "That username or email is already taken",
          });
        }

        const [profile] = await context.db
          .insert(userProfile)
          .values({
            userId: created.user.id,
            fullName: input.fullName,
            nationalId: input.nationalId,
            birthday: input.birthday,
            grade: input.grade,
            role: input.role,
          })
          .returning();
        if (!profile) {
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message: "Failed to create profile",
          });
        }

        return {
          userId: created.user.id,
          profileId: profile.id,
          role: input.role,
        };
      }),

    /** Complete the user profile for the signed-in account. */
    signup: publicProcedure
      .input(profileFieldsSchema)
      .output(signupOutputSchema)
      .handler(async ({ context, input }) => {
        const { session } = context;
        if (!session?.user) {
          throw new Error("Signup requires an authenticated session");
        }
        const [existing] = await context.db
          .select({ id: userProfile.id })
          .from(userProfile)
          .where(eq(userProfile.userId, session.user.id));
        if (existing) {
          throw new Error("Profile already exists");
        }
        const [profile] = await context.db
          .insert(userProfile)
          .values({
            userId: session.user.id,
            fullName: input.fullName,
            nationalId: input.nationalId,
            birthday: input.birthday,
            grade: input.grade,
            role: "student",
          })
          .returning();
        if (!profile) {
          throw new Error("Failed to create profile");
        }
        return {
          userId: session.user.id,
          profileId: profile.id,
          role: "student",
        };
      }),

    /** Current user profile (role + identification). */
    me: protectedProcedure.output(meOutputSchema).handler(({ context }) => ({
      userId: context.profile.userId,
      username: context.session.user.username ?? null,
      role: context.profile.role,
      fullName: context.profile.fullName,
      nationalId: context.profile.nationalId,
      birthday: context.profile.birthday,
      grade: context.profile.grade,
    })),

    /**
     * Who may register a team: the person registering is either the team
     * leader or the school's MIC. Used to gate the registration wizard.
     */
    canRegisterTeam: protectedProcedure
      .output(
        z.object({
          canRegister: z.boolean(),
          role: z.enum(["admin", "mic", "leader", "student", "volunteer"]),
          reason: z.string().nullable(),
        })
      )
      .handler(({ context }) => {
        const { role } = context.profile;
        const isLeader =
          role === "leader" || role === "mic" || role === "admin";
        return {
          canRegister: isLeader,
          role,
          reason: isLeader
            ? null
            : "Only the team leader or the school's MIC (teacher in charge) can register a team. Ask your leader to register, or ask your MIC to register on the school's behalf.",
        };
      }),

    /** Admin: list all users and their roles. */
    listUsers: adminProcedure
      .output(
        z.array(
          z.object({
            userId: z.string(),
            username: z.string().nullable(),
            role: z.enum(["admin", "mic", "leader", "student", "volunteer"]),
            fullName: z.string(),
          })
        )
      )
      .handler(async ({ context }) => {
        const rows = await context.db
          .select({
            userId: userProfile.userId,
            username: user.username,
            role: userProfile.role,
            fullName: userProfile.fullName,
          })
          .from(userProfile)
          .leftJoin(user, eq(userProfile.userId, user.id));
        return rows.map((row) => ({
          userId: row.userId,
          username: row.username ?? null,
          role: row.role,
          fullName: row.fullName,
        }));
      }),

    /** Admin: create a new user account with a provisioned username & password. */
    createUser: adminProcedure
      .input(
        z.object({
          fullName: z.string().min(1, "Full name is required"),
          role: z.enum(["admin", "mic", "leader", "student", "volunteer"]),
          email: z.string().email("Invalid email").optional(),
          grade: gradeSchema.default("10"),
          schoolId: z.string().optional(),
        })
      )
      .output(
        z.object({
          userId: z.string(),
          fullName: z.string(),
          username: z.string(),
          password: z.string(),
          role: z.enum(["admin", "mic", "leader", "student", "volunteer"]),
        })
      )
      .handler(async ({ context, input }) => {
        const username = generateUsername(input.fullName);
        const password = generatePassword();
        const email =
          input.email?.trim() ||
          `${username}@${input.role === "volunteer" ? "volunteers" : "users"}.bytequest.lk`;

        let userId: string;
        try {
          const createdUser = await context.auth.api.signUpEmail({
            body: {
              email,
              name: input.fullName.trim(),
              password,
              username,
            },
          });
          userId = createdUser.user.id;
        } catch (error) {
          throw new ORPCError("CONFLICT", {
            message:
              error instanceof Error && error.message
                ? error.message
                : "Could not create user account",
          });
        }

        await context.db.insert(userProfile).values({
          userId,
          fullName: input.fullName.trim(),
          nationalId: `ID-${userId.slice(0, 8).toUpperCase()}`,
          birthday: "2008-01-01",
          grade: input.grade,
          role: input.role,
        });

        return {
          userId,
          fullName: input.fullName.trim(),
          username,
          password,
          role: input.role,
        };
      }),

    /** Admin: change a user's role (RBAC control). */
    setRole: adminProcedure
      .input(
        z.object({
          userId: z.string(),
          role: z.enum(["admin", "mic", "leader", "student", "volunteer"]),
        })
      )
      .output(
        z.object({
          userId: z.string(),
          role: z.enum(["admin", "mic", "leader", "student", "volunteer"]),
        })
      )
      .handler(async ({ context, input }) => {
        if (input.userId === context.session.user.id) {
          throw new Error("Cannot change your own role");
        }
        const [updated] = await context.db
          .update(userProfile)
          .set({ role: input.role })
          .where(eq(userProfile.userId, input.userId))
          .returning();
        if (!updated) {
          throw new Error("User not found");
        }
        return { userId: updated.userId, role: updated.role };
      }),

    /** Admin: rotate a participant's password and return the new credential. Admin accounts cannot be rotated. */
    rotateUserPassword: adminProcedure
      .input(
        z.object({
          userId: z.string(),
        })
      )
      .output(
        z.object({
          userId: z.string(),
          fullName: z.string(),
          password: z.string(),
        })
      )
      .handler(async ({ context, input }) => {
        const [targetProfile] = await context.db
          .select({
            userId: userProfile.userId,
            fullName: userProfile.fullName,
            role: userProfile.role,
          })
          .from(userProfile)
          .where(eq(userProfile.userId, input.userId));

        if (!targetProfile) {
          throw new ORPCError("NOT_FOUND", {
            message: "User profile not found",
          });
        }

        if (targetProfile.role === "admin") {
          throw new ORPCError("FORBIDDEN", {
            message: "Admin password rotation is not allowed.",
          });
        }

        const newPassword = generatePassword();
        const authContext = await context.auth.$context;
        const hashedPassword = await authContext.password.hash(newPassword);

        // Update password on account credentials
        const updated = await context.db
          .update(account)
          .set({
            password: hashedPassword,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(account.userId, input.userId),
              eq(account.providerId, "credential")
            )
          )
          .returning({ id: account.id });

        if (updated.length === 0) {
          // If no credential account row exists, also check providerId: email or insert
          const anyAccount = await context.db
            .select({ id: account.id, providerId: account.providerId })
            .from(account)
            .where(eq(account.userId, input.userId));

          if (anyAccount.length > 0) {
            await context.db
              .update(account)
              .set({
                password: hashedPassword,
                updatedAt: new Date(),
              })
              .where(eq(account.userId, input.userId));
          } else {
            throw new ORPCError("NOT_FOUND", {
              message: "No authentication account found for this user",
            });
          }
        }

        return {
          userId: targetProfile.userId,
          fullName: targetProfile.fullName,
          password: newPassword,
        };
      }),

    /** Public: apply for admin (organising committee) access. */
    applyForAdmin: publicProcedure
      .input(adminApplicationInputSchema)
      .output(
        z.object({
          id: z.string(),
          status: z.literal("pending"),
        })
      )
      .handler(async ({ context, input }) => {
        const username = input.username.toLowerCase();
        const [pending] = await context.db
          .select({ id: adminApplication.id })
          .from(adminApplication)
          .where(
            and(
              eq(adminApplication.email, input.email),
              eq(adminApplication.status, "pending")
            )
          );
        if (pending) {
          throw new ORPCError("CONFLICT", {
            message: "You already have an application awaiting review",
          });
        }

        const [existingApproved] = await context.db
          .select({ id: adminApplication.id })
          .from(adminApplication)
          .where(
            and(
              eq(adminApplication.email, input.email),
              eq(adminApplication.status, "approved")
            )
          );
        if (existingApproved) {
          throw new ORPCError("CONFLICT", {
            message:
              "An admin account for this email is already approved. Admin password rotation is not allowed.",
          });
        }

        const [existingUser] = await context.db
          .select({ id: user.id })
          .from(user)
          .where(eq(user.email, input.email));
        if (existingUser) {
          throw new ORPCError("CONFLICT", {
            message:
              "An account with this email already exists. Admin password rotation is not allowed.",
          });
        }

        const [created] = await context.db
          .insert(adminApplication)
          .values({ ...input, username })
          .returning({ id: adminApplication.id });
        if (!created) {
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message: "Failed to submit application",
          });
        }
        return { id: created.id, status: "pending" as const };
      }),

    /** Admin: list applications, newest first, optionally by status. */
    listAdminApplications: adminProcedure
      .input(
        z
          .object({
            status: z.enum(["pending", "approved", "rejected"]).optional(),
          })
          .optional()
      )
      .output(z.array(adminApplicationOutputSchema))
      .handler(async ({ context, input }) => {
        const rows = await context.db
          .select()
          .from(adminApplication)
          .where(
            input?.status
              ? eq(adminApplication.status, input.status)
              : undefined
          )
          .orderBy(desc(adminApplication.createdAt));
        return rows.map((row) => ({
          id: row.id,
          fullName: row.fullName,
          email: row.email,
          username: row.username,
          organization: row.organization,
          role: row.role,
          experience: row.experience,
          status: row.status,
          reviewNote: row.reviewNote,
          reviewedAt: row.reviewedAt ? row.reviewedAt.toISOString() : null,
          createdAt: row.createdAt.toISOString(),
        }));
      }),

    /**
     * Admin: approve or reject an application. Approval provisions the account
     * with a generated password, returned once to the reviewing admin.
     */
    decideAdminApplication: adminProcedure
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
          /** Set only on approval: the one-time password for the new account. */
          password: z.string().nullable(),
        })
      )
      .handler(async ({ context, input }) => {
        const [row] = await context.db
          .select()
          .from(adminApplication)
          .where(eq(adminApplication.id, input.applicationId));
        if (!row) {
          throw new ORPCError("NOT_FOUND", {
            message: "Application not found",
          });
        }
        if (row.status !== "pending") {
          throw new ORPCError("CONFLICT", {
            message:
              "Application already decided. Admin password rotation is not allowed.",
          });
        }

        if (!input.approve) {
          const [rejected] = await context.db
            .update(adminApplication)
            .set({
              status: "rejected",
              reviewedByUserId: context.profile.userId,
              reviewedAt: new Date(),
              reviewNote: input.note ?? null,
            })
            .where(eq(adminApplication.id, row.id))
            .returning();
          if (!rejected) {
            throw new ORPCError("INTERNAL_SERVER_ERROR", {
              message: "Failed to reject application",
            });
          }
          return {
            id: rejected.id,
            status: "rejected" as const,
            password: null,
          };
        }

        const password = generatePassword();

        let userId: string;
        try {
          const created = await context.auth.api.signUpEmail({
            body: {
              email: row.email,
              name: row.fullName,
              password,
              username: row.username,
            },
          });
          userId = created.user.id;
        } catch (error) {
          throw new ORPCError("CONFLICT", {
            message:
              error instanceof Error && error.message
                ? error.message
                : "Could not provision the account for this application",
          });
        }

        await context.db.insert(userProfile).values({
          userId,
          fullName: row.fullName,
          nationalId: row.username,
          birthday: "1970-01-01",
          grade: "13",
          role: "admin",
        });

        const [approved] = await context.db
          .update(adminApplication)
          .set({
            status: "approved",
            reviewedByUserId: context.profile.userId,
            reviewedAt: new Date(),
            reviewNote: input.note ?? null,
          })
          .where(eq(adminApplication.id, row.id))
          .returning();
        if (!approved) {
          throw new ORPCError("INTERNAL_SERVER_ERROR", {
            message: "Failed to approve application",
          });
        }

        return {
          id: approved.id,
          status: "approved" as const,
          password,
        };
      }),
  },
};

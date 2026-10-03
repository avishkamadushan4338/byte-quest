import { userProfile } from "@byte-quest/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProcedure,
  protectedProcedure,
  publicProcedure,
} from "../../index";

/** Primary division covers grades 6-9; secondary covers grades 10-13. */
export const inferDivision = (grade: string): "primary" | "secondary" =>
  Number(grade) <= 9 ? "primary" : "secondary";

export const gradeSchema = z
  .string()
  .regex(/^(?:6|7|8|9|10|11|12|13)$/u, "Grade must be between 6 and 13");

const signupInputSchema = z.object({
  fullName: z.string().min(1),
  nationalId: z.string().min(1),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u, "Use YYYY-MM-DD"),
  grade: gradeSchema,
});

const signupOutputSchema = z.object({
  userId: z.string(),
  profileId: z.string(),
});

const meOutputSchema = z.object({
  userId: z.string(),
  role: z.enum(["admin", "student"]),
  fullName: z.string(),
  nationalId: z.string(),
  birthday: z.string(),
  grade: z.string(),
});

export const accessRouter = {
  access: {
    /** Complete the user profile for the signed-up account (identity data). */
    signup: publicProcedure
      .input(signupInputSchema)
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
        return { userId: session.user.id, profileId: profile.id };
      }),

    /** Current user profile (role + identification). */
    me: protectedProcedure.output(meOutputSchema).handler(({ context }) => ({
      userId: context.session.user.id,
      role: context.profile.role,
      fullName: context.profile.fullName,
      nationalId: context.profile.nationalId,
      birthday: context.profile.birthday,
      grade: context.profile.grade,
    })),

    /** Admin: list all users and their roles. */
    listUsers: adminProcedure
      .output(
        z.array(
          z.object({
            userId: z.string(),
            role: z.enum(["admin", "student"]),
            fullName: z.string(),
          })
        )
      )
      .handler(async ({ context }) => {
        const profiles = await context.db.select().from(userProfile);
        return profiles.map((p) => ({
          userId: p.userId,
          role: p.role,
          fullName: p.fullName,
        }));
      }),

    /** Admin: change a user's role (RBAC control). */
    setRole: adminProcedure
      .input(
        z.object({ userId: z.string(), role: z.enum(["admin", "student"]) })
      )
      .output(
        z.object({ userId: z.string(), role: z.enum(["admin", "student"]) })
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
  },
};

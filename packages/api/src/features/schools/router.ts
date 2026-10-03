import { school, team } from "@byte-quest/db";
import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { adminProcedure, publicProcedure } from "../../index";

const schoolOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
});

const schoolWithSlotsSchema = schoolOutputSchema.extend({
  primarySlotsUsed: z.number(),
  secondarySlotsUsed: z.number(),
});

export const schoolsRouter = {
  schools: {
    /** Public list so students can pick a school when forwarding. */
    list: publicProcedure
      .output(z.array(schoolOutputSchema))
      .handler(({ context }) =>
        context.db
          .select({
            id: school.id,
            name: school.name,
            city: school.city,
          })
          .from(school)
          .orderBy(asc(school.name))
      ),

    /** Public detail: which division team slots are still free. */
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .output(schoolWithSlotsSchema)
      .handler(async ({ context, input }) => {
        const [row] = await context.db
          .select({
            id: school.id,
            name: school.name,
            city: school.city,
            primarySlotsUsed:
              sql<number>`count(*) filter (where ${team.division} = 'primary')`.mapWith(
                Number
              ),
            secondarySlotsUsed:
              sql<number>`count(*) filter (where ${team.division} = 'secondary')`.mapWith(
                Number
              ),
          })
          .from(school)
          .leftJoin(team, eq(team.schoolId, school.id))
          .where(eq(school.id, input.id))
          .groupBy(school.id);
        if (!row) {
          throw new Error("School not found");
        }
        return row;
      }),

    /** Admin: register a school. */
    create: adminProcedure
      .input(z.object({ name: z.string().min(1), city: z.string().min(1) }))
      .output(schoolOutputSchema)
      .handler(async ({ context, input }) => {
        const [created] = await context.db
          .insert(school)
          .values(input)
          .returning();
        if (!created) {
          throw new Error("Failed to create school");
        }
        return created;
      }),

    /** Admin: update a school. */
    update: adminProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().min(1).optional(),
          city: z.string().min(1).optional(),
        })
      )
      .output(schoolOutputSchema)
      .handler(async ({ context, input }) => {
        const { id, ...changes } = input;
        const [updated] = await context.db
          .update(school)
          .set(changes)
          .where(eq(school.id, id))
          .returning();
        if (!updated) {
          throw new Error("School not found");
        }
        return updated;
      }),
  },
};

import type { Database } from "@byte-quest/db";
import { school, team } from "@byte-quest/db";
import { asc, eq, like, sql } from "drizzle-orm";
import { z } from "zod";

import { adminProcedure, publicProcedure } from "../../index";

export interface SchoolLookup {
  name: string;
  city: string;
  province?: string;
  address?: string;
}

const schoolOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
  province: z.string().nullable(),
  address: z.string().nullable(),
});

const schoolWithSlotsSchema = schoolOutputSchema.extend({
  primarySlotsUsed: z.number(),
  secondarySlotsUsed: z.number(),
});

/**
 * Resolve a school by name for team registration: exact match first, then a
 * case-insensitive "contains" match, otherwise insert. Schools self-register
 * through the MIC, so this is deliberately reachable without admin rights.
 */
export const findOrCreateSchool = async (db: Database, input: SchoolLookup) => {
  const name = input.name.trim();
  const city = input.city.trim();
  const province = input.province?.trim() || null;
  const address = input.address?.trim() || null;

  const [exact] = await db
    .select({
      id: school.id,
      name: school.name,
      city: school.city,
      province: school.province,
      address: school.address,
    })
    .from(school)
    .where(eq(school.name, name))
    .limit(1);
  if (exact) {
    return exact;
  }

  const [partial] = await db
    .select({
      id: school.id,
      name: school.name,
      city: school.city,
      province: school.province,
      address: school.address,
    })
    .from(school)
    .where(like(school.name, `%${name}%`))
    .limit(1);
  if (partial) {
    return partial;
  }

  const [created] = await db
    .insert(school)
    .values({ name, city, province, address })
    .returning();
  if (!created) {
    throw new Error("Failed to register school");
  }
  return created;
};

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
            province: school.province,
            address: school.address,
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
            province: school.province,
            address: school.address,
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
      .input(
        z.object({
          name: z.string().min(1),
          city: z.string().min(1),
          province: z.string().optional(),
          address: z.string().optional(),
        })
      )
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
          province: z.string().optional(),
          address: z.string().optional(),
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

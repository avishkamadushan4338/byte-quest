import { userProfile } from "@byte-quest/db";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import { authMiddleware } from "@/middleware/auth";
import { db } from "@/services";

export const getProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.session?.user.id;
    if (!userId) {
      return null;
    }
    const [profile] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, userId));
    return profile ?? null;
  });

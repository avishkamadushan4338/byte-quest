import type { Context as ApiContext } from "@byte-quest/api/context";
import { userProfile } from "@byte-quest/db";
import { eq } from "drizzle-orm";

import { db, auth } from "./services";

export const createContext = async ({
  req,
}: {
  req: Request;
}): Promise<ApiContext> => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  let profile = null;
  if (session?.user) {
    const [row] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, session.user.id));
    profile = row ?? null;
  }

  return {
    auth,
    db,
    session,
    profile,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

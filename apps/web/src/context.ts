import type { Context as ApiContext } from "@byte-quest/api/context";

import { db, auth } from "./services";

export const createContext = async ({
  req,
}: {
  req: Request;
}): Promise<ApiContext> => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  return {
    db,
    session,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

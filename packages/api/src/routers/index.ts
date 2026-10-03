import type { RouterClient } from "@orpc/server";

import { accessRouter } from "../features/access/router";
import { schoolsRouter } from "../features/schools/router";
import { submissionsRouter } from "../features/submissions/router";
import { teamsRouter } from "../features/teams/router";
import { protectedProcedure, publicProcedure } from "../index";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => "OK"),
  privateData: protectedProcedure.handler(({ context }) => ({
    message: "This is private",
    user: context.session?.user,
  })),
  ...accessRouter,
  ...schoolsRouter,
  ...teamsRouter,
  ...submissionsRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;

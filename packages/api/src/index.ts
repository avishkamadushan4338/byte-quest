import { ORPCError, os } from "@orpc/server";

import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user || !context.profile) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return await next({
    context: {
      session: context.session,
      profile: context.profile,
    },
  });
});

const requireAdmin = o.middleware(async ({ context, next }) => {
  if (!context.session?.user || !context.profile) {
    throw new ORPCError("UNAUTHORIZED");
  }
  if (context.profile.role !== "admin") {
    throw new ORPCError("FORBIDDEN", {
      message: "Admin role required",
    });
  }
  return await next({
    context: {
      session: context.session,
      profile: context.profile,
    },
  });
});

export const protectedProcedure = publicProcedure.use(requireAuth);
export const adminProcedure = publicProcedure.use(requireAdmin);

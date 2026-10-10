import { session } from "@byte-quest/db";
import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";

import type { Context } from "../context";

export interface ProvisionInput {
  email: string;
  name: string;
  username: string;
  password: string;
}

/**
 * Creates a credential login without ever touching the caller's session.
 *
 * `auth.api.signUpEmail()` mints a session because `emailAndPassword.autoSignIn`
 * is on, which is what we want for duplicate detection (a taken email throws
 * instead of silently returning a synthetic user). The throwaway session is
 * deleted here: nobody holds its token, and leaving it in the table would keep
 * a live session alive for an account that has not signed in yet.
 *
 * Note the cookie for that session is never forwarded to the caller - sessions
 * are only ever established by the browser hitting `/api/auth/*`.
 */
export const provisionCredentialUser = async (
  context: Pick<Context, "auth" | "db">,
  input: ProvisionInput
): Promise<string> => {
  let userId: string;
  try {
    const created = await context.auth.api.signUpEmail({
      body: {
        email: input.email,
        name: input.name,
        password: input.password,
        username: input.username,
      },
    });
    userId = created.user.id;
  } catch (error) {
    throw new ORPCError("CONFLICT", {
      message:
        error instanceof Error && error.message
          ? error.message
          : "Could not create this account",
    });
  }

  await context.db.delete(session).where(eq(session.userId, userId));

  return userId;
};

import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import type { Database } from "@byte-quest/db";
import * as schema from "@byte-quest/db/schema/auth";
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";

export { ensureBootstrapAdmin, ADMIN_USERNAME } from "./admin";
export type { AdminBootstrapConfig } from "./admin";

/**
 * Sign-in handles allow letters, digits, dots, underscores and hyphens, and
 * must start alphanumeric. Hyphens matter: generated MIC handles embed them,
 * and better-auth's built-in validator rejects them at sign-in — which would
 * create rows that look valid but can never log in.
 */
export const USERNAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/u;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 32;

export const isValidUsername = (value: string) =>
  value.length >= USERNAME_MIN_LENGTH &&
  value.length <= USERNAME_MAX_LENGTH &&
  USERNAME_PATTERN.test(value);

export interface AuthConfig {
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  ADMIN_PASSWORD: string;
  ADMIN_NAME?: string;
  ADMIN_EMAIL?: string;
}

export interface AuthOptions {
  /** Lower bound for password length; defaults to Better Auth's minimum. */
  minPasswordLength?: number;
}

export const createAuth = (
  env: AuthConfig,
  database: Database,
  options: AuthOptions = {}
) =>
  betterAuth({
    database: drizzleAdapter(database, {
      provider: "sqlite",
      schema,
    }),
    trustedOrigins: [env.BETTER_AUTH_URL],
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: options.minPasswordLength ?? 8,
      requireEmailVerification: false,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    user: {
      additionalFields: {
        displayUsername: {
          type: "string",
          required: false,
          input: false,
        },
      },
    },
    plugins: [
      /**
       * Do NOT add `tanstackStartCookies()` here.
       *
       * It short-circuits for the HTTP router (`apps/web/src/routes/api/auth/$`),
       * so it contributes nothing to browser sign-in. Its `after` hook matches
       * *every* endpoint, including the server-side `auth.api.signUpEmail()`
       * calls that provision volunteer/captain/user logins. Those calls mint a
       * session (see `autoSignIn` above) and the hook pushed that Set-Cookie
       * into the ambient request scope - so approving a volunteer silently
       * overwrote the reviewing admin's session cookie and logged them out.
       *
       * Sessions are only ever established by the browser hitting
       * `/api/auth/*`, which returns its own Set-Cookie.
       */
      username({
        usernameValidator: isValidUsername,
        minUsernameLength: USERNAME_MIN_LENGTH,
        maxUsernameLength: USERNAME_MAX_LENGTH,
      }),
    ],
  });

export type Session = ReturnType<typeof createAuth>["$Infer"]["Session"];
export type Auth = ReturnType<typeof createAuth>;

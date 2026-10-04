import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import type { Database } from "@byte-quest/db";
import * as schema from "@byte-quest/db/schema/auth";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export type OtpType =
  | "sign-in"
  | "email-verification"
  | "forget-password"
  | "change-email";

export interface OtpMessage {
  email: string;
  otp: string;
  type: OtpType;
}

export type OtpSender = (message: OtpMessage) => Promise<void>;

const logOtpToConsole: OtpSender = ({ email, otp, type }) => {
  console.info(`[byte-quest] OTP ${type} for ${email}: ${otp}`);
  return Promise.resolve();
};

export interface AuthConfig {
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
}

export interface AuthOptions {
  sendVerificationOTP?: OtpSender;
}

export const createAuth = (
  env: AuthConfig,
  database: Database,
  options: AuthOptions = {}
) =>
  betterAuth({
    database: drizzleAdapter(database, {
      provider: "pg",
      schema,
    }),
    trustedOrigins: [env.BETTER_AUTH_URL],
    emailAndPassword: { enabled: false },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    plugins: [
      tanstackStartCookies(),
      emailOTP({
        sendVerificationOTP: options.sendVerificationOTP ?? logOtpToConsole,
        storeOTP: "hashed",
        allowedAttempts: 5,
      }),
    ],
  });

export type Session = ReturnType<typeof createAuth>["$Infer"]["Session"];

import type { Database } from "@byte-quest/db";
import { account, session, user, userProfile } from "@byte-quest/db";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { and, eq, or } from "drizzle-orm";

/** Fixed login username for the seeded admin seat. */
export const ADMIN_USERNAME = "admin";

/** Minimum length required for `ADMIN_PASSWORD`. */
export const MIN_ADMIN_PASSWORD_LENGTH = 8;

/** Placeholder profile fields for the seeded admin — not real identity data. */
const ADMIN_PLACEHOLDER_NIC = "ADM-0001";
const ADMIN_PLACEHOLDER_BIRTHDAY = "1990-01-01";
const ADMIN_PLACEHOLDER_GRADE = "N/A";

export interface AdminBootstrapConfig {
  ADMIN_PASSWORD: string;
  ADMIN_NAME?: string;
  ADMIN_EMAIL?: string;
}

/**
 * Refuses to boot with an unset or too-short `ADMIN_PASSWORD` — the same
 * password is granted the `admin` role, so a weak value must fail loudly
 * rather than silently become a usable login.
 */
const assertAdminPassword = (password: string | undefined): string => {
  if (!password) {
    throw new Error(
      "Refusing to start: ADMIN_PASSWORD is not set. Add it to the server environment."
    );
  }
  if (password.length < MIN_ADMIN_PASSWORD_LENGTH) {
    throw new Error(
      `Refusing to start: ADMIN_PASSWORD is shorter than ${MIN_ADMIN_PASSWORD_LENGTH} characters.`
    );
  }
  return password;
};

/**
 * Bootstraps the seeded `admin` account from the server environment on every
 * start. `.env` (or the orchestrator's environment) is the standing source of
 * truth: a missing account is created with the configured password and name,
 * and an existing account's stored password is reconciled against the
 * current `ADMIN_PASSWORD` — only rewritten (and every session for the seat
 * revoked) when it no longer matches. An unchanged password is a no-op, so
 * this never re-hashes or disrupts sessions on an ordinary restart.
 *
 * This means `.env` is also how you rotate the admin password: change
 * `ADMIN_PASSWORD` and restart the server.
 */
export const ensureBootstrapAdmin = async (
  database: Database,
  env: AdminBootstrapConfig
): Promise<void> => {
  const password = assertAdminPassword(env.ADMIN_PASSWORD);
  const name = env.ADMIN_NAME || "Admin";
  const email = (env.ADMIN_EMAIL || "admin@byte-quest.local").toLowerCase();

  const [existing] = await database
    .select()
    .from(user)
    .where(or(eq(user.username, ADMIN_USERNAME), eq(user.email, email)))
    .limit(1);

  let userId: string;

  if (existing) {
    userId = existing.id;
    await database
      .update(user)
      .set({
        username: ADMIN_USERNAME,
        displayUsername: ADMIN_USERNAME,
        name,
        email,
      })
      .where(eq(user.id, userId));

    const [existingAccount] = await database
      .select()
      .from(account)
      .where(
        and(eq(account.userId, userId), eq(account.providerId, "credential"))
      )
      .limit(1);

    if (existingAccount) {
      const matchesEnv = await verifyPassword({
        hash: existingAccount.password ?? "",
        password,
      });
      if (!matchesEnv) {
        const hash = await hashPassword(password);
        await database
          .update(account)
          .set({ password: hash })
          .where(eq(account.id, existingAccount.id));
        await database.delete(session).where(eq(session.userId, userId));
        console.log("[auth] Rotated admin password from env, sessions revoked");
      }
    } else {
      const hash = await hashPassword(password);
      await database.insert(account).values({
        id: crypto.randomUUID(),
        accountId: userId,
        providerId: "credential",
        userId,
        password: hash,
      });
    }
  } else {
    userId = crypto.randomUUID();
    const hash = await hashPassword(password);
    await database.insert(user).values({
      id: userId,
      name,
      email,
      emailVerified: true,
      username: ADMIN_USERNAME,
      displayUsername: ADMIN_USERNAME,
    });
    await database.insert(account).values({
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: hash,
    });
    console.log(`[auth] Created admin account (${ADMIN_USERNAME})`);
  }

  const [existingProfile] = await database
    .select()
    .from(userProfile)
    .where(eq(userProfile.userId, userId))
    .limit(1);

  if (existingProfile) {
    if (existingProfile.role !== "admin") {
      await database
        .update(userProfile)
        .set({ role: "admin" })
        .where(eq(userProfile.id, existingProfile.id));
    }
  } else {
    await database.insert(userProfile).values({
      userId,
      role: "admin",
      fullName: name,
      nationalId: ADMIN_PLACEHOLDER_NIC,
      birthday: ADMIN_PLACEHOLDER_BIRTHDAY,
      grade: ADMIN_PLACEHOLDER_GRADE,
    });
  }
};

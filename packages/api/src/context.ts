import type { Session } from "@byte-quest/auth";
import type { Database, UserProfile } from "@byte-quest/db";

export interface Context {
  session: Session | null;
  profile: UserProfile | null;
  db: Database;
}

/** The authenticated caller's context variant. */
export interface AuthenticatedContext {
  session: NonNullable<Session>;
  profile: UserProfile;
  db: Database;
}

/** The admin caller's context variant. */
export interface AdminContext extends AuthenticatedContext {
  profile: UserProfile & { role: "admin" };
}

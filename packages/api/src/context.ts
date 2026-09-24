import type { Session } from "@byte-quest/auth";
import type { Database } from "@byte-quest/db";

export interface Context {
  session: Session | null;
  db: Database;
}

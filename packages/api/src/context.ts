import type { Session } from "@byte-quest/auth";
import type { Database } from "@byte-quest/db";

export type Context = {
  session: Session | null;
  db: Database;
};

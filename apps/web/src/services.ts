import { createAuth } from "@byte-quest/auth";
import { createDb } from "@byte-quest/db";

import { ENV } from "./env.server";

export const db = await createDb(ENV);
export const auth = createAuth(ENV, db);

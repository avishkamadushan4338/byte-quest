import { createAuth, ensureBootstrapAdmin } from "@byte-quest/auth";
import { createDb } from "@byte-quest/db";
import { createMailDelivery, sendStartupAlert } from "@byte-quest/api/lib/mail";

import { ENV } from "./env.server";

export const db = await createDb(ENV);
export const auth = createAuth(ENV, db);

// Bootstrap (or reconcile) the admin account from the server environment on
// every start: a missing account is created with ADMIN_PASSWORD, an existing
// one has its password re-synced against the current env value (and only
// then, with sessions revoked) so rotating ADMIN_PASSWORD and restarting is
// how the admin password is changed.
await ensureBootstrapAdmin(db, ENV);

export const mail = createMailDelivery(process.env);

// Operator alert: mail the configured operator each time the process starts.
// Fire-and-forget; a failed send is logged and never blocks serving requests.
void sendStartupAlert(process.env);

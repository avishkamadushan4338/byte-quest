/**
 * Structured audit trail for privileged admin actions (role changes,
 * credential issuance, application decisions).
 *
 * Entries are emitted as a single JSON line on stdout so the container log
 * driver in front of this app (Docker/Portainer/Plesk) can ship and search
 * them without a second datastore. Credentials are never included — only the
 * fact that one was issued.
 */

export interface AuditEvent {
  /** Stable dotted name of the action, e.g. "user.set-role". */
  action: string;
  /** The signed-in admin on whose behalf the action ran. */
  actorUserId: string;
  /** The account the action targeted, when there is one. */
  targetUserId?: string;
  /** Non-sensitive context (role names, application ids, counts). */
  details?: Record<string, string | number | boolean | null | string[]>;
}

export const auditLog = (event: AuditEvent): void => {
  console.info(
    `[audit] ${JSON.stringify({
      timestamp: new Date().toISOString(),
      ...event,
    })}`
  );
};

/**
 * Outbound mail (ported from school-management's `packages/auth/src/email.ts`).
 *
 * `MAIL_TRANSPORT`:
 * - `console` — the message is printed to the server log. Refused in production.
 * - `smtp` — sent through a real mailbox via `nodemailer`. A fresh connection
 *   is opened per send.
 * - unset — `console` in development and test; in production every send fails
 *   with a message naming the missing configuration.
 *
 * Provider errors are thrown, never swallowed here.
 */

import { createTransport } from "nodemailer";

export interface OutboundMessage {
  to: string;
  subject: string;
  body: string;
  /** Optional HTML version; `body` stays as the plain-text alternative. */
  html?: string;
}

export type MailDelivery = (message: OutboundMessage) => Promise<void>;

export interface MailConfig {
  NODE_ENV?: string;
  MAIL_TRANSPORT?: string;
  MAIL_FROM?: string;
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_SECURE?: string;
  SMTP_ALLOW_SELF_SIGNED?: string;
}

export interface SmtpOptions {
  host: string;
  port: number;
  secure: boolean;
  auth?: { user: string; pass: string };
  rejectUnauthorized: boolean;
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/** Injectable so tests never open a real socket. */
export type SmtpSend = (options: SmtpOptions) => Promise<void>;

const logToConsole: MailDelivery = ({ to, subject, body }) => {
  console.info(`[mail] to=${to} subject="${subject}"\n${body}`);
  return Promise.resolve();
};

const refuse =
  (reason: string): MailDelivery =>
  ({ to }) =>
    Promise.reject(new Error(`Cannot send email to ${to}: ${reason}`));

const defaultSmtpSend: SmtpSend = async ({
  host,
  port,
  secure,
  auth,
  rejectUnauthorized,
  from,
  to,
  subject,
  text,
  html,
}) => {
  const transporter = createTransport({
    host,
    port,
    secure,
    auth,
    tls: { rejectUnauthorized },
  });
  try {
    await transporter.sendMail({ from, to, subject, text, html });
  } finally {
    transporter.close();
  }
};

const viaSmtp =
  (
    smtp: Omit<SmtpOptions, "from" | "to" | "subject" | "text">,
    from: string,
    sendImpl: SmtpSend
  ): MailDelivery =>
  async ({ to, subject, body, html }) => {
    try {
      await sendImpl({ ...smtp, from, to, subject, text: body, html });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(`Mail provider refused the message to ${to}: ${reason}`, {
        cause: error,
      });
    }
  };

/** `"587"` -> `587`; anything that isn't a positive integer is a config error. */
const parseSmtpPort = (value: string | undefined): number | undefined => {
  if (!value) {
    return 587;
  }
  const port = Number(value);
  return Number.isInteger(port) && port > 0 ? port : undefined;
};

/** Picks the transport for a configuration. Pure, so it can be tested. */
export const createMailDelivery = (
  config: MailConfig,
  sendImpl: SmtpSend = defaultSmtpSend
): MailDelivery => {
  const production = config.NODE_ENV === "production";
  const transport = config.MAIL_TRANSPORT ?? (production ? "" : "console");

  if (transport === "console") {
    return production
      ? refuse(
          "MAIL_TRANSPORT=console is not allowed in production; configure a real provider"
        )
      : logToConsole;
  }

  if (transport === "smtp") {
    const port = parseSmtpPort(config.SMTP_PORT);
    if (!(config.SMTP_HOST && config.MAIL_FROM && port)) {
      return refuse(
        "MAIL_TRANSPORT=smtp needs SMTP_HOST, a numeric SMTP_PORT, and MAIL_FROM"
      );
    }
    const auth =
      config.SMTP_USER && config.SMTP_PASS
        ? { user: config.SMTP_USER, pass: config.SMTP_PASS }
        : undefined;
    return viaSmtp(
      {
        host: config.SMTP_HOST,
        port,
        secure: config.SMTP_SECURE === "true" || config.SMTP_SECURE === "1",
        rejectUnauthorized: !(
          config.SMTP_ALLOW_SELF_SIGNED === "true" ||
          config.SMTP_ALLOW_SELF_SIGNED === "1"
        ),
        auth,
      },
      config.MAIL_FROM,
      sendImpl
    );
  }

  return refuse(
    transport
      ? `unknown MAIL_TRANSPORT "${transport}"`
      : "no mail transport is configured (set MAIL_TRANSPORT=smtp with SMTP_HOST, SMTP_PORT, and MAIL_FROM)"
  );
};

const escapeHtml = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/** Plain HTML notice: a heading, an intro, and label/value facts. */
export const renderNoticeHtml = ({
  heading,
  intro,
  facts,
}: {
  heading: string;
  intro: string;
  facts: [string, string][];
}): string => {
  const rows = facts
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#555">${escapeHtml(label)}</td><td style="padding:4px 0"><strong>${escapeHtml(value)}</strong></td></tr>`
    )
    .join("");
  return `<div style="font-family:Arial,sans-serif;color:#111"><h2>${escapeHtml(heading)}</h2><p>${escapeHtml(intro)}</p><table>${rows}</table></div>`;
};

/** Sent to the team leader once a registration is accepted. */
export const teamRegistrationEmail = ({
  referenceCode,
  teamName,
  schoolName,
  division,
}: {
  referenceCode: string;
  teamName: string;
  schoolName: string;
  division: string;
}): Omit<OutboundMessage, "to"> => ({
  subject: `BYTE QUEST registration received: ${referenceCode}`,
  body: `Your team "${teamName}" from ${schoolName} (${division} division) is registered.\n\nReference code: ${referenceCode}\n\nKeep this code. You will need it to follow up with the organising committee.`,
  html: renderNoticeHtml({
    heading: "Registration received",
    intro: `Your team "${teamName}" from ${schoolName} is registered.`,
    facts: [
      ["Reference code", referenceCode],
      ["Division", division],
    ],
  }),
});

/**
 * Operator alert on server start, mirroring school-management: fire-and-forget,
 * logged on failure, a no-op when `OPERATOR_ALERT_EMAIL` is unset.
 */
export const sendStartupAlert = async (
  config: MailConfig & { OPERATOR_ALERT_EMAIL?: string }
): Promise<void> => {
  const to = config.OPERATOR_ALERT_EMAIL;
  if (!to) {
    return;
  }
  const startedAt = new Date().toISOString();
  try {
    await createMailDelivery(config)({
      to,
      subject: "BYTE QUEST server started",
      body: `The server process started at ${startedAt} (NODE_ENV=${config.NODE_ENV ?? "unset"}).`,
      html: renderNoticeHtml({
        heading: "The server started",
        intro: "The BYTE QUEST server process has started.",
        facts: [
          ["Started at", startedAt],
          ["Environment", config.NODE_ENV ?? "unset"],
        ],
      }),
    });
  } catch (error) {
    console.error(
      "[startup] Could not send the server-start notification email:",
      error
    );
  }
};

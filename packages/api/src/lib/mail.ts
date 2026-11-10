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

const EMAIL_COLORS = {
  ink: "#020807",
  lime: "#52FF3D",
  teal: "#00897B",
  gold: "#D4AF37",
  text: "#0F1F1B",
  muted: "#5B6B66",
  line: "#E3EBE7",
  wash: "#F3F7F5",
} as const;

const EMAIL_FONT = "Arial,Helvetica,sans-serif";
const TRAILING_SLASHES = /\/+$/;
const PROTOCOL = /^https?:\/\//;

const LABEL_CELL = `padding:9px 16px 9px 0;width:130px;color:${EMAIL_COLORS.muted};font-size:13px;vertical-align:top;border-bottom:1px solid ${EMAIL_COLORS.line}`;
const VALUE_CELL = `padding:9px 0;color:${EMAIL_COLORS.text};font-size:14px;vertical-align:top;border-bottom:1px solid ${EMAIL_COLORS.line}`;

export interface TeamRegistrationMember {
  fullName: string;
  grade: string;
  isLeader: boolean;
  isPresenter: boolean;
}

/** What the leader is sent: only what they submitted, no guardian or contact data for students. */
export interface TeamRegistrationDetails {
  /** Public origin of the site; images in the email are served from it. */
  appUrl: string;
  referenceCode: string;
  teamName: string;
  schoolName: string;
  address: string;
  city: string;
  province: string;
  division: string;
  teacherName: string;
  teacherPhone: string;
  members: TeamRegistrationMember[];
  submittedAt: Date;
}

const formatSubmittedAt = (date: Date): string =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Colombo",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);

const detailRow = (label: string, value: string): string =>
  value
    ? `<tr><td style="${LABEL_CELL}">${escapeHtml(label)}</td><td style="${VALUE_CELL}">${escapeHtml(value)}</td></tr>`
    : "";

const roleBadge = (text: string, background: string, color: string): string =>
  `<span style="display:inline-block;margin-left:6px;padding:2px 8px;border-radius:999px;background:${background};color:${color};font-size:11px;font-weight:bold">${text}</span>`;

const memberRow = (member: TeamRegistrationMember, index: number): string => {
  const badges = [
    member.isLeader
      ? roleBadge("LEADER", EMAIL_COLORS.gold, EMAIL_COLORS.ink)
      : "",
    member.isPresenter
      ? roleBadge("PRESENTER", EMAIL_COLORS.teal, "#FFFFFF")
      : "",
  ].join("");
  return `<tr><td style="${VALUE_CELL};width:28px;color:${EMAIL_COLORS.muted}">${index + 1}</td><td style="${VALUE_CELL}"><strong>${escapeHtml(member.fullName)}</strong>${badges}</td><td style="${VALUE_CELL}">${escapeHtml(member.grade)}</td></tr>`;
};

const sectionTitle = (title: string): string =>
  `<p style="margin:28px 0 6px;color:${EMAIL_COLORS.teal};font-size:12px;letter-spacing:2px;font-weight:bold">${escapeHtml(title.toUpperCase())}</p>`;

const renderRegistrationHtml = (details: TeamRegistrationDetails): string => {
  const origin = details.appUrl.replace(TRAILING_SLASHES, "");
  const asset = (file: string): string => `${origin}/assets/email/${file}`;
  const location = [details.address, details.city, details.province]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
  const memberCount = details.members.length;

  return `<div style="background:${EMAIL_COLORS.wash};padding:24px 12px;font-family:${EMAIL_FONT}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#FFFFFF;border-radius:12px;overflow:hidden">
<tr><td style="background:${EMAIL_COLORS.ink};padding:28px 32px">
<img src="${asset("bq-logo.png")}" width="240" alt="BYTE QUEST" style="display:block;width:240px;height:auto;border:0">
<p style="margin:26px 0 0;color:${EMAIL_COLORS.lime};font-size:12px;letter-spacing:2px;font-weight:bold">REGISTRATION RECEIVED</p>
<h1 style="margin:6px 0 0;color:#FFFFFF;font-size:26px;line-height:1.25">Your team is registered</h1>
</td></tr>
<tr><td style="padding:24px 32px 0">
<p style="margin:0;color:${EMAIL_COLORS.text};font-size:15px;line-height:1.6">Thank you. <strong>${escapeHtml(details.teamName)}</strong> from <strong>${escapeHtml(details.schoolName)}</strong> is registered in the <strong>${escapeHtml(details.division)}</strong> division. Keep the reference code below; you will need it when you contact the organising committee.</p>
</td></tr>
<tr><td style="padding:20px 32px 0">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL_COLORS.gold};border-radius:10px"><tr><td style="padding:18px 22px">
<div style="color:${EMAIL_COLORS.ink};font-size:12px;letter-spacing:2px;font-weight:bold">REFERENCE CODE</div>
<div style="color:${EMAIL_COLORS.ink};font-size:34px;font-weight:bold;letter-spacing:3px">${escapeHtml(details.referenceCode)}</div>
</td></tr></table>
</td></tr>
<tr><td style="padding:0 32px 8px">
${sectionTitle("School and team")}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${detailRow("School", details.schoolName)}
${detailRow("Location", location)}
${detailRow("Division", details.division)}
${detailRow("Teacher", details.teacherName)}
${detailRow("Teacher phone", details.teacherPhone)}
${detailRow("Submitted", formatSubmittedAt(details.submittedAt))}
</table>
${sectionTitle(`Members (${memberCount})`)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${details.members.map(memberRow).join("")}
</table>
</td></tr>
<tr><td style="background:${EMAIL_COLORS.ink};padding:24px 32px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td width="72" valign="top"><img src="${asset("crest.png")}" width="60" height="60" alt="St. Aloysius' College crest" style="display:block;width:60px;height:60px;border:0"></td>
<td valign="top" style="color:#FFFFFF;font-size:13px;line-height:1.6">
<strong style="font-size:15px">St. Aloysius' College, Galle</strong><br>
Byte Quest &middot; Inter-School Innovation &amp; Coding Programme<br>
Templers Road, Kaluwella, Galle, Sri Lanka<br>
+94 91 222 3082 &middot; +94 77 936 8304<br>
<a href="${origin}" style="color:${EMAIL_COLORS.lime};text-decoration:none">${escapeHtml(origin.replace(PROTOCOL, ""))}</a> &middot; bytequest@aloysiuscollege.lk
</td>
<td width="112" align="right" valign="top"><img src="${asset("sacoba-logo.png")}" width="112" alt="SACOBA" style="display:block;width:112px;height:auto;border:0"></td>
</tr></table>
</td></tr>
</table>
</div>`;
};

/** Sent to the team leader once a registration is accepted. */
export const teamRegistrationEmail = (
  details: TeamRegistrationDetails
): Omit<OutboundMessage, "to"> => {
  const memberLines = details.members
    .map((member) => `  - ${member.fullName} (${member.grade})`)
    .join("\n");
  return {
    subject: `BYTE QUEST registration received: ${details.referenceCode}`,
    body: `Your team "${details.teamName}" from ${details.schoolName} (${details.division} division) is registered.\n\nReference code: ${details.referenceCode}\nMembers (${details.members.length}):\n${memberLines}\n\nKeep this code. You will need it to follow up with the organising committee.`,
    html: renderRegistrationHtml(details),
  };
};

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

// Mail transport for CRM notifications.
//
// Three modes, picked automatically from whichever environment variables are
// present, so neither hosting choice blocks the team:
//
//   smtp    — CRM_SMTP_HOST is set. Sends through Jozi Dairy's own mailbox.
//             Right choice on a normal VPS or shared host.
//   resend  — RESEND_API_KEY is set. Plain HTTPS, no outbound SMTP needed, so
//             it still works on hosts that block port 587 (e.g. Vercel).
//   console — neither is set. Logs the email instead of sending it, so the CRM
//             runs in development without mail credentials.
//
// CRM_MAIL_TRANSPORT overrides the detection.

export interface MailMessage {
  to: string[];
  cc?: string[];
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}

export type MailTransport = "smtp" | "resend" | "console";

export function resolveTransport(): MailTransport {
  const forced = (process.env.CRM_MAIL_TRANSPORT ?? process.env.MAIL_TRANSPORT)?.trim().toLowerCase();
  if (forced === "smtp" || forced === "resend" || forced === "console") {
    return forced as MailTransport;
  }

  if (process.env.CRM_SMTP_HOST || process.env.SMTP_HOST) return "smtp";
  if (process.env.RESEND_API_KEY) return "resend";
  return "console";
}

function fromAddress(): string {
  return (
    process.env.CRM_MAIL_FROM ??
    process.env.SMTP_FROM ??
    process.env.EMAIL_FROM ??
    "Jozi Dairy Website <notifications@jozidairy.co.za>"
  );
}

async function sendViaSmtp(message: MailMessage): Promise<void> {
  // Imported lazily so the dependency is only loaded when SMTP is in use.
  const nodemailer = await import("nodemailer");

  const host = process.env.CRM_SMTP_HOST ?? process.env.SMTP_HOST;
  const port = Number(process.env.CRM_SMTP_PORT ?? process.env.SMTP_PORT ?? 587);
  const user = process.env.CRM_SMTP_USER ?? process.env.SMTP_USER;
  const pass = process.env.CRM_SMTP_PASSWORD ?? process.env.SMTP_PASS;
  const secureEnv = process.env.CRM_SMTP_SECURE ?? process.env.SMTP_SECURE;

  const transporter = nodemailer.createTransport({
    host,
    port,
    // 465 is implicit TLS; 587 upgrades with STARTTLS.
    secure: secureEnv ? secureEnv === "true" : port === 465,
    auth: user && pass ? { user, pass } : undefined,
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === "production",
    },
  });

  await transporter.sendMail({
    from: fromAddress(),
    to: message.to,
    cc: message.cc,
    replyTo: message.replyTo,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
}

async function sendViaResend(message: MailMessage): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: message.to,
      cc: message.cc,
      reply_to: message.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Resend rejected the email (${response.status}): ${detail.slice(0, 300)}`
    );
  }
}

function logToConsole(message: MailMessage): void {
  console.info(
    [
      "[crm:mail] No mail transport configured — email not sent.",
      `          To:      ${message.to.join(", ")}`,
      message.cc?.length ? `          Cc:      ${message.cc.join(", ")}` : null,
      message.replyTo ? `          Reply-To: ${message.replyTo}` : null,
      `          Subject: ${message.subject}`,
      "          ---",
      message.text
        .split("\n")
        .map((line) => `          ${line}`)
        .join("\n"),
    ]
      .filter(Boolean)
      .join("\n")
  );
}

/**
 * Sends a message through the configured transport. Throws on failure — the
 * caller decides whether that should matter.
 */
export async function sendMail(message: MailMessage): Promise<MailTransport> {
  const transport = resolveTransport();

  if (message.to.length === 0) {
    throw new Error("No recipient configured for CRM notifications.");
  }

  if (transport === "smtp") await sendViaSmtp(message);
  else if (transport === "resend") await sendViaResend(message);
  else logToConsole(message);

  return transport;
}

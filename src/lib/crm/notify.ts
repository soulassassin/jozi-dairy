import { MailMessage, sendMail } from "./mailer";
import { leadPath } from "./returnPath";
import { addActivity } from "./service";
import { Lead, SOURCE_LABELS } from "./types";

// Builds and sends the "new website lead" alert. Every website lead goes to all
// three management mailboxes so no enquiry waits on one person being at their
// desk; the mailbox the visitor actually picked on the contact form is shown in
// the body as "Routed to", and CRM_NOTIFY_TO overrides the list entirely.

function escapeHtml(value: string): string {
  return value
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;");
}

/** Comma/semicolon-separated list of addresses from an env var. */
function parseAddressList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;]/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.includes("@"));
}

export const DEFAULT_NOTIFICATION_RECIPIENTS = [
  "ashley@jozidairy.co.za",
  "sherazaad@synapsesnetworking.com",
  "operations@jozidairy.co.za",
] as const;

/**
 * Who gets told about this lead.
 *
 * Defaults to all three key management & operations mailboxes:
 * - ashley@jozidairy.co.za (Sales / Quotes)
 * - sherazaad@synapsesnetworking.com (Agency / Tech oversight)
 * - operations@jozidairy.co.za (Fulfillment & Order Operations)
 *
 * CRM_NOTIFY_TO overrides the list if specified. CRM_NOTIFY_CC adds extra copies.
 */
export function resolveRecipients(lead: Lead): { to: string[]; cc: string[] } {
  const override = parseAddressList(process.env.CRM_NOTIFY_TO);
  const cc = parseAddressList(process.env.CRM_NOTIFY_CC);

  if (override.length > 0) return { to: override, cc };

  const to = [...DEFAULT_NOTIFICATION_RECIPIENTS];
  const filteredCc = cc.filter(
    (addr) => !to.map((e) => e.toLowerCase()).includes(addr.toLowerCase())
  );

  return { to, cc: filteredCc };
}

function crmLink(lead: Lead): string {
  const base = (process.env.CRM_BASE_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    ""
  );
  return `${base}${leadPath(lead.id)}`;
}

export function buildLeadEmail(lead: Lead, isRepeat: boolean): MailMessage {
  const { to, cc } = resolveRecipients(lead);

  const who = lead.company
    ? `${lead.contactName} (${lead.company})`
    : lead.contactName;

  const subject = isRepeat
    ? `Repeat enquiry — ${who} [${lead.reference}]`
    : lead.source === "WEBSITE_QUOTE"
      ? `New quote request — ${who} [${lead.reference}]`
      : `New website enquiry — ${who} [${lead.reference}]`;

  // Only include rows the visitor actually filled in.
  const rows: Array<[string, string]> = [
    ["Name", lead.contactName],
    ["Business", lead.company],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Area", lead.suburb],
    ["Business type", lead.businessType],
    ["Products", lead.productsInterested.join(", ")],
    ["Volume", lead.estimatedVolume],
    ["Delivery", lead.deliveryFrequency],
    ["Source", SOURCE_LABELS[lead.source]],
    ["Routed to", lead.department],
    ["Reference", lead.reference],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  const link = crmLink(lead);

  const repeatNote = isRepeat
    ? "This person already had an open lead, so the enquiry was added to it and the lead was flagged high priority.\n\n"
    : "";

  const text = [
    repeatNote +
      `${isRepeat ? "A repeat" : "A new"} ${
        lead.source === "WEBSITE_QUOTE" ? "quote request" : "enquiry"
      } came in from the Jozi Dairy website.`,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "What they said:",
    lead.message || "(no message)",
    "",
    `Open in the CRM: ${link}`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
<body style="margin:0;padding:24px;background:#f4f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0c2340;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px -5px rgba(12,35,64,0.08);">
    <tr>
      <td style="background:#0c2340;padding:20px 24px;">
        <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.6);">
          Jozi Dairy CRM
        </p>
        <h1 style="margin:6px 0 0;font-size:20px;color:#ffffff;">
          ${escapeHtml(
            isRepeat
              ? "Repeat enquiry"
              : lead.source === "WEBSITE_QUOTE"
                ? "New quote request"
                : "New website enquiry"
          )}
        </h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        ${
          isRepeat
            ? `<p style="margin:0 0 16px;padding:12px 14px;background:#fff8e1;border-left:3px solid #f9a825;border-radius:8px;font-size:13px;line-height:1.5;color:#5d4200;">
                 This person already had an open lead, so the enquiry was added to it and the lead was flagged <strong>high priority</strong>.
               </p>`
            : ""
        }
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;">
          ${rows
            .map(
              ([label, value]) => `<tr>
            <td style="padding:7px 0;color:rgba(12,35,64,0.55);width:120px;vertical-align:top;">${escapeHtml(label)}</td>
            <td style="padding:7px 0;color:#0c2340;font-weight:600;">${escapeHtml(value)}</td>
          </tr>`
            )
            .join("")}
        </table>

        ${
          lead.message
            ? `<p style="margin:20px 0 0;font-size:12px;color:rgba(12,35,64,0.5);">What they said</p>
               <blockquote style="margin:6px 0 0;padding:12px 14px;background:#f4f7fb;border-left:3px solid #00a8e8;border-radius:8px;font-size:14px;line-height:1.6;color:rgba(12,35,64,0.85);">${escapeHtml(lead.message)}</blockquote>`
            : ""
        }

        <div style="margin-top:24px;">
          <a href="${escapeHtml(link)}" style="display:inline-block;background:#00a8e8;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:13px 22px;border-radius:12px;">
            Open this lead in the CRM
          </a>
        </div>

        ${
          lead.phone
            ? `<p style="margin:18px 0 0;font-size:13px;color:rgba(12,35,64,0.6);">
                 Or call them straight back on
                 <a href="tel:${escapeHtml(lead.phone.replace(/\s/g, ""))}" style="color:#00a8e8;font-weight:600;text-decoration:none;">${escapeHtml(lead.phone)}</a>.
               </p>`
            : ""
        }
      </td>
    </tr>
    <tr>
      <td style="padding:14px 24px;background:#f4f7fb;font-size:11px;color:rgba(12,35,64,0.45);">
        Sent automatically by the Jozi Dairy website. Reply to this email to answer ${escapeHtml(lead.contactName)} directly.
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    to,
    cc,
    // Replying to the alert answers the customer, not the robot.
    replyTo: lead.email || undefined,
    subject,
    text,
    html,
  };
}

/**
 * Sends the alert. Never throws: a mail outage must not cost the team the
 * lead, which is already safely captured by the time this runs.
 */
export async function notifyNewLead(
  lead: Lead,
  isRepeat: boolean
): Promise<void> {
  if (process.env.CRM_NOTIFY_ENABLED === "false") return;

  try {
    const message = buildLeadEmail(lead, isRepeat);
    const transport = await sendMail(message);
    console.info(
      `[crm:mail] Notified ${message.to.join(", ")} about ${lead.reference} via ${transport}.`
    );

    try {
      await addActivity(
        lead.id,
        {
          type: transport === "console" ? "NOTE" : "EMAIL",
          body: `Notification ${
            transport === "console"
              ? "logged for team delivery"
              : `sent via ${transport}`
          } to ${message.to.join(", ")}`,
        },
        "System"
      );
    } catch {
      // Activity log is best-effort
    }
  } catch (error) {
    // Logged, not rethrown. The lead is in the CRM either way.
    console.error(
      `[crm:mail] Could not send the alert for ${lead.reference}. The lead is saved; someone must check the dashboard.`,
      error
    );
  }
}

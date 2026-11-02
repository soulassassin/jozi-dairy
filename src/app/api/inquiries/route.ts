import { after } from "next/server";
import { readJsonBody } from "@/lib/crm/apiGuard";
import { notifyNewLead } from "@/lib/crm/notify";
import { createLead, ValidationError } from "@/lib/crm/service";
import { isStoreDurable } from "@/lib/crm/store";
import { LeadSource } from "@/lib/crm/types";

// Public endpoint. The website contact form and the wholesale quote modal post
// here, so an enquiry is captured in the CRM even when the visitor never
// finishes sending the WhatsApp message or the mailto draft.

/**
 * Crude per-IP throttle to keep a bot from filling the lead list. It lives in
 * memory, so it resets on redeploy and is per-instance — enough for a form this
 * size, and the place to swap in a shared store if abuse ever becomes real.
 */
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter(
    (stamp) => now - stamp < WINDOW_MS
  );
  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-running server.
  if (hits.size > 5000) {
    for (const [existingKey, stamps] of hits) {
      if (stamps.every((stamp) => now - stamp >= WINDOW_MS)) {
        hits.delete(existingKey);
      }
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

/**
 * Origins allowed to post an enquiry from another host.
 *
 * The marketing site and the CRM can be deployed separately — the site on a
 * CDN platform, the CRM on a host with a real filesystem. When they are, the
 * browser sends a cross-origin POST and needs CORS permission. Unset means
 * same-origin only, which is correct when one deployment serves both.
 */
function allowedOrigins(): string[] {
  return (process.env.CRM_ALLOWED_ORIGINS ?? "")
    .split(/[,;]/)
    .map((entry) => entry.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

/** CORS headers for a request, empty when the origin is not allowed. */
function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  if (!origin) return {};
  if (!allowedOrigins().includes(origin.replace(/\/+$/, ""))) return {};

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/** Preflight for the cross-origin case. */
export async function OPTIONS(request: Request) {
  const headers = corsHeaders(request);
  return new Response(null, {
    status: Object.keys(headers).length > 0 ? 204 : 403,
    headers,
  });
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** Only the two website surfaces may set a source; anything else is an email. */
function resolveSource(value: unknown): LeadSource {
  if (value === "WEBSITE_QUOTE") return "WEBSITE_QUOTE";
  if (value === "WEBSITE_FORM") return "WEBSITE_FORM";
  return "EMAIL";
}

export async function POST(request: Request) {
  const cors = corsHeaders(request);

  // Refuse rather than accept an enquiry this deployment cannot keep. On a
  // serverless host the write would succeed, the visitor would get a
  // reference number, and the lead would vanish with the function. Better a
  // visible failure that sends them to WhatsApp than a silent loss.
  if (!isStoreDurable()) {
    console.error(
      "[inquiries] Refused a lead: this deployment has no durable store. Point the public form at the CRM host with NEXT_PUBLIC_INQUIRY_ENDPOINT, or move the CRM to a host with a persistent filesystem."
    );
    return Response.json(
      {
        error:
          "Our enquiry system is being moved. Please phone or WhatsApp us and we will help you right away.",
      },
      { status: 503, headers: cors }
    );
  }

  if (isRateLimited(clientKey(request))) {
    return Response.json(
      { error: "Too many submissions just now. Please try again in a minute." },
      { status: 429, headers: cors }
    );
  }

  const body = await readJsonBody(request);

  // Honeypot: a real person never fills a field they cannot see. Accept the
  // submission so the bot sees success, but record nothing.
  if (typeof body.companyWebsite === "string" && body.companyWebsite.trim()) {
    return Response.json({ ok: true }, { status: 202, headers: cors });
  }

  try {
    const { lead, merged } = await createLead(
      { ...body, source: resolveSource(body.source) },
      "Website"
    );

    // Email the team after the response is sent, so the visitor never waits on
    // SMTP and a mail outage cannot fail a capture that already succeeded.
    after(() => notifyNewLead(lead, merged));

    // Deliberately minimal response: the public form has no business knowing
    // the pipeline status or internal notes of an existing lead.
    return Response.json(
      { ok: true, reference: lead.reference, merged },
      { status: 201, headers: cors }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json(
        { error: error.message },
        { status: 400, headers: cors }
      );
    }

    console.error("[inquiries] capture failed", error);
    return Response.json(
      {
        error:
          "We could not record that enquiry. Please phone or WhatsApp us instead.",
      },
      { status: 500, headers: cors }
    );
  }
}

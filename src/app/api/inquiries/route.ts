import { readJsonBody } from "@/lib/crm/apiGuard";
import { createLead, ValidationError } from "@/lib/crm/service";
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
  if (isRateLimited(clientKey(request))) {
    return Response.json(
      { error: "Too many submissions just now. Please try again in a minute." },
      { status: 429 }
    );
  }

  const body = await readJsonBody(request);

  // Honeypot: a real person never fills a field they cannot see. Accept the
  // submission so the bot sees success, but record nothing.
  if (typeof body.companyWebsite === "string" && body.companyWebsite.trim()) {
    return Response.json({ ok: true }, { status: 202 });
  }

  try {
    const { lead, merged } = await createLead(
      { ...body, source: resolveSource(body.source) },
      "Website"
    );

    // Deliberately minimal response: the public form has no business knowing
    // the pipeline status or internal notes of an existing lead.
    return Response.json(
      { ok: true, reference: lead.reference, merged },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    console.error("[inquiries] capture failed", error);
    return Response.json(
      {
        error:
          "We could not record that enquiry. Please phone or WhatsApp us instead.",
      },
      { status: 500 }
    );
  }
}

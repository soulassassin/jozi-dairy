// Where the public forms send an enquiry.
//
// The marketing site and the CRM do not have to live on the same host. The
// site suits a CDN platform like Vercel; the CRM needs a persistent
// filesystem, so it runs on a normal Node host. When they are split, the
// forms on the public site must post to the CRM's origin — posting to the
// site's own /api/inquiries would hand the lead to a serverless function with
// a throwaway disk and lose it.
//
// Set NEXT_PUBLIC_INQUIRY_ENDPOINT on the public deployment, e.g.
//   NEXT_PUBLIC_INQUIRY_ENDPOINT=https://crm.jozidairy.co.za/api/inquiries
// Leave it unset when one deployment serves both, which is the default.

const SAME_ORIGIN = "/api/inquiries";

function resolveEndpoint(): string {
  const raw = process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT?.trim();
  if (!raw) return SAME_ORIGIN;

  // A path on this origin.
  if (raw.startsWith("/")) return raw;

  // Otherwise it must be an absolute http(s) URL. A typo here would silently
  // send every enquiry nowhere, so fall back to the same-origin route and say
  // so rather than trusting it.
  try {
    const url = new URL(raw);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.toString();
    }
  } catch {
    // fall through
  }

  console.warn(
    `[inquiries] NEXT_PUBLIC_INQUIRY_ENDPOINT is not a usable URL or path (${raw}). Falling back to ${SAME_ORIGIN}.`
  );
  return SAME_ORIGIN;
}

/** Resolved once: the value is inlined at build time by Next. */
export const INQUIRY_ENDPOINT = resolveEndpoint();

/** True when enquiries are posted to another origin, which needs CORS. */
export const INQUIRY_IS_CROSS_ORIGIN = !INQUIRY_ENDPOINT.startsWith("/");

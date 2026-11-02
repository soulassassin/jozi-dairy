// Where to send a staff member after they sign in.
//
// The "open this lead" button in a notification email points at
// /crm?lead=<id>. Sessions only last 12 hours, so that click often lands on
// the login page — without this, the lead reference is lost and the person has
// to hunt for the enquiry they were just emailed about.
//
// The path travels through a query parameter, which means it is attacker
// controllable: `/crm/login?next=https://evil.example` would otherwise turn
// the login form into an open redirect. So anything that is not plainly a path
// inside /crm is discarded rather than corrected.

export const CRM_HOME = "/crm";

/** Anything outside printable ASCII — control characters, spaces, NULs. */
const UNSAFE_IN_PATH = /[^\x21-\x7e]/;

/**
 * Narrows an untrusted `next` value to a safe in-app CRM path, falling back to
 * the CRM home page.
 */
export function safeCrmReturnPath(value: unknown): string {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (typeof candidate !== "string") return CRM_HOME;

  const path = candidate.trim();

  // Must be a root-relative path. Backslashes are rejected outright because
  // browsers normalise them to "/", turning "/\evil.example" into a host.
  if (!path.startsWith("/")) return CRM_HOME;
  if (path.includes("\\")) return CRM_HOME;

  // No control characters or whitespace smuggled into the URL or a header.
  if (UNSAFE_IN_PATH.test(path)) return CRM_HOME;

  // Resolve against a throwaway origin so "../" segments collapse *before* the
  // prefix test — otherwise "/crm/../admin" reads as a path inside /crm.
  const base = "http://crm.invalid";
  let url: URL;
  try {
    url = new URL(path, base);
  } catch {
    return CRM_HOME;
  }

  // A protocol-relative "//host/path" parses to a different origin.
  if (url.origin !== base) return CRM_HOME;

  // Percent-encoding in the path could hide a separator (%2f) that only
  // decodes after this check. The lead id lives in the query string, which is
  // allowed to be encoded, so nothing legitimate needs it here.
  if (url.pathname.includes("%")) return CRM_HOME;

  // Compare without a trailing slash so "/crm/login/" cannot sneak past.
  const pathname =
    url.pathname.length > 1 && url.pathname.endsWith("/")
      ? url.pathname.slice(0, -1)
      : url.pathname;

  // Staff tooling only: never bounce out to the public site or an API route.
  if (pathname !== CRM_HOME && !pathname.startsWith("/crm/")) return CRM_HOME;

  // Signing in should never drop someone straight back onto the login form.
  if (pathname === "/crm/login") return CRM_HOME;

  return `${pathname}${url.search}`;
}

/** The `/crm` URL that opens a single lead's drawer. */
export function leadPath(leadId: string): string {
  return `${CRM_HOME}?lead=${encodeURIComponent(leadId)}`;
}

/** Reads the `lead` query parameter, ignoring repeats and empty values. */
export function readLeadParam(value: unknown): string | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (typeof candidate !== "string") return null;
  const trimmed = candidate.trim();
  return trimmed ? trimmed : null;
}

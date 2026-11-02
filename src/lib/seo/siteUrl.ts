/**
 * Canonical Site URL resolution helper for Jozi Dairy.
 * Enforces precedence:
 *   1. process.env.NEXT_PUBLIC_SITE_URL
 *   2. process.env.SITE_URL
 *   3. Fallback: "https://www.jozidairy.co.za"
 * Trims whitespace and strips trailing slashes.
 */
export function getSiteUrl(): string {
  const envUrl =
    (typeof process.env.NEXT_PUBLIC_SITE_URL === "string" &&
      process.env.NEXT_PUBLIC_SITE_URL.trim()) ||
    (typeof process.env.SITE_URL === "string" &&
      process.env.SITE_URL.trim()) ||
    "https://www.jozidairy.co.za";

  return envUrl.replace(/\/+$/, "");
}

/**
 * Returns an absolute URL for a given pathname against the resolved site base URL.
 * Normalizes leading slashes and prevents double slashes.
 */
export function getAbsoluteUrl(path: string = "/"): string {
  const baseUrl = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/") {
    return baseUrl;
  }
  return `${baseUrl}${normalizedPath.replace(/\/+$/, "")}`;
}

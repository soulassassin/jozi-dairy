import { ActivityType, LeadPriority, LeadStatus } from "@/lib/crm/types";

/** Pipeline colours, kept in one place so table, drawer and tiles agree. */
export const STATUS_STYLES: Record<LeadStatus, string> = {
  NEW: "bg-jozi-cyan/15 text-jozi-navy ring-1 ring-jozi-cyan/40",
  CONTACTED: "bg-sky-50 text-sky-800 ring-1 ring-sky-200",
  QUALIFIED: "bg-jozi-amber/15 text-amber-900 ring-1 ring-jozi-amber/40",
  QUOTED: "bg-violet-50 text-violet-800 ring-1 ring-violet-200",
  WON: "bg-jozi-green/15 text-green-900 ring-1 ring-jozi-green/40",
  LOST: "bg-jozi-navy/5 text-jozi-navy/60 ring-1 ring-jozi-navy/15",
};

export const PRIORITY_STYLES: Record<LeadPriority, string> = {
  HIGH: "bg-red-50 text-red-700 ring-1 ring-red-200",
  MEDIUM: "bg-jozi-amber/10 text-amber-800 ring-1 ring-jozi-amber/30",
  LOW: "bg-jozi-navy/5 text-jozi-navy/60 ring-1 ring-jozi-navy/15",
};

export const ACTIVITY_DOT: Record<ActivityType, string> = {
  CALL_OUTBOUND: "bg-jozi-cyan",
  CALL_INBOUND: "bg-jozi-green",
  EMAIL: "bg-violet-500",
  WHATSAPP: "bg-green-500",
  MEETING: "bg-jozi-amber",
  QUOTE_SENT: "bg-jozi-navy",
  NOTE: "bg-jozi-navy/30",
  STATUS_CHANGE: "bg-jozi-navy/20",
};

const RAND_FORMATTER = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

export function formatRand(amount: number): string {
  return RAND_FORMATTER.format(amount);
}

/** "Today", "Yesterday", "3 days ago", else a short date. */
export function formatRelative(iso: string): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "—";

  const dayMs = 24 * 60 * 60 * 1000;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfThen = new Date(then);
  startOfThen.setHours(0, 0, 0, 0);

  const days = Math.round(
    (startOfToday.getTime() - startOfThen.getTime()) / dayMs
  );

  if (days === 0) {
    return `Today ${then.toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
  if (days === 1) return "Yesterday";
  if (days > 1 && days < 7) return `${days} days ago`;
  if (days < 0) return then.toLocaleDateString("en-ZA", { dateStyle: "medium" });

  return then.toLocaleDateString("en-ZA", { dateStyle: "medium" });
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-ZA", { dateStyle: "medium" });
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** True when a follow-up date has arrived or passed. */
export function isFollowUpDue(date: string | null): boolean {
  return Boolean(date && date <= todayIso());
}

export interface ApiError {
  error: string;
}

/**
 * Thin fetch wrapper that surfaces the API's own error message, so the UI can
 * show "That passcode is not correct" rather than "Request failed".
 */
export async function apiFetch<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers:
      init?.body !== undefined
        ? { "Content-Type": "application/json", ...init?.headers }
        : init?.headers,
  });

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload && typeof (payload as ApiError).error === "string"
        ? (payload as ApiError).error
        : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload as T;
}

/** Builds a wa.me link from a local SA number. */
export function whatsappHref(number: string, message?: string): string {
  const digits = number.replace(/\D/g, "");
  const international = digits.startsWith("0")
    ? `27${digits.slice(1)}`
    : digits.startsWith("27")
      ? digits
      : digits;

  const suffix = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${international}${suffix}`;
}

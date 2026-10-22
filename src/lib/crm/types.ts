// Core CRM domain model for the Jozi Dairy sales team.
// Leads arrive from phone calls, the website contact form and the website quote
// modal, then move along a pipeline until they are won or lost.

export const LEAD_SOURCES = [
  "PHONE_CALL",
  "WEBSITE_FORM",
  "WEBSITE_QUOTE",
  "EMAIL",
  "WHATSAPP",
  "WALK_IN",
  "REFERRAL",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "QUOTED",
  "WON",
  "LOST",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export type LeadPriority = (typeof LEAD_PRIORITIES)[number];

export const ACTIVITY_TYPES = [
  "CALL_OUTBOUND",
  "CALL_INBOUND",
  "EMAIL",
  "WHATSAPP",
  "MEETING",
  "QUOTE_SENT",
  "NOTE",
  "STATUS_CHANGE",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export const BUSINESS_TYPES = [
  "Coffee Shop / Cafe",
  "Restaurant",
  "Retailer / Spaza",
  "Hotel / Guest House",
  "Catering / Canteen",
  "School / Creche",
  "Commercial / Bulk",
  "Household / Individual",
  "Other",
] as const;

// Sales owners mirror the live department mailboxes on the public site.
export const LEAD_OWNERS = [
  "Ashley (Sales)",
  "Operations",
  "Accounts",
  "Unassigned",
] as const;

export const LOSS_REASONS = [
  "Price too high",
  "Outside delivery area",
  "Volume too low",
  "Went with competitor",
  "No longer needs supply",
  "Unreachable / no response",
  "Duplicate enquiry",
  "Other",
] as const;

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  body: string;
  author: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  reference: string; // Human-friendly handle, e.g. JD-L-0007

  // Contact details — the person the team actually phones.
  contactName: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  suburb: string;

  // Qualification detail.
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  businessType: string;
  productsInterested: string[];
  estimatedVolume: string;
  deliveryFrequency: string;
  estimatedMonthlyValue: number; // ZAR, 0 when unknown
  message: string; // Original enquiry text, verbatim
  department: string; // Mailbox the website routed it to

  owner: string;
  nextFollowUpAt: string | null; // ISO date (YYYY-MM-DD)
  lostReason: string | null;

  createdAt: string;
  updatedAt: string;

  activities: Activity[];
}

/** A deduplicated person, derived from every lead sharing their email/phone. */
export interface Contact {
  key: string;
  contactName: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  suburb: string;
  leadCount: number;
  openLeadCount: number;
  wonLeadCount: number;
  lastTouchedAt: string;
  leadIds: string[];
  statuses: LeadStatus[];
}

export interface CrmStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
  newThisWeek: number;
  openPipelineValue: number;
  wonValue: number;
  overdueFollowUps: number;
  unassigned: number;
}

/** Shape persisted to disk. `version` lets us migrate the file later. */
export interface CrmDatabase {
  version: 1;
  leadSequence: number;
  leads: Lead[];
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  QUOTED: "Quote Sent",
  WON: "Won",
  LOST: "Lost",
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
  PHONE_CALL: "Phone Call",
  WEBSITE_FORM: "Website Contact Form",
  WEBSITE_QUOTE: "Website Quote Request",
  EMAIL: "Email",
  WHATSAPP: "WhatsApp",
  WALK_IN: "Walk-in",
  REFERRAL: "Referral",
};

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  CALL_OUTBOUND: "Called out",
  CALL_INBOUND: "Inbound call",
  EMAIL: "Email",
  WHATSAPP: "WhatsApp",
  MEETING: "Meeting",
  QUOTE_SENT: "Quote sent",
  NOTE: "Note",
  STATUS_CHANGE: "Status change",
};

/** Statuses that still need the team to do something. */
export const OPEN_STATUSES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "QUOTED",
];

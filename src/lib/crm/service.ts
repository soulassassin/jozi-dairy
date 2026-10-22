import { randomUUID } from "node:crypto";
import { mutate, read } from "./store";
import {
  Activity,
  ActivityType,
  Contact,
  CrmStats,
  Lead,
  LEAD_SOURCES,
  LEAD_STATUSES,
  LeadPriority,
  LeadSource,
  LeadStatus,
  OPEN_STATUSES,
  STATUS_LABELS,
} from "./types";

// ---------------------------------------------------------------------------
// Normalisation helpers
// ---------------------------------------------------------------------------

function text(value: unknown, maxLength = 2000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

/**
 * Reduces a South African phone number to comparable digits so that
 * "065 234 2460", "0652342460" and "+27 65 234 2460" match each other.
 */
export function normalisePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("27") && digits.length === 11) return `0${digits.slice(2)}`;
  if (digits.startsWith("0027")) return `0${digits.slice(4)}`;
  return digits;
}

export function normaliseEmail(value: string): string {
  return value.trim().toLowerCase();
}

function nowIso(): string {
  return new Date().toISOString();
}

function nextReference(sequence: number): string {
  return `JD-L-${String(sequence).padStart(4, "0")}`;
}

function oneOf<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function money(value: unknown): number {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount) || amount < 0) return 0;
  return Math.round(amount * 100) / 100;
}

/** Accepts a YYYY-MM-DD date, rejecting anything unparseable. */
function isoDate(value: unknown): string | null {
  const raw = text(value, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  return Number.isNaN(new Date(raw).getTime()) ? null : raw;
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => text(entry, 120))
    .filter((entry) => entry.length > 0)
    .slice(0, 30);
}

// ---------------------------------------------------------------------------
// Lead creation
// ---------------------------------------------------------------------------

export interface LeadInput {
  contactName?: unknown;
  company?: unknown;
  email?: unknown;
  phone?: unknown;
  whatsapp?: unknown;
  suburb?: unknown;
  source?: unknown;
  status?: unknown;
  priority?: unknown;
  businessType?: unknown;
  productsInterested?: unknown;
  estimatedVolume?: unknown;
  deliveryFrequency?: unknown;
  estimatedMonthlyValue?: unknown;
  message?: unknown;
  department?: unknown;
  owner?: unknown;
  nextFollowUpAt?: unknown;
}

export interface CreateLeadResult {
  lead: Lead;
  /** True when the enquiry was merged into an existing lead instead. */
  merged: boolean;
}

function buildActivity(
  leadId: string,
  type: ActivityType,
  body: string,
  author: string
): Activity {
  return {
    id: randomUUID(),
    leadId,
    type,
    body,
    author: author || "System",
    createdAt: nowIso(),
  };
}

/**
 * Finds an open lead for the same person so repeat enquiries land on one
 * record. Won and lost leads are left alone — a return enquiry after either
 * outcome is genuinely new business.
 */
function findOpenDuplicate(
  leads: Lead[],
  email: string,
  phone: string
): Lead | undefined {
  const emailKey = normaliseEmail(email);
  const phoneKey = normalisePhone(phone);
  if (!emailKey && !phoneKey) return undefined;

  return leads.find((lead) => {
    if (!OPEN_STATUSES.includes(lead.status)) return false;
    if (emailKey && normaliseEmail(lead.email) === emailKey) return true;
    if (phoneKey && normalisePhone(lead.phone) === phoneKey) return true;
    return false;
  });
}

export class ValidationError extends Error {}

/**
 * Creates a lead, or appends the enquiry to the person's existing open lead.
 * `author` records who captured it ("Website" for public submissions).
 */
export async function createLead(
  input: LeadInput,
  author = "Website"
): Promise<CreateLeadResult> {
  const contactName = text(input.contactName, 120);
  const email = text(input.email, 160);
  const phone = text(input.phone, 40);

  if (!contactName) {
    throw new ValidationError("A contact name is required.");
  }
  if (!email && !phone) {
    throw new ValidationError(
      "Capture at least an email address or a phone number so the team can follow up."
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ValidationError("That email address is not valid.");
  }

  const message = text(input.message, 4000);
  const source = oneOf<LeadSource>(input.source, LEAD_SOURCES, "PHONE_CALL");
  const sourceWords = source.replace(/_/g, " ").toLowerCase();

  return mutate<CreateLeadResult>((db) => {
    const existing = findOpenDuplicate(db.leads, email, phone);

    if (existing) {
      // Repeat enquiry: log it on the timeline and fill in anything new.
      existing.activities.push(
        buildActivity(
          existing.id,
          source === "PHONE_CALL" ? "CALL_INBOUND" : "NOTE",
          message
            ? `Repeat enquiry via ${sourceWords}: ${message}`
            : `Repeat enquiry via ${sourceWords}.`,
          author
        )
      );

      existing.company = existing.company || text(input.company, 160);
      existing.email = existing.email || email;
      existing.phone = existing.phone || phone;
      existing.whatsapp = existing.whatsapp || text(input.whatsapp, 40);
      existing.suburb = existing.suburb || text(input.suburb, 120);
      existing.priority = "HIGH"; // Asked twice — worth chasing.
      existing.updatedAt = nowIso();

      const products = stringList(input.productsInterested);
      if (products.length) {
        existing.productsInterested = Array.from(
          new Set([...existing.productsInterested, ...products])
        );
      }

      return { lead: existing, merged: true };
    }

    db.leadSequence += 1;
    const id = randomUUID();
    const timestamp = nowIso();

    const lead: Lead = {
      id,
      reference: nextReference(db.leadSequence),
      contactName,
      company: text(input.company, 160),
      email,
      phone,
      whatsapp: text(input.whatsapp, 40),
      suburb: text(input.suburb, 120),
      source,
      status: oneOf<LeadStatus>(input.status, LEAD_STATUSES, "NEW"),
      priority: oneOf<LeadPriority>(
        input.priority,
        ["LOW", "MEDIUM", "HIGH"],
        "MEDIUM"
      ),
      businessType: text(input.businessType, 120),
      productsInterested: stringList(input.productsInterested),
      estimatedVolume: text(input.estimatedVolume, 120),
      deliveryFrequency: text(input.deliveryFrequency, 120),
      estimatedMonthlyValue: money(input.estimatedMonthlyValue),
      message,
      department: text(input.department, 160),
      owner: text(input.owner, 80) || "Unassigned",
      nextFollowUpAt: isoDate(input.nextFollowUpAt),
      lostReason: null,
      createdAt: timestamp,
      updatedAt: timestamp,
      activities: [],
    };

    lead.activities.push(
      buildActivity(
        id,
        source === "PHONE_CALL" ? "CALL_INBOUND" : "NOTE",
        message || `Lead captured via ${sourceWords}.`,
        author
      )
    );

    db.leads.push(lead);
    return { lead, merged: false };
  });
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export interface LeadQuery {
  status?: string | null;
  source?: string | null;
  owner?: string | null;
  search?: string | null;
  /** "followups" limits results to leads due or overdue for a follow-up. */
  view?: string | null;
}

function matchesSearch(lead: Lead, term: string): boolean {
  const haystack = [
    lead.reference,
    lead.contactName,
    lead.company,
    lead.email,
    lead.phone,
    lead.suburb,
    lead.businessType,
    lead.message,
    lead.productsInterested.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(term);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function listLeads(query: LeadQuery = {}): Promise<Lead[]> {
  const db = await read();
  const term = text(query.search, 120).toLowerCase();
  const today = todayIso();

  return db.leads
    .filter((lead) => {
      if (query.status && query.status !== "ALL" && lead.status !== query.status) {
        return false;
      }
      if (query.source && query.source !== "ALL" && lead.source !== query.source) {
        return false;
      }
      if (query.owner && query.owner !== "ALL" && lead.owner !== query.owner) {
        return false;
      }
      if (query.view === "open" && !OPEN_STATUSES.includes(lead.status)) {
        return false;
      }
      if (query.view === "followups") {
        if (!lead.nextFollowUpAt || lead.nextFollowUpAt > today) return false;
        if (!OPEN_STATUSES.includes(lead.status)) return false;
      }
      if (term && !matchesSearch(lead, term)) return false;
      return true;
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getLead(id: string): Promise<Lead | undefined> {
  const db = await read();
  return db.leads.find((lead) => lead.id === id);
}

// ---------------------------------------------------------------------------
// Updates
// ---------------------------------------------------------------------------

export interface LeadUpdate extends LeadInput {
  lostReason?: unknown;
}

/** Applies a partial update, recording a timeline entry for status changes. */
export async function updateLead(
  id: string,
  patch: LeadUpdate,
  author: string
): Promise<Lead | undefined> {
  return mutate<Lead | undefined>((db) => {
    const lead = db.leads.find((entry) => entry.id === id);
    if (!lead) return undefined;

    const has = (key: keyof LeadUpdate) =>
      Object.prototype.hasOwnProperty.call(patch, key);

    if (has("status")) {
      const status = oneOf<LeadStatus>(patch.status, LEAD_STATUSES, lead.status);
      if (status !== lead.status) {
        lead.activities.push(
          buildActivity(
            lead.id,
            "STATUS_CHANGE",
            `Moved from ${STATUS_LABELS[lead.status]} to ${STATUS_LABELS[status]}.`,
            author
          )
        );
        lead.status = status;

        // Closing a lead clears the follow-up so it leaves the chase list.
        if (status === "WON" || status === "LOST") lead.nextFollowUpAt = null;
        if (status !== "LOST") lead.lostReason = null;
      }
    }

    if (has("contactName")) {
      const name = text(patch.contactName, 120);
      if (name) lead.contactName = name;
    }
    if (has("company")) lead.company = text(patch.company, 160);
    if (has("email")) lead.email = text(patch.email, 160);
    if (has("phone")) lead.phone = text(patch.phone, 40);
    if (has("whatsapp")) lead.whatsapp = text(patch.whatsapp, 40);
    if (has("suburb")) lead.suburb = text(patch.suburb, 120);
    if (has("businessType")) lead.businessType = text(patch.businessType, 120);
    if (has("estimatedVolume")) {
      lead.estimatedVolume = text(patch.estimatedVolume, 120);
    }
    if (has("deliveryFrequency")) {
      lead.deliveryFrequency = text(patch.deliveryFrequency, 120);
    }
    if (has("message")) lead.message = text(patch.message, 4000);
    if (has("department")) lead.department = text(patch.department, 160);
    if (has("owner")) lead.owner = text(patch.owner, 80) || "Unassigned";
    if (has("productsInterested")) {
      lead.productsInterested = stringList(patch.productsInterested);
    }
    if (has("estimatedMonthlyValue")) {
      lead.estimatedMonthlyValue = money(patch.estimatedMonthlyValue);
    }
    if (has("priority")) {
      lead.priority = oneOf<LeadPriority>(
        patch.priority,
        ["LOW", "MEDIUM", "HIGH"],
        lead.priority
      );
    }
    if (has("nextFollowUpAt")) lead.nextFollowUpAt = isoDate(patch.nextFollowUpAt);
    if (has("lostReason")) lead.lostReason = text(patch.lostReason, 200) || null;
    if (has("source")) {
      lead.source = oneOf<LeadSource>(patch.source, LEAD_SOURCES, lead.source);
    }

    lead.updatedAt = nowIso();
    return lead;
  });
}

export async function addActivity(
  leadId: string,
  input: { type?: unknown; body?: unknown; nextFollowUpAt?: unknown },
  author: string
): Promise<Lead | undefined> {
  const body = text(input.body, 4000);
  if (!body) throw new ValidationError("Write something to log.");

  const type = oneOf<ActivityType>(
    input.type,
    [
      "CALL_OUTBOUND",
      "CALL_INBOUND",
      "EMAIL",
      "WHATSAPP",
      "MEETING",
      "QUOTE_SENT",
      "NOTE",
    ],
    "NOTE"
  );

  return mutate<Lead | undefined>((db) => {
    const lead = db.leads.find((entry) => entry.id === leadId);
    if (!lead) return undefined;

    lead.activities.push(buildActivity(lead.id, type, body, author));

    // Logging real contact on an untouched lead advances it automatically.
    const contactMade =
      type === "CALL_OUTBOUND" ||
      type === "CALL_INBOUND" ||
      type === "EMAIL" ||
      type === "WHATSAPP" ||
      type === "MEETING";
    if (lead.status === "NEW" && contactMade) lead.status = "CONTACTED";
    if (type === "QUOTE_SENT" && OPEN_STATUSES.includes(lead.status)) {
      lead.status = "QUOTED";
    }

    if (Object.prototype.hasOwnProperty.call(input, "nextFollowUpAt")) {
      lead.nextFollowUpAt = isoDate(input.nextFollowUpAt);
    }

    lead.updatedAt = nowIso();
    return lead;
  });
}

export async function deleteLead(id: string): Promise<boolean> {
  return mutate<boolean>((db) => {
    const index = db.leads.findIndex((lead) => lead.id === id);
    if (index === -1) return false;
    db.leads.splice(index, 1);
    return true;
  });
}

// ---------------------------------------------------------------------------
// Derived views
// ---------------------------------------------------------------------------

/**
 * Collapses leads into one record per person, keyed on email where available
 * and phone otherwise, so the team has a single contact book.
 */
export async function listContacts(search?: string | null): Promise<Contact[]> {
  const db = await read();
  const term = text(search, 120).toLowerCase();
  const byKey = new Map<string, Contact>();

  for (const lead of db.leads) {
    const key =
      normaliseEmail(lead.email) ||
      normalisePhone(lead.phone) ||
      `lead:${lead.id}`;

    const existing = byKey.get(key);
    const isOpen = OPEN_STATUSES.includes(lead.status);

    if (existing) {
      existing.leadCount += 1;
      if (isOpen) existing.openLeadCount += 1;
      if (lead.status === "WON") existing.wonLeadCount += 1;
      existing.leadIds.push(lead.id);
      existing.statuses.push(lead.status);
      existing.company = existing.company || lead.company;
      existing.whatsapp = existing.whatsapp || lead.whatsapp;
      existing.suburb = existing.suburb || lead.suburb;
      existing.phone = existing.phone || lead.phone;
      existing.email = existing.email || lead.email;
      if (lead.updatedAt > existing.lastTouchedAt) {
        existing.lastTouchedAt = lead.updatedAt;
        existing.contactName = lead.contactName;
      }
      continue;
    }

    byKey.set(key, {
      key,
      contactName: lead.contactName,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      whatsapp: lead.whatsapp,
      suburb: lead.suburb,
      leadCount: 1,
      openLeadCount: isOpen ? 1 : 0,
      wonLeadCount: lead.status === "WON" ? 1 : 0,
      lastTouchedAt: lead.updatedAt,
      leadIds: [lead.id],
      statuses: [lead.status],
    });
  }

  const contacts = Array.from(byKey.values()).sort((a, b) =>
    b.lastTouchedAt.localeCompare(a.lastTouchedAt)
  );

  if (!term) return contacts;

  return contacts.filter((contact) =>
    [
      contact.contactName,
      contact.company,
      contact.email,
      contact.phone,
      contact.suburb,
    ]
      .join(" ")
      .toLowerCase()
      .includes(term)
  );
}

export async function getStats(): Promise<CrmStats> {
  const db = await read();
  const today = todayIso();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const byStatus = Object.fromEntries(
    LEAD_STATUSES.map((status) => [status, 0])
  ) as Record<LeadStatus, number>;
  const bySource = Object.fromEntries(
    LEAD_SOURCES.map((source) => [source, 0])
  ) as Record<LeadSource, number>;

  let newThisWeek = 0;
  let openPipelineValue = 0;
  let wonValue = 0;
  let overdueFollowUps = 0;
  let unassigned = 0;

  for (const lead of db.leads) {
    byStatus[lead.status] += 1;
    bySource[lead.source] += 1;

    if (lead.createdAt >= weekAgo) newThisWeek += 1;
    if (OPEN_STATUSES.includes(lead.status)) {
      openPipelineValue += lead.estimatedMonthlyValue;
      if (lead.owner === "Unassigned") unassigned += 1;
      if (lead.nextFollowUpAt && lead.nextFollowUpAt <= today) {
        overdueFollowUps += 1;
      }
    }
    if (lead.status === "WON") wonValue += lead.estimatedMonthlyValue;
  }

  return {
    total: db.leads.length,
    byStatus,
    bySource,
    newThisWeek,
    openPipelineValue: Math.round(openPipelineValue * 100) / 100,
    wonValue: Math.round(wonValue * 100) / 100,
    overdueFollowUps,
    unassigned,
  };
}

/** Flat CSV export so the team can work the list in Excel. */
export async function exportLeadsCsv(): Promise<string> {
  const leads = await listLeads();
  const header = [
    "Reference",
    "Contact",
    "Company",
    "Email",
    "Phone",
    "Suburb",
    "Source",
    "Status",
    "Priority",
    "Business Type",
    "Products",
    "Volume",
    "Frequency",
    "Est. Monthly Value (ZAR)",
    "Owner",
    "Next Follow-up",
    "Created",
    "Last Activity",
  ];

  const escape = (value: string | number | null) => {
    const raw = value === null ? "" : String(value);
    if (!/[",\r\n]/.test(raw)) return raw;
    return `"${raw.split('"').join('""')}"`;
  };

  const rows = leads.map((lead) =>
    [
      lead.reference,
      lead.contactName,
      lead.company,
      lead.email,
      lead.phone,
      lead.suburb,
      lead.source,
      lead.status,
      lead.priority,
      lead.businessType,
      lead.productsInterested.join("; "),
      lead.estimatedVolume,
      lead.deliveryFrequency,
      lead.estimatedMonthlyValue.toFixed(2),
      lead.owner,
      lead.nextFollowUpAt ?? "",
      lead.createdAt.slice(0, 10),
      lead.updatedAt.slice(0, 10),
    ].map(escape)
  );

  return [header.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
}

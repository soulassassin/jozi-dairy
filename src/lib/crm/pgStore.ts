// Postgres-backed CRM store.
//
// Presents exactly the interface the JSON-file store does — read() and
// mutate() over a whole CrmDatabase — so the service layer above it is
// unchanged. What differs is where the bytes go and, crucially, what happens
// when two requests mutate at once.
//
// mutate() runs inside a transaction holding a transaction-scoped advisory
// lock, so concurrent writers queue instead of clobbering each other. That
// holds across processes and across serverless instances, which the file store
// could never manage: it is the reason this store is safe on Vercel and the
// file one is not.
//
// Only the rows that actually changed are written. The mutator is handed a
// snapshot, and the difference between that snapshot and what it leaves behind
// becomes the insert/update/delete set.

import type { Pool, PoolClient } from "pg";
import { Activity, ActivityType, CrmDatabase, Lead } from "./types";

/** Serialises every mutation on this database. */
const LOCK_KEY = "jozi_dairy_crm";

let pool: Pool | null = null;

export function isConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * TLS settings for the database connection.
 *
 * Certificates are always verified — this connection carries real customer
 * records, and an unverified one can be intercepted. Supabase's pooler
 * presents a publicly trusted certificate, so Node's default trust store is
 * enough. A direct (non-pooled) connection to db.<ref>.supabase.co needs
 * Supabase's CA bundle, which can be supplied in CRM_DB_CA_CERT.
 */
function tlsOptions(): { ca?: string; rejectUnauthorized: boolean } {
  const ca = process.env.CRM_DB_CA_CERT?.trim();
  return ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: true };
}

async function getPool(): Promise<Pool> {
  if (pool) return pool;

  // Imported lazily so a deployment running on the file store never loads the
  // driver.
  const { Pool: PgPool } = await import("pg");

  pool = new PgPool({
    connectionString: process.env.DATABASE_URL,
    ssl: tlsOptions(),
    // Serverless invocations are short-lived and many; a small ceiling per
    // instance keeps the shared pooler from being exhausted.
    max: Number(process.env.CRM_DB_POOL_MAX ?? 3),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });

  return pool;
}

// ---------------------------------------------------------------------------
// Row mapping
// ---------------------------------------------------------------------------

interface LeadRow {
  id: string;
  reference: string;
  contact_name: string;
  company: string;
  email: string;
  phone: string;
  whatsapp: string;
  suburb: string;
  source: string;
  status: string;
  priority: string;
  business_type: string;
  products_interested: string[];
  estimated_volume: string;
  delivery_frequency: string;
  estimated_monthly_value: string;
  message: string;
  department: string;
  owner: string;
  next_follow_up_at: string | null;
  lost_reason: string | null;
  created_at: Date;
  updated_at: Date;
}

interface ActivityRow {
  id: string;
  lead_id: string;
  type: string;
  body: string;
  author: string;
  created_at: Date;
}

function toLead(row: LeadRow): Lead {
  return {
    id: row.id,
    reference: row.reference,
    contactName: row.contact_name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp,
    suburb: row.suburb,
    source: row.source as Lead["source"],
    status: row.status as Lead["status"],
    priority: row.priority as Lead["priority"],
    businessType: row.business_type,
    productsInterested: row.products_interested ?? [],
    estimatedVolume: row.estimated_volume,
    deliveryFrequency: row.delivery_frequency,
    // numeric comes back as a string, to keep precision the driver cannot
    // assume it may discard.
    estimatedMonthlyValue: Number(row.estimated_monthly_value ?? 0),
    message: row.message,
    department: row.department,
    owner: row.owner,
    nextFollowUpAt: row.next_follow_up_at,
    lostReason: row.lost_reason,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    activities: [],
  };
}

function toActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    leadId: row.lead_id,
    type: row.type as ActivityType,
    body: row.body,
    author: row.author,
    createdAt: row.created_at.toISOString(),
  };
}

/** Loads the whole database through an existing client. */
async function load(client: PoolClient): Promise<CrmDatabase> {
  const leads = await client.query<LeadRow>(
    "select * from crm_lead order by created_at desc"
  );
  const activities = await client.query<ActivityRow>(
    "select * from crm_activity order by created_at asc"
  );
  const counter = await client.query<{ lead_sequence: number }>(
    "select lead_sequence from crm_counter where id = 'crm'"
  );

  const byId = new Map<string, Lead>();
  for (const row of leads.rows) byId.set(row.id, toLead(row));

  for (const row of activities.rows) {
    byId.get(row.lead_id)?.activities.push(toActivity(row));
  }

  return {
    version: 1,
    leadSequence: counter.rows[0]?.lead_sequence ?? 0,
    leads: [...byId.values()],
  };
}

export async function read(): Promise<CrmDatabase> {
  const client = await (await getPool()).connect();
  try {
    return await load(client);
  } finally {
    client.release();
  }
}

// ---------------------------------------------------------------------------
// Writing back only what changed
// ---------------------------------------------------------------------------

/** The lead's own columns, in the order the insert and update statements use. */
function leadValues(lead: Lead): unknown[] {
  return [
    lead.id,
    lead.reference,
    lead.contactName,
    lead.company,
    lead.email,
    lead.phone,
    lead.whatsapp,
    lead.suburb,
    lead.source,
    lead.status,
    lead.priority,
    lead.businessType,
    lead.productsInterested,
    lead.estimatedVolume,
    lead.deliveryFrequency,
    lead.estimatedMonthlyValue,
    lead.message,
    lead.department,
    lead.owner,
    lead.nextFollowUpAt,
    lead.lostReason,
    lead.createdAt,
    lead.updatedAt,
  ];
}

const LEAD_COLUMNS = `id, reference, contact_name, company, email, phone,
  whatsapp, suburb, source, status, priority, business_type,
  products_interested, estimated_volume, delivery_frequency,
  estimated_monthly_value, message, department, owner, next_follow_up_at,
  lost_reason, created_at, updated_at`;

async function insertLead(client: PoolClient, lead: Lead): Promise<void> {
  const values = leadValues(lead);
  const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

  await client.query(
    `insert into crm_lead (${LEAD_COLUMNS}) values (${placeholders})`,
    values
  );
}

async function updateLeadRow(client: PoolClient, lead: Lead): Promise<void> {
  await client.query(
    `update crm_lead set
       reference = $2, contact_name = $3, company = $4, email = $5,
       phone = $6, whatsapp = $7, suburb = $8, source = $9, status = $10,
       priority = $11, business_type = $12, products_interested = $13,
       estimated_volume = $14, delivery_frequency = $15,
       estimated_monthly_value = $16, message = $17, department = $18,
       owner = $19, next_follow_up_at = $20, lost_reason = $21,
       created_at = $22, updated_at = $23
     where id = $1`,
    leadValues(lead)
  );
}

async function insertActivity(
  client: PoolClient,
  activity: Activity
): Promise<void> {
  await client.query(
    `insert into crm_activity (id, lead_id, type, body, author, created_at)
     values ($1, $2, $3, $4, $5, $6)
     on conflict (id) do nothing`,
    [
      activity.id,
      activity.leadId,
      activity.type,
      activity.body,
      activity.author,
      activity.createdAt,
    ]
  );
}

/** Scalar fields only — activities are compared separately. */
function leadFingerprint(lead: Lead): string {
  return JSON.stringify(leadValues(lead));
}

async function persistDiff(
  client: PoolClient,
  before: CrmDatabase,
  after: CrmDatabase
): Promise<void> {
  const beforeLeads = new Map(before.leads.map((lead) => [lead.id, lead]));
  const afterLeads = new Map(after.leads.map((lead) => [lead.id, lead]));

  // Gone from the mutator's result: delete. Activities cascade.
  for (const id of beforeLeads.keys()) {
    if (!afterLeads.has(id)) {
      await client.query("delete from crm_lead where id = $1", [id]);
    }
  }

  for (const [id, lead] of afterLeads) {
    const previous = beforeLeads.get(id);

    if (!previous) {
      await insertLead(client, lead);
    } else if (leadFingerprint(previous) !== leadFingerprint(lead)) {
      await updateLeadRow(client, lead);
    }

    // Activities are append-only in this application, so anything with an id
    // the snapshot did not have is new.
    const known = new Set((previous?.activities ?? []).map((a) => a.id));
    for (const activity of lead.activities) {
      if (!known.has(activity.id)) {
        await insertActivity(client, activity);
      }
    }
  }

  if (before.leadSequence !== after.leadSequence) {
    await client.query(
      "update crm_counter set lead_sequence = $1 where id = 'crm'",
      [after.leadSequence]
    );
  }
}

/**
 * Runs `mutator` against the current database and persists what it changed.
 *
 * The advisory lock is transaction-scoped, so it is released on commit or
 * rollback and is safe behind a connection pooler in transaction mode.
 */
export async function mutate<T>(
  mutator: (db: CrmDatabase) => T | Promise<T>
): Promise<T> {
  const client = await (await getPool()).connect();

  try {
    await client.query("begin");
    await client.query("select pg_advisory_xact_lock(hashtext($1))", [LOCK_KEY]);

    const current = await load(client);
    // The mutator edits in place, so the snapshot must be an independent copy.
    const snapshot: CrmDatabase = JSON.parse(
      JSON.stringify(current)
    ) as CrmDatabase;

    const result = await mutator(current);

    await persistDiff(client, snapshot, current);
    await client.query("commit");

    return result;
  } catch (error) {
    await client.query("rollback").catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

import { promises as fs } from "node:fs";
import path from "node:path";
import * as pg from "./pgStore";
import { CrmDatabase } from "./types";

// The CRM persists to a JSON file on the server so the team can run it with no
// database to provision. Every mutation goes through `mutate()`, which
// serialises read-modify-write cycles so two concurrent requests cannot clobber
// each other, and writes via a temp file + rename so a crash mid-write cannot
// leave a truncated database behind.
//
// Swapping this for Postgres later means reimplementing only `read()` and
// `mutate()` — nothing above this file touches the filesystem.

const DATA_DIR = process.env.CRM_DATA_DIR
  ? path.resolve(process.env.CRM_DATA_DIR)
  : path.join(process.cwd(), "data");

const DATA_FILE = path.join(DATA_DIR, "crm.json");

const EMPTY_DB: CrmDatabase = { version: 1, leadSequence: 0, leads: [] };

/** Tail of the write queue; each mutation chains onto the previous one. */
let writeQueue: Promise<unknown> = Promise.resolve();

async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function isMissingFile(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: string }).code === "ENOENT"
  );
}

/** Reads the whole database. Returns an empty database on first run. */
async function readFile(): Promise<CrmDatabase> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as CrmDatabase;

    // Defend against a hand-edited or partially written file.
    if (!parsed || !Array.isArray(parsed.leads)) return { ...EMPTY_DB };

    return {
      version: 1,
      leadSequence: parsed.leadSequence ?? parsed.leads.length,
      leads: parsed.leads,
    };
  } catch (error) {
    if (isMissingFile(error)) return { ...EMPTY_DB };
    throw error;
  }
}

async function write(db: CrmDatabase): Promise<void> {
  await ensureDataDir();
  const tempFile = `${DATA_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tempFile, DATA_FILE);
}

/**
 * Runs `mutator` against the current database, persists whatever it leaves
 * behind, and returns the mutator's result. Mutations are serialised, so the
 * database handed to `mutator` is always the latest committed state.
 */
async function mutateFile<T>(
  mutator: (db: CrmDatabase) => T | Promise<T>
): Promise<T> {
  const run = writeQueue.then(async () => {
    const db = await readFile();
    const result = await mutator(db);
    await write(db);
    return result;
  });

  // Keep the queue alive even if this mutation rejects, so one failed write
  // does not wedge every later request.
  writeQueue = run.catch(() => undefined);

  return run;
}

export const DATA_FILE_PATH = DATA_FILE;

// ---------------------------------------------------------------------------
// Which store is in use
// ---------------------------------------------------------------------------
//
// Postgres when DATABASE_URL is set, otherwise the JSON file. That keeps a
// fresh checkout working with no database to provision, while a real
// deployment gets a store that survives more than one server process.

/** "postgres" or "file" — useful in logs and on the setup screen. */
export function storeKind(): "postgres" | "file" {
  return pg.isConfigured() ? "postgres" : "file";
}

/** Reads the whole database from whichever store is configured. */
export async function read(): Promise<CrmDatabase> {
  return pg.isConfigured() ? pg.read() : readFile();
}

/**
 * Runs `mutator` against the current database and persists the result.
 *
 * Mutations are serialised either way: in-process for the file store, and by
 * a transaction-scoped advisory lock for Postgres, which also holds across
 * separate instances.
 */
export async function mutate<T>(
  mutator: (db: CrmDatabase) => T | Promise<T>
): Promise<T> {
  return pg.isConfigured() ? pg.mutate(mutator) : mutateFile(mutator);
}

/**
 * True when this process can actually keep what it writes.
 *
 * Postgres always can. The JSON file cannot on a serverless platform, which
 * hands each invocation a throwaway filesystem: a lead written there
 * disappears when the function freezes, and the write succeeds first, so the
 * visitor is told an enquiry was received that nobody will ever read.
 *
 * Lead capture checks this and falls back to emailing the team rather than
 * accepting an enquiry it cannot keep. Set CRM_ALLOW_EPHEMERAL_STORE=true to
 * override (useful for a throwaway preview where losing leads does not
 * matter).
 */
export function isStoreDurable(): boolean {
  if (pg.isConfigured()) return true;
  if (process.env.CRM_ALLOW_EPHEMERAL_STORE === "true") return true;

  const serverless = Boolean(
    process.env.VERCEL ??
      process.env.AWS_LAMBDA_FUNCTION_NAME ??
      process.env.NETLIFY ??
      process.env.CF_PAGES
  );

  return !serverless;
}

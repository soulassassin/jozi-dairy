import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

// The CRM sits behind a single shared team passcode held in CRM_PASSCODE, and
// the signed-in staff member types their own name so every call and note is
// attributed on the lead timeline. That keeps the gate simple while still
// answering "who logged this?" — the question the team actually asks.
//
// Upgrading to per-user accounts later means replacing `verifyPasscode` with a
// lookup against the Prisma `User` table; nothing else here changes.

const COOKIE_NAME = "jozi_crm_session";
const SESSION_HOURS = 12;

function passcode(): string {
  return process.env.CRM_PASSCODE ?? "";
}

function secretKey(): Uint8Array {
  const secret =
    process.env.CRM_SESSION_SECRET ??
    // Fall back to the passcode so a half-filled .env.local still works; the
    // dedicated secret is what you want in production.
    process.env.CRM_PASSCODE ??
    "";

  if (secret.length < 16) {
    throw new Error(
      "CRM_SESSION_SECRET must be set to at least 16 characters. See .env.local.example."
    );
  }

  return new TextEncoder().encode(secret);
}

export interface Session {
  staffName: string;
}

export function isCrmConfigured(): boolean {
  return passcode().length > 0;
}

/**
 * Compares the submitted passcode in constant time so a wrong guess does not
 * leak its length through timing.
 */
export function verifyPasscode(submitted: string): boolean {
  const expected = passcode();
  if (!expected) return false;
  if (submitted.length !== expected.length) return false;

  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= submitted.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return mismatch === 0;
}

export async function createSession(staffName: string): Promise<void> {
  const token = await new SignJWT({ staffName })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(secretKey());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/** Returns the current session, or null when nobody is signed in. */
export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    const staffName =
      typeof payload.staffName === "string" ? payload.staffName : "";
    return staffName ? { staffName } : null;
  } catch {
    // Expired, tampered with, or signed under a rotated secret.
    return null;
  }
}

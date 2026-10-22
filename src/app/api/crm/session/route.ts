import {
  createSession,
  destroySession,
  getSession,
  isCrmConfigured,
  verifyPasscode,
} from "@/lib/crm/auth";
import { readJsonBody } from "@/lib/crm/apiGuard";

/** Who is signed in, for the dashboard header. */
export async function GET() {
  const session = await getSession();
  return Response.json({ session });
}

/** Sign in with the shared team passcode plus the staff member's own name. */
export async function POST(request: Request) {
  if (!isCrmConfigured()) {
    return Response.json(
      {
        error:
          "The CRM has no passcode set. Add CRM_PASSCODE and CRM_SESSION_SECRET to .env.local, then restart the server.",
      },
      { status: 503 }
    );
  }

  const body = await readJsonBody(request);
  const staffName =
    typeof body.staffName === "string" ? body.staffName.trim().slice(0, 80) : "";
  const submitted = typeof body.passcode === "string" ? body.passcode : "";

  if (!staffName) {
    return Response.json(
      { error: "Enter your name so your calls and notes are logged against you." },
      { status: 400 }
    );
  }

  if (!verifyPasscode(submitted)) {
    return Response.json({ error: "That passcode is not correct." }, { status: 401 });
  }

  await createSession(staffName);
  return Response.json({ ok: true, session: { staffName } });
}

export async function DELETE() {
  await destroySession();
  return Response.json({ ok: true });
}

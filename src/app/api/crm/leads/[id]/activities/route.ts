import { readJsonBody, withStaffSession } from "@/lib/crm/apiGuard";
import { addActivity } from "@/lib/crm/service";

interface Context {
  params: Promise<{ id: string }>;
}

/** Log a call, email, WhatsApp, meeting, quote or plain note on a lead. */
export const POST = withStaffSession<Context>(
  async (request, session, { params }) => {
    const { id } = await params;
    const body = await readJsonBody(request);
    const lead = await addActivity(id, body, session.staffName);

    if (!lead) {
      return Response.json({ error: "That lead no longer exists." }, { status: 404 });
    }

    return Response.json({ lead }, { status: 201 });
  }
);

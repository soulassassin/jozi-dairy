import { readJsonBody, withStaffSession } from "@/lib/crm/apiGuard";
import { deleteLead, getLead, updateLead } from "@/lib/crm/service";

interface Context {
  params: Promise<{ id: string }>;
}

export const GET = withStaffSession<Context>(async (_request, _session, { params }) => {
  const { id } = await params;
  const lead = await getLead(id);

  if (!lead) {
    return Response.json({ error: "That lead no longer exists." }, { status: 404 });
  }

  return Response.json({ lead });
});

export const PATCH = withStaffSession<Context>(
  async (request, session, { params }) => {
    const { id } = await params;
    const body = await readJsonBody(request);
    const lead = await updateLead(id, body, session.staffName);

    if (!lead) {
      return Response.json({ error: "That lead no longer exists." }, { status: 404 });
    }

    return Response.json({ lead });
  }
);

export const DELETE = withStaffSession<Context>(
  async (_request, _session, { params }) => {
    const { id } = await params;
    const removed = await deleteLead(id);

    if (!removed) {
      return Response.json({ error: "That lead no longer exists." }, { status: 404 });
    }

    return Response.json({ ok: true });
  }
);

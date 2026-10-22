import { readJsonBody, withStaffSession } from "@/lib/crm/apiGuard";
import { createLead, listLeads } from "@/lib/crm/service";

/** Lead list, filtered by the dashboard controls. */
export const GET = withStaffSession(async (request) => {
  const params = new URL(request.url).searchParams;

  const leads = await listLeads({
    status: params.get("status"),
    source: params.get("source"),
    owner: params.get("owner"),
    search: params.get("search"),
    view: params.get("view"),
  });

  return Response.json({ leads });
});

/** Capture a lead by hand — typically while on a phone call. */
export const POST = withStaffSession(async (request, session) => {
  const body = await readJsonBody(request);
  const { lead, merged } = await createLead(body, session.staffName);

  return Response.json({ lead, merged }, { status: merged ? 200 : 201 });
});

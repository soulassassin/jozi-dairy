import { withStaffSession } from "@/lib/crm/apiGuard";
import { listContacts } from "@/lib/crm/service";

/** Deduplicated contact book derived from every lead on file. */
export const GET = withStaffSession(async (request) => {
  const search = new URL(request.url).searchParams.get("search");
  const contacts = await listContacts(search);

  return Response.json({ contacts });
});

import { withStaffSession } from "@/lib/crm/apiGuard";
import { getStats } from "@/lib/crm/service";

/** Headline pipeline numbers for the dashboard tiles. */
export const GET = withStaffSession(async () => {
  const stats = await getStats();

  return Response.json({ stats });
});

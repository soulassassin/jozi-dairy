import { withStaffSession } from "@/lib/crm/apiGuard";
import { exportLeadsCsv } from "@/lib/crm/service";

/** Downloads every lead as CSV for Excel. */
export const GET = withStaffSession(async () => {
  const csv = await exportLeadsCsv();
  const filename = `jozi-dairy-leads-${new Date().toISOString().slice(0, 10)}.csv`;

  // The leading BOM keeps Excel on Windows from mangling accented characters.
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
});

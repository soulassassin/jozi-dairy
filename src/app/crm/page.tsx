import { redirect } from "next/navigation";
import { getSession, isCrmConfigured } from "@/lib/crm/auth";
import { getStats, listContacts, listLeads } from "@/lib/crm/service";
import CrmDashboard from "@/components/crm/CrmDashboard";

export default async function CrmPage() {
  if (!isCrmConfigured()) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20">
        <div className="rounded-2xl border border-jozi-amber/40 bg-white p-8 shadow-card">
          <h1 className="font-display text-2xl font-bold text-jozi-navy">
            Finish setting up the CRM
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-jozi-navy/70">
            Create a <code className="font-mono text-jozi-navy">.env.local</code>{" "}
            file in the project root with a team passcode and a session secret,
            then restart the dev server:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-jozi-navy p-4 text-xs leading-relaxed text-jozi-white">
            {`CRM_PASSCODE=choose-a-team-passcode
CRM_SESSION_SECRET=a-long-random-string-at-least-32-chars`}
          </pre>
          <p className="mt-4 text-sm text-jozi-navy/70">
            Everyone on the sales team shares the passcode and types their own
            name when signing in, so each call and note is attributed.
          </p>
        </div>
      </main>
    );
  }

  const session = await getSession();
  if (!session) redirect("/crm/login");

  // Server-render the first paint with real data so the team sees their
  // pipeline immediately; the dashboard refetches from the API after that.
  const [leads, contacts, stats] = await Promise.all([
    listLeads(),
    listContacts(),
    getStats(),
  ]);

  return (
    <CrmDashboard
      staffName={session.staffName}
      initialLeads={leads}
      initialContacts={contacts}
      initialStats={stats}
    />
  );
}

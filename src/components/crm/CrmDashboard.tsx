"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  LoaderCircle,
  LogOut,
  Milk,
  Plus,
  Search,
  Users,
} from "lucide-react";
import {
  Contact,
  CrmStats,
  Lead,
  LEAD_OWNERS,
  LEAD_SOURCES,
  LEAD_STATUSES,
  SOURCE_LABELS,
  STATUS_LABELS,
} from "@/lib/crm/types";
import { apiFetch } from "./crmUi";
import ContactsTable from "./ContactsTable";
import LeadDetailPanel from "./LeadDetailPanel";
import LeadTable from "./LeadTable";
import NewLeadDialog from "./NewLeadDialog";
import StatTiles from "./StatTiles";

interface CrmDashboardProps {
  staffName: string;
  initialLeads: Lead[];
  initialContacts: Contact[];
  initialStats: CrmStats;
}

type Tab = "pipeline" | "contacts";

export default function CrmDashboard({
  staffName,
  initialLeads,
  initialContacts,
  initialStats,
}: CrmDashboardProps) {
  const router = useRouter();

  const [leads, setLeads] = useState(initialLeads);
  const [contacts, setContacts] = useState(initialContacts);
  const [stats, setStats] = useState(initialStats);

  const [tab, setTab] = useState<Tab>("pipeline");
  const [status, setStatus] = useState("ALL");
  const [source, setSource] = useState("ALL");
  const [owner, setOwner] = useState("ALL");
  const [view, setView] = useState<"all" | "open" | "followups">("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNewLead, setShowNewLead] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // Debounce the search box so typing does not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (status !== "ALL") params.set("status", status);
      if (source !== "ALL") params.set("source", source);
      if (owner !== "ALL") params.set("owner", owner);
      if (view !== "all") params.set("view", view);
      if (search) params.set("search", search);

      const contactParams = new URLSearchParams();
      if (search) contactParams.set("search", search);

      const [leadData, contactData, statsData] = await Promise.all([
        apiFetch<{ leads: Lead[] }>(`/api/crm/leads?${params.toString()}`),
        apiFetch<{ contacts: Contact[] }>(
          `/api/crm/contacts?${contactParams.toString()}`
        ),
        apiFetch<{ stats: CrmStats }>("/api/crm/stats"),
      ]);

      setLeads(leadData.leads);
      setContacts(contactData.contacts);
      setStats(statsData.stats);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not load the latest leads."
      );
    } finally {
      setLoading(false);
    }
  }, [status, source, owner, view, search]);

  // Refetch whenever a filter changes. The first render already has
  // server-rendered data, but refetching keeps the code path single.
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedId) ?? null,
    [leads, selectedId]
  );

  const flash = (text: string) => {
    setToast(text);
    setTimeout(() => setToast(""), 4000);
  };

  /** Replaces one lead in place after an edit, then refreshes the tiles. */
  const handleUpdated = (updated: Lead) => {
    setLeads((current) =>
      current.map((lead) => (lead.id === updated.id ? updated : lead))
    );
    void refresh();
  };

  const handleDeleted = (leadId: string) => {
    setLeads((current) => current.filter((lead) => lead.id !== leadId));
    setSelectedId(null);
    flash("Lead deleted.");
    void refresh();
  };

  const handleCreated = (lead: Lead, merged: boolean) => {
    setShowNewLead(false);
    flash(
      merged
        ? `${lead.contactName} already had an open lead (${lead.reference}) — the enquiry was added to it.`
        : `Lead ${lead.reference} saved.`
    );
    setSelectedId(lead.id);
    void refresh();
  };

  const handleDrillDown = (target: "all" | "open" | "followups" | "unassigned") => {
    setTab("pipeline");
    if (target === "unassigned") {
      setOwner("Unassigned");
      setView("open");
      setStatus("ALL");
      return;
    }
    if (target === "all") {
      setStatus("WON");
      setView("all");
      setOwner("ALL");
      return;
    }
    setView(target);
    setStatus("ALL");
    setOwner("ALL");
  };

  const handleSignOut = async () => {
    await fetch("/api/crm/session", { method: "DELETE" });
    router.replace("/crm/login");
    router.refresh();
  };

  const filtersActive =
    status !== "ALL" || source !== "ALL" || owner !== "ALL" || view !== "all" || search !== "";

  const controlClass =
    "min-h-[44px] rounded-xl border border-jozi-navy/15 bg-white px-3 text-sm text-jozi-navy outline-none transition focus:border-jozi-cyan focus:ring-2 focus:ring-jozi-cyan/25";

  return (
    <div className="min-h-screen">
      <header className="border-b border-jozi-navy/10 bg-jozi-navy">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-jozi-cyan">
              <Milk className="h-5 w-5 text-jozi-white" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold leading-tight text-jozi-white">
                Jozi Dairy CRM
              </h1>
              <p className="text-xs text-jozi-white/55">
                Signed in as {staffName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNewLead(true)}
              className="flex min-h-[44px] items-center gap-2 rounded-xl bg-jozi-cyan px-4 text-sm font-semibold text-jozi-white transition hover:bg-jozi-cyan-hover"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New lead
            </button>

            <a
              href="/api/crm/export"
              className="flex min-h-[44px] items-center gap-2 rounded-xl bg-jozi-navy-light px-4 text-sm font-semibold text-jozi-white transition hover:bg-jozi-navy-card"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Export CSV</span>
            </a>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex min-h-[44px] items-center gap-2 rounded-xl px-3 text-sm font-medium text-jozi-white/70 transition hover:bg-jozi-navy-light hover:text-jozi-white"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {toast ? (
          <p
            role="status"
            className="mb-5 rounded-xl bg-jozi-green/10 px-4 py-3 text-sm font-medium text-green-900 ring-1 ring-jozi-green/30"
          >
            {toast}
          </p>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        ) : null}

        <StatTiles stats={stats} onDrillDown={handleDrillDown} />

        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-jozi-navy/10">
          {(
            [
              ["pipeline", "Pipeline", stats.total],
              ["contacts", "Contacts", contacts.length],
            ] as const
          ).map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-current={tab === key ? "page" : undefined}
              className={`-mb-px flex min-h-[44px] items-center gap-2 border-b-2 px-4 text-sm font-semibold transition ${
                tab === key
                  ? "border-jozi-cyan text-jozi-navy"
                  : "border-transparent text-jozi-navy/50 hover:text-jozi-navy"
              }`}
            >
              {key === "contacts" ? (
                <Users className="h-4 w-4" aria-hidden="true" />
              ) : null}
              {label}
              <span className="rounded-full bg-jozi-navy/10 px-2 py-0.5 text-xs font-bold text-jozi-navy/60">
                {count}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-jozi-navy/35"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search name, business, phone, email, suburb…"
              aria-label="Search leads and contacts"
              className={`${controlClass} w-full pl-9`}
            />
          </div>

          {tab === "pipeline" ? (
            <>
              <label className="sr-only" htmlFor="statusFilter">
                Filter by status
              </label>
              <select
                id="statusFilter"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className={controlClass}
              >
                <option value="ALL">All statuses</option>
                {LEAD_STATUSES.map((entry) => (
                  <option key={entry} value={entry}>
                    {STATUS_LABELS[entry]}
                  </option>
                ))}
              </select>

              <label className="sr-only" htmlFor="sourceFilter">
                Filter by source
              </label>
              <select
                id="sourceFilter"
                value={source}
                onChange={(event) => setSource(event.target.value)}
                className={controlClass}
              >
                <option value="ALL">All sources</option>
                {LEAD_SOURCES.map((entry) => (
                  <option key={entry} value={entry}>
                    {SOURCE_LABELS[entry]}
                  </option>
                ))}
              </select>

              <label className="sr-only" htmlFor="ownerFilter">
                Filter by owner
              </label>
              <select
                id="ownerFilter"
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                className={controlClass}
              >
                <option value="ALL">Anyone</option>
                {LEAD_OWNERS.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>

              <label className="sr-only" htmlFor="viewFilter">
                Limit the view
              </label>
              <select
                id="viewFilter"
                value={view}
                onChange={(event) =>
                  setView(event.target.value as "all" | "open" | "followups")
                }
                className={controlClass}
              >
                <option value="all">Everything</option>
                <option value="open">Open only</option>
                <option value="followups">Follow-ups due</option>
              </select>

              {filtersActive ? (
                <button
                  type="button"
                  onClick={() => {
                    setStatus("ALL");
                    setSource("ALL");
                    setOwner("ALL");
                    setView("all");
                    setSearchInput("");
                  }}
                  className="min-h-[44px] rounded-xl px-3 text-sm font-medium text-jozi-cyan transition hover:bg-jozi-cyan/10"
                >
                  Clear filters
                </button>
              ) : null}
            </>
          ) : null}

          {loading ? (
            <LoaderCircle
              className="h-4 w-4 animate-spin text-jozi-cyan"
              aria-label="Loading"
            />
          ) : null}
        </div>

        <div className="mt-5 pb-16">
          {tab === "pipeline" ? (
            <LeadTable
              leads={leads}
              selectedId={selectedId}
              onSelect={(lead) => setSelectedId(lead.id)}
            />
          ) : (
            <ContactsTable
              contacts={contacts}
              onOpenLead={(leadId) => {
                setTab("pipeline");
                // Clear filters so the lead is certain to be in the list.
                setStatus("ALL");
                setSource("ALL");
                setOwner("ALL");
                setView("all");
                setSelectedId(leadId);
              }}
            />
          )}
        </div>
      </main>

      {selectedLead ? (
        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedId(null)}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      ) : null}

      {showNewLead ? (
        <NewLeadDialog
          onClose={() => setShowNewLead(false)}
          onCreated={handleCreated}
          defaultOwner={staffName}
        />
      ) : null}
    </div>
  );
}

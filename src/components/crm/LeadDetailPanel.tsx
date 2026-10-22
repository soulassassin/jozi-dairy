"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarClock,
  Check,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Trash2,
  X,
} from "lucide-react";
import {
  ACTIVITY_LABELS,
  ActivityType,
  Lead,
  LEAD_OWNERS,
  LEAD_PRIORITIES,
  LEAD_STATUSES,
  LOSS_REASONS,
  SOURCE_LABELS,
  STATUS_LABELS,
} from "@/lib/crm/types";
import {
  ACTIVITY_DOT,
  apiFetch,
  formatDate,
  formatRand,
  formatRelative,
  PRIORITY_STYLES,
  STATUS_STYLES,
  todayIso,
  whatsappHref,
} from "./crmUi";

interface LeadDetailPanelProps {
  lead: Lead;
  onClose: () => void;
  /** Called with the server's updated lead so the list stays in sync. */
  onUpdated: (lead: Lead) => void;
  onDeleted: (leadId: string) => void;
}

/** The activity types a person can log by hand. */
const LOGGABLE: ActivityType[] = [
  "CALL_OUTBOUND",
  "CALL_INBOUND",
  "WHATSAPP",
  "EMAIL",
  "MEETING",
  "QUOTE_SENT",
  "NOTE",
];

export default function LeadDetailPanel({
  lead,
  onClose,
  onUpdated,
  onDeleted,
}: LeadDetailPanelProps) {
  const [activityType, setActivityType] = useState<ActivityType>("CALL_OUTBOUND");
  const [activityBody, setActivityBody] = useState("");
  const [followUp, setFollowUp] = useState(lead.nextFollowUpAt ?? "");
  const [valueInput, setValueInput] = useState(
    lead.estimatedMonthlyValue > 0 ? String(lead.estimatedMonthlyValue) : ""
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Re-seed the editable fields when the drawer switches to another lead.
  useEffect(() => {
    setFollowUp(lead.nextFollowUpAt ?? "");
    setValueInput(
      lead.estimatedMonthlyValue > 0 ? String(lead.estimatedMonthlyValue) : ""
    );
    setActivityBody("");
    setError("");
    setConfirmingDelete(false);
  }, [lead.id, lead.nextFollowUpAt, lead.estimatedMonthlyValue]);

  // Escape closes the drawer, as it does in the quote modal on the public site.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const patchLead = async (patch: Record<string, unknown>) => {
    setBusy(true);
    setError("");
    try {
      const data = await apiFetch<{ lead: Lead }>(`/api/crm/leads/${lead.id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      onUpdated(data.lead);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Update failed.");
    } finally {
      setBusy(false);
    }
  };

  const logActivity = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activityBody.trim()) return;

    setBusy(true);
    setError("");
    try {
      const data = await apiFetch<{ lead: Lead }>(
        `/api/crm/leads/${lead.id}/activities`,
        {
          method: "POST",
          body: JSON.stringify({
            type: activityType,
            body: activityBody,
            // Blank clears the follow-up; a date sets it.
            nextFollowUpAt: followUp || null,
          }),
        }
      );
      onUpdated(data.lead);
      setActivityBody("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not log that.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    setError("");
    try {
      await apiFetch(`/api/crm/leads/${lead.id}`, { method: "DELETE" });
      onDeleted(lead.id);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not delete.");
      setBusy(false);
    }
  };

  // Newest activity first.
  const timeline = [...lead.activities].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  const fieldClass =
    "min-h-[44px] w-full rounded-xl border border-jozi-navy/15 bg-white px-3 text-sm text-jozi-navy outline-none transition focus:border-jozi-cyan focus:ring-2 focus:ring-jozi-cyan/25";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-jozi-navy-dark/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Lead ${lead.reference}`}
        className="relative flex h-full w-full max-w-xl flex-col bg-jozi-tint shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-jozi-navy/10 bg-white px-6 py-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[lead.status]}`}
              >
                {STATUS_LABELS[lead.status]}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${PRIORITY_STYLES[lead.priority]}`}
              >
                {lead.priority}
              </span>
              <span className="font-mono text-xs text-jozi-navy/40">
                {lead.reference}
              </span>
            </div>
            <h2 className="mt-2 truncate font-display text-2xl font-bold text-jozi-navy">
              {lead.contactName}
            </h2>
            <p className="truncate text-sm text-jozi-navy/60">
              {[lead.company, lead.businessType].filter(Boolean).join(" · ") ||
                "No business details yet"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close lead"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-jozi-navy/50 transition hover:bg-jozi-tint hover:text-jozi-navy"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error ? (
            <p
              role="alert"
              className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}

          {/* Reach the person in one tap. */}
          <div className="flex flex-wrap gap-2">
            {lead.phone ? (
              <a
                href={`tel:${lead.phone.replace(/\s/g, "")}`}
                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-jozi-cyan px-4 text-sm font-semibold text-jozi-white transition hover:bg-jozi-cyan-hover"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call
              </a>
            ) : null}
            {lead.whatsapp || lead.phone ? (
              <a
                href={whatsappHref(
                  lead.whatsapp || lead.phone,
                  `Hello ${lead.contactName}, it's Jozi Dairy following up on your dairy enquiry.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-jozi-green px-4 text-sm font-semibold text-jozi-white transition hover:bg-jozi-green-light"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
            ) : null}
            {lead.email ? (
              <a
                href={`mailto:${lead.email}?subject=${encodeURIComponent(
                  "Your Jozi Dairy enquiry"
                )}`}
                className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-jozi-navy px-4 text-sm font-semibold text-jozi-white transition hover:bg-jozi-navy-light"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email
              </a>
            ) : null}
          </div>

          {/* Pipeline controls */}
          <section className="mt-5 rounded-2xl border border-jozi-navy/10 bg-white p-5">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-jozi-navy/70">
              Pipeline
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold text-jozi-navy/70">
                  Status
                </span>
                <select
                  value={lead.status}
                  disabled={busy}
                  onChange={(event) => patchLead({ status: event.target.value })}
                  className={`mt-1.5 ${fieldClass}`}
                >
                  {LEAD_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-jozi-navy/70">
                  Owner
                </span>
                <select
                  value={
                    LEAD_OWNERS.includes(lead.owner as (typeof LEAD_OWNERS)[number])
                      ? lead.owner
                      : "Unassigned"
                  }
                  disabled={busy}
                  onChange={(event) => patchLead({ owner: event.target.value })}
                  className={`mt-1.5 ${fieldClass}`}
                >
                  {LEAD_OWNERS.map((owner) => (
                    <option key={owner} value={owner}>
                      {owner}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-jozi-navy/70">
                  Priority
                </span>
                <select
                  value={lead.priority}
                  disabled={busy}
                  onChange={(event) => patchLead({ priority: event.target.value })}
                  className={`mt-1.5 ${fieldClass}`}
                >
                  {LEAD_PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-jozi-navy/70">
                  Est. value / month (R)
                </span>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    inputMode="decimal"
                    value={valueInput}
                    disabled={busy}
                    onChange={(event) => setValueInput(event.target.value)}
                    className={fieldClass}
                  />
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      patchLead({
                        estimatedMonthlyValue: Number(valueInput) || 0,
                      })
                    }
                    aria-label="Save estimated value"
                    className="flex min-h-[44px] w-12 shrink-0 items-center justify-center rounded-xl bg-jozi-navy text-jozi-white transition hover:bg-jozi-navy-light disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </label>
            </div>

            {lead.status === "LOST" ? (
              <label className="mt-4 block">
                <span className="text-xs font-semibold text-jozi-navy/70">
                  Reason lost
                </span>
                <select
                  value={lead.lostReason ?? ""}
                  disabled={busy}
                  onChange={(event) =>
                    patchLead({ lostReason: event.target.value })
                  }
                  className={`mt-1.5 ${fieldClass}`}
                >
                  <option value="">Select a reason…</option>
                  {LOSS_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </section>

          {/* Enquiry detail */}
          <section className="mt-4 rounded-2xl border border-jozi-navy/10 bg-white p-5">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-jozi-navy/70">
              Enquiry
            </h3>

            <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-jozi-navy/50">Source</dt>
                <dd className="text-jozi-navy">{SOURCE_LABELS[lead.source]}</dd>
              </div>
              <div>
                <dt className="text-xs text-jozi-navy/50">Captured</dt>
                <dd className="text-jozi-navy">{formatRelative(lead.createdAt)}</dd>
              </div>
              {lead.suburb ? (
                <div>
                  <dt className="text-xs text-jozi-navy/50">Area</dt>
                  <dd className="flex items-center gap-1.5 text-jozi-navy">
                    <MapPin className="h-3.5 w-3.5 text-jozi-cyan" aria-hidden="true" />
                    {lead.suburb}
                  </dd>
                </div>
              ) : null}
              {lead.estimatedVolume ? (
                <div>
                  <dt className="text-xs text-jozi-navy/50">Volume</dt>
                  <dd className="text-jozi-navy">{lead.estimatedVolume}</dd>
                </div>
              ) : null}
              {lead.deliveryFrequency ? (
                <div>
                  <dt className="text-xs text-jozi-navy/50">Frequency</dt>
                  <dd className="text-jozi-navy">{lead.deliveryFrequency}</dd>
                </div>
              ) : null}
              {lead.department ? (
                <div>
                  <dt className="text-xs text-jozi-navy/50">Routed to</dt>
                  <dd className="truncate text-jozi-navy">{lead.department}</dd>
                </div>
              ) : null}
            </dl>

            {lead.productsInterested.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs text-jozi-navy/50">Products of interest</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {lead.productsInterested.map((product) => (
                    <span
                      key={product}
                      className="rounded-full bg-jozi-tint-card px-2.5 py-1 text-xs font-medium text-jozi-navy"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {lead.message ? (
              <blockquote className="mt-4 border-l-2 border-jozi-cyan/40 bg-jozi-tint/60 px-4 py-3 text-sm italic text-jozi-navy/80">
                {lead.message}
              </blockquote>
            ) : null}
          </section>

          {/* Log a call / note */}
          <section className="mt-4 rounded-2xl border border-jozi-navy/10 bg-white p-5">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-jozi-navy/70">
              Log a call or note
            </h3>

            <form onSubmit={logActivity} className="mt-4">
              <div className="flex flex-wrap gap-1.5">
                {LOGGABLE.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActivityType(type)}
                    aria-pressed={activityType === type}
                    className={`min-h-[36px] rounded-full px-3 text-xs font-semibold transition ${
                      activityType === type
                        ? "bg-jozi-navy text-jozi-white"
                        : "bg-jozi-tint-card text-jozi-navy/70 hover:bg-jozi-cyan/15"
                    }`}
                  >
                    {ACTIVITY_LABELS[type]}
                  </button>
                ))}
              </div>

              <textarea
                value={activityBody}
                onChange={(event) => setActivityBody(event.target.value)}
                rows={3}
                required
                placeholder="What was said? e.g. Spoke to Thabo — wants 5 crates of 2L full cream, Mon/Wed/Fri. Sending a quote."
                className="mt-3 w-full resize-y rounded-xl border border-jozi-navy/15 px-3 py-2.5 text-sm text-jozi-navy outline-none transition focus:border-jozi-cyan focus:ring-2 focus:ring-jozi-cyan/25"
              />

              <div className="mt-3 flex flex-wrap items-end gap-3">
                <label className="flex-1">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-jozi-navy/70">
                    <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                    Next follow-up
                  </span>
                  <input
                    type="date"
                    value={followUp}
                    min={todayIso()}
                    onChange={(event) => setFollowUp(event.target.value)}
                    className={`mt-1.5 ${fieldClass}`}
                  />
                </label>

                <button
                  type="submit"
                  disabled={busy || !activityBody.trim()}
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-jozi-cyan px-6 text-sm font-semibold text-jozi-white transition hover:bg-jozi-cyan-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? (
                    <LoaderCircle
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : null}
                  Save to timeline
                </button>
              </div>
            </form>
          </section>

          {/* History */}
          <section className="mt-4 rounded-2xl border border-jozi-navy/10 bg-white p-5">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-jozi-navy/70">
              History
              <span className="ml-2 font-sans text-xs font-normal normal-case text-jozi-navy/40">
                {timeline.length} {timeline.length === 1 ? "entry" : "entries"}
              </span>
            </h3>

            <ol className="mt-4 space-y-4">
              {timeline.map((activity) => (
                <li key={activity.id} className="flex gap-3">
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${ACTIVITY_DOT[activity.type]}`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-xs font-bold text-jozi-navy">
                        {ACTIVITY_LABELS[activity.type]}
                      </span>
                      <span className="text-xs text-jozi-navy/45">
                        {activity.author} · {formatRelative(activity.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-jozi-navy/80">
                      {activity.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Destructive action, kept last and behind a confirm. */}
          <div className="mt-6 border-t border-jozi-navy/10 pt-5">
            {confirmingDelete ? (
              <div className="rounded-xl bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-800">
                  Delete {lead.reference} and its {lead.activities.length}-entry
                  history?
                </p>
                <p className="mt-1 text-xs text-red-700">
                  This cannot be undone. Mark the lead <em>Lost</em> instead if you
                  may want the record later.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={busy}
                    className="min-h-[44px] rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                  >
                    Yes, delete permanently
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmingDelete(false)}
                    className="min-h-[44px] rounded-xl bg-white px-4 text-sm font-semibold text-jozi-navy ring-1 ring-jozi-navy/15 transition hover:bg-jozi-tint"
                  >
                    Keep it
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="flex items-center gap-2 text-sm font-medium text-jozi-navy/50 transition hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Delete this lead
              </button>
            )}
          </div>
        </div>

        <footer className="border-t border-jozi-navy/10 bg-white px-6 py-3 text-xs text-jozi-navy/50">
          Follow-up{" "}
          <strong className="text-jozi-navy">
            {formatDate(lead.nextFollowUpAt)}
          </strong>
          {lead.estimatedMonthlyValue > 0 ? (
            <>
              {" · "}Est.{" "}
              <strong className="text-jozi-navy">
                {formatRand(lead.estimatedMonthlyValue)}
              </strong>
              /month
            </>
          ) : null}
          {" · "}Updated {formatRelative(lead.updatedAt)}
        </footer>
      </aside>
    </div>
  );
}

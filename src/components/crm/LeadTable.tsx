"use client";

import React from "react";
import { CalendarClock, Mail, Phone, Search } from "lucide-react";
import { Lead, SOURCE_LABELS, STATUS_LABELS } from "@/lib/crm/types";
import {
  formatDate,
  formatRand,
  formatRelative,
  isFollowUpDue,
  PRIORITY_STYLES,
  STATUS_STYLES,
} from "./crmUi";

interface LeadTableProps {
  leads: Lead[];
  selectedId: string | null;
  onSelect: (lead: Lead) => void;
}

export default function LeadTable({ leads, selectedId, onSelect }: LeadTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-jozi-navy/20 bg-white px-6 py-16 text-center">
        <Search className="mx-auto h-8 w-8 text-jozi-navy/25" aria-hidden="true" />
        <p className="mt-4 font-display text-lg font-semibold text-jozi-navy">
          No leads match this view
        </p>
        <p className="mt-1 text-sm text-jozi-navy/60">
          Clear the filters, or log a new lead with the button above.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-jozi-navy/10 bg-white shadow-soft">
      {/* Desktop: a dense table. Mobile: the same rows as stacked cards. */}
      <table className="hidden w-full border-collapse text-left text-sm lg:table">
        <thead>
          <tr className="border-b border-jozi-navy/10 bg-jozi-tint-card/60">
            <th scope="col" className="px-4 py-3 font-semibold text-jozi-navy">
              Lead
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-jozi-navy">
              Contact
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-jozi-navy">
              Source
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-jozi-navy">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-jozi-navy">
              Owner
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-jozi-navy">
              Follow-up
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold text-jozi-navy">
              Est. / month
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const due = isFollowUpDue(lead.nextFollowUpAt);
            return (
              <tr
                key={lead.id}
                onClick={() => onSelect(lead)}
                tabIndex={0}
                role="button"
                aria-label={`Open lead ${lead.reference} for ${lead.contactName}`}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(lead);
                  }
                }}
                className={`cursor-pointer border-b border-jozi-navy/5 transition last:border-0 hover:bg-jozi-tint/70 focus:bg-jozi-tint focus:outline-none ${
                  selectedId === lead.id ? "bg-jozi-cyan/5" : ""
                }`}
              >
                <td className="px-4 py-3 align-top">
                  <div className="flex items-start gap-2">
                    <div>
                      <p className="font-semibold text-jozi-navy">
                        {lead.contactName}
                      </p>
                      <p className="text-xs text-jozi-navy/55">
                        {lead.company || lead.businessType || "No business name"}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-jozi-navy/40">
                        {lead.reference}
                      </p>
                    </div>
                    {lead.priority === "HIGH" ? (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${PRIORITY_STYLES.HIGH}`}
                      >
                        Hot
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="space-y-1">
                    {lead.phone ? (
                      <a
                        href={`tel:${lead.phone.replace(/\s/g, "")}`}
                        onClick={(event) => event.stopPropagation()}
                        className="flex items-center gap-1.5 text-jozi-navy hover:text-jozi-cyan"
                      >
                        <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {lead.phone}
                      </a>
                    ) : null}
                    {lead.email ? (
                      <a
                        href={`mailto:${lead.email}`}
                        onClick={(event) => event.stopPropagation()}
                        className="flex items-center gap-1.5 text-jozi-navy/70 hover:text-jozi-cyan"
                      >
                        <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span className="max-w-[180px] truncate">{lead.email}</span>
                      </a>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 align-top text-xs text-jozi-navy/70">
                  {SOURCE_LABELS[lead.source]}
                  <p className="mt-1 text-[11px] text-jozi-navy/40">
                    {formatRelative(lead.createdAt)}
                  </p>
                </td>
                <td className="px-4 py-3 align-top">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[lead.status]}`}
                  >
                    {STATUS_LABELS[lead.status]}
                  </span>
                </td>
                <td className="px-4 py-3 align-top text-xs text-jozi-navy/70">
                  {lead.owner}
                </td>
                <td className="px-4 py-3 align-top text-xs">
                  {lead.nextFollowUpAt ? (
                    <span
                      className={`inline-flex items-center gap-1.5 ${
                        due ? "font-semibold text-red-600" : "text-jozi-navy/70"
                      }`}
                    >
                      <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                      {formatDate(lead.nextFollowUpAt)}
                    </span>
                  ) : (
                    <span className="text-jozi-navy/35">Not set</span>
                  )}
                </td>
                <td className="px-4 py-3 align-top text-right text-sm font-semibold text-jozi-navy">
                  {lead.estimatedMonthlyValue > 0
                    ? formatRand(lead.estimatedMonthlyValue)
                    : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ul className="divide-y divide-jozi-navy/5 lg:hidden">
        {leads.map((lead) => {
          const due = isFollowUpDue(lead.nextFollowUpAt);
          return (
            <li key={lead.id}>
              <button
                type="button"
                onClick={() => onSelect(lead)}
                className="w-full px-4 py-4 text-left transition hover:bg-jozi-tint/70"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-jozi-navy">
                      {lead.contactName}
                    </p>
                    <p className="truncate text-xs text-jozi-navy/55">
                      {lead.company || lead.businessType || lead.reference}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[lead.status]}`}
                  >
                    {STATUS_LABELS[lead.status]}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-jozi-navy/60">
                  {lead.phone ? <span>{lead.phone}</span> : null}
                  <span>{SOURCE_LABELS[lead.source]}</span>
                  <span>{lead.owner}</span>
                  {lead.nextFollowUpAt ? (
                    <span className={due ? "font-semibold text-red-600" : ""}>
                      Follow up {formatDate(lead.nextFollowUpAt)}
                    </span>
                  ) : null}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

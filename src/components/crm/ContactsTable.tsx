"use client";

import React from "react";
import { Mail, MapPin, MessageCircle, Phone, Users } from "lucide-react";
import { Contact } from "@/lib/crm/types";
import { formatRelative, whatsappHref } from "./crmUi";

interface ContactsTableProps {
  contacts: Contact[];
  /** Opens the contact's most recent lead. */
  onOpenLead: (leadId: string) => void;
}

export default function ContactsTable({ contacts, onOpenLead }: ContactsTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-jozi-navy/20 bg-white px-6 py-16 text-center">
        <Users className="mx-auto h-8 w-8 text-jozi-navy/25" aria-hidden="true" />
        <p className="mt-4 font-display text-lg font-semibold text-jozi-navy">
          No contacts yet
        </p>
        <p className="mt-1 text-sm text-jozi-navy/60">
          Every lead you capture adds its person to this contact book
          automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {contacts.map((contact) => (
        <article
          key={contact.key}
          className="flex flex-col rounded-2xl border border-jozi-navy/10 bg-white p-5 shadow-soft transition hover:shadow-card"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-display text-lg font-bold text-jozi-navy">
                {contact.contactName}
              </h3>
              {contact.company ? (
                <p className="truncate text-sm text-jozi-navy/60">
                  {contact.company}
                </p>
              ) : null}
            </div>
            {contact.openLeadCount > 0 ? (
              <span className="shrink-0 rounded-full bg-jozi-cyan/15 px-2.5 py-1 text-xs font-semibold text-jozi-navy ring-1 ring-jozi-cyan/40">
                {contact.openLeadCount} open
              </span>
            ) : contact.wonLeadCount > 0 ? (
              <span className="shrink-0 rounded-full bg-jozi-green/15 px-2.5 py-1 text-xs font-semibold text-green-900 ring-1 ring-jozi-green/40">
                Customer
              </span>
            ) : null}
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            {contact.phone ? (
              <div className="flex items-center gap-2">
                <dt className="sr-only">Phone</dt>
                <Phone
                  className="h-4 w-4 shrink-0 text-jozi-cyan"
                  aria-hidden="true"
                />
                <dd>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="text-jozi-navy hover:text-jozi-cyan"
                  >
                    {contact.phone}
                  </a>
                </dd>
              </div>
            ) : null}

            {contact.email ? (
              <div className="flex items-center gap-2">
                <dt className="sr-only">Email</dt>
                <Mail
                  className="h-4 w-4 shrink-0 text-jozi-cyan"
                  aria-hidden="true"
                />
                <dd className="min-w-0">
                  <a
                    href={`mailto:${contact.email}`}
                    className="block truncate text-jozi-navy hover:text-jozi-cyan"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>
            ) : null}

            {contact.suburb ? (
              <div className="flex items-center gap-2">
                <dt className="sr-only">Area</dt>
                <MapPin
                  className="h-4 w-4 shrink-0 text-jozi-cyan"
                  aria-hidden="true"
                />
                <dd className="text-jozi-navy/70">{contact.suburb}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-auto pt-5">
            <p className="text-xs text-jozi-navy/45">
              {contact.leadCount} {contact.leadCount === 1 ? "enquiry" : "enquiries"}{" "}
              · last touched {formatRelative(contact.lastTouchedAt)}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onOpenLead(contact.leadIds[contact.leadIds.length - 1])}
                className="min-h-[40px] flex-1 rounded-xl bg-jozi-navy px-3 text-sm font-semibold text-jozi-white transition hover:bg-jozi-navy-light"
              >
                Open lead
              </button>
              {contact.whatsapp || contact.phone ? (
                <a
                  href={whatsappHref(
                    contact.whatsapp || contact.phone,
                    `Hello ${contact.contactName}, it's Jozi Dairy following up on your dairy enquiry.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-jozi-green px-3 text-sm font-semibold text-jozi-white transition hover:bg-jozi-green-light"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

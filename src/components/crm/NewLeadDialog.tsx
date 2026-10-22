"use client";

import React, { useEffect, useState } from "react";
import { LoaderCircle, PhoneIncoming, X } from "lucide-react";
import { PRODUCTS } from "@/data/dairyData";
import {
  BUSINESS_TYPES,
  Lead,
  LEAD_OWNERS,
  LEAD_SOURCES,
  SOURCE_LABELS,
} from "@/lib/crm/types";
import { apiFetch, todayIso } from "./crmUi";

interface NewLeadDialogProps {
  onClose: () => void;
  onCreated: (lead: Lead, merged: boolean) => void;
  /** Pre-fills the name field for the signed-in rep's own attribution. */
  defaultOwner: string;
}

/**
 * Capture form built for taking details down live on a phone call: name and
 * number first, everything else optional.
 */
export default function NewLeadDialog({
  onClose,
  onCreated,
  defaultOwner,
}: NewLeadDialogProps) {
  const [contactName, setContactName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [suburb, setSuburb] = useState("");
  const [source, setSource] = useState("PHONE_CALL");
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [products, setProducts] = useState<string[]>([]);
  const [estimatedVolume, setEstimatedVolume] = useState("");
  const [deliveryFrequency, setDeliveryFrequency] = useState("");
  const [estimatedMonthlyValue, setEstimatedMonthlyValue] = useState("");
  const [owner, setOwner] = useState(
    LEAD_OWNERS.includes(defaultOwner as (typeof LEAD_OWNERS)[number])
      ? defaultOwner
      : "Ashley (Sales)"
  );
  const [nextFollowUpAt, setNextFollowUpAt] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const toggleProduct = (name: string) => {
    setProducts((current) =>
      current.includes(name)
        ? current.filter((entry) => entry !== name)
        : [...current, name]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const data = await apiFetch<{ lead: Lead; merged: boolean }>(
        "/api/crm/leads",
        {
          method: "POST",
          body: JSON.stringify({
            contactName,
            company,
            phone,
            email,
            suburb,
            source,
            businessType,
            productsInterested: products,
            estimatedVolume,
            deliveryFrequency,
            estimatedMonthlyValue: Number(estimatedMonthlyValue) || 0,
            owner,
            nextFollowUpAt: nextFollowUpAt || null,
            message,
          }),
        }
      );
      onCreated(data.lead, data.merged);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not save that lead."
      );
      setBusy(false);
    }
  };

  const fieldClass =
    "mt-1.5 min-h-[48px] w-full rounded-xl border border-jozi-navy/15 bg-white px-3 text-sm text-jozi-navy outline-none transition focus:border-jozi-cyan focus:ring-2 focus:ring-jozi-cyan/25";
  const labelClass = "text-xs font-semibold text-jozi-navy/70";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <div
        className="fixed inset-0 bg-jozi-navy-dark/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-label="Log a new lead"
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-jozi-navy/10 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-jozi-cyan/15">
              <PhoneIncoming
                className="h-5 w-5 text-jozi-cyan"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-jozi-navy">
                Log a new lead
              </h2>
              <p className="text-sm text-jozi-navy/60">
                Name and a contact number are all you need to start.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-jozi-navy/50 transition hover:bg-jozi-tint hover:text-jozi-navy"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
          {error ? (
            <p
              role="alert"
              className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>
                Contact name <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                required
                autoFocus
                value={contactName}
                onChange={(event) => setContactName(event.target.value)}
                placeholder="e.g. Thabo Mokoena"
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Business name</span>
              <input
                type="text"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                placeholder="e.g. Corner Cafe Midrand"
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="e.g. 065 234 2460"
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="e.g. orders@cornercafe.co.za"
                className={fieldClass}
              />
            </label>
          </div>

          <p className="mt-2 text-xs text-jozi-navy/50">
            Capture a phone number or an email — the team needs at least one way
            to reach them.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Suburb / area</span>
              <input
                type="text"
                value={suburb}
                onChange={(event) => setSuburb(event.target.value)}
                placeholder="e.g. Halfway House, Midrand"
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>How did they reach us?</span>
              <select
                value={source}
                onChange={(event) => setSource(event.target.value)}
                className={fieldClass}
              >
                {LEAD_SOURCES.map((entry) => (
                  <option key={entry} value={entry}>
                    {SOURCE_LABELS[entry]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>Business type</span>
              <select
                value={businessType}
                onChange={(event) => setBusinessType(event.target.value as typeof businessType)}
                className={fieldClass}
              >
                {BUSINESS_TYPES.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className={labelClass}>Assign to</span>
              <select
                value={owner}
                onChange={(event) => setOwner(event.target.value)}
                className={fieldClass}
              >
                {LEAD_OWNERS.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <fieldset className="mt-5">
            <legend className={labelClass}>Products of interest</legend>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {PRODUCTS.map((product) => (
                <button
                  key={product.name}
                  type="button"
                  onClick={() => toggleProduct(product.name)}
                  aria-pressed={products.includes(product.name)}
                  className={`min-h-[36px] rounded-full px-3 text-xs font-semibold transition ${
                    products.includes(product.name)
                      ? "bg-jozi-navy text-jozi-white"
                      : "bg-jozi-tint-card text-jozi-navy/70 hover:bg-jozi-cyan/15"
                  }`}
                >
                  {product.name}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="block">
              <span className={labelClass}>Volume</span>
              <input
                type="text"
                value={estimatedVolume}
                onChange={(event) => setEstimatedVolume(event.target.value)}
                placeholder="e.g. 10 crates / week"
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Delivery days</span>
              <input
                type="text"
                value={deliveryFrequency}
                onChange={(event) => setDeliveryFrequency(event.target.value)}
                placeholder="e.g. Mon, Wed, Fri"
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Est. value / month (R)</span>
              <input
                type="number"
                min="0"
                step="100"
                inputMode="decimal"
                value={estimatedMonthlyValue}
                onChange={(event) => setEstimatedMonthlyValue(event.target.value)}
                placeholder="0"
                className={fieldClass}
              />
            </label>
          </div>

          <label className="mt-5 block">
            <span className={labelClass}>What did they ask for?</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={3}
              placeholder="Notes from the call — this becomes the first entry on the lead's timeline."
              className="mt-1.5 w-full resize-y rounded-xl border border-jozi-navy/15 px-3 py-2.5 text-sm text-jozi-navy outline-none transition focus:border-jozi-cyan focus:ring-2 focus:ring-jozi-cyan/25"
            />
          </label>

          <label className="mt-4 block sm:max-w-xs">
            <span className={labelClass}>Next follow-up</span>
            <input
              type="date"
              value={nextFollowUpAt}
              min={todayIso()}
              onChange={(event) => setNextFollowUpAt(event.target.value)}
              className={fieldClass}
            />
          </label>
        </div>

        <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-jozi-navy/10 bg-jozi-tint/60 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] rounded-xl px-5 text-sm font-semibold text-jozi-navy/70 transition hover:bg-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-jozi-cyan px-6 text-sm font-semibold text-jozi-white transition hover:bg-jozi-cyan-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : null}
            Save lead
          </button>
        </footer>
      </form>
    </div>
  );
}

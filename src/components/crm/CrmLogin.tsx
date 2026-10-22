"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, LoaderCircle, Milk } from "lucide-react";

export default function CrmLogin() {
  const router = useRouter();
  const [staffName, setStaffName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/crm/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffName, passcode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Could not sign you in.");
        setBusy(false);
        return;
      }

      // Refresh so the server component picks up the new session cookie.
      router.replace("/crm");
      router.refresh();
    } catch {
      setError("Network error. Check that the dev server is still running.");
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-jozi-navy px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-jozi-cyan shadow-glow">
            <Milk className="h-7 w-7 text-jozi-white" aria-hidden="true" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold text-jozi-white">
            Jozi Dairy CRM
          </h1>
          <p className="mt-2 text-sm text-jozi-white/60">
            Lead and contact management for the sales team
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-jozi-white p-7 shadow-card"
        >
          <label
            htmlFor="staffName"
            className="block text-sm font-semibold text-jozi-navy"
          >
            Your name
          </label>
          <input
            id="staffName"
            type="text"
            value={staffName}
            onChange={(event) => setStaffName(event.target.value)}
            required
            autoComplete="name"
            placeholder="e.g. Ashley"
            className="mt-2 min-h-[48px] w-full rounded-xl border border-jozi-navy/15 px-4 text-jozi-navy outline-none transition focus:border-jozi-cyan focus:ring-2 focus:ring-jozi-cyan/30"
          />
          <p className="mt-2 text-xs text-jozi-navy/50">
            Calls and notes you log are saved under this name.
          </p>

          <label
            htmlFor="passcode"
            className="mt-6 block text-sm font-semibold text-jozi-navy"
          >
            Team passcode
          </label>
          <input
            id="passcode"
            type="password"
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            required
            autoComplete="current-password"
            className="mt-2 min-h-[48px] w-full rounded-xl border border-jozi-navy/15 px-4 text-jozi-navy outline-none transition focus:border-jozi-cyan focus:ring-2 focus:ring-jozi-cyan/30"
          />

          {error ? (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="mt-7 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-jozi-cyan font-semibold text-jozi-white transition hover:bg-jozi-cyan-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? (
              <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <Lock className="h-4 w-4" aria-hidden="true" />
            )}
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}

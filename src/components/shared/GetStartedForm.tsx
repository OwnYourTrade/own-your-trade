"use client";

import { useState } from "react";
import { verticals } from "@/config/verticals";

export default function GetStartedForm({
  source = "hub",
  defaultTrade = "",
  compact = false,
}: {
  source?: string;
  defaultTrade?: string;
  compact?: boolean;
}) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    trade: defaultTrade,
    message: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source }),
      });
    } catch {
      /* demo: still confirm to the user */
    }
    setBusy(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="ticket p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ledger text-paper">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h3 className="mt-4 font-display text-2xl font-extrabold text-ink">
          Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""} — got it.
        </h3>
        <p className="mt-2 text-ink-soft">
          I&apos;ll come back within a day with a straight answer on whether it&apos;s worth it
          for {form.business || "you"} — no hard sell.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="ticket p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" value={form.name} onChange={(v) => set("name", v)} required />
        <Field label="Business name" value={form.business} onChange={(v) => set("business", v)} placeholder="Optional" />
        <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} required />
        <Field label="Phone" type="tel" value={form.phone} onChange={(v) => set("phone", v)} placeholder="Optional" />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-ink">Your trade</label>
        <select
          value={form.trade}
          onChange={(e) => set("trade", e.target.value)}
          className="w-full rounded-md border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-stamp focus:ring-2 focus:ring-stamp/20"
        >
          <option value="">Select…</option>
          {verticals.map((v) => (
            <option key={v.slug} value={v.trade}>{v.trade}</option>
          ))}
          <option value="Other">Something else</option>
        </select>
      </div>

      {!compact && (
        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-ink">Anything you want to know?</label>
          <textarea
            rows={3}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="Tell me a bit about how you take orders or bookings now."
            className="w-full rounded-md border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-stamp focus:ring-2 focus:ring-stamp/20"
          />
        </div>
      )}

      <button type="submit" disabled={busy} className="btn-primary mt-6 w-full">
        {busy ? "Sending…" : "Send enquiry"}
      </button>
      <p className="mt-3 text-center text-xs text-ink-soft/70">
        Just a question — no obligation. Ready to buy?{" "}
        <a href="/get-started" className="font-semibold text-stamp hover:underline">Get started →</a>
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label} {required && <span className="text-stamp">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-stamp focus:ring-2 focus:ring-stamp/20"
      />
    </div>
  );
}

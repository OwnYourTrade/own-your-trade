"use client";

import { useEffect, useMemo, useState } from "react";
import { verticals } from "@/config/verticals";
import { site } from "@/config/site";
import TradeIcon from "./TradeIcon";
import Honeypot from "./Honeypot";

const cur = site.currency;

export default function SignupForm() {
  const [trade, setTrade] = useState<string>("");
  const [tierId, setTierId] = useState<string>("growth");
  const [canceled, setCanceled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    business: "",
    name: "",
    email: "",
    phone: "",
    area: "",
    domain: "",
    website: "",
    notes: "",
    company_url: "", // spam honeypot — humans leave this blank
  });

  // Pre-select trade/tier from the query (?trade=&tier=), and canceled notice.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get("trade");
    const tr = p.get("tier");
    if (t && verticals.some((v) => v.slug === t)) setTrade(t);
    if (tr && site.pricing.tiers.some((x) => x.id === tr)) setTierId(tr);
    if (p.get("canceled") === "1") setCanceled(true);
  }, []);

  const tier = site.pricing.tiers.find((t) => t.id === tierId)!;
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const ready = useMemo(
    () => Boolean(trade && form.business.trim() && form.name.trim() && form.email.trim() && form.phone.trim() && form.area.trim()),
    [trade, form]
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trade, tier: tierId, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setBusy(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <Honeypot value={form.company_url} onChange={(v) => set("company_url", v)} />
      <div className="space-y-8">
        {canceled && (
          <div className="rounded-xl border border-ledger/40 bg-ledger/10 px-5 py-3 text-sm text-ink">
            No payment was taken — your details are still here whenever you&apos;re ready.
          </div>
        )}

        {/* 1. Trade */}
        <Step n={1} title="Pick your trade">
          <div className="flex flex-wrap gap-2">
            {verticals.map((v) => (
              <button
                type="button"
                key={v.slug}
                onClick={() => setTrade(v.slug)}
                className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition ${
                  trade === v.slug ? "border-stamp bg-stamp/5 text-ink" : "border-ink/10 text-ink-soft hover:border-ink/25"
                }`}
              >
                <TradeIcon name={v.icon} className="h-4 w-4" />
                {v.trade}
              </button>
            ))}
          </div>
        </Step>

        {/* 2. Tier */}
        <Step n={2} title="Pick your plan">
          <div className="grid gap-3 sm:grid-cols-3">
            {site.pricing.tiers.map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setTierId(t.id)}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  tierId === t.id ? "border-stamp bg-stamp/5" : "border-ink/10 hover:border-ink/25"
                }`}
              >
                <span className="flex items-center justify-between">
                  <span className="font-display font-bold text-ink">{t.name}</span>
                  {t.highlight && <span className="rounded-full bg-stamp px-2 py-0.5 text-[9px] font-bold uppercase text-paper">Popular</span>}
                </span>
                <span className="tnum mt-2 block font-mono text-xl font-bold text-ink">{cur}{t.monthly}<span className="text-xs font-normal text-ink-soft">/mo</span></span>
                <span className="mt-1 block text-xs text-ink-soft">{t.setup > 0 ? `+ ${cur}${t.setup} setup` : "No setup fee"}</span>
              </button>
            ))}
          </div>
        </Step>

        {/* 3. Details */}
        <Step n={3} title="Your details">
          <p className="-mt-2 mb-4 text-sm text-ink-soft">
            Just the essentials to get started — we&apos;ll email you afterwards to collect your
            menu or services and any branding. No long questionnaire here.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Business name" value={form.business} onChange={(v) => set("business", v)} required />
            <Field label="Your name" value={form.name} onChange={(v) => set("name", v)} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} required />
            <Field label="Phone" type="tel" value={form.phone} onChange={(v) => set("phone", v)} required />
            <Field label="Business address or area" hint="Postcode or town" value={form.area} onChange={(v) => set("area", v)} required />
            <Field label="Preferred domain" hint="Optional — leave blank if unsure" value={form.domain} onChange={(v) => set("domain", v)} placeholder="yourbusiness.co.uk" />
            <div className="sm:col-span-2">
              <Field label="Existing website or social link" hint="Optional — helps us understand your setup" value={form.website} onChange={(v) => set("website", v)} placeholder="facebook.com/…  or  yoursite.co.uk" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Anything specific you want for your site or system?
                <span className="ml-1 font-normal text-ink-soft/70">· Optional</span>
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={4}
                placeholder="E.g. specific features, branding preferences, colours, anything you'd like us to know before we start."
                className="w-full resize-y rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm leading-relaxed outline-none transition focus:border-stamp focus:ring-2 focus:ring-stamp/20"
              />
            </div>
          </div>
        </Step>
      </div>

      {/* Summary */}
      <div>
        <div className="ticket sticky top-24 p-6">
          <p className="mono-label text-ink-soft">Your plan</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-ink">{tier.name}</p>
          <p className="mt-1 text-sm text-ink-soft">{tier.blurb}</p>

          <div className="my-5 space-y-2 border-y border-ink/10 py-4 text-sm">
            {tier.setup > 0 && (
              <Row k="One-off setup & build" v={`${cur}${tier.setup}`} />
            )}
            <Row k="First month" v={`${cur}${tier.monthly}`} />
            <div className="flex items-center justify-between pt-1 text-base font-bold text-ink">
              <span>Due today</span>
              <span className="tnum font-mono">{cur}{tier.setup + tier.monthly}</span>
            </div>
          </div>
          <p className="text-xs text-ink-soft">Then {cur}{tier.monthly}/month. No commission, cancel anytime.</p>

          {error && <p className="mt-4 rounded-xl bg-stamp/10 px-4 py-2.5 text-sm text-stamp">{error}</p>}

          <button type="submit" disabled={!ready || busy} className="btn-gold mt-5 w-full">
            {busy ? "Starting…" : `Continue — ${cur}${tier.setup + tier.monthly} today`}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
            <LockIcon /> Secure payment via Stripe (test mode)
          </p>
        </div>
      </div>
    </form>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-ink font-mono text-xs font-bold text-paper">{n}</span>
        <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-ink-soft">
      <span>{k}</span>
      <span className="tnum font-mono text-ink">{v}</span>
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  hint?: string;
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
        {hint && <span className="ml-1 font-normal text-ink-soft/70">· {hint}</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-stamp focus:ring-2 focus:ring-stamp/20"
      />
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

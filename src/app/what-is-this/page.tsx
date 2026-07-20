import type { Metadata } from "next";
import Link from "next/link";
import HubShell from "@/components/shared/HubShell";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "What is this?",
  description:
    "Own Your Trade in plain terms: your own ordering or booking site, built on a proven system, live in under 2 weeks, with no commission.",
};

const plain = [
  {
    title: "Your own site",
    body: "Branded to you — your name, your look, your domain (from Growth up). Not a listing on someone else's marketplace.",
  },
  {
    title: "A proven system",
    body: "Real online ordering or booking that works, already built and tested across five trades — not a fragile plugin bolted onto a template.",
  },
  {
    title: "A live dashboard",
    body: "Orders and bookings land on your screen in real time. You run them New → In progress → Done. No printer roll, no lost tickets.",
  },
  {
    title: "No commission",
    body: "One flat monthly fee. Card payments go through Stripe straight to your own bank — you keep the full value, minus only the standard card fee.",
  },
];

export default function WhatIsThisPage() {
  return (
    <HubShell heroTone="light">
      {/* Hero */}
      <section className="relative overflow-hidden bg-paper">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-stamp/10 blur-3xl" />
        <div className="container-x relative pt-32 pb-16 sm:pt-36">
          <p className="eyebrow">Own Your Trade — what is this?</p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-extrabold leading-[1.03] tracking-tight text-ink sm:text-6xl">
            Your own ordering or booking site, on a proven system.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            In one sentence: you get your own site, built on a system that already works, live in
            under two weeks — and you never pay commission. That&apos;s the whole thing. No app to
            download, no marketplace, no cut of every order.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {site.claims.map((c) => (
              <span key={c} className="claim-badge"><span className="text-ledger">✓</span> {c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* In plain terms */}
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">In plain terms</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              What you actually get.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {plain.map((p) => (
              <div key={p.title} className="ticket p-6">
                <h3 className="font-display text-xl font-bold text-ink">{p.title}</h3>
                <p className="mt-2 text-ink-soft">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — bold full-bleed brand-green block */}
      <section id="how" className="relative overflow-hidden brand-block text-paper">
        <div className="container-x relative py-20 sm:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow text-paper/70">How it works</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Four steps. That&apos;s the whole loop.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {site.steps.map((s) => (
              <div key={s.n}>
                <span className="tnum font-mono text-3xl font-bold text-ledger-light">{s.n}</span>
                <h3 className="mt-3 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-paper/70">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Honesty */}
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <div className="ticket p-8">
            <h3 className="font-display text-2xl font-bold text-ink">Not built from scratch.</h3>
            <p className="mt-3 text-ink-soft">
              Each trade gets a proven, tested template — the same system running the live demos —
              customised with your name, branding, menu or services, and prices. That&apos;s a
              feature, not a shortcut: it&apos;s why it&apos;s affordable and live in under two
              weeks, and why it just works on day one.
            </p>
            <Link href="/templates" className="btn-primary mt-6">See the templates →</Link>
          </div>
          <div className="ticket p-8">
            <h3 className="font-display text-2xl font-bold text-ink">Not a website with no system.</h3>
            <p className="mt-3 text-ink-soft">
              The whole point is escaping commission by taking orders and bookings yourself. A
              pretty website with no ordering system doesn&apos;t do that — so we don&apos;t sell
              one. The site and the system are one thing.
            </p>
            <Link href="/#pricing" className="btn-outline mt-6">See pricing →</Link>
          </div>
        </div>
      </section>
    </HubShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import HubShell from "@/components/shared/HubShell";
import Reveal from "@/components/shared/Reveal";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "What we do",
  description:
    "We build online ordering and booking systems for local trades, plus affordable custom websites to run them on — one flat fee, no commission, live in under 2 weeks.",
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
      <section className="grain relative overflow-hidden bg-paper">
        {/* A look through the doorway into a real demo — the arch always frames
            something, it's never an empty shape */}
        <div className="arch-door absolute bottom-0 right-[6%] hidden h-[340px] w-[250px] overflow-hidden border-2 border-sand-dark/70 shadow-warm lg:block">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/oyt/barber-hero.jpg)" }} />
          <div className="absolute inset-x-0 bottom-0 bg-ink/70 px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-paper">
            Fade &amp; Co — a live demo
          </div>
        </div>
        <div className="container-x relative pt-32 pb-16 sm:pt-36">
          <Reveal>
            <p className="eyebrow">Own Your Trade — what we do</p>
            <h1 className="mt-6 max-w-3xl font-craft text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              We build ordering &amp; booking systems — and the websites to{" "}
              <span className="italic text-stamp">run them on.</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-6 max-w-2xl text-lg text-ink-soft">
              Plainly: we build online ordering and booking systems for local trades — takeaways,
              barbers, driving instructors, tutors and PTs — plus affordable, properly-built
              websites to run them on. You pay one flat monthly fee, not a cut of every job, so it
              costs less than the commission platforms from day one. Live in under two weeks.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {site.claims.map((c) => (
                <span key={c} className="claim-badge"><span className="text-ledger">✓</span> {c}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* In plain terms */}
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow">In plain terms</p>
              <h2 className="mt-3 font-craft text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                What you actually get.
              </h2>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {plain.map((p, i) => (
              <Reveal key={p.title} variant="scale" delay={80 + i * 70}>
                <div className={`card-craft flex h-full gap-5 rounded-2xl border p-6 shadow-warm ${i % 3 === 0 ? "border-sand-dark/60 bg-sand/50" : "border-sand-dark/70 bg-white"}`}>
                  <span className="icon-plate arch-top grid h-14 w-11 shrink-0 place-items-center bg-stamp/10 font-mono text-sm font-bold text-stamp">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-craft text-xl font-semibold text-ink">{p.title}</h3>
                    <p className="mt-2 text-ink-soft">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — bold full-bleed brand-green block */}
      <section id="how" className="grain relative overflow-hidden brand-block text-paper">
        <div className="container-x relative py-20 sm:py-24">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow eyebrow-light">How it works</p>
              <h2 className="mt-3 font-craft text-3xl font-semibold tracking-tight sm:text-4xl">
                Four steps. That&apos;s the whole loop.
              </h2>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {site.steps.map((s, i) => (
              <Reveal key={s.n} delay={80 + i * 80}>
                <div className="h-full rounded-2xl border-2 border-paper/20 p-5">
                  <span className="tnum font-mono text-3xl font-bold text-ledger-light">{s.n}</span>
                  <h3 className="mt-3 font-display text-lg font-bold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-paper/70">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Honesty */}
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <Reveal variant="scale">
            <div className="card-craft grain relative h-full rounded-2xl border border-sand-dark/60 bg-sand/50 p-8 shadow-warm">
              <h3 className="font-craft text-2xl font-semibold text-ink">Not built from scratch.</h3>
              <p className="mt-3 text-ink-soft">
                Each trade gets a proven, tested template — the same system running the live demos —
                customised with your name, branding, menu or services, and prices. That&apos;s a
                feature, not a shortcut: it&apos;s why it&apos;s affordable and live in under two
                weeks, and why it just works on day one.
              </p>
              <Link href="/templates" className="btn-primary mt-6">See the templates →</Link>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={100}>
            <div className="card-craft h-full rounded-2xl border border-sand-dark/70 bg-white p-8 shadow-warm">
              <h3 className="font-craft text-2xl font-semibold text-ink">Not a website with no system.</h3>
              <p className="mt-3 text-ink-soft">
                The whole point is escaping commission by taking orders and bookings yourself. A
                pretty website with no ordering system doesn&apos;t do that — so we don&apos;t sell
                one. The site and the system are one thing.
              </p>
              <Link href="/#pricing" className="btn-outline mt-6">See pricing →</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </HubShell>
  );
}

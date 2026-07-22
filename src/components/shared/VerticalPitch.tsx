import Link from "next/link";
import HubShell from "./HubShell";
import CommissionCalculator from "./CommissionCalculator";
import CompareTable from "./CompareTable";
import TierCards from "./TierCards";
import GetStartedForm from "./GetStartedForm";
import TradeIcon from "./TradeIcon";
import Reveal from "./Reveal";
import type { Vertical } from "@/config/verticals";

export default function VerticalPitch({ v }: { v: Vertical }) {
  return (
    <HubShell heroTone="dark">
      {/* Hero */}
      <section className="grain relative overflow-hidden bg-ink text-paper">
        <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: `url(${v.heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-stamp-dark/60" />
        <div className="container-x relative pt-32 pb-16 sm:pt-36 sm:pb-20">
          <Reveal>
            <div className="flex items-center gap-2 text-stamp-light">
              <TradeIcon name={v.icon} className="h-5 w-5" />
              <span className="eyebrow eyebrow-mint">Own Your Trade — {v.heroKicker}</span>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-5 max-w-3xl font-craft text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              {v.heroTitle}
            </h1>
          </Reveal>
          <Reveal delay={170}>
            <p className="mt-5 max-w-2xl text-lg text-paper/80">{v.heroSub}</p>
          </Reveal>
          <Reveal delay={250}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={v.demoPath} className="btn-gold">Open the live demo →</Link>
              <Link href="#compare" className="btn-outline !border-paper/30 !text-paper hover:!border-paper">
                See the comparison
              </Link>
            </div>
            <p className="mt-6 text-sm text-paper/60">
              Live example: <span className="font-semibold text-paper">{v.businessName}</span>
            </p>
          </Reveal>
        </div>
        {/* Amber threshold at the base of the hero */}
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-ledger/60" />
      </section>

      {/* Calculator for this trade */}
      <section className="grain relative border-b border-sand-dark/60 bg-sand/60 py-16">
        <div className="container-x">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow">The maths</p>
              <h2 className="mt-3 font-craft text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Here&apos;s what it&apos;s quietly costing you.
              </h2>
              <p className="mt-3 text-ink-soft">
                Set it to your own numbers. This is money off work you already do.
              </p>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={120}>
            <div className="mx-auto mt-8 max-w-4xl">
              <CommissionCalculator initialSlug={v.slug} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* See it in action — embedded demo */}
      <section className="py-16">
        <div className="container-x">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="eyebrow">See it in action</p>
                <h2 className="mt-3 font-craft text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  This is the real thing — try it right here.
                </h2>
                <p className="mt-3 text-ink-soft">
                  Not a screenshot. Place a real {v.slug === "takeaway" ? "test order" : "test booking"} below,
                  then look at what the owner sees.
                </p>
              </div>
              <div className="max-w-sm">
                <div className="flex flex-wrap gap-3">
                  <Link href={v.demoPath} className="btn-primary">Open full demo ↗</Link>
                  <Link href={v.dashboardPath} className="btn-outline">See {v.dashboardLabel} ↗</Link>
                </div>
                <p className="mt-3 text-sm text-ink-soft">
                  This is the live dashboard the owner sees — every{" "}
                  {v.slug === "takeaway" ? "order" : "booking"} lands here in real time, so you run
                  your day without juggling apps.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal variant="scale" delay={140}>
            <div className="mt-8 overflow-hidden rounded-2xl border border-sand-dark/70 shadow-warm-lg">
              <div className="flex items-center gap-1.5 border-b border-ink/10 bg-ink px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-paper/25" />
                <span className="h-2.5 w-2.5 rounded-full bg-paper/25" />
                <span className="h-2.5 w-2.5 rounded-full bg-paper/25" />
                <span className="ml-3 font-mono text-xs text-paper/60">{v.businessName} — live demo</span>
              </div>
              <iframe
                title={`${v.businessName} live demo`}
                src={v.demoPath}
                className="h-[680px] w-full bg-paper"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Comparison */}
      <section id="compare" className="grain relative border-y border-sand-dark/60 bg-sand/60 py-16">
        <div className="container-x">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow">Straight comparison</p>
              <h2 className="mt-3 font-craft text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Own Your Trade vs {v.competitors.join(" vs ")}
              </h2>
              <p className="mt-3 text-ink-soft">
                No spin. Filter by what matters to you, and see where the money goes.
              </p>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={120}>
            <div className="mt-8">
              <CompareTable competitors={v.competitors} rows={v.compareRows} saved={v.saved} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16">
        <div className="container-x">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Pricing for {v.trade.toLowerCase()}s</p>
              <h2 className="mt-3 font-craft text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                One flat fee. Pick your level.
              </h2>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={120}>
            <div className="mt-10">
              <TierCards />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact */}
      <section id="get-started" className="grain relative border-t border-sand-dark/60 bg-sand/60 py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div>
              <p className="eyebrow">Get started</p>
              <h2 className="mt-3 font-craft text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Own your {v.trade.toLowerCase()} bookings.
              </h2>
              <p className="mt-4 max-w-md text-ink-soft">
                Tell me how you take {v.calc.unitNoun} now and I&apos;ll come back with a straight
                answer on whether owning it yourself saves you money. Keep {v.saved.headline} — or
                don&apos;t, and I&apos;ll tell you that too.
              </p>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={120}>
            <GetStartedForm source={v.slug} defaultTrade={v.trade} />
          </Reveal>
        </div>
      </section>
    </HubShell>
  );
}

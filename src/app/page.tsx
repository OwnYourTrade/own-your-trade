import Link from "next/link";
import HubShell from "@/components/shared/HubShell";
import CommissionCalculator from "@/components/shared/CommissionCalculator";
import TierCards from "@/components/shared/TierCards";
import HeroPreviewInput from "@/components/shared/HeroPreviewInput";
import PhoneMockup from "@/components/shared/PhoneMockup";
import DemoTilesStrip from "@/components/shared/DemoTilesStrip";
import OwnedFactBlock from "@/components/shared/OwnedFactBlock";
import TradeIcon from "@/components/shared/TradeIcon";
import Reveal from "@/components/shared/Reveal";
import HeroArch from "@/components/shared/HeroArch";
import { verticals } from "@/config/verticals";

export default function HubHome() {
  const featured = verticals[0];
  const rest = verticals.slice(1);

  return (
    <HubShell heroTone="light">
      {/* ------------------------------------------------------------- Hero */}
      <section className="grain relative overflow-hidden bg-paper">
        <div className="container-x relative pt-32 text-center sm:pt-36">
          <Reveal>
            <p className="eyebrow">Own Your Trade — for independent local trades</p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mx-auto mt-6 max-w-5xl font-craft text-[2.6rem] font-semibold leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-[4.7rem]">
              Own your trade. Stop paying commission on customers you{" "}
              <span className="draw-underline italic text-stamp">already earned.</span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mx-auto mt-7 max-w-2xl text-lg text-ink-soft">
              The apps and platforms take 25–30% on people who already know your name. Get your own
              ordering or booking site, on a proven system — and keep the lot.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <HeroPreviewInput />
          </Reveal>
        </div>

        {/* Real product visual: the Northgate demo in a phone, standing in its own doorway */}
        <div className="relative mt-14 sm:mt-16">
          <HeroArch className="absolute inset-x-0 -top-2 bottom-0" />
          {/* The green doorway itself */}
          <div className="grain arch-top !absolute bottom-0 left-1/2 top-[4.5rem] w-[540px] max-w-[86vw] -translate-x-1/2 brand-block" />
          {/* Threshold line */}
          <div className="absolute bottom-0 left-1/2 h-[3px] w-[680px] max-w-[96vw] -translate-x-1/2 rounded-full bg-ledger/40" />
          <div className="container-x relative flex justify-center pb-12 pt-6">
            <div className="float-soft">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------- "What is this?" explainer (clickable) */}
      <div className="container-x relative z-10 -mt-9">
        <Reveal variant="scale">
          <Link
            href="/what-is-this"
            className="card-craft group mx-auto flex max-w-3xl items-center gap-4 rounded-2xl border border-sand-dark/70 bg-white p-4 shadow-warm hover:shadow-warm-lg sm:gap-5 sm:p-5"
          >
            <span className="icon-plate arch-top grid h-12 w-11 shrink-0 place-items-center bg-stamp/10 text-stamp">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-sm font-bold text-ink sm:text-base">What we do</span>
              <span className="mt-0.5 block text-sm text-ink-soft">
                Ordering &amp; booking systems for local trades, plus affordable custom websites — one flat fee, no commission.
              </span>
            </span>
            <span className="hidden shrink-0 whitespace-nowrap font-semibold text-stamp sm:inline">
              See how it works <span className="go-arrow">→</span>
            </span>
          </Link>
        </Reveal>
      </div>

      {/* --------------------------------------------------- Trade selector */}
      <section className="pb-20 pt-16 sm:pb-24 sm:pt-20">
        <div className="container-x">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Pick your trade</p>
              <h2 className="mt-3 font-craft text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Built for how your trade actually works.
              </h2>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
            {/* Featured trade — one tall card with the doorway motif */}
            <Reveal variant="scale" className="lg:row-span-2">
              <Link
                href={`/${featured.slug}`}
                className="card-craft grain group flex h-full flex-col rounded-2xl border border-sand-dark/70 bg-white p-6 shadow-warm hover:shadow-warm-lg sm:p-7"
              >
                <span className="icon-plate arch-top grid h-20 w-16 place-items-center bg-stamp text-paper">
                  <TradeIcon name={featured.icon} className="h-8 w-8" />
                </span>
                <p className="mt-6 font-craft text-2xl font-semibold leading-tight text-ink">{featured.trade}</p>
                <p className="mt-1 text-sm text-ink-soft">{featured.selectorSub}</p>
                {/* The trade's real photo, framed in the doorway motif */}
                <div
                  className="arch-top mt-5 min-h-[180px] flex-1 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.015]"
                  style={{ backgroundImage: `url(${featured.heroImage})` }}
                />
                <p className="pt-6 font-mono text-xs uppercase tracking-[0.1em] text-clay">
                  Keep {featured.saved.headline} <span className="go-arrow">→</span>
                </p>
              </Link>
            </Reveal>

            {/* The other four — varied fills, same doorway icon plates */}
            {rest.map((v, i) => (
              <Reveal key={v.slug} variant="scale" delay={80 + i * 70}>
                <Link
                  href={`/${v.slug}`}
                  className={`card-craft group flex h-full flex-col rounded-2xl border p-5 shadow-warm hover:shadow-warm-lg ${
                    i % 2 === 0 ? "border-sand-dark/60 bg-sand/50" : "border-sand-dark/70 bg-white"
                  }`}
                >
                  <span className="icon-plate arch-top grid h-12 w-10 place-items-center bg-stamp/10 text-stamp transition-colors group-hover:bg-stamp group-hover:text-paper">
                    <TradeIcon name={v.icon} className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-display text-base font-bold leading-tight text-ink">{v.trade}</p>
                  <p className="mt-0.5 text-xs text-ink-soft">{v.selectorSub}</p>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-clay">
                    Keep {v.saved.headline} <span className="go-arrow">→</span>
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------- Full-bleed demo-tiles strip */}
      <DemoTilesStrip />

      {/* ------------------------------------------------------- Calculator */}
      <section id="calculator" className="grain border-y border-sand-dark/60 bg-sand/60 py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">The commission counter</p>
              <h2 className="mt-3 font-craft text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                See exactly what the apps and platforms take.
              </h2>
              <p className="mt-3 text-ink-soft">
                Pick your trade, set your numbers, watch the yearly total. Real maths, no fine print.
              </p>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={120}>
            <div className="mx-auto mt-10 max-w-4xl">
              <CommissionCalculator initialSlug="takeaway" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------- Green colour-block + facts */}
      <OwnedFactBlock />

      {/* ---------------------------------------------------------- Pricing */}
      <section id="pricing" className="py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Simple pricing</p>
              <h2 className="mt-3 font-craft text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                One flat fee. No commission. Pick your level.
              </h2>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={120}>
            <div className="mt-12">
              <TierCards />
            </div>
          </Reveal>
        </div>
      </section>
    </HubShell>
  );
}

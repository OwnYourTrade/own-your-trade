import Link from "next/link";
import HubShell from "@/components/shared/HubShell";
import CommissionCalculator from "@/components/shared/CommissionCalculator";
import TierCards from "@/components/shared/TierCards";
import HeroPreviewInput from "@/components/shared/HeroPreviewInput";
import PhoneMockup from "@/components/shared/PhoneMockup";
import DemoTilesStrip from "@/components/shared/DemoTilesStrip";
import OwnedFactBlock from "@/components/shared/OwnedFactBlock";
import TradeIcon from "@/components/shared/TradeIcon";
import { verticals } from "@/config/verticals";

export default function HubHome() {
  return (
    <HubShell heroTone="light">
      {/* ------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden bg-paper">
        {/* soft organic blurred blobs bleeding from the edges */}
        <div className="pointer-events-none absolute -left-52 top-24 h-[34rem] w-[34rem] rounded-full bg-stamp/20 blur-[110px]" />
        <div className="pointer-events-none absolute -right-52 top-40 h-[30rem] w-[30rem] rounded-full bg-ledger/20 blur-[110px]" />

        <div className="container-x relative pt-32 text-center sm:pt-36">
          <p className="eyebrow">Own Your Trade — for independent local trades</p>

          <h1 className="mx-auto mt-6 max-w-5xl font-display text-[2.7rem] font-bold leading-[1.0] tracking-tight text-ink sm:text-6xl lg:text-[5rem]">
            Own your trade. Stop paying commission on customers you already earned.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg text-ink-soft">
            The apps and platforms take 25–30% on people who already know your name. Get your own
            ordering or booking site, on a proven system — and keep the lot.
          </p>

          <HeroPreviewInput />
        </div>

        {/* Real product visual: the Northgate demo in a phone, over a green panel */}
        <div className="relative mt-16 sm:mt-20">
          <div className="absolute inset-x-0 bottom-0 top-36 brand-block rounded-t-[3rem]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-paper to-transparent" />
          <div className="container-x relative flex justify-center pb-10 pt-4">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ---------------------------- "What is this?" explainer (clickable) */}
      <div className="container-x relative z-10 -mt-9">
        <Link
          href="/what-is-this"
          className="group mx-auto flex max-w-3xl items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4 shadow-lift transition duration-200 hover:-translate-y-0.5 sm:gap-5 sm:p-5"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-stamp/10 text-stamp">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-sm font-bold text-ink sm:text-base">What is Own Your Trade?</span>
            <span className="mt-0.5 block text-sm text-ink-soft">
              Your own ordering or booking site, on a proven system, live in under 2 weeks — no commission.
            </span>
          </span>
          <span className="hidden shrink-0 whitespace-nowrap font-semibold text-stamp group-hover:underline sm:inline">
            See how it works →
          </span>
        </Link>
      </div>

      {/* --------------------------------------------------- Trade selector */}
      <section className="pb-20 pt-16 sm:pb-24 sm:pt-20">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Pick your trade</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Built for how your trade actually works.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {verticals.map((v) => (
              <Link
                key={v.slug}
                href={`/${v.slug}`}
                className="hover-lift group rounded-2xl border border-ink/10 bg-white p-5"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-stamp/10 text-stamp transition group-hover:bg-stamp group-hover:text-paper">
                  <TradeIcon name={v.icon} className="h-6 w-6" />
                </span>
                <p className="mt-4 font-display text-base font-bold leading-tight text-ink">{v.trade}</p>
                <p className="mt-0.5 text-xs text-ink-soft">{v.selectorSub}</p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-ledger-dark">
                  Keep {v.saved.headline} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------- Full-bleed demo-tiles strip */}
      <DemoTilesStrip />

      {/* ------------------------------------------------------- Calculator */}
      <section id="calculator" className="border-y border-ink/10 bg-paper-dark/40 py-20 sm:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">The commission counter</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              See exactly what the apps and platforms take.
            </h2>
            <p className="mt-3 text-ink-soft">
              Pick your trade, set your numbers, watch the yearly total. Real maths, no fine print.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-4xl">
            <CommissionCalculator initialSlug="takeaway" />
          </div>
        </div>
      </section>

      {/* --------------------------------------- Green colour-block + facts */}
      <OwnedFactBlock />

      {/* ---------------------------------------------------------- Pricing */}
      <section id="pricing" className="py-20 sm:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Simple pricing</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              One flat fee. No commission. Pick your level.
            </h2>
          </div>
          <div className="mt-12">
            <TierCards />
          </div>
        </div>
      </section>
    </HubShell>
  );
}

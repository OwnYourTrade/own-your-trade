import Link from "next/link";
import { verticals } from "@/config/verticals";
import TradeIcon from "./TradeIcon";

/**
 * Full-bleed, edge-to-edge row of demo-template tiles with a bottom-gradient
 * £-saved overlay — the Owner.com "grow sales like these owners" pattern, with
 * our real demo businesses and honest calculator-derived figures.
 *
 * All five tiles fit the viewport on desktop (basis-1/5, no clipping); on
 * smaller screens the row scrolls horizontally with a fade-edge hint.
 */
export default function DemoTilesStrip() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-x mb-8">
        <p className="eyebrow">Real, working templates</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Keep money like these five would.
        </h2>
        <p className="mt-3 max-w-xl text-ink-soft">
          Not customers — our own live demos, each showing the honest yearly saving from the
          calculator. Open any of them.
        </p>
      </div>

      <div className="relative">
        <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
          {verticals.map((v) => (
            <Link
              key={v.slug}
              href={v.demoPath}
              className="group relative h-[400px] shrink-0 basis-[78%] snap-start overflow-hidden sm:basis-1/3 lg:basis-1/5"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${v.heroImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent" />
              <div className="absolute inset-x-0 top-0 p-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/75 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-paper backdrop-blur-sm">
                  <TradeIcon name={v.icon} className="h-3.5 w-3.5" /> {v.trade}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-paper">
                <p className="tnum font-display text-3xl font-extrabold leading-none text-paper">
                  {v.saved.headline.replace(/^(about|around) /i, "")}
                </p>
                <p className="mt-1.5 text-sm text-paper/70">kept, not paid in commission</p>
                <p className="mt-4 font-semibold">{v.businessName}</p>
                <p className="mt-0.5 text-sm font-semibold text-ledger-light underline-offset-4 group-hover:underline">
                  Open the live demo →
                </p>
              </div>
            </Link>
          ))}
        </div>
        {/* scroll hint — only meaningful on smaller screens where the row overflows */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-paper to-transparent lg:hidden" />
      </div>

      <p className="container-x mt-4 text-xs text-ink-soft">
        £ figures are honest estimates from the commission calculator, not client results — Own
        Your Trade is a new service and doesn&apos;t invent testimonials or stats.
      </p>
    </section>
  );
}

import Link from "next/link";
import { site } from "@/config/site";

function gbp(n: number) {
  return `${site.currency}${n}`;
}

export default function TierCards() {
  return (
    <div>
      <div className="grid gap-5 lg:grid-cols-3">
        {site.pricing.tiers.map((t) => (
          <div
            key={t.id}
            className={`ticket hover-lift relative flex flex-col p-6 ${
              t.highlight ? "ring-2 ring-stamp" : ""
            }`}
          >
            {t.highlight && (
              <span className="absolute -top-3 left-6 rounded bg-stamp px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-paper">
                Most popular
              </span>
            )}
            <h3 className="font-display text-xl font-extrabold text-ink">{t.name}</h3>
            <p className="mt-1.5 min-h-[2.5rem] text-sm text-ink-soft">{t.blurb}</p>

            <div className="mt-4 flex items-end gap-1">
              <span className="tnum font-mono text-4xl font-bold text-ink">{gbp(t.monthly)}</span>
              <span className="mb-1 text-sm text-ink-soft">/ month</span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              {t.setup > 0 ? `+ ${gbp(t.setup)} one-off setup` : "No setup fee"} ·{" "}
              <span className="font-mono">{t.domain}</span>
            </p>

            <ul className="mt-5 space-y-2 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-ink">
                  <span className="mt-0.5 text-ledger">✓</span>
                  <span>{f}</span>
                </li>
              ))}
              {t.notIncluded.map((f) => (
                <li key={f} className="flex items-start gap-2 text-ink-soft/60 line-through">
                  <span className="mt-0.5">✕</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/get-started?tier=${t.id}`}
              className={`mt-6 ${t.highlight ? "btn-gold" : "btn-outline"} w-full`}
            >
              {t.cta}
            </Link>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-5 max-w-2xl text-center text-sm text-ink-soft">
        {site.pricing.note}
      </p>
    </div>
  );
}

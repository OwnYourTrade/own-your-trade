import type { Metadata } from "next";
import Link from "next/link";
import HubShell from "@/components/shared/HubShell";
import SitePreview from "@/components/shared/SitePreview";
import { verticals } from "@/config/verticals";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Every trade gets a proven, tested template — customised with your name, branding, menu or services, and prices. See the live examples.",
};

const customisation = [
  { title: "Your name & branding", body: "Your business name, colours and photos throughout — it looks like you, not us." },
  { title: "Your menu or services", body: "Your dishes and prices, or your services, durations and rates — set up for you." },
  { title: "Your domain", body: "Live on your own domain from the Growth plan up, set up and pointed for you." },
  { title: "Your pricing", body: "Delivery rules, deposits, slots and opening hours configured to how you actually run." },
];

export default function TemplatesPage() {
  return (
    <HubShell heroTone="light">
      {/* Hero */}
      <section className="relative overflow-hidden bg-paper">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-ledger/15 blur-3xl" />
        <div className="container-x relative pt-32 pb-16 sm:pt-36">
          <p className="eyebrow">Own Your Trade — templates</p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-extrabold leading-[1.03] tracking-tight text-ink sm:text-6xl">
            A proven template, made yours.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            Every trade gets a tested template — the exact system running the live demos below —
            customised with your name, branding, menu or services, and prices. Proven and tested,
            not an experiment on your business. That&apos;s why it&apos;s affordable and live fast.
          </p>
        </div>
      </section>

      {/* Full-bleed demo tiles */}
      <section className="py-6">
        <div className="mb-6 container-x">
          <p className="eyebrow">Live examples</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            Five real, working templates. Try any of them.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-5">
          {verticals.map((v) => (
            <Link key={v.slug} href={v.demoPath} className="group relative block h-72 overflow-hidden bg-ink">
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${v.heroImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-paper">
                <span className="inline-flex items-center rounded-full bg-ink/75 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-paper backdrop-blur-sm">{v.trade}</span>
                <p className="mt-2 font-display text-lg font-extrabold leading-tight">{v.businessName}</p>
                <p className="tnum mt-1 font-mono text-sm font-bold text-ledger-light">Keeps {v.saved.headline}</p>
                <p className="mt-3 text-xs font-semibold text-paper/80 underline-offset-4 group-hover:underline">Open the live demo →</p>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-4 container-x text-xs text-ink-soft">
          £ figures are honest estimates from the commission calculator, not client results —
          we&apos;re a new service and don&apos;t invent testimonials or stats.
        </p>
      </section>

      {/* What customisation looks like */}
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow">What customisation looks like</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Same proven engine. Unmistakably your business.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {customisation.map((c) => (
              <div key={c.title} className="ticket p-6">
                <h3 className="font-display text-lg font-bold text-ink">{c.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive preview */}
      <section className="border-y border-ink/10 bg-paper-dark/40 py-16 sm:py-20">
        <div className="container-x">
          <SitePreview initialSlug="takeaway" />
        </div>
      </section>
    </HubShell>
  );
}

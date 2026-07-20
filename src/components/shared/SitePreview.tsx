"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { verticals } from "@/config/verticals";
import TradeIcon from "./TradeIcon";

const FLAVOURS: Record<string, { tag: string; cta: string; blurb: string }> = {
  takeaway: { tag: "Order online", cta: "Start your order", blurb: "Collection & delivery · open till late" },
  driving: { tag: "Book a lesson", cta: "Check availability", blurb: "Manual & automatic · patient instructors" },
  barber: { tag: "Book a chair", cta: "Pick a time", blurb: "Fades · beard work · walk-ins welcome" },
  tutor: { tag: "Book a session", cta: "Find a slot", blurb: "One-to-one tuition · KS2 to GCSE" },
  pt: { tag: "Book a session", cta: "Get started", blurb: "1-to-1 coaching · small groups" },
};

export default function SitePreview({ initialSlug = "takeaway" }: { initialSlug?: string }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState(initialSlug);

  // Pre-fill from ?name= so the hero "preview" box can carry a typed name here.
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get("name");
      if (p && p.trim()) setName(p.trim());
    } catch {
      /* ignore */
    }
  }, []);
  const active = verticals.find((v) => v.slug === slug) ?? verticals[0];
  const flavour = FLAVOURS[slug] ?? FLAVOURS.takeaway;
  const shown = name.trim() || active.businessName;
  const demoHref = `${active.demoPath}${name.trim() ? `?name=${encodeURIComponent(name.trim())}` : ""}`;

  return (
    <div className="grid items-center gap-8 lg:grid-cols-2">
      <div>
        <p className="eyebrow">Preview your site</p>
        <h3 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
          Type your name. See it become a site.
        </h3>
        <p className="mt-3 max-w-md text-ink-soft">
          This is the idea in ten seconds: your name over the top, your customers ordering
          or booking underneath. Try it, then open the real thing — it carries your name through.
        </p>

        <label className="mt-6 block text-sm font-medium text-ink">Your business name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={active.businessName}
          className="mt-2 w-full rounded-full border border-ink/15 bg-white px-5 py-3 text-lg font-semibold outline-none focus:border-stamp focus:ring-2 focus:ring-stamp/20"
        />

        <div className="mt-4 flex flex-wrap gap-1.5">
          {verticals.map((v) => (
            <button
              key={v.slug}
              onClick={() => setSlug(v.slug)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                v.slug === slug ? "bg-ink text-paper" : "bg-ink/5 text-ink-soft hover:bg-ink/10"
              }`}
            >
              <TradeIcon name={v.icon} className="h-3.5 w-3.5" />
              {v.trade}
            </button>
          ))}
        </div>

        <Link href={demoHref} className="btn-primary mt-6">
          Open the live {active.trade.toLowerCase()} demo →
        </Link>
      </div>

      {/* Mock browser */}
      <div className="ticket overflow-hidden">
        <div className="flex items-center gap-1.5 border-b border-ink/10 bg-paper/70 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
          <span className="ml-3 truncate font-mono text-xs text-ink-soft">
            {slugToDomain(shown)}
          </span>
        </div>

        {/* Fake site */}
        <div className="bg-white">
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3.5">
            <span className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
              <span className="grid h-7 w-7 place-items-center rounded bg-stamp text-paper">
                <TradeIcon name={active.icon} className="h-4 w-4" />
              </span>
              <span className="truncate">{shown}</span>
            </span>
            <span className="hidden rounded bg-stamp px-3 py-1.5 text-xs font-semibold text-paper sm:inline">
              {flavour.tag}
            </span>
          </div>
          <div className="relative">
            <div
              className="h-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${active.heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="font-display text-xl font-extrabold leading-tight text-paper">
                {shown}
              </p>
              <p className="mt-0.5 text-xs text-paper/80">{flavour.blurb}</p>
              <span className="mt-3 inline-block rounded bg-paper px-3 py-1.5 text-xs font-bold text-ink">
                {flavour.cta}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function slugToDomain(name: string) {
  const slug =
    name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 24) || "yourbusiness";
  return `${slug}.co.uk`;
}

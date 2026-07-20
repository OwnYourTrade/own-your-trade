"use client";

import { useMemo, useState } from "react";
import { verticals, type Vertical } from "@/config/verticals";
import { site } from "@/config/site";
import TradeIcon from "./TradeIcon";

const growth = site.pricing.tiers.find((t) => t.id === "growth")!;
const OYT_MONTHLY = growth.monthly;

function gbp(n: number, dp = 0) {
  return `${site.currency}${n.toLocaleString("en-GB", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  })}`;
}

export default function CommissionCalculator({
  initialSlug = "takeaway",
}: {
  initialSlug?: string;
}) {
  const [slug, setSlug] = useState(initialSlug);
  const active = (verticals.find((v) => v.slug === slug) ?? verticals[0]) as Vertical;

  const [volume, setVolume] = useState(active.calc.volume);
  const [avg, setAvg] = useState(active.calc.avg);
  const [rate, setRate] = useState(active.calc.commission);

  // When the trade changes, reset the inputs to that trade's realistic defaults.
  const selectTrade = (v: Vertical) => {
    setSlug(v.slug);
    setVolume(v.calc.volume);
    setAvg(v.calc.avg);
    setRate(v.calc.commission);
  };

  const volumeMax = useMemo(
    () => Math.max(200, Math.ceil((active.calc.volume * 2.5) / 50) * 50),
    [active]
  );

  const { monthlyLost, annualLost, annualKept } = useMemo(() => {
    const m = volume * avg * rate;
    const a = m * 12;
    const kept = a - OYT_MONTHLY * 12;
    return { monthlyLost: m, annualLost: a, annualKept: kept };
  }, [volume, avg, rate]);

  return (
    <div className="ticket overflow-hidden">
      {/* Trade toggles */}
      <div className="flex flex-wrap gap-1.5 border-b border-ink/10 bg-paper/60 p-3">
        {verticals.map((v) => {
          const on = v.slug === slug;
          return (
            <button
              key={v.slug}
              onClick={() => selectTrade(v)}
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold transition ${
                on ? "bg-ink text-paper" : "text-ink-soft hover:bg-ink/5"
              }`}
            >
              <TradeIcon name={v.icon} className="h-4 w-4" />
              <span className="hidden sm:inline">{v.trade}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-0 md:grid-cols-2">
        {/* Inputs */}
        <div className="space-y-7 p-6 sm:p-8">
          <Slider
            label={`${cap(active.calc.unitNoun)} a month`}
            value={volume}
            min={10}
            max={volumeMax}
            step={5}
            onChange={setVolume}
            display={volume.toLocaleString("en-GB")}
          />
          <Slider
            label={`Average ${active.calc.unitNounSingular} value`}
            value={avg}
            min={5}
            max={120}
            step={1}
            onChange={setAvg}
            display={gbp(avg)}
          />
          <Slider
            label={cap(active.calc.commissionLabel)}
            value={Math.round(rate * 100)}
            min={2}
            max={35}
            step={1}
            onChange={(v) => setRate(v / 100)}
            display={`${Math.round(rate * 100)}%`}
          />
          <p className="text-xs leading-relaxed text-ink-soft">
            Drag the sliders. Defaults reflect a typical {active.trade.toLowerCase()} —
            adjust them to your own numbers.
          </p>
        </div>

        {/* Ledger readout */}
        <div className="flex flex-col justify-center gap-5 bg-ink p-6 text-paper sm:p-8">
          <div>
            <p className="mono-label text-paper/50">What the platforms take</p>
            <p className="tnum mt-1 font-mono text-2xl font-bold text-ledger-light">
              {gbp(monthlyLost)} <span className="text-base font-normal text-paper/50">/ month</span>
            </p>
          </div>
          <div className="rule-dashed border-paper/20" />
          <div>
            <p className="mono-label text-paper/50">That's a year</p>
            <p className="tnum mt-1 font-mono text-5xl font-bold leading-none text-ledger-light">
              {gbp(annualLost)}
            </p>
          </div>
          <div className="rule-dashed border-paper/20" />
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="mono-label text-paper/50">Own Your Trade</p>
              <p className="tnum mt-1 font-mono text-lg font-bold text-paper">
                {gbp(OYT_MONTHLY)} <span className="text-sm font-normal text-paper/50">/ month flat</span>
              </p>
            </div>
            <div className="text-right">
              <p className="mono-label text-ledger-light">You'd keep</p>
              <p className="tnum mt-1 font-mono text-2xl font-bold text-ledger-light">
                {gbp(Math.max(0, annualKept))}<span className="text-sm font-normal text-paper/50">/yr</span>
              </p>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-paper/40">
            Illustrative. Compares platform commission against the Growth plan's flat monthly
            fee; excludes card fees, which both sides pay.
          </p>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-ink">{label}</label>
        <span className="tnum font-mono text-lg font-bold text-ink">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink/15 accent-stamp"
      />
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

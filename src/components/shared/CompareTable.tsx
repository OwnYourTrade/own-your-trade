"use client";

import { useState } from "react";
import type { CompareCategory, CompareRow } from "@/config/verticals";

const FILTERS: { id: CompareCategory | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "cost", label: "Cost" },
  { id: "control", label: "Control" },
  { id: "support", label: "Support" },
];

export default function CompareTable({
  competitors,
  rows,
  saved,
}: {
  competitors: string[];
  rows: CompareRow[];
  saved: { headline: string; basis: string };
}) {
  const [filter, setFilter] = useState<CompareCategory | "all">("all");
  const shown = filter === "all" ? rows : rows.filter((r) => r.category === filter);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-md px-3.5 py-1.5 text-[13px] font-semibold transition ${
              filter === f.id ? "bg-ink text-paper" : "bg-ink/5 text-ink-soft hover:bg-ink/10"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="ticket overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink/10">
              <th className="p-4 text-left font-medium text-ink-soft">&nbsp;</th>
              <th className="bg-stamp/5 p-4 text-left">
                <span className="wordmark text-[13px] text-stamp">OWN·YOUR·TRADE</span>
              </th>
              {competitors.map((c) => (
                <th key={c} className="p-4 text-left font-display text-base font-bold text-ink">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.feature} className="border-b border-ink/5 last:border-0">
                <td className="p-4 align-top font-semibold text-ink">{r.feature}</td>
                <td className="bg-stamp/5 p-4 align-top">
                  <span className="inline-flex items-start gap-1.5 font-medium text-ink">
                    <span className="mt-0.5 text-ledger">✓</span>
                    {r.oyt}
                  </span>
                </td>
                {competitors.map((c) => (
                  <td key={c} className="p-4 align-top text-ink-soft">
                    {r.rivals[c] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Concrete £ saved */}
      <div className="mt-5 flex flex-col gap-2 rounded-2xl bg-ledger p-6 text-ink sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mono-label text-ink/60">What that adds up to</p>
          <p className="tnum font-display text-2xl font-extrabold">
            You keep {saved.headline}
          </p>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-ink/70">{saved.basis}</p>
      </div>
    </div>
  );
}

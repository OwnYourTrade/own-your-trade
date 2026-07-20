"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Lead } from "@/lib/leads";
import { site } from "@/config/site";

function timeAgo(iso: string, now: number): string {
  const mins = Math.floor((now - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function LeadTrackerClient({ initialLeads }: { initialLeads: Lead[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [trade, setTrade] = useState<string>("all");
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(0);
  useEffect(() => {
    setMounted(true);
    setNow(Date.now());
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/leads", { cache: "no-store" });
        if (res.status === 401) {
          router.push("/login?next=/lead-tracker");
          return;
        }
        const data = await res.json();
        if (alive && data.leads) {
          setLeads(data.leads);
          setNow(Date.now());
        }
      } catch {
        /* keep last good state */
      }
    };
    const id = setInterval(load, 15000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [router]);

  async function logout() {
    await fetch("/api/dashboard/logout", { method: "POST" });
    router.push("/login?next=/lead-tracker");
    router.refresh();
  }

  const trades = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => l.trade && set.add(l.trade));
    return Array.from(set).sort();
  }, [leads]);

  const visible = trade === "all" ? leads : leads.filter((l) => l.trade === trade);

  const weekCount = useMemo(() => {
    const wk = now - 7 * 24 * 60 * 60 * 1000;
    return leads.filter((l) => new Date(l.createdAt).getTime() >= wk).length;
  }, [leads, now]);

  return (
    <div className="min-h-screen bg-paper-dark">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div>
            <span className="wordmark text-[13px]">{site.wordmark}</span>
            <p className="text-[11px] text-paper/60">Lead tracker · enquiries</p>
          </div>
          <button onClick={logout} className="rounded-md bg-paper/10 px-4 py-1.5 text-sm hover:bg-paper/20">Sign out</button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Total enquiries" value={String(leads.length)} accent />
          <Stat label="Last 7 days" value={mounted ? String(weekCount) : "…"} />
          <Stat label="Trades" value={String(trades.length)} />
        </div>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
          <Chip on={trade === "all"} onClick={() => setTrade("all")}>All ({leads.length})</Chip>
          {trades.map((t) => (
            <Chip key={t} on={trade === t} onClick={() => setTrade(t)}>
              {t} ({leads.filter((l) => l.trade === t).length})
            </Chip>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="mt-16 text-center text-ink-soft">
            <p className="font-display text-xl text-ink">No enquiries yet</p>
            <p className="mt-1 text-sm">
              Submissions from the hub and vertical &ldquo;get started&rdquo; forms appear here automatically.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {visible.map((l) => (
              <div key={l.id} className="ticket p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-lg font-bold text-ink">{l.name}</span>
                      {l.business && <span className="text-ink-soft">· {l.business}</span>}
                      {l.trade && (
                        <span className="stamp-badge">{l.trade}</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">
                      <a href={`mailto:${l.email}`} className="hover:text-stamp">{l.email}</a>
                      {l.phone && <> · <a href={`tel:${l.phone}`} className="hover:text-stamp">{l.phone}</a></>}
                    </p>
                    {l.message && <p className="mt-2 rounded-md bg-paper px-3 py-2 text-sm text-ink">{l.message}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs text-ink-soft">{mounted ? timeAgo(l.createdAt, now) : ""}</p>
                    <p className="mt-1 mono-label text-ink-soft/60">via {l.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg p-5 shadow-soft ${accent ? "bg-ink text-paper" : "bg-white text-ink"}`}>
      <p className={`mono-label ${accent ? "text-paper/70" : "text-ink-soft"}`}>{label}</p>
      <p className="tnum mt-1 font-mono text-3xl font-bold">{value}</p>
    </div>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition ${
        on ? "bg-ink text-paper" : "bg-white text-ink-soft hover:bg-paper"
      }`}
    >
      {children}
    </button>
  );
}

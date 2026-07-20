"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Signup } from "@/lib/signups";
import { site } from "@/config/site";

function timeAgo(iso: string, now: number): string {
  const mins = Math.floor((now - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const PAY_META: Record<string, { label: string; badge: string }> = {
  paid: { label: "Paid", badge: "bg-ledger text-ink" },
  demo: { label: "Demo", badge: "bg-ink/10 text-ink-soft" },
  unpaid: { label: "Unpaid", badge: "bg-stamp/15 text-stamp" },
};

export default function SignupsClient({ initialSignups }: { initialSignups: Signup[] }) {
  const router = useRouter();
  const [signups, setSignups] = useState<Signup[]>(initialSignups);
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
        const res = await fetch("/api/signup", { cache: "no-store" });
        if (res.status === 401) {
          router.push("/login?next=/signups");
          return;
        }
        const data = await res.json();
        if (alive && data.signups) {
          setSignups(data.signups);
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
    router.push("/login?next=/signups");
    router.refresh();
  }

  const stats = useMemo(() => {
    const paid = signups.filter((s) => s.payment.status === "paid" || s.payment.status === "demo");
    const revenue = paid.reduce((sum, s) => sum + s.payment.amount, 0);
    const mrr = signups
      .filter((s) => s.payment.status !== "unpaid")
      .reduce((sum, s) => {
        const t = site.pricing.tiers.find((x) => x.id === s.tier);
        return sum + (t?.monthly ?? 0);
      }, 0);
    return { total: signups.length, paid: paid.length, revenue, mrr };
  }, [signups]);

  return (
    <div className="min-h-screen bg-paper-dark">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div>
            <span className="wordmark text-[13px]">{site.wordmark}</span>
            <p className="text-[11px] text-paper/60">Signups · new customers</p>
          </div>
          <button onClick={logout} className="rounded-full bg-paper/10 px-4 py-1.5 text-sm hover:bg-paper/20">Sign out</button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6">
        <div className="grid gap-4 sm:grid-cols-4">
          <Stat label="Signups" value={String(stats.total)} accent />
          <Stat label="Paid / started" value={String(stats.paid)} />
          <Stat label="Collected today" value={`${site.currency}${stats.revenue}`} />
          <Stat label="MRR started" value={`${site.currency}${stats.mrr}`} />
        </div>

        {signups.length === 0 ? (
          <div className="mt-16 text-center text-ink-soft">
            <p className="font-display text-xl text-ink">No signups yet</p>
            <p className="mt-1 text-sm">Completed Get Started signups appear here automatically.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {signups.map((s) => {
              const tier = site.pricing.tiers.find((x) => x.id === s.tier);
              const pm = PAY_META[s.payment.status] ?? PAY_META.unpaid;
              return (
                <div key={s.id} className="ticket p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-lg font-bold text-ink">{s.business}</span>
                        <span className="stamp-badge">{s.trade}</span>
                        <span className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-paper">{tier?.name ?? s.tier}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${pm.badge}`}>{pm.label}</span>
                      </div>
                      <p className="mt-1.5 text-sm text-ink-soft">
                        {s.name} · <a href={`mailto:${s.email}`} className="hover:text-stamp">{s.email}</a> · <a href={`tel:${s.phone}`} className="hover:text-stamp">{s.phone}</a>
                      </p>
                      <p className="mt-1 text-sm text-ink-soft">
                        📍 {s.area}
                        {s.domain ? ` · wants ${s.domain}` : ""}
                        {s.website ? ` · ${s.website}` : ""}
                      </p>
                      {s.notes && (
                        <p className="mt-2 rounded-lg bg-paper px-3 py-2 text-sm text-ink">
                          <span className="font-semibold">Notes:</span> {s.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="tnum font-mono text-lg font-bold text-ink">{site.currency}{s.payment.amount}</p>
                      <p className="font-mono text-xs text-ink-soft">{mounted ? timeAgo(s.createdAt, now) : ""}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-ink-soft/60">{s.id}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 shadow-soft ${accent ? "bg-ink text-paper" : "bg-white text-ink"}`}>
      <p className={`mono-label ${accent ? "text-paper/70" : "text-ink-soft"}`}>{label}</p>
      <p className="tnum mt-1 font-mono text-3xl font-bold">{value}</p>
    </div>
  );
}

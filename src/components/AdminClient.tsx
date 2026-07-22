"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Signup } from "@/lib/signups";
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

const PAY_META: Record<string, { label: string; badge: string }> = {
  paid: { label: "Paid", badge: "bg-ledger text-ink" },
  demo: { label: "Demo", badge: "bg-ink/10 text-ink-soft" },
  unpaid: { label: "Unpaid", badge: "bg-stamp/15 text-stamp" },
};

/** Human badge for the live Stripe subscription state on a signup. */
function subscriptionBadge(s: Signup): { label: string; badge: string } | null {
  if (!s.subscriptionStatus) return null;
  const end = s.currentPeriodEnd
    ? new Date(s.currentPeriodEnd).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : null;
  if (s.subscriptionStatus === "canceled")
    return { label: "Sub cancelled", badge: "bg-ink/10 text-ink-soft line-through" };
  if (s.cancelAtPeriodEnd)
    return { label: end ? `Cancels ${end}` : "Cancels at period end", badge: "bg-stamp/15 text-stamp" };
  if (s.subscriptionStatus === "past_due")
    return { label: "Payment failed", badge: "bg-stamp text-paper" };
  if (s.subscriptionStatus === "active")
    return { label: end ? `Renews ${end}` : "Sub active", badge: "bg-stamp/10 text-stamp" };
  return { label: `Sub: ${s.subscriptionStatus}`, badge: "bg-ink/10 text-ink-soft" };
}

/** Does this signup still contribute to MRR? */
function contributesToMrr(s: Signup): boolean {
  if (s.payment.status === "unpaid") return false;
  if (!s.subscriptionStatus) return true; // demo/legacy rows
  if (s.subscriptionStatus === "canceled" || s.subscriptionStatus === "incomplete_expired") return false;
  return true;
}

type Tab = "signups" | "leads";

export default function AdminClient({
  initialSignups,
  initialLeads,
}: {
  initialSignups: Signup[];
  initialLeads: Lead[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("signups");
  const [signups, setSignups] = useState<Signup[]>(initialSignups);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
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
        const [s, l] = await Promise.all([
          fetch("/api/signup", { cache: "no-store" }),
          fetch("/api/leads", { cache: "no-store" }),
        ]);
        if (s.status === 401 || l.status === 401) {
          router.push("/admin/login");
          return;
        }
        const sd = await s.json();
        const ld = await l.json();
        if (alive) {
          if (sd.signups) setSignups(sd.signups);
          if (ld.leads) setLeads(ld.leads);
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
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const signupStats = useMemo(() => {
    const paid = signups.filter((s) => s.payment.status === "paid" || s.payment.status === "demo");
    const revenue = paid.reduce((sum, s) => sum + s.payment.amount, 0);
    const mrr = signups
      .filter(contributesToMrr)
      .reduce((sum, s) => sum + (site.pricing.tiers.find((x) => x.id === s.tier)?.monthly ?? 0), 0);
    return { total: signups.length, paid: paid.length, revenue, mrr };
  }, [signups]);

  const [portalBusy, setPortalBusy] = useState<string | null>(null);
  async function openPortal(signupId: string) {
    setPortalBusy(signupId);
    try {
      const res = await fetch("/api/admin/billing-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signupId }),
      });
      const data = await res.json();
      if (res.ok && data.url) window.open(data.url, "_blank", "noopener");
      else alert(data.error || "Couldn't open the billing portal.");
    } catch {
      alert("Network error opening the billing portal.");
    }
    setPortalBusy(null);
  }

  const weekLeads = useMemo(() => {
    const wk = now - 7 * 24 * 60 * 60 * 1000;
    return leads.filter((l) => new Date(l.createdAt).getTime() >= wk).length;
  }, [leads, now]);

  return (
    <div className="min-h-screen bg-paper-dark">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div>
            <span className="wordmark text-[13px]">{site.wordmark}</span>
            <p className="text-[11px] text-paper/60">Admin · private business data</p>
          </div>
          <button onClick={logout} className="rounded-full bg-paper/10 px-4 py-1.5 text-sm hover:bg-paper/20">Sign out</button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6">
        {/* Tabs */}
        <div className="flex gap-2">
          <TabBtn on={tab === "signups"} onClick={() => setTab("signups")}>Signups ({signups.length})</TabBtn>
          <TabBtn on={tab === "leads"} onClick={() => setTab("leads")}>Enquiries ({leads.length})</TabBtn>
        </div>

        {tab === "signups" ? (
          <>
            <div className="mt-5 grid gap-4 sm:grid-cols-4">
              <Stat label="Signups" value={String(signupStats.total)} accent />
              <Stat label="Paid / started" value={String(signupStats.paid)} />
              <Stat label="Collected" value={`${site.currency}${signupStats.revenue}`} />
              <Stat label="MRR started" value={`${site.currency}${signupStats.mrr}`} />
            </div>
            {signups.length === 0 ? (
              <Empty title="No signups yet" sub="Completed Get Started signups appear here automatically." />
            ) : (
              <div className="mt-6 space-y-3">
                {signups.map((s) => {
                  const tier = site.pricing.tiers.find((x) => x.id === s.tier);
                  const pm = PAY_META[s.payment.status] ?? PAY_META.unpaid;
                  const sub = subscriptionBadge(s);
                  return (
                    <div key={s.id} className="ticket p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-display text-lg font-bold text-ink">{s.business}</span>
                            <span className="stamp-badge">{s.trade}</span>
                            <span className="rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-paper">{tier?.name ?? s.tier}</span>
                            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${pm.badge}`}>{pm.label}</span>
                            {sub && (
                              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${sub.badge}`}>{sub.label}</span>
                            )}
                          </div>
                          <p className="mt-1.5 text-sm text-ink-soft">
                            {s.name} · <a href={`mailto:${s.email}`} className="hover:text-stamp">{s.email}</a> · <a href={`tel:${s.phone}`} className="hover:text-stamp">{s.phone}</a>
                          </p>
                          <p className="mt-1 text-sm text-ink-soft">
                            📍 {s.area}{s.domain ? ` · wants ${s.domain}` : ""}{s.website ? ` · ${s.website}` : ""}
                          </p>
                          {s.notes && (
                            <p className="mt-2 rounded-lg bg-paper px-3 py-2 text-sm text-ink"><span className="font-semibold">Notes:</span> {s.notes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="tnum font-mono text-lg font-bold text-ink">{site.currency}{s.payment.amount}</p>
                          <p className="font-mono text-xs text-ink-soft">{mounted ? timeAgo(s.createdAt, now) : ""}</p>
                          <p className="mt-0.5 font-mono text-[11px] text-ink-soft/60">{s.id}</p>
                          {s.stripeCustomerId && (
                            <button
                              onClick={() => openPortal(s.id)}
                              disabled={portalBusy === s.id}
                              className="mt-2 rounded-full border border-ink/20 px-3 py-1 text-[11px] font-semibold text-ink transition hover:border-stamp hover:text-stamp disabled:opacity-50"
                            >
                              {portalBusy === s.id ? "Opening…" : "Billing portal ↗"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Stat label="Enquiries" value={String(leads.length)} accent />
              <Stat label="Last 7 days" value={mounted ? String(weekLeads) : "…"} />
              <Stat label="Trades" value={String(new Set(leads.map((l) => l.trade).filter(Boolean)).size)} />
            </div>
            {leads.length === 0 ? (
              <Empty title="No enquiries yet" sub="Submissions from the hub and vertical get-started forms appear here." />
            ) : (
              <div className="mt-6 space-y-3">
                {leads.map((l) => (
                  <div key={l.id} className="ticket p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display text-lg font-bold text-ink">{l.name}</span>
                          {l.business && <span className="text-ink-soft">· {l.business}</span>}
                          {l.trade && <span className="stamp-badge">{l.trade}</span>}
                        </div>
                        <p className="mt-1.5 text-sm text-ink-soft">
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
          </>
        )}
      </div>
    </div>
  );
}

function TabBtn({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${on ? "bg-ink text-paper" : "bg-white text-ink-soft hover:bg-paper"}`}
    >
      {children}
    </button>
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

function Empty({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mt-16 text-center text-ink-soft">
      <p className="font-display text-xl text-ink">{title}</p>
      <p className="mt-1 text-sm">{sub}</p>
    </div>
  );
}

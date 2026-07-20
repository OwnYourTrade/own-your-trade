"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Booking, BookingStatus } from "@/lib/bookings";
import type { BookingConfig } from "@/config/demos/booking";

const STATUS_META: Record<BookingStatus, { label: string; badge: string }> = {
  new: { label: "New", badge: "bg-stamp text-paper" },
  confirmed: { label: "Confirmed", badge: "bg-ledger text-paper" },
  completed: { label: "Done", badge: "bg-ink/10 text-ink-soft" },
  cancelled: { label: "Cancelled", badge: "bg-ink/10 text-ink-soft line-through" },
};

const FILTERS: { id: BookingStatus | "upcoming" | "all"; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "new", label: "New" },
  { id: "confirmed", label: "Confirmed" },
  { id: "completed", label: "Done" },
  { id: "all", label: "All" },
];

function prettyDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
}

export default function BookingBoard({
  config,
  initialBookings,
}: {
  config: BookingConfig;
  initialBookings: Booking[];
}) {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("upcoming");
  const [busy, setBusy] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/bookings?vertical=${config.slug}`, { cache: "no-store" });
        if (res.status === 401) {
          router.push(`/login?next=/${config.slug}/demo/dashboard`);
          return;
        }
        const data = await res.json();
        if (alive && data.bookings) setBookings(data.bookings);
      } catch {
        /* keep last good state */
      }
    };
    const id = setInterval(load, 8000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [router, config.slug]);

  async function setStatus(id: string, status: BookingStatus) {
    setBusy(id);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    try {
      await fetch(`/api/bookings/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } finally {
      setBusy(null);
    }
  }

  async function logout() {
    await fetch("/api/dashboard/logout", { method: "POST" });
    router.push(`/login?next=/${config.slug}/demo/dashboard`);
    router.refresh();
  }

  const stats = useMemo(() => {
    const active = bookings.filter((b) => b.status === "new" || b.status === "confirmed");
    const revenue = bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((s, b) => s + b.price, 0);
    return {
      newCount: bookings.filter((b) => b.status === "new").length,
      active: active.length,
      total: bookings.length,
      revenue,
    };
  }, [bookings]);

  const visible = useMemo(() => {
    if (filter === "all") return bookings;
    if (filter === "upcoming") return bookings.filter((b) => b.status === "new" || b.status === "confirmed");
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of visible) {
      const arr = map.get(b.day) ?? [];
      arr.push(b);
      map.set(b.day, arr);
    }
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  }, [visible]);

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-stamp font-display font-extrabold">{config.monogram}</span>
            <div>
              <h1 className="font-display text-lg font-bold leading-none">{config.staffLabel}&apos;s diary</h1>
              <p className="text-[11px] text-paper/60">{config.businessName} · live bookings</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-xs text-paper/70">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ledger opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ledger" />
              </span>
              Live
            </span>
            <button onClick={logout} className="rounded-md bg-paper/10 px-4 py-1.5 text-sm hover:bg-paper/20">Sign out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6">
        <div className="grid gap-4 sm:grid-cols-4">
          <Stat label="New requests" value={String(stats.newCount)} accent />
          <Stat label="Upcoming" value={String(stats.active)} />
          <Stat label="Total booked" value={String(stats.total)} />
          <Stat label="Booked value" value={`£${stats.revenue.toFixed(0)}`} />
        </div>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => {
            const count =
              f.id === "all"
                ? bookings.length
                : f.id === "upcoming"
                ? stats.active
                : bookings.filter((b) => b.status === f.id).length;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition ${
                  filter === f.id ? "bg-ink text-paper" : "bg-white text-ink-soft hover:bg-paper"
                }`}
              >
                {f.label}<span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {grouped.length === 0 ? (
          <div className="mt-16 text-center text-ink-soft">
            <p className="font-display text-xl text-ink">Nothing here yet</p>
            <p className="mt-1 text-sm">New bookings appear automatically as customers confirm.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {grouped.map(([iso, rows]) => (
              <div key={iso}>
                <h2 className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                  {mounted ? prettyDay(iso) : iso}
                </h2>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {rows.sort((a, b) => (a.time < b.time ? -1 : 1)).map((b) => (
                    <BookingCard key={b.id} b={b} busy={busy === b.id} staffLabel={config.staffLabel} onStatus={setStatus} />
                  ))}
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
    <div className={`rounded-lg p-5 shadow-soft ${accent ? "bg-stamp text-paper" : "bg-white text-ink"}`}>
      <p className={`mono-label ${accent ? "text-paper/80" : "text-ink-soft"}`}>{label}</p>
      <p className="tnum mt-1 font-mono text-3xl font-bold">{value}</p>
    </div>
  );
}

function BookingCard({
  b,
  busy,
  staffLabel,
  onStatus,
}: {
  b: Booking;
  busy: boolean;
  staffLabel: string;
  onStatus: (id: string, s: BookingStatus) => void;
}) {
  const meta = STATUS_META[b.status];
  return (
    <article className="ticket flex flex-col">
      <div className="flex items-start justify-between gap-2 border-b border-ink/10 p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="tnum font-mono text-lg font-bold text-ink">{b.time}</span>
            <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${meta.badge}`}>{meta.label}</span>
          </div>
          <p className="mt-0.5 text-sm font-semibold text-ink">{b.service}</p>
        </div>
        <span className="tnum font-mono text-sm font-bold text-ink">{b.price === 0 ? "Free" : `£${b.price.toFixed(0)}`}</span>
      </div>
      <div className="flex-1 px-4 py-3 text-sm">
        <p className="font-semibold text-ink">{b.customer.name}</p>
        <p className="text-ink-soft">
          <a href={`tel:${b.customer.phone}`} className="hover:text-stamp">{b.customer.phone}</a>
          {b.staff ? ` · ${staffLabel}: ${b.staff}` : ""}
        </p>
        {b.customer.notes && (
          <p className="mt-2 rounded-md bg-paper px-3 py-2 text-xs text-ink"><span className="font-semibold">Note:</span> {b.customer.notes}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-ink/10 p-3">
        {b.status === "new" && <Btn busy={busy} primary onClick={() => onStatus(b.id, "confirmed")}>Confirm</Btn>}
        {b.status === "confirmed" && <Btn busy={busy} primary onClick={() => onStatus(b.id, "completed")}>Mark done</Btn>}
        {b.status !== "completed" && b.status !== "cancelled" && <Btn busy={busy} onClick={() => onStatus(b.id, "cancelled")}>Cancel</Btn>}
        {(b.status === "completed" || b.status === "cancelled") && <Btn busy={busy} onClick={() => onStatus(b.id, "new")}>Reopen</Btn>}
      </div>
    </article>
  );
}

function Btn({ children, onClick, primary, busy }: { children: React.ReactNode; onClick: () => void; primary?: boolean; busy?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
        primary ? "bg-stamp text-paper hover:bg-stamp-dark" : "bg-paper-dark text-ink-soft hover:bg-ink/10"
      }`}
    >
      {children}
    </button>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/menu";
import { identity } from "@/config/demos/takeaway";
import type { Order, OrderStatus } from "@/lib/orders";

const STATUS_META: Record<
  OrderStatus,
  { label: string; badge: string; dot: string }
> = {
  new: { label: "New", badge: "bg-lacquer text-cream", dot: "bg-lacquer" },
  preparing: {
    label: "Preparing",
    badge: "bg-gold text-ink",
    dot: "bg-gold-dark",
  },
  ready: { label: "Ready", badge: "bg-jade text-white", dot: "bg-jade" },
  completed: {
    label: "Completed",
    badge: "bg-ink/10 text-ink-soft",
    dot: "bg-ink/40",
  },
  cancelled: {
    label: "Cancelled",
    badge: "bg-ink/10 text-ink-soft line-through",
    dot: "bg-ink/30",
  },
};

const FILTERS: { id: OrderStatus | "active" | "all"; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "new", label: "New" },
  { id: "preparing", label: "Preparing" },
  { id: "ready", label: "Ready" },
  { id: "completed", label: "Completed" },
  { id: "all", label: "All" },
];

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const h = Math.floor(mins / 60);
  return `${h}h ${mins % 60}m ago`;
}

export default function DashboardClient({
  initialOrders,
  stripeConfigured,
}: {
  initialOrders: Order[];
  stripeConfigured: boolean;
}) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("active");
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [busy, setBusy] = useState<string | null>(null);
  // Gate time-relative text so server & client render identically on first paint.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Poll for new orders every 8 seconds.
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        if (res.status === 401) {
          router.push("/takeaway/demo/dashboard/login");
          return;
        }
        const data = await res.json();
        if (alive && data.orders) {
          setOrders(data.orders);
          setLastSync(new Date());
        }
      } catch {
        /* keep last good state */
      }
    };
    const id = setInterval(load, 8000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [router]);

  async function setStatus(id: string, status: OrderStatus) {
    setBusy(id);
    // optimistic
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    try {
      await fetch(`/api/orders/${id}/status`, {
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
    router.push("/dashboard/login");
    router.refresh();
  }

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todays = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === today
    );
    const active = orders.filter(
      (o) => o.status === "new" || o.status === "preparing" || o.status === "ready"
    );
    const revenue = todays
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + o.total, 0);
    return {
      newCount: orders.filter((o) => o.status === "new").length,
      active: active.length,
      todayCount: todays.length,
      revenue,
    };
  }, [orders]);

  const visible = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "active")
      return orders.filter(
        (o) =>
          o.status === "new" ||
          o.status === "preparing" ||
          o.status === "ready"
      );
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  return (
    <div>
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-lacquer-dark text-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/50 text-gold">
              <span className="font-display">{identity.monogram}</span>
            </span>
            <div>
              <h1 className="font-display text-lg leading-none">
                Kitchen Dashboard
              </h1>
              <p className="text-[11px] text-gold-light/80">
                {identity.name} · Live orders
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-xs text-cream/70">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-jade opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-jade" />
              </span>
              Live · synced{" "}
              {mounted
                ? lastSync.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "…"}
            </span>
            <button
              onClick={logout}
              className="rounded-full bg-white/10 px-4 py-1.5 text-sm hover:bg-white/20"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="New orders" value={String(stats.newCount)} accent />
          <Stat label="Active now" value={String(stats.active)} />
          <Stat label="Orders today" value={String(stats.todayCount)} />
          <Stat label="Revenue today" value={formatPrice(stats.revenue)} />
        </div>

        {!stripeConfigured && (
          <div className="mt-4 rounded-xl border border-gold/40 bg-gold-light/30 px-5 py-3 text-sm text-ink">
            <strong>Demo mode:</strong> orders are being placed without live
            Stripe payments. Add Stripe test keys to <code>.env.local</code> to
            take real test-mode card payments.
          </div>
        )}

        {/* Filters */}
        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => {
            const count =
              f.id === "all"
                ? orders.length
                : f.id === "active"
                ? stats.active
                : orders.filter((o) => o.status === f.id).length;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  filter === f.id
                    ? "bg-ink text-cream"
                    : "bg-white text-ink-soft hover:bg-cream"
                }`}
              >
                {f.label}
                <span className="ml-1.5 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Orders */}
        {visible.length === 0 ? (
          <div className="mt-16 text-center text-ink-soft">
            <div className="text-4xl">🍽️</div>
            <p className="mt-3 font-display text-xl text-ink">No orders here</p>
            <p className="mt-1 text-sm">
              New orders will appear automatically as customers check out.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                busy={busy === o.id}
                mounted={mounted}
                onStatus={setStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 shadow-soft ${
        accent ? "bg-lacquer text-cream" : "bg-white text-ink"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-wide ${
          accent ? "text-cream/80" : "text-ink-soft"
        }`}
      >
        {label}
      </p>
      <p className="mt-1 font-display text-3xl">{value}</p>
    </div>
  );
}

function OrderCard({
  order,
  busy,
  mounted,
  onStatus,
}: {
  order: Order;
  busy: boolean;
  mounted: boolean;
  onStatus: (id: string, s: OrderStatus) => void;
}) {
  const meta = STATUS_META[order.status];
  const isNew = order.status === "new";

  return (
    <article
      className={`flex flex-col rounded-2xl bg-white shadow-card ring-1 ring-inset transition ${
        isNew ? "ring-lacquer/40" : "ring-transparent"
      }`}
    >
      {/* header */}
      <div className="flex items-start justify-between gap-3 border-b border-ink/10 p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-lg text-ink">{order.id}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${meta.badge}`}
            >
              {meta.label}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink-soft">
            {new Date(order.createdAt).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {mounted ? ` · ${timeAgo(order.createdAt)}` : ""}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase ${
              order.type === "delivery"
                ? "bg-jade/15 text-jade"
                : "bg-gold/20 text-gold-dark"
            }`}
          >
            {order.type}
          </span>
          <span
            className={`text-[11px] font-semibold ${
              order.payment.status === "paid"
                ? "text-jade"
                : order.payment.status === "demo"
                ? "text-gold-dark"
                : "text-lacquer"
            }`}
          >
            {order.payment.status === "paid"
              ? "✓ Paid"
              : order.payment.status === "demo"
              ? "Demo order"
              : "Unpaid"}
          </span>
        </div>
      </div>

      {/* customer */}
      <div className="border-b border-ink/10 bg-cream/50 px-4 py-3 text-sm">
        <p className="font-semibold text-ink">{order.customer.name}</p>
        <p className="text-ink-soft">
          <a href={`tel:${order.customer.phone}`} className="hover:text-lacquer">
            {order.customer.phone}
          </a>{" "}
          · {order.customer.email}
        </p>
        {order.type === "delivery" && order.customer.address && (
          <p className="mt-1 text-ink-soft">📍 {order.customer.address}</p>
        )}
        {order.customer.notes && (
          <p className="mt-2 rounded-lg bg-gold-light/30 px-3 py-2 text-xs text-ink">
            <span className="font-semibold">Note:</span> {order.customer.notes}
          </p>
        )}
      </div>

      {/* items */}
      <div className="flex-1 px-4 py-3">
        <ul className="space-y-1.5 text-sm">
          {order.items.map((l) => (
            <li key={l.key} className="flex justify-between gap-3">
              <span className="text-ink">
                <span className="font-semibold text-lacquer">{l.qty}×</span>{" "}
                {l.name}
              </span>
              <span className="text-ink-soft">
                {formatPrice(l.price * l.qty)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-ink/10 pt-2 text-sm font-bold text-ink">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      {/* actions */}
      <div className="flex flex-wrap gap-2 border-t border-ink/10 p-3">
        {isNew && (
          <ActionBtn busy={busy} primary onClick={() => onStatus(order.id, "preparing")}>
            Accept &amp; prepare
          </ActionBtn>
        )}
        {order.status === "preparing" && (
          <ActionBtn busy={busy} primary onClick={() => onStatus(order.id, "ready")}>
            Mark ready
          </ActionBtn>
        )}
        {order.status === "ready" && (
          <ActionBtn busy={busy} primary onClick={() => onStatus(order.id, "completed")}>
            Complete order
          </ActionBtn>
        )}
        {order.status !== "completed" && order.status !== "cancelled" && (
          <ActionBtn busy={busy} onClick={() => onStatus(order.id, "cancelled")}>
            Cancel
          </ActionBtn>
        )}
        {(order.status === "completed" || order.status === "cancelled") && (
          <ActionBtn busy={busy} onClick={() => onStatus(order.id, "new")}>
            Reopen
          </ActionBtn>
        )}
      </div>
    </article>
  );
}

function ActionBtn({
  children,
  onClick,
  primary,
  busy,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
  busy?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${
        primary
          ? "bg-lacquer text-cream hover:bg-lacquer-dark"
          : "bg-cream-dark text-ink-soft hover:bg-ink/10"
      }`}
    >
      {children}
    </button>
  );
}

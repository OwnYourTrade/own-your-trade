"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { menu, formatPrice } from "@/lib/menu";
import { site, type OrderType } from "@/lib/site";
import { useCart } from "@/components/CartProvider";
import ItemRow from "@/components/ItemRow";
import CategoryChips from "@/components/CategoryChips";

type Step = "build" | "details";

export default function OrderClient() {
  const { lines, subtotal, count, setQty, remove } = useCart();
  const params = useSearchParams();
  const canceled = params.get("canceled") === "1";

  const [step, setStep] = useState<Step>("build");
  const [type, setType] = useState<OrderType>("collection");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryFee = useMemo(() => {
    if (type !== "delivery") return 0;
    return subtotal >= site.delivery.freeOver ? 0 : site.delivery.fee;
  }, [type, subtotal]);

  const total = subtotal + deliveryFee;
  const belowMinimum =
    type === "delivery" && subtotal < site.delivery.minimum && count > 0;

  const update = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          customer: form,
          cart: lines.map((l) => ({ key: l.key, qty: l.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  // ---------------------------------------------------------------- Empty
  if (count === 0 && step === "build") {
    return (
      <div className="container-x py-16">
        {canceled && <CanceledNotice />}
        <div className="mx-auto max-w-lg rounded-3xl bg-white p-10 text-center shadow-card">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cream-dark text-2xl">
            🥡
          </div>
          <h1 className="mt-5 font-display text-3xl text-ink">
            Let&apos;s build your order
          </h1>
          <p className="mt-3 text-ink-soft">
            Your basket is empty. Browse the menu and tap{" "}
            <span className="font-semibold text-lacquer">Add</span> on the dishes
            you fancy — they&apos;ll appear here ready for checkout.
          </p>
          <div className="mt-6">
            <BrowseToggle onBrowse={() => window.scrollTo({ top: 0 })} />
          </div>
        </div>
        <div className="mt-10">
          <MenuBrowser />
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------- Details step
  if (step === "details") {
    return (
      <div className="container-x py-10">
        <button
          onClick={() => setStep("build")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-lacquer"
        >
          ← Back to menu
        </button>

        <h1 className="font-display text-3xl text-ink sm:text-4xl">
          Your details
        </h1>
        <div className="rule-gold mt-3" />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <div className="space-y-8">
            <OrderTypeToggle type={type} setType={setType} />

            <div className="card p-6 sm:p-8">
              <h2 className="font-display text-xl text-ink">Contact details</h2>
              <p className="mt-1 text-sm text-ink-soft">
                No account needed — we just need a way to reach you about your
                order.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  placeholder="Alex Chen"
                  required
                />
                <Field
                  label="Phone"
                  value={form.phone}
                  onChange={(v) => update("phone", v)}
                  placeholder="07700 900123"
                  type="tel"
                  required
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Email (for your receipt)"
                    value={form.email}
                    onChange={(v) => update("email", v)}
                    placeholder="you@example.com"
                    type="email"
                    required
                  />
                </div>
                {type === "delivery" && (
                  <div className="sm:col-span-2">
                    <Field
                      label="Delivery address"
                      value={form.address}
                      onChange={(v) => update("address", v)}
                      placeholder="12 Example Road, High Street"
                      required
                    />
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-ink">
                    Notes for the kitchen{" "}
                    <span className="text-ink-soft/60">(optional)</span>
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    rows={3}
                    placeholder="Allergies, spice preferences, buzzer number…"
                    className="w-full rounded-xl border border-ink/15 bg-cream/50 px-4 py-2.5 text-sm outline-none focus:border-lacquer focus:ring-2 focus:ring-lacquer/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-24">
              <SummaryPanel
                lines={lines}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                type={type}
              />

              {belowMinimum && (
                <p className="mt-3 rounded-xl bg-lacquer/10 px-4 py-3 text-sm text-lacquer">
                  Minimum delivery order is{" "}
                  {formatPrice(site.delivery.minimum)}. Add{" "}
                  {formatPrice(site.delivery.minimum - subtotal)} more, or switch
                  to collection.
                </p>
              )}

              {error && (
                <p className="mt-3 rounded-xl bg-lacquer/10 px-4 py-3 text-sm text-lacquer">
                  {error}
                </p>
              )}

              <button
                onClick={submit}
                disabled={submitting || belowMinimum || count === 0}
                className="btn-primary mt-4 w-full text-base"
              >
                {submitting
                  ? "Starting secure checkout…"
                  : `Pay ${formatPrice(total)}`}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
                <LockIcon /> Secure payment powered by Stripe (test mode)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------- Build step
  return (
    <div className="container-x py-10">
      {canceled && <CanceledNotice />}
      <h1 className="font-display text-3xl text-ink sm:text-4xl">
        Build your order
      </h1>
      <p className="mt-2 text-ink-soft">
        Browse the menu and add dishes to your basket.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <MenuBrowser />
        </div>

        {/* Basket sidebar */}
        <div>
          <div className="sticky top-24">
            <div className="card overflow-hidden">
              <div className="bg-lacquer-dark px-6 py-4 text-cream">
                <h2 className="font-display text-xl">Your basket</h2>
                <p className="text-xs text-gold-light/90">
                  {count} {count === 1 ? "item" : "items"}
                </p>
              </div>

              <div className="max-h-[46vh] overflow-y-auto px-4 py-3">
                {lines.length === 0 ? (
                  <p className="px-2 py-8 text-center text-sm text-ink-soft">
                    Nothing here yet.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {lines.map((l) => (
                      <li
                        key={l.key}
                        className="flex items-start justify-between gap-3 rounded-lg px-2 py-2 hover:bg-cream"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-snug text-ink">
                            {l.name}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="flex items-center rounded-full border border-ink/15">
                              <button
                                onClick={() => setQty(l.key, l.qty - 1)}
                                className="grid h-6 w-6 place-items-center text-ink"
                                aria-label="Decrease"
                              >
                                −
                              </button>
                              <span className="w-5 text-center text-xs font-semibold">
                                {l.qty}
                              </span>
                              <button
                                onClick={() => setQty(l.key, l.qty + 1)}
                                className="grid h-6 w-6 place-items-center text-ink"
                                aria-label="Increase"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => remove(l.key)}
                              className="text-xs text-ink-soft hover:text-lacquer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-ink">
                          {formatPrice(l.price * l.qty)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="border-t border-ink/10 px-6 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-soft">Subtotal</span>
                  <span className="text-lg font-bold text-ink">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <button
                  onClick={() => setStep("details")}
                  disabled={count === 0}
                  className="btn-primary mt-4 w-full"
                >
                  Continue to details
                </button>
                <p className="mt-2 text-center text-xs text-ink-soft">
                  Collection &amp; delivery options on the next step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Sub-components
// --------------------------------------------------------------------------

function MenuBrowser() {
  return (
    <>
      <div className="-mx-5 sm:-mx-8">
        <CategoryChips categories={menu.map((c) => ({ id: c.id, name: c.name }))} />
      </div>
      <div className="mt-6 space-y-10">
        {menu.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-40">
            <div className="flex items-baseline justify-between gap-3 border-b-2 border-gold/40 pb-2">
              <h2 className="font-display text-2xl text-ink">{cat.name}</h2>
              {cat.note && (
                <span className="text-xs font-medium text-gold-dark">
                  {cat.note}
                </span>
              )}
            </div>
            <div className="mt-1">
              {cat.items.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function OrderTypeToggle({
  type,
  setType,
}: {
  type: OrderType;
  setType: (t: OrderType) => void;
}) {
  return (
    <div className="card p-6 sm:p-8">
      <h2 className="font-display text-xl text-ink">How would you like it?</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {(
          [
            { id: "collection", label: "Collection", sub: "Ready in ~20 min" },
            { id: "delivery", label: "Delivery", sub: site.delivery.radiusNote },
          ] as const
        ).map((o) => (
          <button
            key={o.id}
            onClick={() => setType(o.id)}
            className={`rounded-2xl border-2 p-4 text-left transition ${
              type === o.id
                ? "border-lacquer bg-lacquer/5"
                : "border-ink/10 hover:border-ink/25"
            }`}
          >
            <span className="flex items-center gap-2 font-display text-lg text-ink">
              {o.label}
              {type === o.id && <span className="text-lacquer">✓</span>}
            </span>
            <span className="mt-1 block text-xs text-ink-soft">{o.sub}</span>
          </button>
        ))}
      </div>
      {type === "collection" && (
        <p className="mt-4 text-sm text-ink-soft">
          Collect from {site.address.line1}, {site.address.city}{" "}
          {site.address.postcode}.
        </p>
      )}
    </div>
  );
}

function SummaryPanel({
  lines,
  subtotal,
  deliveryFee,
  total,
  type,
}: {
  lines: { key: string; name: string; price: number; qty: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  type: OrderType;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="bg-lacquer-dark px-6 py-4 text-cream">
        <h2 className="font-display text-xl">Order summary</h2>
      </div>
      <div className="px-6 py-4">
        <ul className="space-y-2 text-sm">
          {lines.map((l) => (
            <li key={l.key} className="flex justify-between gap-3">
              <span className="text-ink-soft">
                <span className="font-medium text-ink">{l.qty}×</span> {l.name}
              </span>
              <span className="font-medium text-ink">
                {formatPrice(l.price * l.qty)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1.5 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {type === "delivery" && (
            <div className="flex justify-between text-ink-soft">
              <span>Delivery</span>
              <span>
                {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
              </span>
            </div>
          )}
          <div className="flex justify-between pt-1 text-base font-bold text-ink">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label} {required && <span className="text-lacquer">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-ink/15 bg-cream/50 px-4 py-2.5 text-sm outline-none focus:border-lacquer focus:ring-2 focus:ring-lacquer/20"
      />
    </div>
  );
}

function CanceledNotice() {
  return (
    <div className="mb-6 rounded-xl border border-gold/40 bg-gold-light/20 px-5 py-4 text-sm text-ink">
      Your payment was cancelled and nothing has been charged. Your basket is
      still here whenever you&apos;re ready.
    </div>
  );
}

function BrowseToggle({ onBrowse }: { onBrowse: () => void }) {
  return (
    <button onClick={onBrowse} className="btn-primary">
      Browse the menu below ↓
    </button>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

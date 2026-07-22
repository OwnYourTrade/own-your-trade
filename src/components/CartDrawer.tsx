"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/menu";

export default function CartDrawer() {
  const { lines, subtotal, isOpen, closeCart, setQty, remove, count } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Your basket"
      >
        <div className="flex items-center justify-between border-b border-ink/10 bg-lacquer-dark px-6 py-4 text-cream">
          <div>
            <h2 className="font-display text-xl">Your Basket</h2>
            <p className="text-xs text-gold-light/90">
              {count} {count === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close basket"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-cream-dark text-lacquer">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <p className="font-display text-lg text-ink">Your basket is empty</p>
            <p className="text-sm text-ink-soft">
              Add some dishes from the menu to get started.
            </p>
            <Link href="/takeaway/demo/order" onClick={closeCart} className="btn-primary mt-2">
              Start your order
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-3">
                {lines.map((l) => (
                  <li
                    key={l.key}
                    className="flex items-start gap-3 rounded-xl bg-white p-3 shadow-soft"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug text-ink">
                        {l.name}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {formatPrice(l.price)} each
                      </p>
                      <button
                        onClick={() => remove(l.key)}
                        className="mt-1 text-xs font-medium text-lacquer hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm font-bold text-ink">
                        {formatPrice(l.price * l.qty)}
                      </span>
                      <QtyStepper
                        qty={l.qty}
                        onDec={() => setQty(l.key, l.qty - 1)}
                        onInc={() => setQty(l.key, l.qty + 1)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-ink/10 bg-white px-6 py-5">
              <div className="flex items-center justify-between text-sm text-ink-soft">
                <span>Subtotal</span>
                <span className="text-lg font-bold text-ink">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-soft">
                Delivery & fees calculated at checkout.
              </p>
              <Link
                href="/takeaway/demo/order?checkout=1"
                onClick={closeCart}
                className="btn-primary mt-4 w-full"
              >
                Review & Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function QtyStepper({
  qty,
  onDec,
  onInc,
}: {
  qty: number;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-ink/15 bg-cream">
      <button
        onClick={onDec}
        aria-label="Decrease quantity"
        className="grid h-7 w-7 place-items-center rounded-full text-ink hover:bg-cream-dark"
      >
        −
      </button>
      <span className="w-5 text-center text-sm font-semibold">{qty}</span>
      <button
        onClick={onInc}
        aria-label="Increase quantity"
        className="grid h-7 w-7 place-items-center rounded-full text-ink hover:bg-cream-dark"
      >
        +
      </button>
    </div>
  );
}

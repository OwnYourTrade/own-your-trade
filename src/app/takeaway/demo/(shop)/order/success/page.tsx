import type { Metadata } from "next";
import Link from "next/link";
import { getOrder, markPaidBySession, type Order } from "@/lib/orders";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { formatPrice } from "@/lib/menu";
import { site } from "@/lib/site";
import ClearCart from "@/components/order/ClearCart";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false },
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { order?: string; session_id?: string; demo?: string };
}) {
  const orderId = searchParams.order;
  const sessionId = searchParams.session_id;
  const isDemo = searchParams.demo === "1";

  let order: Order | undefined = orderId ? await getOrder(orderId) : undefined;
  let paymentVerified = isDemo;

  // Verify the Stripe session server-side and mark the order paid.
  if (order && sessionId && stripeConfigured) {
    try {
      const stripe = getStripe()!;
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        await markPaidBySession(sessionId);
        paymentVerified = true;
        order = await getOrder(order.id); // refresh
      }
    } catch {
      /* fall through — show pending state */
    }
  }
  if (order && order.payment.status === "paid") paymentVerified = true;

  if (!order) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="font-display text-3xl text-ink">Order not found</h1>
        <p className="mt-3 text-ink-soft">
          We couldn&apos;t find that order. If you were charged, please call us
          on {site.phone}.
        </p>
        <Link href="/takeaway/demo/order" className="btn-primary mt-6">
          Start a new order
        </Link>
      </div>
    );
  }

  const eta =
    order.type === "delivery"
      ? "We’ll have it with you in around 45 minutes."
      : "It’ll be ready to collect in around 20 minutes.";

  return (
    <div className="container-x py-16">
      <ClearCart />

      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl bg-white p-8 shadow-card sm:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-jade text-cream">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="eyebrow mt-5">
              {paymentVerified ? "Payment received" : "Order placed"}
            </p>
            <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              Thank you, {order.customer.name.split(" ")[0]}!
            </h1>
            <p className="mt-3 text-ink-soft">
              Your order <span className="font-semibold text-ink">{order.id}</span>{" "}
              has been sent to the {site.fullName} kitchen.
            </p>
            <p className="mt-1 text-ink-soft">{eta}</p>
          </div>

          {isDemo && (
            <div className="mt-6 rounded-xl border border-gold/40 bg-gold-light/20 px-5 py-3 text-center text-xs text-ink">
              This is a demo — no payment was taken. This page is exactly the
              confirmation your customer would see after ordering.
            </div>
          )}

          {/* Receipt */}
          <div className="mt-8 rounded-2xl bg-cream p-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold uppercase tracking-wide text-ink-soft">
                {order.type === "delivery" ? "Delivery" : "Collection"}
              </span>
              <span className="text-ink-soft">
                {new Date(order.createdAt).toLocaleString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {order.items.map((l) => (
                <li key={l.key} className="flex justify-between gap-3">
                  <span className="text-ink">
                    <span className="font-medium">{l.qty}×</span> {l.name}
                  </span>
                  <span className="font-medium text-ink">
                    {formatPrice(l.price * l.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t border-ink/10 pt-4 text-sm">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {order.type === "delivery" && (
                <div className="flex justify-between text-ink-soft">
                  <span>Delivery</span>
                  <span>
                    {order.deliveryFee === 0
                      ? "Free"
                      : formatPrice(order.deliveryFee)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-1 text-base font-bold text-ink">
                <span>Total {paymentVerified ? "paid" : "due"}</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {order.type === "delivery" && order.customer.address && (
            <p className="mt-5 text-center text-sm text-ink-soft">
              Delivering to: {order.customer.address}
            </p>
          )}

          <p className="mx-auto mt-8 max-w-sm text-center text-sm text-ink-soft">
            That order just landed on the kitchen&apos;s live dashboard in real time — see the
            view the owner runs their service from.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/takeaway/demo" className="btn-outline">
              Back to home
            </Link>
            <Link href="/takeaway/demo/dashboard" className="btn-primary">
              See what you&apos;d see as the business owner →
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Questions about your order? Call us on{" "}
          <a href={site.phoneHref} className="font-semibold text-lacquer">
            {site.phone}
          </a>
          .
        </p>
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import {
  getSignup,
  getSignupBySession,
  getSignupBySubscription,
  getSignupByCustomer,
  markPaidBySession,
  markNotified,
  updateSignup,
} from "@/lib/signups";
import { sendSignupNotifications } from "@/lib/email";
import { site } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Stripe webhook — keeps signup records in sync with real billing state:
//   checkout.session.completed   -> mark paid, store customer/subscription ids
//   invoice.paid                 -> subscription healthy (active)
//   invoice.payment_failed       -> past_due
//   customer.subscription.updated-> status / cancel_at_period_end / period end
//   customer.subscription.deleted-> canceled
// Signature-verified with STRIPE_WEBHOOK_SECRET. Returns 200 for events we
// don't handle; 500 on handler errors so Stripe retries.
// ---------------------------------------------------------------------------

const asId = (v: string | { id: string } | null | undefined): string | undefined =>
  typeof v === "string" ? v : v?.id ?? undefined;

/**
 * `current_period_end` lives on the subscription in older Stripe API versions
 * and on the subscription item in newer ones — accept either shape.
 */
function periodEndOf(sub: Stripe.Subscription): string | undefined {
  const raw =
    (sub as { current_period_end?: number }).current_period_end ??
    (sub.items?.data?.[0] as unknown as { current_period_end?: number } | undefined)
      ?.current_period_end;
  return raw ? new Date(raw * 1000).toISOString() : undefined;
}

async function applySubscriptionState(sub: Stripe.Subscription, forceStatus?: string) {
  const signup =
    (await getSignupBySubscription(sub.id)) ??
    (asId(sub.customer) ? await getSignupByCustomer(asId(sub.customer)!) : undefined) ??
    (sub.metadata?.signupId ? await getSignup(sub.metadata.signupId) : undefined);
  if (!signup) return;
  await updateSignup(signup.id, {
    stripeSubscriptionId: sub.id,
    stripeCustomerId: asId(sub.customer),
    subscriptionStatus: forceStatus ?? sub.status,
    cancelAtPeriodEnd: !!sub.cancel_at_period_end,
    currentPeriodEnd: periodEndOf(sub),
  });
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeConfigured || !secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe()!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || session.payment_status !== "paid") break;
        const signup = await getSignupBySession(session.id);
        if (!signup) break;
        await markPaidBySession(session.id);
        await updateSignup(signup.id, {
          stripeCustomerId: asId(session.customer),
          stripeSubscriptionId: asId(session.subscription),
          subscriptionStatus: "active",
        });
        // Send the confirmation emails if the success page hasn't already.
        const fresh = await getSignup(signup.id);
        if (fresh && fresh.payment.status === "paid" && !fresh.notifiedAt) {
          const tier = site.pricing.tiers.find((t) => t.id === fresh.tier);
          const result = await sendSignupNotifications(fresh, tier);
          if (result.ok) await markNotified(fresh.id);
        }
        break;
      }

      case "customer.subscription.updated": {
        await applySubscriptionState(event.data.object as Stripe.Subscription);
        break;
      }

      case "customer.subscription.deleted": {
        await applySubscriptionState(event.data.object as Stripe.Subscription, "canceled");
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = asId(invoice.subscription as string | Stripe.Subscription | null);
        if (subId) {
          const signup = await getSignupBySubscription(subId);
          if (signup) await updateSignup(signup.id, { subscriptionStatus: "active" });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = asId(invoice.subscription as string | Stripe.Subscription | null);
        if (subId) {
          const signup = await getSignupBySubscription(subId);
          if (signup) await updateSignup(signup.id, { subscriptionStatus: "past_due" });
        }
        break;
      }

      default:
        // Unhandled event types are fine — acknowledge them.
        break;
    }
  } catch (err) {
    console.error("[stripe-webhook] handler error for", event.type, err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

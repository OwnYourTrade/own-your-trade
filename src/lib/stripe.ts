import Stripe from "stripe";

// ---------------------------------------------------------------------------
// Dual-mode Stripe.
//
//   STRIPE_SECRET_KEY        sk_test_...  — test mode (local dev, previews,
//                                           and all signups created before
//                                           live keys existed)
//   STRIPE_LIVE_SECRET_KEY   sk_live_...  — LIVE mode, set only on the Vercel
//                                           production environment
//
// New signups use live mode whenever live keys are configured (production);
// everywhere else they fall back to test mode. Each signup records which mode
// created it (Signup.stripeMode), and every later Stripe call for that signup
// (success-page verification, billing portal) must use the same mode.
// The demo checkouts do not use Stripe at all.
// ---------------------------------------------------------------------------

export type StripeMode = "test" | "live";

const testSecret = process.env.STRIPE_SECRET_KEY;
const liveSecret = process.env.STRIPE_LIVE_SECRET_KEY;

/** True when test-mode Stripe is available (legacy name, kept for callers). */
export const stripeConfigured = Boolean(testSecret && testSecret.startsWith("sk_"));
/** True when LIVE Stripe is available (production only). */
export const liveStripeConfigured = Boolean(liveSecret && liveSecret.startsWith("sk_live_"));
/** True when any Stripe mode is available. */
export const anyStripeConfigured = stripeConfigured || liveStripeConfigured;

/** The mode NEW signups are created in: live wherever live keys are set. */
export const signupMode: StripeMode = liveStripeConfigured ? "live" : "test";

const cache: Partial<Record<StripeMode, Stripe>> = {};

export function getStripe(mode: StripeMode = "test"): Stripe | null {
  const key = mode === "live" ? liveSecret : testSecret;
  if (!key || !key.startsWith("sk_")) return null;
  if (mode === "live" && !key.startsWith("sk_live_")) return null; // never allow a non-live key in the live slot
  if (!cache[mode]) cache[mode] = new Stripe(key, { apiVersion: "2024-06-20" });
  return cache[mode]!;
}

/**
 * Create a Stripe Customer Billing Portal session for a customer — the
 * self-serve place to update card details and cancel the subscription.
 * A fresh account has no default portal configuration, so on that specific
 * failure we create a sensible one (invoices, card update, cancel at period
 * end) and retry once. `mode` must match the mode the customer was created in.
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string,
  mode: StripeMode = "test"
): Promise<{ url: string }> {
  const stripe = getStripe(mode);
  if (!stripe) throw new Error(`Stripe (${mode}) is not configured`);
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return { url: session.url };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (!/default configuration has not been created|No configuration provided/i.test(msg)) throw err;
    await stripe.billingPortal.configurations.create({
      business_profile: { headline: "Own Your Trade — manage your plan" },
      features: {
        invoice_history: { enabled: true },
        payment_method_update: { enabled: true },
        customer_update: { enabled: true, allowed_updates: ["email", "address"] },
        subscription_cancel: { enabled: true, mode: "at_period_end" },
      },
    });
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return { url: session.url };
  }
}

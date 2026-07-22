import Stripe from "stripe";

// Stripe runs in TEST mode. Provide keys via .env.local:
//   STRIPE_SECRET_KEY=sk_test_...
//   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
//
// If no secret key is present, the app falls back to a clearly-labelled
// "demo" checkout so the full ordering flow can still be exercised without
// any Stripe account. With keys present, real Stripe test-mode Checkout is used.

const secret = process.env.STRIPE_SECRET_KEY;

export const stripeConfigured = Boolean(secret && secret.startsWith("sk_"));

let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!stripeConfigured) return null;
  if (!cached) {
    cached = new Stripe(secret as string, {
      apiVersion: "2024-06-20",
    });
  }
  return cached;
}

/**
 * Create a Stripe Customer Billing Portal session for a customer — the
 * self-serve place to update card details and cancel the subscription.
 * A fresh (test) account has no default portal configuration, so on that
 * specific failure we create a sensible one (invoices, card update, cancel
 * at period end) and retry once.
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<{ url: string }> {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured");
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

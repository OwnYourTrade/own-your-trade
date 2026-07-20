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

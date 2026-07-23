import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSignup, signupStripeMode } from "@/lib/signups";
import { anyStripeConfigured, createBillingPortalSession } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin-only: generate a Billing Portal link for a signup's Stripe customer —
// e.g. to send to a customer, or to manage/cancel a subscription on their
// behalf while on the phone with them.
export async function POST(req: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!anyStripeConfigured) {
    return NextResponse.json({ error: "Billing is not enabled." }, { status: 503 });
  }

  let body: { signupId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const signupId = typeof body.signupId === "string" ? body.signupId.trim() : "";
  if (!signupId) {
    return NextResponse.json({ error: "signupId required." }, { status: 400 });
  }

  const signup = await getSignup(signupId);
  if (!signup?.stripeCustomerId) {
    return NextResponse.json({ error: "No Stripe customer on this signup." }, { status: 404 });
  }

  const host = req.headers.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  try {
    const portal = await createBillingPortalSession(
      signup.stripeCustomerId,
      `${proto}://${host}/admin`,
      signupStripeMode(signup)
    );
    return NextResponse.json({ url: portal.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not open the billing portal.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

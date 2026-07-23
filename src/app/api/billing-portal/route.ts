import { NextResponse } from "next/server";
import { getStripe, anyStripeConfigured, createBillingPortalSession } from "@/lib/stripe";
import { getSignupBySession, signupStripeMode } from "@/lib/signups";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Customer self-serve billing portal (update card, cancel subscription).
// Capability-gated by the Stripe Checkout session id: it's unguessable and is
// only ever shown to the customer on their own confirmation page/URL, so
// possessing it proves this is that customer. We resolve the session -> the
// Stripe customer -> a Billing Portal session, and never accept a raw
// customer id from the client.
// ---------------------------------------------------------------------------

function originFrom(req: Request): string {
  const explicit = req.headers.get("origin");
  if (explicit) return explicit;
  const host = req.headers.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  if (!anyStripeConfigured) {
    return NextResponse.json({ error: "Billing is not enabled." }, { status: 503 });
  }

  let body: { sessionId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
  if (!sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  }

  // The session id must belong to one of our signups; that signup tells us
  // which Stripe mode (live/test) its customer lives in.
  const signup = await getSignupBySession(sessionId);
  if (!signup) {
    return NextResponse.json({ error: "No billing account found for this session." }, { status: 404 });
  }
  const mode = signupStripeMode(signup);
  const stripe = getStripe(mode);
  if (!stripe) {
    return NextResponse.json({ error: "Billing is not enabled." }, { status: 503 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
    if (!customerId) {
      return NextResponse.json({ error: "No billing account found for this session." }, { status: 404 });
    }
    const returnUrl = `${originFrom(req)}/get-started/success?signup=${session.client_reference_id ?? ""}&session_id=${sessionId}`;
    const portal = await createBillingPortalSession(customerId, returnUrl, mode);
    return NextResponse.json({ url: portal.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not open the billing portal.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

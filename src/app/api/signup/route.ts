import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { createSignup, updateSignup, listSignups } from "@/lib/signups";
import { isAdmin } from "@/lib/auth";
import { site } from "@/config/site";
import { getVertical } from "@/config/verticals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Real customer signups — admin-only (separate from the demo dashboards).
export async function GET() {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ signups: await listSignups() });
}

function originFrom(req: Request): string {
  const explicit = req.headers.get("origin");
  if (explicit) return explicit;
  const host = req.headers.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  // Spam honeypot: a hidden field only bots fill. If present, silently drop
  // the submission (no signup, no Stripe session) and return a benign success.
  if (str(body.company_url)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const tradeSlug = str(body.trade);
  const tierId = str(body.tier);
  const business = str(body.business);
  const name = str(body.name);
  const email = str(body.email);
  const phone = str(body.phone);
  const area = str(body.area);
  const domain = str(body.domain);
  const website = str(body.website);
  const notes = str(body.notes);

  // Resolve the tier and trade server-side — never trust prices from the client.
  const tier = site.pricing.tiers.find((t) => t.id === tierId);
  const vertical = getVertical(tradeSlug);
  if (!tier) return NextResponse.json({ error: "Please choose a plan." }, { status: 400 });
  if (!vertical) return NextResponse.json({ error: "Please choose your trade." }, { status: 400 });

  if (!business || !name || !phone || !area) {
    return NextResponse.json(
      { error: "Please fill in your business name, your name, phone and area." },
      { status: 400 }
    );
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  // First payment = one-off setup (if any) + first month.
  const firstAmount = tier.setup + tier.monthly;

  const base = {
    trade: vertical.trade,
    tier: tier.id,
    business,
    name,
    email,
    phone,
    area,
    domain: domain || undefined,
    website: website || undefined,
    notes: notes || undefined,
  };

  const origin = originFrom(req);

  // ---- Demo mode (no Stripe keys) ---------------------------------------
  if (!stripeConfigured) {
    const signup = await createSignup({
      ...base,
      payment: { status: "demo", method: "demo", amount: firstAmount },
    });
    return NextResponse.json({
      url: `${origin}/get-started/success?signup=${signup.id}&demo=1`,
      demo: true,
    });
  }

  // ---- Real Stripe test-mode Checkout: recurring subscription -----------
  // The monthly fee is a genuine recurring price (charged automatically every
  // month until cancelled); any one-off setup fee is added to the first
  // invoice only. Cancellation is self-serve via the Stripe Billing Portal.
  const signup = await createSignup({
    ...base,
    payment: { status: "unpaid", method: "stripe", amount: firstAmount },
  });

  try {
    const stripe = getStripe()!;

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    if (tier.setup > 0) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: Math.round(tier.setup * 100),
          product_data: { name: `${tier.name} one-off setup & build` },
        },
      });
    }
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "gbp",
        unit_amount: Math.round(tier.monthly * 100),
        recurring: { interval: "month" },
        product_data: { name: `Own Your Trade — ${tier.name} plan` },
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items,
      customer_email: email,
      client_reference_id: signup.id,
      metadata: { signupId: signup.id, tier: tier.id, trade: vertical.slug, business },
      subscription_data: {
        metadata: { signupId: signup.id, tier: tier.id, business },
      },
      success_url: `${origin}/get-started/success?signup=${signup.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/get-started?trade=${vertical.slug}&tier=${tier.id}&canceled=1`,
    });
    await updateSignup(signup.id, { stripeSessionId: session.id });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment could not be started.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

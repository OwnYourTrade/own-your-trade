import { NextResponse } from "next/server";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { createOrder, priceCart, updateOrder, type CartInput } from "@/lib/orders";
import { site, type OrderType } from "@/lib/site";

export const runtime = "nodejs";

type Body = {
  type: OrderType;
  customer: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
  };
  cart: CartInput;
};

function originFrom(req: Request): string {
  const explicit = req.headers.get("origin");
  if (explicit) return explicit;
  const host = req.headers.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const type: OrderType = body.type === "delivery" ? "delivery" : "collection";
  const cart = Array.isArray(body.cart) ? body.cart : [];

  // ---- Validate customer -------------------------------------------------
  const name = (body.customer?.name || "").trim();
  const phone = (body.customer?.phone || "").trim();
  const email = (body.customer?.email || "").trim();
  const address = (body.customer?.address || "").trim();
  const notes = (body.customer?.notes || "").trim();

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Please provide your name and phone number." },
      { status: 400 }
    );
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email for your receipt." },
      { status: 400 }
    );
  }
  if (type === "delivery" && !address) {
    return NextResponse.json(
      { error: "A delivery address is required for delivery orders." },
      { status: 400 }
    );
  }

  // ---- Price the cart server-side ---------------------------------------
  const priced = priceCart(cart, type);
  if (priced.items.length === 0) {
    return NextResponse.json({ error: "Your basket is empty." }, { status: 400 });
  }
  if (type === "delivery" && priced.subtotal < site.delivery.minimum) {
    return NextResponse.json(
      {
        error: `Minimum order for delivery is £${site.delivery.minimum.toFixed(
          2
        )}.`,
      },
      { status: 400 }
    );
  }

  const customer = { name, phone, email, address, notes };
  const origin = originFrom(req);

  // ---- Demo mode (no Stripe keys) ---------------------------------------
  if (!stripeConfigured) {
    const order = await createOrder({
      type,
      customer,
      priced,
      method: "demo",
    });
    return NextResponse.json({
      url: `${origin}/takeaway/demo/order/success?order=${order.id}&demo=1`,
      demo: true,
    });
  }

  // ---- Real Stripe test-mode Checkout -----------------------------------
  const stripe = getStripe()!;

  // Create the order first so we always have a record, even if the customer
  // abandons payment (it stays "unpaid" until the session completes).
  const order = await createOrder({ type, customer, priced, method: "stripe" });

  const line_items = priced.items.map((l) => ({
    quantity: l.qty,
    price_data: {
      currency: "gbp",
      unit_amount: Math.round(l.price * 100),
      product_data: { name: l.name },
    },
  }));
  if (priced.deliveryFee > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "gbp",
        unit_amount: Math.round(priced.deliveryFee * 100),
        product_data: { name: "Delivery" },
      },
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: email,
      client_reference_id: order.id,
      metadata: { orderId: order.id, type },
      success_url: `${origin}/takeaway/demo/order/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/takeaway/demo/order?canceled=1`,
    });

    await updateOrder(order.id, { stripeSessionId: session.id });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Payment could not be started.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

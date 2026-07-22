import { NextResponse } from "next/server";
import { createOrder, priceCart, type CartInput } from "@/lib/orders";
import { site, type OrderType } from "@/lib/site";

export const runtime = "nodejs";

// ---------------------------------------------------------------------------
// DEMO checkout — the takeaway demo's "place order" endpoint. This is a
// product demo, not a real transaction: no payment step, no card details.
// The order is validated and priced server-side, saved, and the customer goes
// straight to the confirmation page (exactly what their customer would see).
// Real payments happen only in the Get Started signup flow (/api/signup),
// which stays fully on Stripe.
// ---------------------------------------------------------------------------

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

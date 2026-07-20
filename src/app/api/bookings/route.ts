import { NextResponse } from "next/server";
import { isStaff } from "@/lib/auth";
import { createBooking, listBookings } from "@/lib/bookings";
import { getBookingConfig } from "@/config/demos/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isStaff()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const vertical = new URL(req.url).searchParams.get("vertical") || undefined;
  return NextResponse.json({ bookings: await listBookings(vertical) });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const vertical = str(body.vertical);
  const serviceId = str(body.serviceId);
  const day = str(body.day);
  const time = str(body.time);
  const staff = str(body.staff) || undefined;

  const config = getBookingConfig(vertical);
  if (!config) {
    return NextResponse.json({ error: "Unknown booking type." }, { status: 400 });
  }

  // Re-resolve the service (and its price) server-side — never trust the client.
  const service = config.services.find((s) => s.id === serviceId);
  if (!service) {
    return NextResponse.json({ error: "Please choose a service." }, { status: 400 });
  }
  if (!day || !time) {
    return NextResponse.json({ error: "Please choose a day and time." }, { status: 400 });
  }

  const customer = (body.customer ?? {}) as Record<string, unknown>;
  const name = str(customer.name);
  const phone = str(customer.phone);
  if (!name || !phone) {
    return NextResponse.json(
      { error: "Please provide your name and phone number." },
      { status: 400 }
    );
  }

  const booking = await createBooking({
    vertical,
    service: service.name,
    price: service.price,
    staff,
    day,
    time,
    customer: {
      name,
      phone,
      email: str(customer.email) || undefined,
      notes: str(customer.notes) || undefined,
    },
  });

  return NextResponse.json({ ok: true, booking });
}

import { NextResponse } from "next/server";
import { isStaff } from "@/lib/auth";
import { updateBookingStatus, type BookingStatus } from "@/lib/bookings";

export const runtime = "nodejs";

const VALID: BookingStatus[] = ["new", "confirmed", "completed", "cancelled"];

export async function POST(req: Request, { params }: { params: { id: string } }) {
  if (!isStaff()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let status: BookingStatus;
  try {
    status = (await req.json()).status;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!VALID.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await updateBookingStatus(params.id, status);
  if (!updated) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  return NextResponse.json({ booking: updated });
}

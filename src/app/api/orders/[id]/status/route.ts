import { NextResponse } from "next/server";
import { isStaff } from "@/lib/auth";
import { updateOrder, type OrderStatus } from "@/lib/orders";

export const runtime = "nodejs";

const VALID: OrderStatus[] = [
  "new",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isStaff()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let status: OrderStatus;
  try {
    const body = await req.json();
    status = body.status;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!VALID.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await updateOrder(params.id, { status });
  if (!updated) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ order: updated });
}

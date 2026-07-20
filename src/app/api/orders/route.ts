import { NextResponse } from "next/server";
import { isStaff } from "@/lib/auth";
import { listOrders } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isStaff()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ orders: await listOrders() });
}

import { NextResponse } from "next/server";
import { isStaff } from "@/lib/auth";
import { writeList } from "@/lib/storage";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// POST /api/demo-reset — staff-gated maintenance for the DEMO dashboards.
//
// Clears demo-only data: the kitchen order queue and every booking diary.
// Sample bookings re-seed automatically (with fresh, current dates) the next
// time each booking dashboard is opened, so this is the way to tidy up after
// prospects have filled the demos with test orders/bookings.
//
// NEVER touches real business data — enquiries (leads) and signups live in
// separate collections and are not written here.
// ---------------------------------------------------------------------------
export async function POST() {
  if (!isStaff()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await writeList("orders", []);
  await writeList("bookings", []);
  return NextResponse.json({ ok: true, cleared: ["orders", "bookings"] });
}

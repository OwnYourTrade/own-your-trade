import { NextResponse } from "next/server";
import { createLead, listLeads } from "@/lib/leads";
import { isStaff } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isStaff()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ leads: await listLeads() });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(body.name);
  const email = str(body.email);

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const lead = await createLead({
    source: str(body.source) || "hub",
    trade: str(body.trade) || undefined,
    name,
    business: str(body.business) || undefined,
    email,
    phone: str(body.phone) || undefined,
    message: str(body.message) || undefined,
  });

  return NextResponse.json({ ok: true, id: lead.id });
}

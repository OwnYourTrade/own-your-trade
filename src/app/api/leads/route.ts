import { NextResponse } from "next/server";
import { createLead, listLeads } from "@/lib/leads";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Real enquiries — admin-only (separate from the demo dashboards' password).
export async function GET() {
  if (!isAdmin()) {
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

  // Spam honeypot: a hidden field only bots fill. If present, silently drop
  // the submission and return a normal-looking success so bots don't retry.
  if (str(body.company_url)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

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

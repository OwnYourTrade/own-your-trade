import { NextResponse } from "next/server";
import { checkPassword, staffToken, STAFF_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = await req.json();
    password = body.password || "";
  } catch {
    /* ignore */
  }

  if (!checkPassword(password)) {
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(STAFF_COOKIE, staffToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}

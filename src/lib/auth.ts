import crypto from "crypto";
import { cookies } from "next/headers";

// Lightweight shared-password auth for the staff dashboard.
// Not a full auth system — appropriate for a single-terminal takeaway tool.
// Password is configurable via env; defaults keep the demo runnable out-of-box.

export const STAFF_COOKIE = "oyt_owner";

function password(): string {
  return process.env.DASHBOARD_PASSWORD || "owner";
}

// Token stored in the cookie: HMAC of the password with a server secret.
function token(): string {
  const secret = process.env.DASHBOARD_SECRET || "own-your-trade-demo-secret";
  return crypto.createHmac("sha256", secret).update(password()).digest("hex");
}

export function checkPassword(input: string): boolean {
  const a = Buffer.from(input || "");
  const b = Buffer.from(password());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function staffToken(): string {
  return token();
}

export function isStaff(): boolean {
  const c = cookies().get(STAFF_COOKIE)?.value;
  return Boolean(c && c === token());
}

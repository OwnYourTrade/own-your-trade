import crypto from "crypto";
import { cookies } from "next/headers";

// ---------------------------------------------------------------------------
// Two independent, cookie-based shared-password auth systems:
//
//   • STAFF  — the demo dashboards (kitchen order queue, booking diaries).
//     These only ever show sample/demo data and are shown to prospects as
//     "the owner's view". Guarded by DASHBOARD_PASSWORD / DASHBOARD_SECRET.
//
//   • ADMIN  — the private business area (/admin: real signups + enquiries with
//     real people's contact details). Completely separate password and signing
//     secret (ADMIN_PASSWORD / ADMIN_SECRET) and a separate cookie, so the demo
//     password can never reach real customer data.
//
// Each cookie stores an HMAC of the password with its own secret, so cookies
// can't be forged and the two systems can't be crossed.
// ---------------------------------------------------------------------------

function hmac(secret: string, value: string): string {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function safeEqual(input: string, expected: string): boolean {
  const a = Buffer.from(input || "");
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// --- STAFF (demo dashboards) ------------------------------------------------

export const STAFF_COOKIE = "oyt_owner";

function staffPassword(): string {
  return process.env.DASHBOARD_PASSWORD || "owner";
}
function staffTok(): string {
  return hmac(process.env.DASHBOARD_SECRET || "own-your-trade-demo-secret", staffPassword());
}

export function checkPassword(input: string): boolean {
  return safeEqual(input, staffPassword());
}
export function staffToken(): string {
  return staffTok();
}
export function isStaff(): boolean {
  const c = cookies().get(STAFF_COOKIE)?.value;
  return Boolean(c && c === staffTok());
}

// --- ADMIN (private business data) -----------------------------------------

export const ADMIN_COOKIE = "oyt_admin";

function adminPassword(): string {
  // No shared default with the demo password. A weak dev default locally; on a
  // real deployment ADMIN_PASSWORD / ADMIN_SECRET are set as env vars.
  return process.env.ADMIN_PASSWORD || "admin-local-dev";
}
function adminTok(): string {
  return hmac(process.env.ADMIN_SECRET || "own-your-trade-admin-dev-secret", adminPassword());
}

export function checkAdminPassword(input: string): boolean {
  return safeEqual(input, adminPassword());
}
export function adminToken(): string {
  return adminTok();
}
export function isAdmin(): boolean {
  const c = cookies().get(ADMIN_COOKIE)?.value;
  return Boolean(c && c === adminTok());
}

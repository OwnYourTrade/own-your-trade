import { readList, writeList } from "./storage";

// ---------------------------------------------------------------------------
// Get Started signup store (new paying customers). Persistence via lib/storage
// (Vercel KV in production, JSON file locally). The private /admin area reads
// from here.
// ---------------------------------------------------------------------------

export type SignupPayment = {
  status: "unpaid" | "paid" | "demo";
  method: "stripe" | "demo";
  amount: number; // first payment (setup + first month, or first month)
  stripeSessionId?: string;
};

export type Signup = {
  id: string;
  createdAt: string;
  trade: string;
  tier: string; // starter | growth | established
  business: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  domain?: string;
  website?: string;
  notes?: string;
  payment: SignupPayment;
  notifiedAt?: string; // set once the confirmation + owner-alert emails have been sent

  // --- Recurring billing (Stripe subscription) -----------------------------
  /**
   * Which Stripe mode this signup's customer/subscription live in.
   * Signups created before live keys existed have no value = "test".
   * Every Stripe call for this signup must use the same mode.
   */
  stripeMode?: "test" | "live";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  /** Stripe subscription status: active | past_due | canceled | ... */
  subscriptionStatus?: string;
  /** True when the customer has cancelled but keeps access until period end. */
  cancelAtPeriodEnd?: boolean;
  /** ISO date the current paid period runs to (= next charge date while active). */
  currentPeriodEnd?: string;
};

/** The Stripe mode a signup's records live in (legacy rows default to test). */
export function signupStripeMode(s: Pick<Signup, "stripeMode">): "test" | "live" {
  return s.stripeMode === "live" ? "live" : "test";
}

const COLLECTION = "signups";
const readAll = () => readList<Signup>(COLLECTION);
const writeAll = (rows: Signup[]) => writeList(COLLECTION, rows);

function genId(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `SIGN-${n}`;
}

export async function createSignup(input: Omit<Signup, "id" | "createdAt">): Promise<Signup> {
  const rows = await readAll();
  let id = genId();
  while (rows.some((s) => s.id === id)) id = genId();
  const signup: Signup = { id, createdAt: new Date().toISOString(), ...input };
  rows.push(signup);
  await writeAll(rows);
  return signup;
}

export async function getSignup(id: string): Promise<Signup | undefined> {
  return (await readAll()).find((s) => s.id === id);
}

export async function getSignupBySession(sessionId: string): Promise<Signup | undefined> {
  return (await readAll()).find((s) => s.payment.stripeSessionId === sessionId);
}

export async function updateSignup(
  id: string,
  patch: {
    stripeSessionId?: string;
    payment?: Partial<SignupPayment>;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
    cancelAtPeriodEnd?: boolean;
    currentPeriodEnd?: string;
  }
): Promise<Signup | undefined> {
  const rows = await readAll();
  const idx = rows.findIndex((s) => s.id === id);
  if (idx === -1) return undefined;
  if (patch.stripeSessionId) rows[idx].payment.stripeSessionId = patch.stripeSessionId;
  if (patch.payment) rows[idx].payment = { ...rows[idx].payment, ...patch.payment };
  if (patch.stripeCustomerId !== undefined) rows[idx].stripeCustomerId = patch.stripeCustomerId;
  if (patch.stripeSubscriptionId !== undefined) rows[idx].stripeSubscriptionId = patch.stripeSubscriptionId;
  if (patch.subscriptionStatus !== undefined) rows[idx].subscriptionStatus = patch.subscriptionStatus;
  if (patch.cancelAtPeriodEnd !== undefined) rows[idx].cancelAtPeriodEnd = patch.cancelAtPeriodEnd;
  if (patch.currentPeriodEnd !== undefined) rows[idx].currentPeriodEnd = patch.currentPeriodEnd;
  await writeAll(rows);
  return rows[idx];
}

export async function getSignupBySubscription(subscriptionId: string): Promise<Signup | undefined> {
  return (await readAll()).find((s) => s.stripeSubscriptionId === subscriptionId);
}

export async function getSignupByCustomer(customerId: string): Promise<Signup | undefined> {
  return (await readAll()).find((s) => s.stripeCustomerId === customerId);
}

export async function markPaidBySession(sessionId: string): Promise<Signup | undefined> {
  const s = await getSignupBySession(sessionId);
  if (!s) return undefined;
  return updateSignup(s.id, { payment: { status: "paid" } });
}

/**
 * Records that the signup's confirmation + owner-notification emails have been
 * sent, so a page refresh never double-sends. Returns the updated row.
 */
export async function markNotified(id: string): Promise<Signup | undefined> {
  const rows = await readAll();
  const idx = rows.findIndex((s) => s.id === id);
  if (idx === -1) return undefined;
  rows[idx].notifiedAt = new Date().toISOString();
  await writeAll(rows);
  return rows[idx];
}

export async function listSignups(): Promise<Signup[]> {
  return (await readAll()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

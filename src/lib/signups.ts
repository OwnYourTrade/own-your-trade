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
};

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
  patch: { stripeSessionId?: string; payment?: Partial<SignupPayment> }
): Promise<Signup | undefined> {
  const rows = await readAll();
  const idx = rows.findIndex((s) => s.id === id);
  if (idx === -1) return undefined;
  if (patch.stripeSessionId) rows[idx].payment.stripeSessionId = patch.stripeSessionId;
  if (patch.payment) rows[idx].payment = { ...rows[idx].payment, ...patch.payment };
  await writeAll(rows);
  return rows[idx];
}

export async function markPaidBySession(sessionId: string): Promise<Signup | undefined> {
  const s = await getSignupBySession(sessionId);
  if (!s) return undefined;
  return updateSignup(s.id, { payment: { status: "paid" } });
}

export async function listSignups(): Promise<Signup[]> {
  return (await readAll()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

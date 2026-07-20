import { readList, writeList } from "./storage";

// ---------------------------------------------------------------------------
// Lead store — "get started" / contact enquiries from the hub and vertical
// pages. Persistence via lib/storage (Vercel KV in production, JSON locally).
// The private /admin area reads from here.
// ---------------------------------------------------------------------------

export type Lead = {
  id: string;
  createdAt: string;
  source: string; // "hub", "footer", or a vertical slug
  trade?: string;
  name: string;
  business?: string;
  email: string;
  phone?: string;
  message?: string;
};

const COLLECTION = "leads";

function genId(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `LEAD-${n}`;
}

export async function createLead(input: Omit<Lead, "id" | "createdAt">): Promise<Lead> {
  const leads = await readList<Lead>(COLLECTION);
  let id = genId();
  while (leads.some((l) => l.id === id)) id = genId();
  const lead: Lead = { id, createdAt: new Date().toISOString(), ...input };
  leads.push(lead);
  await writeList(COLLECTION, leads);
  return lead;
}

export async function listLeads(): Promise<Lead[]> {
  return (await readList<Lead>(COLLECTION)).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

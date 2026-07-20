import fs from "fs";
import path from "path";
import { createClient, type VercelKV } from "@vercel/kv";

// ---------------------------------------------------------------------------
// Dual-mode storage. Each "collection" is a JSON array of records under a key.
//
//  • On Vercel (read-only filesystem): use serverless Redis (Vercel KV /
//    Upstash) when its REST credentials are present. We accept either the
//    KV_REST_API_* names or the UPSTASH_REDIS_REST_* names, so it works
//    regardless of how the store is connected in the dashboard.
//  • Locally / anywhere without those vars: fall back to JSON files in ./data,
//    so the demo runs with zero setup during development.
//
// Every store (orders / bookings / leads / signups) goes through here, so the
// KV migration is isolated to this one file.
// ---------------------------------------------------------------------------

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const useKV = Boolean(KV_URL && KV_TOKEN);

export const storageMode: "kv" | "file" = useKV ? "kv" : "file";

const DATA_DIR = path.join(process.cwd(), "data");
const fileFor = (name: string) => path.join(DATA_DIR, `${name}.json`);
const kvKey = (name: string) => `oyt:${name}`;

let client: VercelKV | null = null;
function kv(): VercelKV {
  if (!client) client = createClient({ url: KV_URL as string, token: KV_TOKEN as string });
  return client;
}

export async function readList<T>(name: string): Promise<T[]> {
  if (useKV) {
    const v = await kv().get<T[]>(kvKey(name));
    return Array.isArray(v) ? v : [];
  }
  try {
    return JSON.parse(fs.readFileSync(fileFor(name), "utf8")) as T[];
  } catch {
    return [];
  }
}

export async function writeList<T>(name: string, rows: T[]): Promise<void> {
  if (useKV) {
    await kv().set(kvKey(name), rows);
    return;
  }
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  // Write to a temp file then rename for a near-atomic replace.
  const tmp = `${fileFor(name)}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(rows, null, 2), "utf8");
  fs.renameSync(tmp, fileFor(name));
}

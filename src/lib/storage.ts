import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Dual-mode storage. Each "collection" is a JSON array of records stored under
// a key.
//
//  • On Vercel (read-only filesystem): use Vercel KV (serverless Redis) when
//    KV_REST_API_URL / KV_REST_API_TOKEN are present.
//  • Locally / anywhere without KV: fall back to the JSON files in ./data,
//    so the demo runs with zero setup during development.
//
// Every store (orders / bookings / leads / signups) goes through here, so the
// KV migration is isolated to this one file.
// ---------------------------------------------------------------------------

const useKV = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export const storageMode: "kv" | "file" = useKV ? "kv" : "file";

const DATA_DIR = path.join(process.cwd(), "data");
const fileFor = (name: string) => path.join(DATA_DIR, `${name}.json`);
const kvKey = (name: string) => `oyt:${name}`;

// Lazily load the KV client only when it's actually configured, so file mode
// never imports it and never needs the env vars.
async function kvClient() {
  const mod = await import("@vercel/kv");
  return mod.kv;
}

export async function readList<T>(name: string): Promise<T[]> {
  if (useKV) {
    const kv = await kvClient();
    const v = await kv.get<T[]>(kvKey(name));
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
    const kv = await kvClient();
    await kv.set(kvKey(name), rows);
    return;
  }
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  // Write to a temp file then rename for a near-atomic replace.
  const tmp = `${fileFor(name)}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(rows, null, 2), "utf8");
  fs.renameSync(tmp, fileFor(name));
}

import { readList, writeList } from "./storage";

// ---------------------------------------------------------------------------
// Booking store (driving / barber / tutor / PT demos). Persistence via
// lib/storage (Vercel KV in production, JSON file locally).
// ---------------------------------------------------------------------------

export type BookingStatus = "new" | "confirmed" | "completed" | "cancelled";

export type Booking = {
  id: string;
  vertical: string;
  createdAt: string;
  status: BookingStatus;
  service: string;
  price: number;
  staff?: string;
  day: string; // "2026-07-20"
  time: string; // "14:00"
  customer: { name: string; phone: string; email?: string; notes?: string };
};

const COLLECTION = "bookings";
const readAll = () => readList<Booking>(COLLECTION);
const writeAll = (rows: Booking[]) => writeList(COLLECTION, rows);

/** ISO date (YYYY-MM-DD) for `offset` days from today — for seeding samples. */
export function isoFromOffset(offset: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function genId(vertical: string): string {
  const p = vertical.slice(0, 3).toUpperCase();
  const n = Math.floor(1000 + Math.random() * 9000);
  return `${p}-${n}`;
}

export async function createBooking(input: {
  vertical: string;
  service: string;
  price: number;
  staff?: string;
  day: string;
  time: string;
  customer: Booking["customer"];
  status?: BookingStatus;
}): Promise<Booking> {
  const rows = await readAll();
  let id = genId(input.vertical);
  while (rows.some((b) => b.id === id)) id = genId(input.vertical);
  const booking: Booking = {
    id,
    vertical: input.vertical,
    createdAt: new Date().toISOString(),
    status: input.status ?? "new",
    service: input.service,
    price: input.price,
    staff: input.staff,
    day: input.day,
    time: input.time,
    customer: input.customer,
  };
  rows.push(booking);
  await writeAll(rows);
  return booking;
}

export async function listBookings(vertical?: string): Promise<Booking[]> {
  const rows = await readAll();
  const filtered = vertical ? rows.filter((b) => b.vertical === vertical) : rows;
  return filtered.sort((a, b) => (`${a.day} ${a.time}` < `${b.day} ${b.time}` ? -1 : 1));
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<Booking | undefined> {
  const rows = await readAll();
  const idx = rows.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  rows[idx].status = status;
  await writeAll(rows);
  return rows[idx];
}

/** Seed a vertical's sample bookings once, so its dashboard is never empty. */
export async function seedBookings(
  vertical: string,
  samples: {
    service: string;
    price: number;
    staff?: string;
    day: string;
    time: string;
    customer: Booking["customer"];
    status: BookingStatus;
  }[]
): Promise<void> {
  const rows = await readAll();
  if (rows.some((b) => b.vertical === vertical)) return; // already seeded / has bookings
  for (const s of samples) {
    rows.push({
      id: genId(vertical),
      vertical,
      createdAt: new Date().toISOString(),
      status: s.status,
      service: s.service,
      price: s.price,
      staff: s.staff,
      day: s.day,
      time: s.time,
      customer: s.customer,
    });
  }
  await writeAll(rows);
}

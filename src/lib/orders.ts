import { resolveItem } from "./menu";
import { site, type OrderType } from "./site";
import { readList, writeList } from "./storage";

// ---------------------------------------------------------------------------
// Order store. Persistence goes through lib/storage (Vercel KV in production,
// JSON file locally). Prices are NEVER trusted from the client — see priceCart.
// ---------------------------------------------------------------------------

export type OrderStatus = "new" | "preparing" | "ready" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "demo";

export type OrderLine = { key: string; name: string; price: number; qty: number };

export type Customer = {
  name: string;
  phone: string;
  email: string;
  address?: string;
  notes?: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  type: OrderType;
  customer: Customer;
  items: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  payment: {
    status: PaymentStatus;
    method: "stripe" | "demo";
    stripeSessionId?: string;
  };
};

const COLLECTION = "orders";
const readAll = () => readList<Order>(COLLECTION);
const writeAll = (rows: Order[]) => writeList(COLLECTION, rows);

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
function genId(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${n}`;
}

// ---------------------------------------------------------------------------

export type CartInput = { key: string; qty: number }[];

export type PricedOrder = {
  items: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
};

/** Re-price a cart from the canonical menu data (never trust client prices). */
export function priceCart(cart: CartInput, type: OrderType): PricedOrder {
  const items: OrderLine[] = [];
  for (const line of cart) {
    const qty = Math.max(1, Math.min(50, Math.floor(line.qty)));
    const resolved = resolveItem(line.key);
    if (!resolved) continue;
    items.push({ key: resolved.key, name: resolved.name, price: resolved.price, qty });
  }
  const subtotal = round2(items.reduce((s, l) => s + l.price * l.qty, 0));
  let deliveryFee = 0;
  if (type === "delivery") {
    deliveryFee = subtotal >= site.delivery.freeOver ? 0 : site.delivery.fee;
  }
  const total = round2(subtotal + deliveryFee);
  return { items, subtotal, deliveryFee, total };
}

export async function createOrder(input: {
  type: OrderType;
  customer: Customer;
  priced: PricedOrder;
  method: "stripe" | "demo";
  stripeSessionId?: string;
}): Promise<Order> {
  const orders = await readAll();
  let id = genId();
  while (orders.some((o) => o.id === id)) id = genId();

  const order: Order = {
    id,
    createdAt: new Date().toISOString(),
    status: "new",
    type: input.type,
    customer: input.customer,
    items: input.priced.items,
    subtotal: input.priced.subtotal,
    deliveryFee: input.priced.deliveryFee,
    total: input.priced.total,
    payment: {
      status: input.method === "demo" ? "demo" : "unpaid",
      method: input.method,
      stripeSessionId: input.stripeSessionId,
    },
  };
  orders.push(order);
  await writeAll(orders);
  return order;
}

export async function getOrder(id: string): Promise<Order | undefined> {
  return (await readAll()).find((o) => o.id === id);
}

export async function getOrderBySession(sessionId: string): Promise<Order | undefined> {
  return (await readAll()).find((o) => o.payment.stripeSessionId === sessionId);
}

export async function listOrders(): Promise<Order[]> {
  return (await readAll()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function updateOrder(
  id: string,
  patch: Partial<Pick<Order, "status">> & {
    payment?: Partial<Order["payment"]>;
    stripeSessionId?: string;
  }
): Promise<Order | undefined> {
  const orders = await readAll();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  const current = orders[idx];
  if (patch.status) current.status = patch.status;
  if (patch.stripeSessionId) current.payment.stripeSessionId = patch.stripeSessionId;
  if (patch.payment) current.payment = { ...current.payment, ...patch.payment };
  orders[idx] = current;
  await writeAll(orders);
  return current;
}

export async function markPaidBySession(sessionId: string): Promise<Order | undefined> {
  const order = await getOrderBySession(sessionId);
  if (!order) return undefined;
  return updateOrder(order.id, { payment: { status: "paid" } });
}

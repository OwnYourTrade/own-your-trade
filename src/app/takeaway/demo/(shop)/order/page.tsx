import type { Metadata } from "next";
import { Suspense } from "react";
import OrderClient from "@/components/order/OrderClient";

export const metadata: Metadata = {
  title: "Order Online",
  description:
    "Order from Northgate Chinese Takeaway online for collection or delivery. Pay securely by card — no account needed.",
};

export default function OrderPage() {
  return (
    <div className="paper-texture min-h-screen">
      <Suspense fallback={<div className="container-x py-20 text-center text-ink-soft">Loading menu…</div>}>
        <OrderClient />
      </Suspense>
    </div>
  );
}

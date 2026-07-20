import { redirect } from "next/navigation";
import { isStaff } from "@/lib/auth";
import { listOrders } from "@/lib/orders";
import { stripeConfigured } from "@/lib/stripe";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isStaff()) {
    redirect("/takeaway/demo/dashboard/login");
  }
  return (
    <DashboardClient
      initialOrders={await listOrders()}
      stripeConfigured={stripeConfigured}
    />
  );
}

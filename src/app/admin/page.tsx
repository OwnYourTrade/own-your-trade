import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listSignups } from "@/lib/signups";
import { listLeads } from "@/lib/leads";
import AdminClient from "@/components/AdminClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminPage() {
  if (!isAdmin()) redirect("/admin/login");
  const [signups, leads] = await Promise.all([listSignups(), listLeads()]);
  return <AdminClient initialSignups={signups} initialLeads={leads} />;
}

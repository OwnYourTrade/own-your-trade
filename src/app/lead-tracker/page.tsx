import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isStaff } from "@/lib/auth";
import { listLeads } from "@/lib/leads";
import LeadTrackerClient from "@/components/LeadTrackerClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lead tracker", robots: { index: false } };

export default async function LeadTrackerPage() {
  if (!isStaff()) redirect("/login?next=/lead-tracker");
  return <LeadTrackerClient initialLeads={await listLeads()} />;
}

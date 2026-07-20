import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isStaff } from "@/lib/auth";
import { listSignups } from "@/lib/signups";
import SignupsClient from "@/components/SignupsClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Signups", robots: { index: false } };

export default async function SignupsPage() {
  if (!isStaff()) redirect("/login?next=/signups");
  return <SignupsClient initialSignups={await listSignups()} />;
}

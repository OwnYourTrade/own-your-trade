import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VerticalPitch from "@/components/shared/VerticalPitch";
import { getVertical } from "@/config/verticals";

const v = getVertical("takeaway");

export const metadata: Metadata = v
  ? { title: v.heroTitle, description: v.heroSub }
  : {};

export default function Page() {
  if (!v) notFound();
  return <VerticalPitch v={v} />;
}

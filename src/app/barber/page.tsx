import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VerticalPitch from "@/components/shared/VerticalPitch";
import { getVertical } from "@/config/verticals";
import { verticalMetadata } from "@/lib/seo";

const v = getVertical("barber");

export const metadata: Metadata = verticalMetadata("barber");

export default function Page() {
  if (!v) notFound();
  return <VerticalPitch v={v} />;
}

import type { Metadata } from "next";
import BookingDemo from "@/components/booking/BookingDemo";
import { getBookingConfig } from "@/config/demos/booking";

const config = getBookingConfig("pt")!;

export const metadata: Metadata = {
  title: `Book online · ${config.businessName}`,
  description: config.blurb,
};

export default function Page() {
  return <BookingDemo config={config} />;
}

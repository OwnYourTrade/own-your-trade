import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isStaff } from "@/lib/auth";
import { getBookingConfig } from "@/config/demos/booking";
import { listBookings, seedBookings, isoFromOffset } from "@/lib/bookings";
import BookingBoard from "@/components/booking/BookingBoard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Owner dashboard", robots: { index: false } };

const SLUG = "pt";

export default async function Page() {
  if (!isStaff()) redirect(`/login?next=/${SLUG}/demo/dashboard`);
  const config = getBookingConfig(SLUG)!;
  await seedBookings(
    SLUG,
    config.sampleBookings.map((s) => {
      const svc = config.services.find((x) => x.name === s.service);
      return {
        service: s.service,
        price: svc?.price ?? 0,
        staff: s.staff,
        day: isoFromOffset(s.dayOffset),
        time: s.time,
        status: s.status,
        customer: { name: s.customer, phone: "—" },
      };
    })
  );
  return <BookingBoard config={config} initialBookings={await listBookings(SLUG)} />;
}

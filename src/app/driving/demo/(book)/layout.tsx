import BookingDemoShell from "@/components/booking/BookingDemoShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BookingDemoShell slug="driving">{children}</BookingDemoShell>;
}

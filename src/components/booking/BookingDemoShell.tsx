import DemoStrip from "@/components/shared/DemoStrip";
import DemoBackFooter from "@/components/shared/DemoBackFooter";
import { getBookingConfig } from "@/config/demos/booking";

/** Chrome for a booking demo's customer flow: demo strip on top, back-footer below. */
export default function BookingDemoShell({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) {
  const config = getBookingConfig(slug);
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <DemoStrip
        slug={slug}
        label={config?.businessName ?? slug}
        dashboardPath={`/${slug}/demo/dashboard`}
        dashboardLabel="Owner's diary"
      />
      <div className="flex-1">{children}</div>
      <DemoBackFooter slug={slug} />
    </div>
  );
}

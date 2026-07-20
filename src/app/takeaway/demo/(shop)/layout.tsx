import type { Metadata } from "next";
import { CartProvider } from "@/components/CartProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import DemoStrip from "@/components/shared/DemoStrip";
import { identity } from "@/config/demos/takeaway";

export const metadata: Metadata = {
  title: {
    default: `${identity.legalName}`,
    template: `%s · ${identity.name}`,
  },
  description: identity.blurb,
};

export default function TakeawayDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <DemoStrip
        slug="takeaway"
        label={identity.legalName}
        dashboardPath="/takeaway/demo/dashboard"
        dashboardLabel="Kitchen dashboard"
      />
      <Nav />
      <CartDrawer />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </CartProvider>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kitchen Dashboard",
  robots: { index: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-paper-dark">{children}</div>;
}

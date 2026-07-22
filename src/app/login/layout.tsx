import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Owner login · Own Your Trade",
  description: "Log in to view the demo owner dashboards.",
  robots: { index: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

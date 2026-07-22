import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin login · Own Your Trade",
  description: "Private admin area.",
  robots: { index: false },
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

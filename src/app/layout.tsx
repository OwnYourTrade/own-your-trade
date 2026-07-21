import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import CookieBanner from "@/components/shared/CookieBanner";

export const metadata: Metadata = {
  title: {
    default: "Own Your Trade — stop paying commission on customers you earned",
    template: "%s · Own Your Trade",
  },
  description:
    "Own Your Trade builds independent takeaways, driving instructors, barbers, tutors and personal trainers their own ordering and booking system — so you keep the customers you already earned, without paying 25–30% commission.",
  metadataBase: new URL("http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { VerticalSlug } from "@/config/verticals";

// ===========================================================================
//  SEO helpers — canonical site URL, the shared OG image, and per-vertical
//  titles/descriptions. Titles are unique per page; the root layout appends
//  " · Own Your Trade" via its title template, so page titles omit the brand.
// ===========================================================================

export const SITE_NAME = "Own Your Trade";

// Canonical production origin. On Vercel this resolves to the production domain
// (and automatically to a custom domain once one is added); localhost in dev.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Own Your Trade — commission-free ordering & booking systems for local trades",
};

type Seo = { title: string; description: string; ogTitle: string };

export const VERTICAL_SEO: Record<VerticalSlug, Seo> = {
  takeaway: {
    title: "Commission-free online ordering for takeaways",
    description:
      "Take orders on your own branded site instead of paying Just Eat or Deliveroo 25–30%. A proven ordering system with a live kitchen dashboard, for one flat monthly fee.",
    ogTitle: "Commission-free online ordering for takeaways — Own Your Trade",
  },
  driving: {
    title: "Lesson booking for driving instructors",
    description:
      "Fill your diary on your own booking site — no platform subscription or per-pupil lead fees. A branded lesson-booking system with a live diary, for one flat fee.",
    ogTitle: "Lesson booking for driving instructors — Own Your Trade",
  },
  barber: {
    title: "Commission-free booking for barbers & salons",
    description:
      "Take appointments on your own branded page instead of paying Fresha or Treatwell for new-client bookings. Keep your clients and card fees, for one flat monthly fee.",
    ogTitle: "Commission-free booking for barbers & salons — Own Your Trade",
  },
  tutor: {
    title: "Commission-free lesson booking for tutors",
    description:
      "Book pupils through your own site and stop giving Tutorful or MyTutor a cut of every lesson. A branded booking system with your schedule built in, for one flat fee.",
    ogTitle: "Lesson booking for private tutors — Own Your Trade",
  },
  pt: {
    title: "Booking software for personal trainers",
    description:
      "Take session and class bookings on your own site without a £100-a-month platform. A branded booking page with a live schedule — one flat fee, no commission.",
    ogTitle: "Session booking for personal trainers — Own Your Trade",
  },
};

/** Full metadata (title, description, canonical, Open Graph, Twitter) for a vertical page. */
export function verticalMetadata(slug: VerticalSlug): Metadata {
  const s = VERTICAL_SEO[slug];
  const path = `/${slug}`;
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_GB",
      url: path,
      title: s.ogTitle,
      description: s.description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: s.ogTitle,
      description: s.description,
      images: [OG_IMAGE.url],
    },
  };
}

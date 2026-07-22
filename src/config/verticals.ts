// ===========================================================================
//  VERTICALS — the five trades Own Your Trade sells to.
//  Each entry drives: the hub trade-selector card, the commission-calculator
//  defaults, and that trade's pitch page (hero, comparison table, £ saved,
//  links to its live demo + owner dashboard).
//
//  Competitor cells are deliberately honest and specific — every claim is the
//  kind of thing a real operator could defend, not marketing puff.
// ===========================================================================

export type CompareCategory = "cost" | "control" | "support";

export type CompareRow = {
  feature: string;
  category: CompareCategory;
  oyt: string;
  /** keyed by competitor name (must match `competitors`) */
  rivals: Record<string, string>;
};

export type VerticalSlug = "takeaway" | "driving" | "barber" | "tutor" | "pt";

export type Vertical = {
  slug: VerticalSlug;
  trade: string; // "Takeaway"
  selectorLabel: string; // card label on the hub
  selectorSub: string; // one line under the card label
  icon: VerticalSlug; // maps to <TradeIcon />
  businessName: string; // the example business / live demo
  demoPath: string;
  dashboardPath: string;
  dashboardLabel: string;

  heroImage: string;
  heroKicker: string;
  heroTitle: string;
  heroSub: string;

  competitors: string[]; // named rivals, in table-column order
  compareRows: CompareRow[];

  // Concrete saving shown at the end of the comparison.
  saved: {
    headline: string; // e.g. "about £19,000 a year"
    basis: string; // one honest sentence explaining the figure
  };

  // Commission-calculator defaults when this trade is selected.
  calc: {
    unitNoun: string; // "orders", "bookings", "lessons"
    unitNounSingular: string;
    volume: number; // per month
    avg: number; // £ average value
    commission: number; // 0.25 == 25%
    commissionLabel: string; // what the % represents
  };
};

export const verticals: Vertical[] = [
  // -------------------------------------------------------------------------
  {
    slug: "takeaway",
    trade: "Takeaway",
    selectorLabel: "Takeaway",
    selectorSub: "Order-ahead & delivery",
    icon: "takeaway",
    businessName: "Northgate Chinese Takeaway",
    demoPath: "/takeaway/demo",
    dashboardPath: "/takeaway/demo/dashboard",
    dashboardLabel: "the live kitchen dashboard",
    heroImage: "/images/oyt/takeaway-hero.jpg",
    heroKicker: "For independent takeaways",
    heroTitle: "Take your orders on your own site. Keep the whole bill.",
    heroSub:
      "Just Eat and Deliveroo charge 25–30% on every order — including the regulars who already know you. Give them a branded site to order direct, and that commission stays in your till.",
    competitors: ["Just Eat", "Deliveroo", "Flipdish"],
    compareRows: [
      {
        feature: "On a £22 order",
        category: "cost",
        oyt: "You keep all £22",
        rivals: { "Just Eat": "Up to £6.60 taken (14–30%)", Deliveroo: "Up to £7.70 taken (25–35%)", Flipdish: "A per-order fee through their payments, on top of the plan" },
      },
      {
        feature: "Commission per order",
        category: "cost",
        oyt: "None — flat monthly fee",
        rivals: { "Just Eat": "14–30%", Deliveroo: "25–35%", Flipdish: "\"None\" — but every order carries a Flipdish Pay fee" },
      },
      {
        feature: "Ongoing cost & contract",
        category: "cost",
        oyt: "From £29 a month, no contract",
        rivals: { "Just Eat": "A cut of everything", Deliveroo: "A cut of everything", Flipdish: "£69–£139+ a month on contract — often the priciest option overall" },
      },
      {
        feature: "Card / service fees",
        category: "cost",
        oyt: "Standard Stripe fee only",
        rivals: { "Just Eat": "Added on top", Deliveroo: "Added on top", Flipdish: "Quote-based rates via their own processor" },
      },
      {
        feature: "Setup & lock-in",
        category: "control",
        oyt: "Set up for you in under 2 weeks",
        rivals: { "Just Eat": "Their platform, their rules", Deliveroo: "Their platform, their rules", Flipdish: "Setup & hardware fees, then platform lock-in" },
      },
      {
        feature: "Live kitchen dashboard",
        category: "control",
        oyt: "Built in — yours",
        rivals: { "Just Eat": "Their tablet", Deliveroo: "Their tablet", Flipdish: "Inside their platform" },
      },
      {
        feature: "Built & supported by",
        category: "support",
        oyt: "A real local developer",
        rivals: { "Just Eat": "Call centre", Deliveroo: "Call centre", Flipdish: "Global SaaS helpdesk" },
      },
    ],
    saved: {
      headline: "about £19,000 a year",
      basis: "300 orders a month at a £22 average, at 25% commission, is £1,650 a month — versus one flat monthly fee.",
    },
    calc: {
      unitNoun: "orders",
      unitNounSingular: "order",
      volume: 300,
      avg: 22,
      commission: 0.25,
      commissionLabel: "app commission",
    },
  },

  // -------------------------------------------------------------------------
  {
    slug: "driving",
    trade: "Driving Instructor",
    selectorLabel: "Driving Instructor",
    selectorSub: "Lesson booking",
    icon: "driving",
    businessName: "Roadstart Driving School",
    demoPath: "/driving/demo",
    dashboardPath: "/driving/demo/dashboard",
    dashboardLabel: "the instructor's diary",
    heroImage: "/images/oyt/driving-hero.jpg",
    heroKicker: "For driving instructors & schools",
    heroTitle: "Fill your diary without renting it back off a platform.",
    heroSub:
      "Booking platforms charge you a monthly subscription — and often a fee per pupil — to manage learners you found yourself. Take bookings on your own site and the diary is yours.",
    competitors: ["Lesson8", "BookLive"],
    compareRows: [
      {
        feature: "A year of bookings",
        category: "cost",
        oyt: "One flat fee — from £348 a year",
        rivals: { Lesson8: "Subscription plus lead fees — commonly £1,500+", BookLive: "Subscription plus lead fees — commonly £1,500+" },
      },
      {
        feature: "Monthly platform fee",
        category: "cost",
        oyt: "One flat fee, all pupils",
        rivals: { Lesson8: "Per-instructor subscription", BookLive: "Per-instructor subscription" },
      },
      {
        feature: "Fee per new pupil / lead",
        category: "cost",
        oyt: "None",
        rivals: { Lesson8: "Lead fees common", BookLive: "Lead fees common" },
      },
      {
        feature: "Your own branded site",
        category: "control",
        oyt: "Yes (Growth up)",
        rivals: { Lesson8: "Their branding", BookLive: "Their branding" },
      },
      {
        feature: "Live diary you control",
        category: "control",
        oyt: "Built in",
        rivals: { Lesson8: "Yes, on their terms", BookLive: "Yes, on their terms" },
      },
      {
        feature: "Support",
        category: "support",
        oyt: "A real local developer",
        rivals: { Lesson8: "Help articles", BookLive: "Help desk" },
      },
    ],
    saved: {
      headline: "£1,500+ a year",
      basis: "A per-instructor subscription plus typical per-pupil lead fees adds up fast — none of which you pay on your own site.",
    },
    calc: {
      unitNoun: "lessons",
      unitNounSingular: "lesson",
      volume: 120,
      avg: 34,
      commission: 0.1,
      commissionLabel: "platform & lead fees",
    },
  },

  // -------------------------------------------------------------------------
  {
    slug: "barber",
    trade: "Barber / Salon",
    selectorLabel: "Barber / Salon",
    selectorSub: "Appointment booking",
    icon: "barber",
    businessName: "Fade & Co Barbers",
    demoPath: "/barber/demo",
    dashboardPath: "/barber/demo/dashboard",
    dashboardLabel: "the chair-side booking diary",
    heroImage: "/images/oyt/barber-hero.jpg",
    heroKicker: "For barbers & salons",
    heroTitle: "Your chairs, your clients, your booking page.",
    heroSub:
      "Fresha and Treatwell look free until they charge you for new-client bookings and card processing, and put your regulars in their marketplace. Book them on your own page instead.",
    competitors: ["Fresha", "Treatwell"],
    compareRows: [
      {
        feature: "On a £20 new-client booking",
        category: "cost",
        oyt: "You keep all £20",
        rivals: { Fresha: "£6 taken (20% fee, £6 minimum)", Treatwell: "£7 taken (35% fee — c. 42% once VAT is added)" },
      },
      {
        feature: "New-client booking fee",
        category: "cost",
        oyt: "None",
        rivals: { Fresha: "20%, minimum £6 a head", Treatwell: "35% — and charged even if you cancel the appointment" },
      },
      {
        feature: "Card processing",
        category: "cost",
        oyt: "Standard Stripe fee only",
        rivals: { Fresha: "Their rate, marked up", Treatwell: "Their rate + subscription" },
      },
      {
        feature: "Your clients in a marketplace",
        category: "control",
        oyt: "No — they're yours",
        rivals: { Fresha: "Listed & marketed to", Treatwell: "Listed & marketed to" },
      },
      {
        feature: "Branded booking page",
        category: "control",
        oyt: "Yes (Growth up)",
        rivals: { Fresha: "Their template", Treatwell: "Their template" },
      },
      {
        feature: "Support",
        category: "support",
        oyt: "A real local developer",
        rivals: { Fresha: "In-app support", Treatwell: "Account team" },
      },
    ],
    saved: {
      headline: "£2,000+ a year",
      basis: "New-client booking fees and marked-up card processing on a steady book of clients typically run into four figures a year.",
    },
    calc: {
      unitNoun: "appointments",
      unitNounSingular: "appointment",
      volume: 260,
      avg: 19,
      commission: 0.08,
      commissionLabel: "booking & card fees",
    },
  },

  // -------------------------------------------------------------------------
  {
    slug: "tutor",
    trade: "Tutor",
    selectorLabel: "Tutor",
    selectorSub: "Lesson booking",
    icon: "tutor",
    businessName: "Thornfield Tutoring",
    demoPath: "/tutor/demo",
    dashboardPath: "/tutor/demo/dashboard",
    dashboardLabel: "the tuition schedule",
    heroImage: "/images/oyt/tutor-hero.jpg",
    heroKicker: "For private tutors",
    heroTitle: "Teach the pupils. Keep the fee. All of it.",
    heroSub:
      "Tutorful and MyTutor take a cut of every lesson — for the whole time a pupil stays with you. Book them through your own site and that cut is yours to keep.",
    competitors: ["Tutorful", "MyTutor"],
    compareRows: [
      {
        feature: "On a £30 lesson",
        category: "cost",
        oyt: "You keep all £30",
        rivals: { Tutorful: "The family pays ~£40 for your £30 — a ~35% fee sits on top", MyTutor: "~40% + VAT taken — you keep barely half" },
      },
      {
        feature: "Commission per lesson",
        category: "cost",
        oyt: "None — flat monthly fee",
        rivals: { Tutorful: "~35% service fee on every lesson", MyTutor: "~40% + VAT, every lesson" },
      },
      {
        feature: "Repeat lessons, same pupil",
        category: "cost",
        oyt: "Never charged — flat fee regardless",
        rivals: { Tutorful: "Keeps taking a fee on every repeat lesson", MyTutor: "Keeps taking a cut on every repeat lesson" },
      },
      {
        feature: "Own the parent relationship",
        category: "control",
        oyt: "You do",
        rivals: { Tutorful: "Through the platform", MyTutor: "Through the platform" },
      },
      {
        feature: "Branded booking site",
        category: "control",
        oyt: "Yes (Growth up)",
        rivals: { Tutorful: "Profile page", MyTutor: "Profile page" },
      },
      {
        feature: "Support",
        category: "support",
        oyt: "A real local developer",
        rivals: { Tutorful: "Marketplace support", MyTutor: "Marketplace support" },
      },
    ],
    saved: {
      headline: "about £2,000 a year",
      basis: "28 lessons a month at £30: MyTutor's ~40% cut would be over £330 a month, so £2,000 a year is a conservative figure — and it applies for as long as those pupils stay.",
    },
    calc: {
      unitNoun: "lessons",
      unitNounSingular: "lesson",
      volume: 28,
      avg: 30,
      commission: 0.22,
      commissionLabel: "marketplace commission",
    },
  },

  // -------------------------------------------------------------------------
  {
    slug: "pt",
    trade: "Personal Trainer",
    selectorLabel: "Personal Trainer",
    selectorSub: "Session & class booking",
    icon: "pt",
    businessName: "Ironclad Personal Training",
    demoPath: "/pt/demo",
    dashboardPath: "/pt/demo/dashboard",
    dashboardLabel: "the session schedule",
    heroImage: "/images/oyt/pt-hero.jpg",
    heroKicker: "For personal trainers & coaches",
    heroTitle: "Book sessions on your own site, not a £100-a-month platform.",
    heroSub:
      "Class-booking software charges a hefty monthly fee plus a cut of every transaction. For a solo trainer or small studio, your own booking page does the same job without the overhead.",
    competitors: ["Class-booking platforms"],
    compareRows: [
      {
        feature: "Software cost per year",
        category: "cost",
        oyt: "From £348 flat",
        rivals: { "Class-booking platforms": "£900–£1,800+ before transaction fees" },
      },
      {
        feature: "Monthly software fee",
        category: "cost",
        oyt: "One flat fee",
        rivals: { "Class-booking platforms": "£75–£150+/mo" },
      },
      {
        feature: "Transaction fees",
        category: "cost",
        oyt: "Standard Stripe fee only",
        rivals: { "Class-booking platforms": "On top of the subscription" },
      },
      {
        feature: "Branded booking site",
        category: "control",
        oyt: "Yes (Growth up)",
        rivals: { "Class-booking platforms": "Their branding / widget" },
      },
      {
        feature: "Live session schedule",
        category: "control",
        oyt: "Built in",
        rivals: { "Class-booking platforms": "Yes" },
      },
      {
        feature: "Support",
        category: "support",
        oyt: "A real local developer",
        rivals: { "Class-booking platforms": "Tiered support plans" },
      },
    ],
    saved: {
      headline: "£1,500+ a year",
      basis: "A typical class-booking subscription is £100+ a month before transaction fees — versus one flat fee that does the same job.",
    },
    calc: {
      unitNoun: "sessions",
      unitNounSingular: "session",
      volume: 90,
      avg: 40,
      commission: 0.05,
      commissionLabel: "software & transaction fees",
    },
  },
];

export function getVertical(slug: string): Vertical | undefined {
  return verticals.find((v) => v.slug === slug);
}

export const verticalSlugs = verticals.map((v) => v.slug);

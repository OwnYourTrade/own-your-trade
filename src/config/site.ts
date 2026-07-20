// ===========================================================================
//  OWN YOUR TRADE — the product/marketing config.
//  Identity, operator contact, the commission range we compare against, and the
//  three pricing tiers. Edit pricing and copy here; the hub and every vertical
//  page read from this file.
// ===========================================================================

export const site = {
  name: "Own Your Trade",
  wordmark: "OWN·YOUR·TRADE",
  oneLiner:
    "Your own ordering and booking system — so you keep the customers you already earned.",
  tagline: "Stop paying commission on customers you already earned.",

  // Short, honest, backable claim badges. No fabricated stats or reviews.
  claims: ["No commission, ever", "Live in under 2 weeks", "A proven, tested system"],

  // The operator behind it — kept honest and local. Edit to your details.
  operator: {
    name: "Own Your Trade",
    role: "Independent web developer for local trades",
    location: "UK",
    email: "hello@ownyourtrade.co.uk",
    phone: "0000 000 0000",
    phoneHref: "tel:0000000000",
  },

  // Marketplace / platform commission range we compare against (takeaways etc.).
  commission: { low: 0.25, high: 0.3 },

  // -------------------------------------------------------------------------
  // PRICING — three tiers, applied to every trade. A website build is Growth
  // tier and up; Starter is the system only, on a subdomain.
  // -------------------------------------------------------------------------
  currency: "£",
  pricing: {
    note: "One flat monthly fee. No commission, ever. A branded site on your own domain is included from Growth up — Starter is the system only, on a subdomain. We don't sell a website without the system.",
    tiers: [
      {
        id: "starter",
        name: "Starter",
        blurb: "The ordering or booking system, live on a subdomain of ours. No custom site build.",
        setup: 0,
        monthly: 29,
        domain: "yourname.ownyourtrade.co.uk",
        cta: "Start on Starter",
        highlight: false,
        features: [
          "Online ordering or booking system",
          "Live owner dashboard (orders / bookings)",
          "Secure card payments via Stripe, straight to your bank",
          "Hosted on a subdomain we provide",
          "No commission — one flat monthly fee",
        ],
        notIncluded: ["Custom-built website", "Your own domain name"],
      },
      {
        id: "growth",
        name: "Growth",
        blurb: "Your own branded site on a proven system, on your own domain — live in under 2 weeks.",
        setup: 149,
        monthly: 49,
        domain: "yourbusiness.co.uk",
        cta: "Get the Growth build",
        highlight: true,
        features: [
          "Everything in Starter, plus:",
          "Your own branded version of a proven system",
          "Your own domain name, set up for you",
          "Built for your trade specifically — live in under 2 weeks",
          "Menu / services / prices updated whenever you need",
        ],
        notIncluded: [],
      },
      {
        id: "established",
        name: "Established",
        blurb: "Growth, plus priority support and ongoing updates to keep your pages fresh.",
        setup: 149,
        monthly: 89,
        domain: "yourbusiness.co.uk",
        cta: "Talk about Established",
        highlight: false,
        features: [
          "Everything in Growth, plus:",
          "Priority support — a real person, same day",
          "Ongoing marketing-page updates (offers, seasons, news)",
          "Quarterly review of what's converting",
          "First in the queue for new features",
        ],
        notIncluded: [],
      },
    ],
  },

  hero: {
    kicker: "For independent local trades",
    title: "Own your trade — stop paying commission on customers you already earned.",
    subtitle:
      "The apps and platforms charge you 25–30% on people who already know your name. Own Your Trade gives you your own ordering or booking system — and a website to put it on — so those customers order direct and you keep the lot.",
  },

  problem: {
    kicker: "The problem",
    title: "You're paying to reach customers you already have.",
    body: "Just Eat, Fresha, Tutorful and the rest charge a cut of every booking — even when it's a regular who'd have found you anyway. Over a year that's thousands of pounds gone, on work you did yourself.",
  },

  steps: [
    {
      n: "01",
      title: "Your customer orders or books on your site",
      body: "They pick what they want and check out in a couple of taps — no app, no account, no middleman.",
    },
    {
      n: "02",
      title: "They pay (or book) securely",
      body: "Card payments run through Stripe, straight to your own bank. You keep the full value, minus only the standard card fee.",
    },
    {
      n: "03",
      title: "It lands live on your dashboard",
      body: "The order or booking appears on your screen with all the details — ready to accept and fulfil.",
    },
    {
      n: "04",
      title: "You run it New → In progress → Done",
      body: "Track every job through to handover. No lost tickets, no app juggling, no commission.",
    },
  ],
};

export type Site = typeof site;
export type Tier = (typeof site.pricing.tiers)[number];

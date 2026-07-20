# Own Your Trade

One connected Next.js product — a marketing hub that sells an **ordering/booking
system** to five independent trades, each with its own pitch page and an
**embedded, live, working demo**. Everything shares one design system, one nav,
one footer and one component library: clicking from a pitch page into a demo
feels like moving to another page of the same site, not a different project.

The pitch: independent businesses lose 25–30% commission (or hefty platform
fees) on customers who already know them. Own Your Trade gives them their own
system — and optionally a full website — so they keep what they earned.

---

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:3000** (may use **3001** if 3000 is busy — check the
terminal). Runs fully in demo mode with no setup.

| URL | What it is |
| --- | --- |
| `/` | **The hub** — hero + trade selector, live commission calculator, "preview your site", social proof, pricing, contact |
| `/takeaway` `/driving` `/barber` `/tutor` `/pt` | **Vertical pitch pages** — tailored hero, this-trade calculator, embedded live demo, comparison vs named competitors ending on a £-saved figure, pricing, contact |
| `/takeaway/demo` | **Live takeaway demo** — Northgate Chinese Takeaway: full branded site + cart + Stripe checkout |
| `/takeaway/demo/dashboard` | Northgate's live **kitchen** dashboard |
| `/driving/demo` `/barber/demo` `/tutor/demo` `/pt/demo` | **Live booking demos** — Roadstart / Fade & Co / Thornfield / Ironclad |
| `/{trade}/demo/dashboard` | That business's live **booking diary** |
| `/lead-tracker` | **Private** — every "get started" enquiry from across the site |
| `/login` | Shared owner sign-in for the dashboards (password `owner`) |

Every demo carries the **OWN·YOUR·TRADE** wordmark top-left and a "Built by Own
Your Trade" link back to its pitch page.

---

## Architecture — one codebase, one build

```
src/
  config/
    site.ts              Own Your Trade identity, contact, 3 pricing tiers, commission range
    verticals.ts         the 5 trades: competitors, comparison rows, £-saved figures, calculator defaults
    demos/
      takeaway.ts        Northgate demo — identity, menu, copy (all invented / generic)
      booking.ts         driving / barber / tutor / pt booking configs (services, staff, slots, samples)
  components/
    shared/              ONE library used by hub AND every demo:
                         OwnYourTradeNav, OwnYourTradeFooter, Wordmark, DemoStrip, DemoBackFooter,
                         HubShell, TradeIcon, CommissionCalculator, SitePreview, CompareTable,
                         TierCards, GetStartedForm, VerticalPitch, useDemoName
    booking/             BookingDemo (slot picker), BookingBoard (owner diary), BookingDemoShell
    (takeaway demo)      Nav, Footer, cart, menu rows, dashboard, order flow
  app/
    page.tsx             the hub
    {trade}/page.tsx     the 5 pitch pages (each renders <VerticalPitch/>)
    takeaway/demo/(shop) Northgate customer site (home/menu/about/reviews/contact/order)
    takeaway/demo/dashboard
    {trade}/demo/(book)  booking flow      ·  {trade}/demo/dashboard  booking diary
    lead-tracker, login
    api/                 checkout (Stripe), orders, bookings, leads, dashboard auth
  lib/                   orders, bookings, leads (JSON-file stores), stripe, auth, menu
data/                    orders.json · bookings.json · leads.json (created on first write)
public/images/oyt/       hero + per-trade photography (real photos, dark overlays)
```

**Design system (one theme everywhere).** Brand green `#17593F` (logo, nav, primary
buttons, accents), gold/amber `#C0872E` (reserved for money figures, £-saved and
"get started" CTAs), warm cream `#F4F1E8` base, charcoal-navy `#1E2A30` text/dark
blocks — with Public Sans (headings/body) and Space Mono (wordmark, numbers,
labels). Set once in `globals.css` (`:root`) and `tailwind.config.ts`. The semantic
CSS-var tokens are still named `stamp` (→ green) and `ledger` (→ gold) so a palette
change is a one-file edit; the logo mark and favicon are a flat SVG doorway stamp.

**Shared state between hub and demos.** The "preview your site" tool carries the
typed business name through via `?name=` — e.g. `/takeaway/demo?name=Riverside+Fish+Bar`
opens the demo pre-filled with that name (`useDemoName`).

---

## The two demo types

### Takeaway (ordering + Stripe)
Browse menu → **Add** → basket → **collection or delivery** → details → **pay**.
- **Demo mode (default):** straight to a confirmation page, no card needed.
- **Real Stripe test payments:** copy `.env.local.example` → `.env.local`, add
  your Stripe **test** keys, restart. Pay with `4242 4242 4242 4242`, any future
  expiry/CVC. Verified server-side on return and marked **Paid**.
- Prices are **never trusted from the browser** — re-priced server-side from the
  takeaway config before charging.
- Orders land live on `/takeaway/demo/dashboard` (New → Preparing → Ready → Completed).

### Driving / Barber / Tutor / PT (booking)
Pick a **day** → pick a **slot** → details → **confirm** (no payment). The
booking appears live on that business's diary at `/{trade}/demo/dashboard`
(New → Confirmed → Done). Service prices are re-resolved server-side. Each diary
is seeded with sample bookings so it's never empty.

---

## Pricing (three tiers, every trade)

Configured in `src/config/site.ts`:

- **Starter** — the ordering/booking system only, on a subdomain. **No custom site build.**
- **Growth** — full custom-built branded website **+** the system, on your own domain.
- **Established** — Growth **+** priority support **+** ongoing marketing-page updates.

Copy makes clear a website build is **Growth-tier-and-up**, not included by default.
Prices in the config are editable placeholders.

---

## Rebranding a demo for a real client

- **Takeaway:** edit `src/config/demos/takeaway.ts` (identity, contact, menu, copy).
- **Booking trades:** edit the relevant object in `src/config/demos/booking.ts`
  (business name, services, staff, slots).
- **A new trade / competitor set / £-saved figure:** edit `src/config/verticals.ts`.

Drop client photography in `public/images/oyt/` (heroes) and `public/images/`
(takeaway food). The single design system applies automatically.

---

## Notes

- **No customer accounts** — ordering/booking needs only contact details.
- **JSON file stores** keep the demo dependency-free; every access goes through
  `src/lib/{orders,bookings,leads}.ts`, so swapping in a real database later is
  isolated to those files.
- **All demo businesses are invented** (Northgate, Roadstart, Fade & Co,
  Thornfield, Ironclad) with made-up addresses ("High Street, UK"), menus and
  prices. Photography is real, licensed stock — **no AI-generated imagery**.
- One owner password (`DASHBOARD_PASSWORD`, default `owner`) gates every owner
  view; `DASHBOARD_SECRET` signs the session cookie.

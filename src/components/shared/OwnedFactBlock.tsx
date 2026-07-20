import { site } from "@/config/site";

const facts = [
  { icon: "grid", title: "5 trades, one system", body: "Takeaway, driving, barber, tutor and PT — the same proven engine." },
  { icon: "percent", title: "No commission, ever", body: "One flat monthly fee. You keep the full order or booking value." },
  { icon: "clock", title: "Live in under 2 weeks", body: "A proven template, customised to your business and launched fast." },
  { icon: "bank", title: "Straight to your bank", body: "Card payments run through Stripe — no middleman holding your money." },
  { icon: "shield", title: "Your customers, your data", body: "Yours to keep and market to — not rented back by a marketplace." },
];

/**
 * Full-bleed brand-green section (image-3 pattern): diagonal/radial texture,
 * centred white headline, honest claim pill-badges, and a row of pale FACT
 * cards populated with real product facts — no fabricated testimonials/reviews.
 */
export default function OwnedFactBlock() {
  return (
    <section className="relative overflow-hidden brand-block py-20 text-paper sm:py-28">
      <div className="container-x relative text-center">
        <h2 className="mx-auto max-w-3xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
          Built to be owned, not rented.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-paper/80">
          One proven system behind five trades — everything below is a real product fact, not a
          review score we don&apos;t have yet.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          {site.claims.map((c) => (
            <span key={c} className="inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-[13px] font-semibold text-ink shadow-soft">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-stamp"><path d="M20 6 9 17l-5-5" /></svg>
              {c}
            </span>
          ))}
        </div>

        <div className="mt-14 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-5">
          {facts.map((f) => (
            <div key={f.title} className="rounded-2xl bg-paper p-5 shadow-card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-stamp/10 text-stamp">
                <FactIcon name={f.icon} />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FactIcon({ name }: { name: string }) {
  const c = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "grid") return (<svg {...c}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>);
  if (name === "percent") return (<svg {...c}><path d="M19 5 5 19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></svg>);
  if (name === "clock") return (<svg {...c}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
  if (name === "bank") return (<svg {...c}><path d="M3 10 12 4l9 6M5 10v9M19 10v9M9 10v9M15 10v9M3 21h18" /></svg>);
  return (<svg {...c}><path d="M12 3 4 6v5c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-3Z" /><path d="m9 12 2 2 4-4" /></svg>);
}

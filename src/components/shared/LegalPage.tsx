import HubShell from "./HubShell";

/**
 * Shared chrome for the static legal/policy pages (Privacy, Terms, Cookies).
 * A light hero header + a ticket-card body styled by the `.prose-legal`
 * utility, so the three pages stay visually consistent with the rest of the
 * site (fonts, colours, ticket surfaces).
 */
export default function LegalPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <HubShell heroTone="light">
      <section className="relative overflow-hidden bg-paper">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[26rem] w-[26rem] rounded-full bg-stamp/10 blur-3xl" />
        <div className="container-x relative pt-32 pb-8 sm:pt-36">
          <p className="eyebrow">Own Your Trade — Legal</p>
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          {intro && <p className="mt-4 max-w-2xl text-lg text-ink-soft">{intro}</p>}
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft/70">
            Last updated: {updated}
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-x">
          <div className="ticket max-w-3xl p-7 sm:p-10">
            <div className="prose-legal">{children}</div>
          </div>
        </div>
      </section>
    </HubShell>
  );
}

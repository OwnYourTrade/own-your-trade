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
      <section className="grain relative overflow-hidden bg-paper">
        <div aria-hidden="true" className="arch-top absolute -right-24 top-24 hidden h-[340px] w-[260px] border-2 border-sand-dark/60 lg:block" />
        <div className="container-x relative pt-32 pb-8 sm:pt-36">
          <p className="eyebrow">Own Your Trade — Legal</p>
          <h1 className="mt-5 font-craft text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
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
          <div className="max-w-3xl rounded-2xl border border-sand-dark/70 bg-white p-7 shadow-warm sm:p-10">
            <div className="prose-legal">{children}</div>
          </div>
        </div>
      </section>
    </HubShell>
  );
}

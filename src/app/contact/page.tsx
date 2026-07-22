import type { Metadata } from "next";
import Link from "next/link";
import HubShell from "@/components/shared/HubShell";
import GetStartedForm from "@/components/shared/GetStartedForm";
import Reveal from "@/components/shared/Reveal";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Own Your Trade — email us or send an enquiry and we'll come back within a day with a straight answer, no hard sell.",
};

export default function ContactPage() {
  return (
    <HubShell heroTone="light">
      <section className="grain relative overflow-hidden bg-paper">
        <div className="container-x relative grid gap-10 pt-32 pb-20 sm:pt-36 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          <Reveal>
            <div>
              <p className="eyebrow">Own Your Trade — Contact</p>
              <h1 className="mt-5 font-craft text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                Get in <span className="italic text-stamp">touch.</span>
              </h1>
              <p className="mt-4 max-w-md text-lg text-ink-soft">
                Tell me about your place and how you take orders or bookings now. I&apos;ll come back
                within a day with a straight answer on whether it&apos;s worth it — no hard sell.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <span className="icon-plate arch-top grid h-12 w-10 shrink-0 place-items-center bg-stamp/10 text-stamp">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m2 7 10 7L22 7" /></svg>
                  </span>
                  <div>
                    <p className="mono-label text-ink-soft">Email</p>
                    <a
                      href={`mailto:${site.operator.email}`}
                      className="mt-1 block font-display text-xl font-bold text-ink hover:text-stamp"
                    >
                      {site.operator.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="icon-plate arch-top grid h-12 w-10 shrink-0 place-items-center bg-ledger/15 text-ledger-dark">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                  <div>
                    <p className="mono-label text-ink-soft">Ready to buy?</p>
                    <Link
                      href="/get-started"
                      className="mt-1 inline-flex items-center gap-1 font-display text-xl font-bold text-ink hover:text-stamp"
                    >
                      Get started →
                    </Link>
                    <p className="mt-1 text-sm text-ink-soft">
                      Pick your trade and plan, or see{" "}
                      <Link href="/#pricing" className="font-semibold text-stamp hover:underline">pricing</Link>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-sand-dark/60 bg-sand/40 p-4 text-sm text-ink-soft">
                Prefer to see it first? Every trade has a{" "}
                <Link href="/" className="font-semibold text-stamp hover:underline">live, interactive demo</Link>{" "}
                — place a test order or booking and watch it land on the owner dashboard.
              </div>
            </div>
          </Reveal>

          <Reveal variant="scale" delay={120}>
            <GetStartedForm source="contact" />
          </Reveal>
        </div>
      </section>
    </HubShell>
  );
}

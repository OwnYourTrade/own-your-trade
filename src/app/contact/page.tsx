import type { Metadata } from "next";
import Link from "next/link";
import HubShell from "@/components/shared/HubShell";
import GetStartedForm from "@/components/shared/GetStartedForm";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Own Your Trade — email us or send an enquiry and we'll come back within a day with a straight answer, no hard sell.",
};

export default function ContactPage() {
  return (
    <HubShell heroTone="light">
      <section className="relative overflow-hidden bg-paper">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[26rem] w-[26rem] rounded-full bg-stamp/10 blur-3xl" />
        <div className="container-x relative grid gap-10 pt-32 pb-20 sm:pt-36 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          <div>
            <p className="eyebrow">Own Your Trade — Contact</p>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Get in touch.
            </h1>
            <p className="mt-4 max-w-md text-lg text-ink-soft">
              Tell me about your place and how you take orders or bookings now. I&apos;ll come back
              within a day with a straight answer on whether it&apos;s worth it — no hard sell.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <p className="mono-label text-ink-soft">Email</p>
                <a
                  href={`mailto:${site.operator.email}`}
                  className="mt-1 block font-display text-xl font-bold text-ink hover:text-stamp"
                >
                  {site.operator.email}
                </a>
              </div>

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

            <div className="mt-8 rounded-2xl border border-ink/10 bg-white/60 p-4 text-sm text-ink-soft">
              Prefer to see it first? Every trade has a{" "}
              <Link href="/" className="font-semibold text-stamp hover:underline">live, interactive demo</Link>{" "}
              — place a test order or booking and watch it land on the owner dashboard.
            </div>
          </div>

          <GetStartedForm source="contact" />
        </div>
      </section>
    </HubShell>
  );
}

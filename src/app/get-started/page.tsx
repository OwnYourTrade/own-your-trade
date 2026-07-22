import type { Metadata } from "next";
import HubShell from "@/components/shared/HubShell";
import SignupForm from "@/components/shared/SignupForm";
import Reveal from "@/components/shared/Reveal";

export const metadata: Metadata = {
  title: "Get started",
  description:
    "Pick your trade and plan, add a few details, and get your own ordering or booking site built — live in under 2 weeks, no commission.",
};

export default function GetStartedPage() {
  return (
    <HubShell heroTone="light">
      <section className="grain relative overflow-hidden bg-paper">
        <div className="container-x relative pb-20 pt-32 sm:pt-36">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow">Get started</p>
              <h1 className="mt-4 font-craft text-4xl font-semibold leading-[1.06] tracking-tight text-ink sm:text-5xl">
                Let&apos;s set your business <span className="italic text-stamp">up.</span>
              </h1>
              <p className="mt-4 text-lg text-ink-soft">
                Pick your trade and plan, add a few essentials, and you&apos;re booked in. We&apos;ll
                email you within a day to collect your menu or services and branding — nothing to
                upload here.
              </p>
            </div>
          </Reveal>

          <div className="mt-12">
            <SignupForm />
          </div>
        </div>
      </section>
    </HubShell>
  );
}

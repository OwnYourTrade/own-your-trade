import type { Metadata } from "next";
import Link from "next/link";
import HubShell from "@/components/shared/HubShell";
import { getSignup, markPaidBySession, markNotified, type Signup } from "@/lib/signups";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { sendSignupNotifications } from "@/lib/email";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "You're in", robots: { index: false } };

export default async function SignupSuccessPage({
  searchParams,
}: {
  searchParams: { signup?: string; session_id?: string; demo?: string };
}) {
  const id = searchParams.signup;
  const sessionId = searchParams.session_id;
  const isDemo = searchParams.demo === "1";

  let signup: Signup | undefined = id ? await getSignup(id) : undefined;
  let paid = isDemo;

  if (signup && sessionId && stripeConfigured) {
    try {
      const session = await getStripe()!.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        await markPaidBySession(sessionId);
        paid = true;
        signup = await getSignup(signup.id);
      }
    } catch {
      /* show pending state */
    }
  }
  if (signup && signup.payment.status === "paid") paid = true;

  const tier = signup ? site.pricing.tiers.find((t) => t.id === signup!.tier) : undefined;

  // Fire the transactional emails exactly once, only for a genuinely paid
  // signup (never for demo/sample actions — those set payment.status = "demo").
  // The notifiedAt flag makes a page refresh a no-op.
  if (signup && signup.payment.status === "paid" && !signup.notifiedAt) {
    const result = await sendSignupNotifications(signup, tier);
    if (result.ok) {
      await markNotified(signup.id);
      signup = (await getSignup(signup.id)) ?? signup;
    }
  }

  return (
    <HubShell heroTone="light">
      <section className="container-x pb-24 pt-32 sm:pt-40">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ledger text-ink">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <p className="eyebrow mt-5">{paid ? "Payment received" : "You're signed up"}</p>
          <h1 className="mt-2 font-craft text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            You&apos;re in{signup ? `, ${signup.name.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-4 text-lg text-ink-soft">
            We&apos;ll email you within 24 hours to collect your menu or services and any branding
            details, so we can get your site built{" "}
            {tier && tier.id !== "starter" ? "and live in under two weeks" : "and live"}.
          </p>

          {signup && (
            <div className="ticket mx-auto mt-8 max-w-md p-6 text-left">
              <p className="mono-label text-ink-soft">Your signup</p>
              <div className="mt-3 space-y-2 text-sm">
                <Row k="Reference" v={signup.id} mono />
                <Row k="Business" v={signup.business} />
                <Row k="Trade" v={signup.trade} />
                <Row k="Plan" v={tier ? tier.name : signup.tier} />
                <Row k={paid ? "Paid today" : "Due today"} v={`${site.currency}${signup.payment.amount}`} mono />
              </div>
              {isDemo && (
                <p className="mt-4 rounded-lg border border-ledger/40 bg-ledger/10 px-3 py-2 text-xs text-ink">
                  Demo mode — no real payment was taken. Add Stripe test keys to enable live
                  test-mode card payments.
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-outline">Back to home</Link>
            <a href={`mailto:${site.operator.email}`} className="btn-primary">Email us now</a>
          </div>
        </div>
      </section>
    </HubShell>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-ink-soft">{k}</span>
      <span className={`font-medium text-ink ${mono ? "font-mono" : ""}`}>{v}</span>
    </div>
  );
}

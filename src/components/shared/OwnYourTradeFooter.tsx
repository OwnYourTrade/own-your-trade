import Link from "next/link";
import Logo from "./Logo";
import GetStartedForm from "./GetStartedForm";
import { site } from "@/config/site";
import { verticals } from "@/config/verticals";

export default function OwnYourTradeFooter() {
  return (
    <footer className="mt-24 bg-ink text-paper">
      {/* Get-started band (site-wide contact endpoint) */}
      <section id="contact" className="border-b border-paper/10">
        <div className="container-x grid gap-10 py-16 lg:grid-cols-[1fr_1.05fr] lg:py-20">
          <div>
            <p className="eyebrow text-stamp-light">Own Your Trade</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              Ready to own your trade?
            </h2>
            <p className="mt-4 max-w-md text-paper/70">
              Tell me about your place and how you take orders or bookings now. I&apos;ll come
              back within a day with a straight answer on whether it&apos;s worth it — no hard sell.
            </p>
            <div className="mt-8 space-y-4">
              <div>
                <p className="mono-label text-paper/50">Email</p>
                <a href={`mailto:${site.operator.email}`} className="mt-1 block font-display text-xl font-bold hover:text-stamp-light">{site.operator.email}</a>
              </div>
              <div>
                <p className="mono-label text-paper/50">Phone</p>
                <a href={site.operator.phoneHref} className="mt-1 block font-display text-xl font-bold hover:text-stamp-light">{site.operator.phone}</a>
              </div>
            </div>
          </div>
          <GetStartedForm source="footer" />
        </div>
      </section>

      {/* Main footer */}
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-9 text-paper" />
            <div className="leading-tight">
              <span className="block font-display text-lg font-extrabold">Own Your Trade</span>
              <span className="wordmark block text-[11px] text-paper/60">{site.wordmark}</span>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/70">{site.oneLiner}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {site.claims.map((c) => (
              <span key={c} className="claim-badge border-paper/20 bg-paper/5 text-paper/80">{c}</span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mono-label text-paper/50">Trades</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {verticals.map((v) => (
              <li key={v.slug}><Link href={`/${v.slug}`} className="text-paper/80 hover:text-paper">{v.trade}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mono-label text-paper/50">Product</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/what-is-this" className="text-paper/80 hover:text-paper">What is this?</Link></li>
            <li><Link href="/templates" className="text-paper/80 hover:text-paper">Templates</Link></li>
            <li><Link href="/#pricing" className="text-paper/80 hover:text-paper">Pricing</Link></li>
            <li><Link href="/login" className="text-paper/80 hover:text-paper">Owner login</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-paper/50 sm:flex-row">
          <span>© Own Your Trade. Built for independent trades.</span>
          <span className="font-mono">Demos are live and interactive — go on, place a test order.</span>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import HubShell from "@/components/shared/HubShell";
import { verticals } from "@/config/verticals";

export default function NotFound() {
  return (
    <HubShell heroTone="light">
      <section className="grain relative overflow-hidden bg-paper">
        <div aria-hidden="true" className="arch-top absolute left-1/2 top-24 h-[420px] w-[340px] -translate-x-1/2 border-2 border-sand-dark/60" />

        <div className="container-x relative flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
          <p className="tnum font-mono text-7xl font-bold text-stamp sm:text-8xl">404</p>
          <h1 className="mt-6 max-w-xl font-craft text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            This page took a <span className="italic text-stamp">wrong turn.</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-ink-soft">
            The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Let&rsquo;s get
            you back on track.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary">Back to home</Link>
            <Link href="/#pricing" className="btn-outline">See pricing</Link>
          </div>

          <div className="mt-12 w-full max-w-lg">
            <p className="mono-label text-ink-soft">Or jump to a trade</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {verticals.map((v) => (
                <Link
                  key={v.slug}
                  href={`/${v.slug}`}
                  className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink-soft transition hover:border-stamp hover:text-stamp"
                >
                  {v.trade}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </HubShell>
  );
}

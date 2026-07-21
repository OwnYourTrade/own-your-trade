import Link from "next/link";
import HubShell from "@/components/shared/HubShell";
import { verticals } from "@/config/verticals";

export default function NotFound() {
  return (
    <HubShell heroTone="light">
      <section className="relative overflow-hidden bg-paper">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-stamp/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 top-20 h-[26rem] w-[26rem] rounded-full bg-ledger/10 blur-3xl" />

        <div className="container-x relative flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
          <p className="tnum font-mono text-7xl font-bold text-stamp sm:text-8xl">404</p>
          <h1 className="mt-6 max-w-xl font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            This page took a wrong turn.
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

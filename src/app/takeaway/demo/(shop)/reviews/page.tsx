import type { Metadata } from "next";
import Link from "next/link";
import { reviews, contact, identity } from "@/config/demos/takeaway";
import { site } from "@/lib/site";
import Stars from "@/components/Stars";

export const metadata: Metadata = {
  title: "Reviews",
  description: `${identity.legalName} is rated ${site.rating} stars across ${site.reviewCount} Google reviews.`,
};

export default function ReviewsPage() {
  return (
    <>
      {/* Big rating hero */}
      <section className="bg-lacquer-dark text-cream">
        <div className="container-x flex flex-col items-center gap-6 py-16 text-center sm:flex-row sm:justify-center sm:gap-14 sm:text-left">
          <div>
            <div className="font-display text-7xl leading-none text-gold-light">
              {site.rating}
            </div>
            <div className="mt-3 flex justify-center sm:justify-start">
              <Stars rating={site.rating} size={26} />
            </div>
          </div>
          <div className="hidden h-20 w-px bg-white/20 sm:block" />
          <div className="max-w-md">
            <p className="eyebrow text-gold-light">{reviews.eyebrow}</p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl">
              {site.reviewCount} Google reviews
            </h1>
            <p className="mt-3 text-cream/80">
              Rated by the people who eat here most — the {contact.area} locals.
            </p>
          </div>
        </div>
      </section>

      {/* Theme mosaic */}
      <section className="paper-texture">
        <div className="container-x py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              What keeps people coming back
            </h2>
            <p className="mt-3 text-ink-soft">{reviews.intro}</p>
          </div>

          <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
            {reviews.themes.map((t, i) => (
              <article
                key={t.title}
                className={`break-inside-avoid rounded-2xl p-7 shadow-soft ${
                  i % 3 === 0
                    ? "bg-lacquer text-cream"
                    : i % 3 === 1
                    ? "bg-white"
                    : "bg-gold-light/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Stars rating={5} size={15} />
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                      i % 3 === 0
                        ? "bg-white/15 text-cream"
                        : "bg-cream-dark text-ink-soft"
                    }`}
                  >
                    {t.tag}
                  </span>
                </div>
                <h3
                  className={`mt-4 font-display text-xl ${
                    i % 3 === 0 ? "text-cream" : "text-ink"
                  }`}
                >
                  {t.title}
                </h3>
                <p
                  className={`mt-2 text-sm leading-relaxed ${
                    i % 3 === 0 ? "text-cream/85" : "text-ink-soft"
                  }`}
                >
                  {t.body}
                </p>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-6 max-w-xl text-center text-xs text-ink-soft/70">
            The notes above are our own paraphrased summary of common themes
            across Google reviews, not verbatim quotes.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={contact.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              View on Google
            </a>
            <Link href="/takeaway/demo/order" className="btn-primary">
              Order online
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

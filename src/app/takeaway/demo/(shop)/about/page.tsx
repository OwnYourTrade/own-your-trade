import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { about, shopfront, identity } from "@/config/demos/takeaway";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${identity.legalName} — ${identity.blurb}`,
};

export default function AboutPage() {
  return (
    <>
      {/* Editorial hero: image left, headline right */}
      <section className="bg-white">
        <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div className="relative order-2 aspect-[5/4] overflow-hidden rounded-[2rem] shadow-card lg:order-1">
            <Image
              src={about.hero.image}
              alt="Freshly cooked dishes from the kitchen"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow">{about.hero.eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
              {about.hero.title}
            </h1>
            <div className="rule-gold mt-5" />
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              {about.story[0]}
            </p>
          </div>
        </div>
      </section>

      {/* Story continued + pull quote */}
      <section className="paper-texture">
        <div className="container-x grid gap-12 py-16 lg:grid-cols-[1fr_1.4fr]">
          <blockquote className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-display text-2xl leading-snug text-lacquer sm:text-3xl">
              “A little touch of a proper Hong Kong tea house, right on your
              doorstep.”
            </p>
          </blockquote>
          <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
            {about.story.slice(1).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-lacquer-dark text-cream">
        <div className="container-x py-16">
          <div className="grid gap-8 sm:grid-cols-3">
            {about.values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white/5 p-7">
                <span className="text-3xl">{v.icon}</span>
                <h3 className="mt-4 font-display text-xl text-cream">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/75">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shopfront + CTA */}
      <section className="bg-white">
        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-2">
          <figure className="overflow-hidden rounded-3xl bg-cream-dark shadow-card">
            <div className="relative aspect-[3/2]">
              <Image
                src={shopfront.image}
                alt={shopfront.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="px-5 py-3 text-center text-xs text-ink-soft">
              {shopfront.caption}
            </figcaption>
          </figure>

          <div>
            <p className="eyebrow">Come and find us</p>
            <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              {site.address.line1}, {site.address.city}
            </h2>
            <div className="rule-gold mt-4" />
            <p className="mt-5 text-ink-soft">
              Rated {site.rating} stars across {site.reviewCount} Google reviews.
              Pop in to collect, sit in, or order online for delivery across the
              neighbourhood.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/takeaway/demo/order" className="btn-primary">
                Order online
              </Link>
              <Link href="/takeaway/demo/reviews" className="btn-outline">
                Read our reviews
              </Link>
              <Link href="/takeaway/demo/contact" className="btn-outline">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

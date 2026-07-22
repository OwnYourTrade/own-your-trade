import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/menu";
import { home, reviews, about, shopfront, setMeals, contact } from "@/config/demos/takeaway";
import Stars from "@/components/Stars";
import FeaturedDishes from "@/components/FeaturedDishes";

export default function HomePage() {
  const hero = home.hero;
  const reviewThemes = reviews.themes.slice(0, 3);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="absolute inset-0 bg-lacquer-dark/20" />

        <div className="container-x relative z-10 py-24 text-cream">
          <div className="max-w-2xl animate-fade-up">
            <p className="eyebrow eyebrow-gold">{hero.eyebrow}</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              {hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-cream/85">
              {hero.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#menu" className="btn-gold text-base">
                Order Online
              </a>
              <Link href="/takeaway/demo/menu" className="btn-outline border-cream/50 !text-cream bg-ink/40 backdrop-blur-sm hover:border-gold-light hover:!text-gold-light">
                View the Menu
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream/85">
              <span className="flex items-center gap-2">
                <Stars rating={site.rating} size={18} />
                <span className="font-semibold">{site.rating}</span>
                <span className="text-cream/70">· {site.reviewCount} Google reviews</span>
              </span>
              <span className="hidden h-4 w-px bg-cream/30 sm:block" />
              <span>{hero.note}</span>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Highlights */}
      <section className="border-b border-ink/10 bg-white">
        <div className="container-x grid gap-8 py-10 sm:grid-cols-3">
          {home.highlights.map((h) => (
            <div key={h.title} className="flex items-start gap-4">
              <span className="text-3xl">{h.icon}</span>
              <div>
                <h3 className="font-display text-lg text-ink">{h.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{h.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------- Featured dishes */}
      <section id="menu" className="paper-texture scroll-mt-24">
        <div className="container-x py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">From our kitchen</p>
              <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
                Signature dishes
              </h2>
              <div className="rule-gold mt-4" />
            </div>
            <Link href="/takeaway/demo/menu" className="btn-outline">
              See the full menu
            </Link>
          </div>

          <FeaturedDishes items={home.featured} />
        </div>
      </section>

      {/* --------------------------------------------------------- Set meals */}
      <section className="bg-lacquer-dark text-cream">
        <div className="container-x grid items-center gap-12 py-20 lg:grid-cols-2">
          <div>
            <p className="eyebrow eyebrow-gold">Great value</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              Set meals for the whole table
            </h2>
            <div className="rule-gold mt-4" />
            <p className="mt-5 max-w-md text-cream/80">
              Can&apos;t decide? Our chef-picked set meals bring together the
              best of the menu — spring rolls, aromatic duck, sizzling beef and
              more — at a price that feeds everyone well.
            </p>

            <ul className="mt-6 space-y-3">
              {setMeals.map((sm) => (
                <li
                  key={sm.id}
                  className="flex items-center justify-between border-b border-white/10 pb-3"
                >
                  <span>
                    <span className="font-display text-lg text-cream">{sm.name}</span>
                    <span className="ml-2 text-sm text-cream/60">{sm.serves}</span>
                  </span>
                  <span className="font-semibold text-gold-light">
                    {formatPrice(sm.price)}
                  </span>
                </li>
              ))}
            </ul>

            <Link href="/takeaway/demo/menu#set-meals" className="btn-gold mt-8">
              Explore set meals
            </Link>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
            <Image
              src="/images/banquet.jpg"
              alt="A shared banquet spread"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Reviews */}
      <section className="paper-texture">
        <div className="container-x py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Loved by {site.address.city}</p>
            <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              {site.rating} stars, {site.reviewCount} reviews
            </h2>
            <div className="mt-3 flex justify-center">
              <Stars rating={site.rating} size={26} />
            </div>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviewThemes.map((r) => (
              <div key={r.title} className="card p-7">
                <Stars rating={5} size={16} />
                <h3 className="mt-3 font-display text-xl text-ink">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/takeaway/demo/reviews" className="btn-outline">
              Read more reviews
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Find us */}
      <section className="bg-white">
        <div className="container-x grid items-stretch gap-12 py-20 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">{home.findUs.eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              {home.findUs.title}
            </h2>
            <div className="rule-gold mt-4" />
            <p className="mt-5 max-w-md text-ink-soft">{home.findUs.body}</p>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <PinIcon />
                <p className="text-ink">
                  {site.address.line1}
                  <br />
                  {site.address.city} {site.address.postcode}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <PhoneIcon />
                <a href={site.phoneHref} className="text-ink hover:text-lacquer">
                  {site.phone}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <ClockIcon />
                <p className="text-ink">Open Tuesday–Sunday · Kitchen until 10:00pm</p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/takeaway/demo/order" className="btn-primary">
                Start an order
              </Link>
              <Link href="/takeaway/demo/contact" className="btn-outline">
                Contact &amp; opening hours
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2">
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
          </div>
        </div>
      </section>
    </>
  );
}

function PinIcon() {
  return (
    <svg className="mt-0.5 shrink-0 text-lacquer" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg className="mt-0.5 shrink-0 text-lacquer" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg className="mt-0.5 shrink-0 text-lacquer" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

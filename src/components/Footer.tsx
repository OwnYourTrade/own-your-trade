import Link from "next/link";
import { site } from "@/lib/site";
import { identity, contact } from "@/config/demos/takeaway";
import Stars from "@/components/Stars";

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-cream/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/50 text-gold">
              <span className="font-display text-lg leading-none">{identity.monogram}</span>
            </span>
            <span className="font-display text-xl text-cream">{identity.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
            {identity.blurb}
          </p>
          <div className="mt-5 flex items-center gap-2 text-gold-light">
            <Stars rating={site.rating} size={16} />
            <span className="ml-1 text-sm text-cream/70">
              {site.rating} · {site.reviewCount} Google reviews
            </span>
          </div>
        </div>

        <div>
          <h3 className="eyebrow text-gold-light">Find Us</h3>
          <address className="mt-4 not-italic text-sm leading-relaxed text-cream/70">
            {site.address.line1}
            <br />
            {site.address.city} {site.address.postcode}
            <br />
            <a href={site.phoneHref} className="mt-2 inline-block text-cream hover:text-gold-light">
              {site.phone}
            </a>
          </address>
          <a
            href={contact.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-medium text-gold-light hover:underline"
          >
            Get directions →
          </a>
        </div>

        <div>
          <h3 className="eyebrow text-gold-light">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { href: "/takeaway/demo/menu", label: "Full Menu" },
              { href: "/takeaway/demo/about", label: "About" },
              { href: "/takeaway/demo/reviews", label: "Reviews" },
              { href: "/takeaway/demo/contact", label: "Contact" },
              { href: "/takeaway/demo/order", label: "Order Online" },
              { href: "/takeaway/demo/dashboard", label: "Kitchen Dashboard" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-cream/70 hover:text-gold-light">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {identity.legalName}, {contact.city}.
          </p>
          <p className="text-cream/50">
            <Link href="/takeaway" className="font-mono uppercase tracking-[0.12em] hover:text-gold-light">
              Built by Own·Your·Trade →
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

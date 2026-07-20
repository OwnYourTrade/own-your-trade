import type { Metadata } from "next";
import Link from "next/link";
import { contact, hours, identity } from "@/config/demos/takeaway";
import { site } from "@/lib/site";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Find ${identity.legalName} at ${contact.line1}, ${contact.city} ${contact.postcode}. Opening hours, directions and contact details.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-lacquer-dark text-cream">
        <div className="container-x py-14 text-center">
          <p className="eyebrow text-gold-light">Get in touch</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Contact &amp; opening hours</h1>
          <p className="mx-auto mt-4 max-w-xl text-cream/80">
            Pop in, call ahead, or send us a message — you&apos;ll find us right
            on the High Street.
          </p>
        </div>
      </section>

      <div className="paper-texture">
        <div className="container-x grid gap-10 py-16 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: details + hours */}
          <div className="space-y-8">
            <div className="card p-6 sm:p-8">
              <h2 className="font-display text-2xl text-ink">Find us</h2>
              <div className="rule-gold mt-3" />
              <dl className="mt-5 space-y-4 text-sm">
                <Row label="Address">
                  {contact.line1}
                  <br />
                  {contact.city} {contact.postcode}
                </Row>
                <Row label="Phone">
                  <a href={contact.phoneHref} className="text-lacquer hover:underline">
                    {contact.phone}
                  </a>
                </Row>
                <Row label="Email">
                  <a href={`mailto:${contact.email}`} className="text-lacquer hover:underline">
                    {contact.email}
                  </a>
                </Row>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  Get directions
                </a>
                <Link href="/takeaway/demo/order" className="btn-primary">
                  Order online
                </Link>
              </div>
            </div>

            <div className="card p-6 sm:p-8">
              <h2 className="font-display text-2xl text-ink">Opening hours</h2>
              <div className="rule-gold mt-3" />
              <ul className="mt-4 divide-y divide-ink/10">
                {hours.map((h) => (
                  <li key={h.day} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="font-medium text-ink">{h.day}</span>
                    <span className={h.time === "Closed" ? "text-ink-soft/60" : "text-ink-soft"}>
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-ink-soft/70">
                Hours shown are indicative for this demo — the kitchen is open
                until 10pm on service days.
              </p>
            </div>
          </div>

          {/* Right: form + map */}
          <div className="space-y-8">
            <ContactForm />
            <div className="overflow-hidden rounded-2xl shadow-soft">
              <iframe
                title={`Map to ${identity.legalName}`}
                src={contact.mapsEmbed}
                className="h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <dt className="w-20 shrink-0 font-semibold uppercase tracking-wide text-ink-soft/70">
        {label}
      </dt>
      <dd className="text-ink">{children}</dd>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { menuByGroup, formatPrice } from "@/lib/menu";
import { setMeals, identity } from "@/config/demos/takeaway";
import ItemRow from "@/components/ItemRow";
import CategoryChips from "@/components/CategoryChips";
import AddButton from "@/components/AddButton";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The full menu — starters, mains, sides and drinks. Order online for collection or delivery.",
};

export default function MenuPage() {
  const groups = menuByGroup();
  const chips = [
    { id: "set-meals", name: "Set Meals" },
    ...groups.flatMap((g) => g.categories.map((c) => ({ id: c.id, name: c.name }))),
  ];

  return (
    <>
      {/* Page header */}
      <section className="bg-lacquer-dark text-cream">
        <div className="container-x py-14 text-center">
          <p className="eyebrow text-gold-light">{identity.tagline}</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Our Menu</h1>
          <p className="mx-auto mt-4 max-w-xl text-cream/80">
            Freshly cooked to order. Tap{" "}
            <span className="font-semibold text-gold-light">Add</span> on any dish
            to build your order — then check out for collection or delivery.
          </p>
        </div>
      </section>

      <CategoryChips categories={chips} />

      <div className="paper-texture">
        <div className="container-x py-12">
          {/* ------------------------------------------------- Set meals band */}
          <section id="set-meals" className="scroll-mt-32">
            <GroupHeading
              kicker="Best value"
              title="Set Meals"
              blurb="Chef-picked spreads that bring the best of the menu together — sorted for the whole table."
            />
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {setMeals.map((sm) => (
                <article key={sm.id} className="card flex flex-col overflow-hidden">
                  <div className="relative h-40">
                    <Image
                      src={sm.image}
                      alt={sm.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink shadow">
                      {sm.serves}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-xl text-ink">{sm.name}</h3>
                      <span className="font-display text-xl text-lacquer">
                        {formatPrice(sm.price)}
                      </span>
                    </div>
                    <ul className="mt-4 flex-1 space-y-1.5 text-sm text-ink-soft">
                      {sm.items.map((it) => (
                        <li key={it} className="flex gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                    <AddButton
                      itemKey={sm.id}
                      name={sm.name}
                      price={sm.price}
                      label={`Add — ${formatPrice(sm.price)}`}
                      className="btn-primary mt-5 w-full"
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* --------------------------------------------------- Menu groups */}
          {groups.map((grp) => (
            <section key={grp.group} className="mt-20">
              <GroupHeading kicker="Menu" title={grp.group} />

              <div className="mt-8 space-y-14">
                {grp.categories.map((cat) => (
                  <section key={cat.id} id={cat.id} className="scroll-mt-32">
                    <div className="card overflow-hidden">
                      <div className="relative h-40 sm:h-52">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 1024px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6">
                          <h3 className="font-display text-2xl text-cream sm:text-3xl">
                            {cat.name}
                          </h3>
                          {cat.note && (
                            <span className="mt-2 inline-block rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
                              {cat.note}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-6 sm:p-8">
                        {cat.blurb && (
                          <p className="mb-4 max-w-2xl text-sm italic text-ink-soft">
                            {cat.blurb}
                          </p>
                        )}
                        <div>
                          {cat.items.map((item) => (
                            <ItemRow key={item.id} item={item} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            </section>
          ))}

          {/* CTA */}
          <div className="mt-20 rounded-3xl bg-lacquer px-8 py-12 text-center text-cream">
            <h2 className="font-display text-3xl">Ready to order?</h2>
            <p className="mx-auto mt-3 max-w-md text-cream/80">
              Your basket is saved as you browse. Head to checkout whenever
              you&apos;re ready.
            </p>
            <Link href="/takeaway/demo/order" className="btn-gold mt-6">
              Go to checkout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function GroupHeading({
  kicker,
  title,
  blurb,
}: {
  kicker: string;
  title: string;
  blurb?: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b-2 border-gold/40 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2 className="mt-1 font-display text-3xl text-ink sm:text-4xl">{title}</h2>
      </div>
      {blurb && <p className="max-w-md text-sm text-ink-soft">{blurb}</p>}
    </div>
  );
}

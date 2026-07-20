"use client";

import Image from "next/image";
import { useState } from "react";
import { formatPrice } from "@/lib/menu";
import { useCart } from "./CartProvider";

export type Featured = {
  key: string;
  name: string;
  blurb: string;
  price: number;
  priceLabel?: string; // e.g. "from £8.80"
  image: string;
};

export default function FeaturedDishes({ items }: { items: Featured[] }) {
  const { add } = useCart();
  const [flash, setFlash] = useState<string | null>(null);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((d) => (
        <article
          key={d.key}
          className="group card flex flex-col transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={d.image}
              alt={d.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute right-3 top-3 rounded-full bg-lacquer-dark/90 px-3 py-1 text-sm font-semibold text-cream shadow">
              {d.priceLabel ?? formatPrice(d.price)}
            </div>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-display text-xl text-ink">{d.name}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
              {d.blurb}
            </p>
            <button
              onClick={() => {
                add({ key: d.key, name: d.name, price: d.price });
                setFlash(d.key);
                setTimeout(() => setFlash((k) => (k === d.key ? null : k)), 900);
              }}
              className="btn-ghost mt-4 self-start"
            >
              {flash === d.key ? "Added ✓" : "Add to order"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

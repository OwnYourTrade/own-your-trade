"use client";

import { useState } from "react";
import { formatPrice, type MenuItem } from "@/lib/menu";
import { useCart } from "./CartProvider";

function Tags({ item }: { item: MenuItem }) {
  return (
    <span className="ml-2 inline-flex flex-wrap gap-1 align-middle">
      {item.popular && (
        <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-dark">
          Popular
        </span>
      )}
      {item.veg && (
        <span className="rounded-full bg-jade/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-jade">
          Veg
        </span>
      )}
      {item.spicy && (
        <span className="rounded-full bg-lacquer/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-lacquer">
          Spicy
        </span>
      )}
    </span>
  );
}

function AddedFlash() {
  return (
    <span className="pointer-events-none absolute inset-0 grid place-items-center rounded-full bg-jade text-xs font-semibold text-white">
      Added ✓
    </span>
  );
}

export default function ItemRow({ item }: { item: MenuItem }) {
  const { add } = useCart();
  const [flashKey, setFlashKey] = useState<string | null>(null);

  const doAdd = (key: string, name: string, price: number) => {
    add({ key, name, price });
    setFlashKey(key);
    setTimeout(() => setFlashKey((k) => (k === key ? null : k)), 900);
  };

  const hasVariants = !!item.variants?.length;

  return (
    <div className="flex items-start justify-between gap-4 border-b border-ink/8 py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline">
          <h4 className="font-medium text-ink">{item.name}</h4>
          <Tags item={item} />
        </div>
        {item.desc && (
          <p className="mt-1 max-w-prose text-sm leading-relaxed text-ink-soft">
            {item.desc}
          </p>
        )}
        {!hasVariants && (
          <p className="mt-1 text-sm font-semibold text-lacquer">
            {formatPrice(item.price!)}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        {hasVariants ? (
          item.variants!.map((v) => {
            const key = `${item.id}::${v.label}`;
            return (
              <button
                key={key}
                onClick={() =>
                  doAdd(key, `${item.name} (${v.label})`, v.price)
                }
                className="relative flex w-36 items-center justify-between gap-2 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-sm transition hover:border-lacquer hover:bg-lacquer hover:text-cream"
              >
                <span>{v.label}</span>
                <span className="font-semibold">{formatPrice(v.price)}</span>
                {flashKey === key && <AddedFlash />}
              </button>
            );
          })
        ) : (
          <button
            onClick={() => doAdd(item.id, item.name, item.price!)}
            className="relative inline-flex items-center gap-1.5 rounded-full bg-lacquer px-4 py-1.5 text-sm font-semibold text-cream shadow-soft transition hover:bg-lacquer-dark"
          >
            <span className="text-base leading-none">+</span> Add
            {flashKey === item.id && <AddedFlash />}
          </button>
        )}
      </div>
    </div>
  );
}

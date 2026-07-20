"use client";

import { useEffect, useRef, useState } from "react";

export default function CategoryChips({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [active, setActive] = useState(categories[0]?.id);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    categories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [categories]);

  // Keep the active chip in view within the horizontal strip
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const chip = strip.querySelector<HTMLElement>(`[data-chip="${active}"]`);
    if (chip) {
      const left =
        chip.offsetLeft - strip.clientWidth / 2 + chip.clientWidth / 2;
      strip.scrollTo({ left, behavior: "smooth" });
    }
  }, [active]);

  const onClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-16 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur md:top-[72px]">
      <div
        ref={stripRef}
        className="no-scrollbar container-x flex gap-2 overflow-x-auto py-3"
      >
        {categories.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            data-chip={c.id}
            onClick={(e) => onClick(e, c.id)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active === c.id
                ? "bg-lacquer text-cream shadow-soft"
                : "bg-white text-ink-soft hover:bg-cream-dark"
            }`}
          >
            {c.name}
          </a>
        ))}
      </div>
    </div>
  );
}

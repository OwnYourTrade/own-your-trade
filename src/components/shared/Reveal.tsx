"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-reveal wrapper (crafted-warmth redesign). Adds `is-revealed` when the
 * element enters the viewport; the actual motion lives in globals.css under
 * `[data-reveal]`, which only hides content when scripting is enabled and is
 * disabled entirely for prefers-reduced-motion. Purely visual — no effect on
 * content, layout order, or functionality.
 */
export default function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "up" | "scale" | "left";
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-revealed");
            io.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={variant}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </div>
  );
}

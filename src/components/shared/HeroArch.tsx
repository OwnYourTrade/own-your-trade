"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's doorway-arch echoes — the logo's "your own place" motif blown up
 * into architectural shapes behind the phone mockup. Replaces the old blurred
 * gradient blobs with something specific and brand-meaningful. Drifts very
 * gently on scroll (rAF parallax, disabled for prefers-reduced-motion) so the
 * green doorway in front reads as standing still — a little depth, no blur.
 */
export default function HeroArch({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY * 0.06, 52);
        el.style.transform = `translateY(${y}px)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`}>
      {/* Outline echo — the widest arch */}
      <div className="arch-top absolute bottom-0 left-1/2 top-0 w-[680px] max-w-[96vw] -translate-x-1/2 border-2 border-sand-dark/70" />
      {/* Solid sand echo */}
      <div className="arch-top absolute bottom-0 left-1/2 top-9 w-[620px] max-w-[92vw] -translate-x-1/2 bg-sand/70" />
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { useDemoName } from "@/components/shared/useDemoName";
import { site } from "@/lib/site";
import { identity } from "@/config/demos/takeaway";

const BASE = "/takeaway/demo";
const links = [
  { href: `${BASE}`, label: "Home" },
  { href: `${BASE}/menu`, label: "Menu" },
  { href: `${BASE}/about`, label: "About" },
  { href: `${BASE}/reviews`, label: "Reviews" },
  { href: `${BASE}/contact`, label: "Contact" },
  { href: `${BASE}/order`, label: "Order" },
];

export default function Nav() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const displayName = useDemoName(identity.name);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === BASE ? pathname === BASE : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-lacquer-dark/95 shadow-lg backdrop-blur"
          : "bg-lacquer-dark"
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-[72px]">
        {/* Brand */}
        <Link href="/takeaway/demo" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/60 bg-lacquer text-gold shadow-inner">
            <span className="font-display text-lg leading-none">{identity.monogram}</span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-extrabold tracking-wide text-cream group-hover:text-gold-light md:text-xl">
              {displayName}
            </span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-gold-light/80">
              {identity.cuisine}
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-active={isActive(l.href)}
              className="nav-link text-cream/90 hover:text-gold-light data-[active=true]:text-gold-light"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <a
            href={site.phoneHref}
            className="hidden text-sm font-medium text-cream/80 hover:text-gold-light lg:inline"
          >
            {site.phone}
          </a>
          <button
            onClick={openCart}
            aria-label="Open basket"
            className="relative grid h-10 w-10 place-items-center rounded-full bg-lacquer text-cream transition hover:bg-lacquer-light"
          >
            <BagIcon />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink">
                {count}
              </span>
            )}
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-full text-cream md:hidden"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-gold/20 bg-lacquer-dark md:hidden">
          <div className="container-x flex flex-col py-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                data-active={isActive(l.href)}
                className="border-b border-white/5 py-3 text-cream/90 data-[active=true]:text-gold-light"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

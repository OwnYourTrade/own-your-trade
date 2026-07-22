"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Wordmark from "./Wordmark";
import TradeIcon from "./TradeIcon";
import { verticals } from "@/config/verticals";

const productLinks = [
  { href: "/what-is-this", label: "What we do", sub: "The service in plain terms", icon: "info" },
  { href: "/templates", label: "Templates", sub: "Proven, tested, made yours", icon: "grid" },
  { href: "/what-is-this#how", label: "How it works", sub: "Order/book → pay → dashboard", icon: "steps" },
  { href: "/#pricing", label: "Pricing", sub: "One flat fee, three levels", icon: "tag" },
] as const;

export default function OwnYourTradeNav({ heroTone = "light" }: { heroTone?: "light" | "dark" }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState<"trades" | "product" | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpen(null);
  }, [pathname]);

  // Light text only when transparent over a dark hero.
  const overDark = !scrolled && heroTone === "dark";
  const logoTone = overDark ? "light" : "dark";
  const linkColor = overDark ? "text-paper/85 hover:text-paper" : "text-ink/75 hover:text-ink";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-ink/10 bg-paper/90 backdrop-blur-md shadow-soft" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="container-x flex h-[70px] items-center justify-between gap-4">
        <Wordmark tone={logoTone} size="md" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Dropdown
            label="Trades"
            color={linkColor}
            isOpen={open === "trades"}
            onOpen={() => setOpen("trades")}
            onClose={() => setOpen(null)}
            width="w-64"
          >
            {verticals.map((v) => (
              <Link key={v.slug} href={`/${v.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-paper">
                <span className="text-stamp"><TradeIcon name={v.icon} className="h-5 w-5" /></span>
                <span>
                  <span className="block font-semibold leading-tight">{v.trade}</span>
                  <span className="block text-xs text-ink-soft">{v.selectorSub}</span>
                </span>
              </Link>
            ))}
          </Dropdown>

          <Dropdown
            label="Product"
            color={linkColor}
            isOpen={open === "product"}
            onOpen={() => setOpen("product")}
            onClose={() => setOpen(null)}
            width="w-72"
          >
            {productLinks.map((l) => (
              <Link key={l.href} href={l.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink hover:bg-paper">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-stamp/10 text-stamp">
                  <MiniIcon name={l.icon} />
                </span>
                <span>
                  <span className="block font-semibold leading-tight">{l.label}</span>
                  <span className="block text-xs text-ink-soft">{l.sub}</span>
                </span>
              </Link>
            ))}
          </Dropdown>

          <Link href="/#pricing" className={`px-3 py-2 text-sm font-medium transition-colors ${linkColor}`}>Pricing</Link>
          <Link href="/contact" className={`px-3 py-2 text-sm font-medium transition-colors ${linkColor}`}>Contact</Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link href="/get-started" className="btn-gold px-6 py-2.5 text-[13px]">Get started</Link>
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className={`grid h-10 w-10 place-items-center rounded-full md:hidden ${overDark ? "text-paper" : "text-ink"}`}
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-ink/10 bg-paper md:hidden">
          <div className="container-x flex flex-col py-3">
            <span className="mono-label px-1 py-2 text-ink-soft">Trades</span>
            {verticals.map((v) => (
              <Link key={v.slug} href={`/${v.slug}`} className="flex items-center gap-3 border-b border-ink/5 py-2.5 text-ink">
                <span className="text-stamp"><TradeIcon name={v.icon} className="h-5 w-5" /></span>
                {v.trade}
              </Link>
            ))}
            <span className="mono-label px-1 pb-2 pt-4 text-ink-soft">Product</span>
            {productLinks.map((l) => (
              <Link key={l.href} href={l.href} className="border-b border-ink/5 py-2.5 text-ink">{l.label}</Link>
            ))}
            <Link href="/contact" className="border-b border-ink/5 py-2.5 font-semibold text-ink">Contact</Link>
            <div className="mt-4">
              <Link href="/get-started" className="btn-gold w-full">Get started</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

function Dropdown({
  label,
  color,
  isOpen,
  onOpen,
  onClose,
  width,
  children,
}: {
  label: string;
  color: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  width: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${color}`}>
        {label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <div className={`absolute left-0 top-full ${width} pt-2`}>
          <div className="ticket animate-dropdown overflow-hidden p-1.5">{children}</div>
        </div>
      )}
    </div>
  );
}

function MiniIcon({ name }: { name: string }) {
  const c = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "info") return (<svg {...c}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>);
  if (name === "grid") return (<svg {...c}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>);
  if (name === "steps") return (<svg {...c}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>);
  return (<svg {...c}><path d="M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" /><path d="M7.5 7.5h.01" /></svg>);
}

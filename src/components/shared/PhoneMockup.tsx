import { identity } from "@/config/demos/takeaway";

// Three real dishes/prices from the Northgate demo config.
const items = [
  { name: "Salt & Pepper Squid", price: "£5.90" },
  { name: "Special Chow Mein", price: "£7.80" },
  { name: "Crispy Chilli Beef", price: "£6.20" },
];

/**
 * A phone-frame mockup of the actual Northgate ordering demo — its real header,
 * food hero, menu rows and order bar. Used in the hero as the "real product"
 * visual, the way Owner.com shows its app in a phone frame.
 */
export default function PhoneMockup({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-[288px] ${className}`}>
      <div className="relative rounded-[2.75rem] border-[11px] border-ink bg-ink shadow-lift">
        {/* dynamic island */}
        <div className="absolute left-1/2 top-2 z-10 h-[22px] w-24 -translate-x-1/2 rounded-full bg-ink" />
        {/* screen */}
        <div className="overflow-hidden rounded-[2rem] bg-paper">
          {/* status bar */}
          <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[11px] font-bold text-ink">
            <span className="tnum font-mono">9:41</span>
            <span className="flex items-center gap-1">
              <svg width="16" height="11" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="7" width="3" height="5" rx="1" /><rect x="5" y="4" width="3" height="8" rx="1" /><rect x="10" y="1.5" width="3" height="10.5" rx="1" opacity="0.9" /><rect x="15" y="0" width="3" height="12" rx="1" opacity="0.4" /></svg>
              <svg width="15" height="11" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M1 4.5a10 10 0 0 1 14 0M3.5 7a6.5 6.5 0 0 1 9 0M8 9.5h.01" /></svg>
              <svg width="22" height="11" viewBox="0 0 24 12" fill="none"><rect x="1" y="1" width="19" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.2" opacity="0.5" /><rect x="2.5" y="2.5" width="13" height="7" rx="1.2" fill="currentColor" /><rect x="21" y="4" width="2" height="4" rx="1" fill="currentColor" opacity="0.5" /></svg>
            </span>
          </div>

          {/* app header */}
          <div className="flex items-center justify-between border-b border-ink/10 px-4 py-2.5">
            <span className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-stamp font-display text-sm font-bold text-paper">
                {identity.monogram}
              </span>
              <span className="font-display text-[15px] font-bold text-ink">{identity.name}</span>
            </span>
            <span className="rounded-full bg-stamp px-2.5 py-1 text-[10px] font-bold text-paper">Order online</span>
          </div>

          {/* food hero */}
          <div className="relative h-28">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/images/oyt/takeaway-hero.jpg)" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-ink/10" />
            <div className="absolute inset-x-0 bottom-0 p-3.5">
              <p className="font-display text-[15px] font-extrabold leading-tight text-paper">Fresh Chinese, made to order</p>
              <p className="text-[10px] text-paper/80">Collection &amp; delivery · open till late</p>
            </div>
          </div>

          {/* menu rows */}
          <div className="divide-y divide-ink/10 px-4">
            {items.map((it) => (
              <div key={it.name} className="flex items-center justify-between py-2.5">
                <span className="text-[12px] font-medium text-ink">{it.name}</span>
                <span className="flex items-center gap-2">
                  <span className="tnum font-mono text-[12px] font-bold text-ink">{it.price}</span>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-stamp text-paper">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </span>
                </span>
              </div>
            ))}
          </div>

          {/* order bar */}
          <div className="p-3.5 pt-2">
            <div className="flex items-center justify-between rounded-full bg-stamp px-4 py-2.5 text-paper">
              <span className="text-[12px] font-semibold">View basket</span>
              <span className="tnum font-mono text-[13px] font-bold">£19.90</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

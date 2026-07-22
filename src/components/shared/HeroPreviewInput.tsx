"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function toDomain(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
  return slug ? `${slug}.co.uk` : "";
}

/**
 * Hero "preview your site" box — one seamless pill (input + solid button) with
 * live feedback: as you type a business name, the live domain preview updates
 * and the button activates. On submit it opens the real Northgate demo
 * pre-filled with that name (carried via ?name=), the same shared-state trick.
 */
export default function HeroPreviewInput() {
  const router = useRouter();
  const [name, setName] = useState("");
  const trimmed = name.trim();
  const domain = toDomain(name);

  const go = () => {
    const q = trimmed ? `?name=${encodeURIComponent(trimmed)}` : "";
    router.push(`/takeaway/demo${q}`);
  };

  return (
    <div className="mx-auto mt-10 max-w-2xl">
      <div className="relative">
        {/* crisp offset backing — a warm sand echo instead of a blur glow */}
        <div className="pointer-events-none absolute inset-0 translate-y-2.5 rounded-full bg-sand-dark/60" />
        <form
          onSubmit={(e) => { e.preventDefault(); go(); }}
          className="relative flex items-center gap-2 rounded-full border border-sand-dark/70 bg-white p-2 pl-5 shadow-warm transition focus-within:border-stamp/50"
        >
          <svg className="hidden shrink-0 text-ink/35 sm:block" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type your business name…"
            aria-label="Your business name"
            className="min-w-0 flex-1 bg-transparent px-1 py-3 text-base outline-none placeholder:text-ink/40 sm:text-lg"
          />
          <button type="submit" className="btn-primary shrink-0 whitespace-nowrap px-5 py-3 sm:px-7">
            Preview my site
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </form>
      </div>

      {/* live feedback */}
      <p className="mt-3 flex items-center justify-center gap-2 text-center text-sm text-ink-soft">
        {trimmed ? (
          <>
            <span className="inline-flex h-2 w-2 rounded-full bg-ledger" />
            Opens a real, working site as{" "}
            <span className="font-semibold text-ink">{trimmed}</span>
            <span className="hidden font-mono text-ink/50 sm:inline">· {domain}</span>
          </>
        ) : (
          <>See your name on a real, working site in seconds — no sign-up.</>
        )}
      </p>
    </div>
  );
}

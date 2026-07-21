"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// GDPR/PECR cookie consent. Strictly-necessary cookies (your login/session,
// cart, and this consent choice itself) always run; anything non-essential
// (e.g. analytics, if added later) should only load when consent === "accepted".
// The choice is stored in localStorage so the banner shows once, on first visit.

const STORAGE_KEY = "oyt-cookie-consent";
export type Consent = "accepted" | "declined";

export function getStoredConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "accepted" || v === "declined" ? v : null;
}

export default function CookieBanner() {
  // Start hidden; decide after mount to avoid a hydration mismatch.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getStoredConsent()) setVisible(true);
  }, []);

  const choose = (consent: Consent) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, consent);
    } catch {
      /* storage blocked — just dismiss for this session */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:max-w-md"
    >
      <div className="ticket p-5 shadow-lift sm:p-6">
        <p className="font-display text-base font-bold text-ink">We use cookies</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          We use essential cookies to make this site work (your session, cart and this choice).
          With your consent we may also use non-essential cookies to understand how the site is
          used. See our{" "}
          <Link href="/cookies" className="font-semibold text-stamp underline underline-offset-2 hover:text-stamp-dark">
            Cookie Policy
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <button onClick={() => choose("accepted")} className="btn-primary px-5 py-2.5 text-sm">
            Accept all
          </button>
          <button onClick={() => choose("declined")} className="btn-outline px-5 py-2.5 text-sm">
            Decline non-essential
          </button>
        </div>
      </div>
    </div>
  );
}

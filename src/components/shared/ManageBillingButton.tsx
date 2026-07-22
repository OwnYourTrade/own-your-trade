"use client";

import { useState } from "react";

/**
 * Opens the Stripe Customer Billing Portal for the customer who just paid —
 * update card details or cancel the subscription. Gated server-side by the
 * (unguessable) Checkout session id from their own confirmation URL.
 */
export default function ManageBillingButton({ sessionId }: { sessionId: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/billing-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Couldn't open the billing portal — please email us instead.");
        setBusy(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error — please try again or email us.");
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 text-center">
      <button onClick={open} disabled={busy} className="btn-outline">
        {busy ? "Opening…" : "Manage billing / cancel"}
      </button>
      {error && <p className="mt-2 text-xs text-stamp">{error}</p>}
      <p className="mx-auto mt-2 max-w-xs text-xs text-ink-soft">
        Update your card or cancel your monthly plan any time — no phone calls, no questions.
      </p>
    </div>
  );
}

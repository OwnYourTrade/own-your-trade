"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { identity } from "@/config/demos/takeaway";

export default function DashboardLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      router.push("/takeaway/demo/dashboard");
      router.refresh();
    } catch {
      setError("Network error.");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-lacquer-dark text-gold">
            <span className="font-display text-xl">{identity.monogram}</span>
          </div>
          <h1 className="mt-4 font-display text-2xl text-ink">
            {identity.name} · Kitchen
          </h1>
          <p className="mt-1 text-sm text-ink-soft">Staff order dashboard</p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl bg-white p-6 shadow-card"
        >
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Password
          </label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter staff password"
            className="w-full rounded-xl border border-ink/15 bg-cream/50 px-4 py-2.5 text-sm outline-none focus:border-lacquer focus:ring-2 focus:ring-lacquer/20"
          />
          {error && <p className="mt-3 text-sm text-lacquer">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-4 w-full"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <p className="mt-4 text-center text-xs text-ink-soft">
            Demo password: <code className="font-semibold">owner</code>
          </p>
        </form>

        <div className="mt-6 text-center">
          <Link href="/takeaway/demo" className="text-sm text-ink-soft hover:text-lacquer">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}

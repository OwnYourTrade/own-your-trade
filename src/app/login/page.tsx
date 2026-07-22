"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { site } from "@/config/site";

export default function OwnerLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [next, setNext] = useState("/");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const n = new URLSearchParams(window.location.search).get("next");
    if (n && n.startsWith("/")) setNext(n);
  }, []);

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
      router.push(next);
      router.refresh();
    } catch {
      setError("Network error.");
      setLoading(false);
    }
  }

  return (
    <div className="grain grid min-h-screen place-items-center bg-paper px-5">
      <div className="relative w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="wordmark text-sm text-ink">{site.wordmark}</span>
          <h1 className="mt-4 font-craft text-2xl font-semibold text-ink">Owner sign in</h1>
          <p className="mt-1 text-sm text-ink-soft">Access your live dashboard</p>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-sand-dark/70 bg-white p-6 shadow-warm">
          <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter owner password"
            className="w-full rounded-md border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-stamp focus:ring-2 focus:ring-stamp/20"
          />
          {error && <p className="mt-3 text-sm text-stamp">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-4 w-full">
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <p className="mt-4 text-center text-xs text-ink-soft">
            Demo password: <code className="font-semibold">owner</code>
          </p>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-ink-soft hover:text-stamp">← Back to Own Your Trade</Link>
        </div>
      </div>
    </div>
  );
}

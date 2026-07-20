"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { site } from "@/config/site";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
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
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error.");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="wordmark text-sm text-ink">{site.wordmark}</span>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">Admin sign in</h1>
          <p className="mt-1 text-sm text-ink-soft">Private — real customer data</p>
        </div>

        <form onSubmit={submit} className="ticket p-6">
          <label className="mb-1.5 block text-sm font-medium text-ink">Admin password</label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full rounded-md border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-stamp focus:ring-2 focus:ring-stamp/20"
          />
          {error && <p className="mt-3 text-sm text-stamp">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary mt-4 w-full">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-ink-soft hover:text-stamp">← Back to site</Link>
        </div>
      </div>
    </div>
  );
}

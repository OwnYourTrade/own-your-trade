"use client";

import { useEffect, useState } from "react";

/**
 * Reads a ?name= query param and returns it, falling back to the demo's own
 * default business name. Used so the homepage "preview your site" tool can carry
 * a typed business name through into a live demo (e.g. /takeaway/demo?name=…).
 *
 * Reads from window.location after mount (not useSearchParams) so it needs no
 * Suspense boundary and never blocks static rendering of the demo shells.
 */
export function useDemoName(fallback: string): string {
  const [name, setName] = useState(fallback);
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get("name");
      if (p && p.trim()) setName(p.trim());
    } catch {
      /* ignore */
    }
  }, []);
  return name;
}

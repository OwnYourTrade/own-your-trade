"use client";

import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";

// Clears the basket once, when the confirmation page mounts.
export default function ClearCart() {
  const { clear, hydrated } = useCart();
  useEffect(() => {
    // Wait until the cart has hydrated from localStorage before clearing,
    // otherwise the provider's hydrate effect would re-load the old basket.
    if (hydrated) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);
  return null;
}

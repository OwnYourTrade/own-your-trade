"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function AddButton({
  itemKey,
  name,
  price,
  label = "Add to order",
  className = "btn-primary",
}: {
  itemKey: string;
  name: string;
  price: number;
  label?: string;
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      onClick={() => {
        add({ key: itemKey, name, price });
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
      }}
      className={className}
    >
      {added ? "Added ✓" : label}
    </button>
  );
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

export type CartLine = {
  key: string; // resolved item key (itemId or itemId::variant)
  name: string;
  price: number;
  qty: number;
};

type CartState = { lines: CartLine[] };

type Action =
  | { type: "add"; line: Omit<CartLine, "qty">; qty?: number }
  | { type: "setQty"; key: string; qty: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "hydrate"; state: CartState };

const STORAGE_KEY = "oyt.cart.v1";

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      const qty = action.qty ?? 1;
      const existing = state.lines.find((l) => l.key === action.line.key);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.key === action.line.key ? { ...l, qty: l.qty + qty } : l
          ),
        };
      }
      return { lines: [...state.lines, { ...action.line, qty }] };
    }
    case "setQty": {
      if (action.qty <= 0) {
        return { lines: state.lines.filter((l) => l.key !== action.key) };
      }
      return {
        lines: state.lines.map((l) =>
          l.key === action.key ? { ...l, qty: action.qty } : l
        ),
      };
    }
    case "remove":
      return { lines: state.lines.filter((l) => l.key !== action.key) };
    case "clear":
      return { lines: [] };
    default:
      return state;
  }
}

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load persisted cart on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        if (parsed && Array.isArray(parsed.lines)) {
          dispatch({ type: "hydrate", state: parsed });
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist on change (after first hydration so we don't clobber storage)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const count = state.lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = state.lines.reduce((s, l) => s + l.qty * l.price, 0);
    return {
      lines: state.lines,
      count,
      subtotal,
      hydrated,
      add: (line, qty) => {
        dispatch({ type: "add", line, qty });
        setIsOpen(true);
      },
      setQty: (key, qty) => dispatch({ type: "setQty", key, qty }),
      remove: (key) => dispatch({ type: "remove", key }),
      clear: () => dispatch({ type: "clear" }),
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    };
  }, [state, isOpen, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

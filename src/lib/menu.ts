// ---------------------------------------------------------------------------
// Menu logic. The DATA lives in src/config/brand.ts (the single file you edit
// per client). This module re-exports it and adds pricing / resolver helpers
// that the ordering flow and dashboard rely on.
// ---------------------------------------------------------------------------

import {
  menu,
  setMeals,
  MENU_GROUP_ORDER,
  type MenuItem,
  type MenuCategory,
  type MenuGroup,
  type Variant,
  type SetMeal,
} from "@/config/demos/takeaway";

export { menu, setMeals, MENU_GROUP_ORDER };
export type { MenuItem, MenuCategory, MenuGroup, Variant, SetMeal };

export const CURRENCY = "£";

export function formatPrice(n: number): string {
  return `${CURRENCY}${n.toFixed(2)}`;
}

/** Lowest price for an item (variant items show "from £x"). */
export function itemFromPrice(item: MenuItem): number {
  if (typeof item.price === "number") return item.price;
  if (item.variants && item.variants.length)
    return Math.min(...item.variants.map((v) => v.price));
  return 0;
}

/** Categories grouped by their top-level group, in canonical order. */
export function menuByGroup(): { group: MenuGroup; categories: MenuCategory[] }[] {
  return MENU_GROUP_ORDER.map((group) => ({
    group,
    categories: menu.filter((c) => c.group === group),
  })).filter((g) => g.categories.length > 0);
}

// ---------------------------------------------------------------------------
// Resolver — the ordering flow only ever sends item keys + quantities; prices
// are looked up here server-side, never trusted from the client.
// ---------------------------------------------------------------------------

export type ResolvedItem = {
  key: string; // unique key: itemId or itemId::variantLabel
  id: string;
  name: string; // full name incl. variant, e.g. "Crispy Aromatic Duck (Half)"
  price: number;
  categoryId: string;
  categoryName: string;
};

const resolvedIndex: Record<string, ResolvedItem> = {};

for (const cat of menu) {
  for (const item of cat.items) {
    if (item.variants && item.variants.length) {
      for (const v of item.variants) {
        const key = `${item.id}::${v.label}`;
        resolvedIndex[key] = {
          key,
          id: item.id,
          name: `${item.name} (${v.label})`,
          price: v.price,
          categoryId: cat.id,
          categoryName: cat.name,
        };
      }
    } else if (typeof item.price === "number") {
      resolvedIndex[item.id] = {
        key: item.id,
        id: item.id,
        name: item.name,
        price: item.price,
        categoryId: cat.id,
        categoryName: cat.name,
      };
    }
  }
}

for (const sm of setMeals) {
  resolvedIndex[sm.id] = {
    key: sm.id,
    id: sm.id,
    name: sm.name,
    price: sm.price,
    categoryId: "set-meals",
    categoryName: "Set Meals",
  };
}

export function resolveItem(key: string): ResolvedItem | undefined {
  return resolvedIndex[key];
}

export function allResolved(): ResolvedItem[] {
  return Object.values(resolvedIndex);
}

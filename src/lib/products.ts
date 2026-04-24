import data from "@/data/simba_products.json";
import type { Product } from "./types";

export const STORE = data.store as { name: string; tagline: string; location: string; currency: string };
export const PRODUCTS: Product[] = data.products as Product[];

export interface CategoryMeta {
  key: string;
  count: number;
  tile: number; // 1-8 -> tailwind tile color
  emoji: string;
}

const TILE_MAP: Record<string, { tile: number; emoji: string }> = {
  "Alcoholic Drinks": { tile: 8, emoji: "🍷" },
  "Cosmetics & Personal Care": { tile: 5, emoji: "🧴" },
  "General": { tile: 4, emoji: "🛒" },
  "Food Products": { tile: 1, emoji: "🥫" },
  "Kitchenware & Electronics": { tile: 6, emoji: "🍳" },
  "Cleaning & Sanitary": { tile: 2, emoji: "🧼" },
  "Baby Products": { tile: 3, emoji: "🍼" },
  "Pet Care": { tile: 7, emoji: "🐾" },
  "Kitchen Storage": { tile: 6, emoji: "🥡" },
  "Sports & Wellness": { tile: 2, emoji: "⚽" },
};

export const CATEGORIES: CategoryMeta[] = Array.from(
  PRODUCTS.reduce((acc, p) => {
    acc.set(p.category, (acc.get(p.category) ?? 0) + 1);
    return acc;
  }, new Map<string, number>())
).map(([key, count]) => ({
  key,
  count,
  tile: TILE_MAP[key]?.tile ?? 4,
  emoji: TILE_MAP[key]?.emoji ?? "🛍️",
})).sort((a, b) => b.count - a.count);

export const formatRWF = (n: number) =>
  `RWF ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export function getProductsByCategory(category: string) {
  return PRODUCTS.filter((p) => p.category === category);
}

export function searchProducts(q: string): Product[] {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
  ).slice(0, 40);
}
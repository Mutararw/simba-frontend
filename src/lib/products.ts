import data from "@/data/simba_products.json";
import type { Product } from "./types";
import { api } from "./api";
import i18n from "@/i18n";

export const STORE = data.store as { name: string; tagline: string; location: string; currency: string };
export const PRODUCTS: Product[] = data.products as Product[];

export interface CategoryMeta {
  key: string;
  count: number;
  tile: number; // 1-8 -> tailwind tile color
  emoji: string;
  image?: string;
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

export function getCategoryMeta(products: Product[]): CategoryMeta[] {
  const PREFERENCES: Record<string, string[]> = {
    "Alcoholic Drinks": ["whisky", "beer", "wine", "gin", "vodka", "liqueur", "label", "black label", "heineken", "skol"],
    "Food Products": ["bread", "milk", "cheese", "flour", "rice", "sauce", "pasta", "corned beef"],
    "Cosmetics & Personal Care": ["shampoo", "soap", "cream", "lotion", "deodorant", "dove", "nivea"],
    "Cleaning & Sanitary": ["detergent", "soap", "cleaner", "mop", "toilet", "axion"],
    "Baby Products": ["diaper", "baby", "milk", "toy", "lactogen"],
    "Kitchenware & Electronics": ["kettle", "pan", "iron", "cooker", "fridge"],
    "Pet Care": ["dog", "cat", "pet", "food"],
    "Kitchen Storage": ["bottle", "canister", "storage"],
    "Sports & Wellness": ["massage", "wellness", "sport"],
  };

  const counts = products.reduce((acc, p) => {
    acc.set(p.category, (acc.get(p.category) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());

  // For each category, find the BEST image from the ENTIRE database
  return Array.from(counts.entries()).map(([key, count]) => {
    const keywords = PREFERENCES[key] || [];
    
    // 1. Try to find a match WITH keywords in the SAME category
    let bestProduct = products.find(p => p.category === key && p.image && keywords.some(k => p.name.toLowerCase().includes(k)));
    
    // 2. Fallback: Try to find a match WITH keywords in ANY category (handle miscategorization)
    if (!bestProduct) {
      bestProduct = products.find(p => p.image && keywords.some(k => p.name.toLowerCase().includes(k)));
    }
    
    // 3. Last fallback: First product in category with an image
    if (!bestProduct) {
      bestProduct = products.find(p => p.category === key && p.image);
    }

    return {
      key,
      count,
      tile: TILE_MAP[key]?.tile ?? 4,
      emoji: TILE_MAP[key]?.emoji ?? "🛍️",
      image: bestProduct?.image,
    };
  }).sort((a, b) => b.count - a.count);
}

export const CATEGORIES: CategoryMeta[] = getCategoryMeta(PRODUCTS);

export const formatRWF = (n: number) => {
  const lang = i18n.language.split("-")[0];
  
  switch (lang) {
    case "en":
      // $1 USD ≈ 1300 RWF
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n / 1300);
    case "fr":
      // €1 EUR ≈ 1400 RWF
      return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n / 1400);
    case "ar":
      // 1 AED ≈ 350 RWF
      return new Intl.NumberFormat("ar-AE", { style: "currency", currency: "AED", maximumFractionDigits: 2 }).format(n / 350);
    case "zh":
      // 1 CNY ≈ 180 RWF
      return new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 2 }).format(n / 180);
    case "rw":
    default:
      return `RWF ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
};

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

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get("/api/products");
    return data.map((p: any) => ({
      ...p,
      id: typeof p.id === 'string' ? parseInt(p.id) : Number(p.id),
      price: Number(p.price),
      inStock: p.stock > 0,
      image: p.imageUrl || p.image_url || "",
    }));
  } catch (error) {
    console.error("Failed to fetch products, falling back to static data", error);
    return PRODUCTS;
  }
}

export async function fetchProduct(id: string | number): Promise<Product | null> {
  try {
    const { data } = await api.get(`/api/products/${id}`);
    return {
      ...data,
      id: typeof data.id === 'string' ? parseInt(data.id) : Number(data.id),
      price: Number(data.price),
      inStock: data.stock > 0,
      image: data.imageUrl || data.image_url || "",
    };
  } catch (error) {
    console.error(`Failed to fetch product ${id}`, error);
    return PRODUCTS.find(p => p.id === Number(id)) || null;
  }
}
import data from "@/data/simba_products.json";
import type { Product } from "./types";
import { api } from "./api";
import i18n from "@/i18n";

export const STORE = data.store as { name: string; tagline: string; location: string; currency: string };
export const PRODUCTS: Product[] = data.products as Product[];

interface ApiProduct {
  id: string | number;
  name: string;
  price: string | number;
  category: string;
  subcategoryId: number;
  stock: number;
  imageUrl?: string;
  image_url?: string;
  unit: string;
}

export interface CategoryMeta {
  key: string;
  count: number;
  tile: number;
  emoji: string;
  image?: string;
}

const TILE_MAP: Record<string, { tile: number; emoji: string }> = {
  "Alcoholic Drinks": { tile: 8, emoji: "🍷" },
  "Cosmetics & Personal Care": { tile: 5, emoji: "🧴" },
  General: { tile: 4, emoji: "🛒" },
  "Food Products": { tile: 1, emoji: "🥫" },
  "Kitchenware & Electronics": { tile: 6, emoji: "🍳" },
  "Cleaning & Sanitary": { tile: 2, emoji: "🧼" },
  "Baby Products": { tile: 3, emoji: "🍼" },
  "Pet Care": { tile: 7, emoji: "🐾" },
  "Kitchen Storage": { tile: 6, emoji: "🥡" },
  "Sports & Wellness": { tile: 2, emoji: "⚽" },
};

function mapApiProduct(product: ApiProduct): Product {
  return {
    ...product,
    id: typeof product.id === "string" ? parseInt(product.id, 10) : Number(product.id),
    price: Number(product.price),
    inStock: product.stock > 0,
    image: product.imageUrl || product.image_url || "",
  };
}

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

  const counts = products.reduce((acc, product) => {
    acc.set(product.category, (acc.get(product.category) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());

  return Array.from(counts.entries())
    .map(([key, count]) => {
      const keywords = PREFERENCES[key] || [];

      let bestProduct = products.find(
        (product) =>
          product.category === key &&
          product.image &&
          keywords.some((keyword) => product.name.toLowerCase().includes(keyword))
      );

      if (!bestProduct) {
        bestProduct = products.find(
          (product) => product.image && keywords.some((keyword) => product.name.toLowerCase().includes(keyword))
        );
      }

      if (!bestProduct) {
        bestProduct = products.find((product) => product.category === key && product.image);
      }

      return {
        key,
        count,
        tile: TILE_MAP[key]?.tile ?? 4,
        emoji: TILE_MAP[key]?.emoji ?? "🛍️",
        image: bestProduct?.image,
      };
    })
    .sort((a, b) => b.count - a.count);
}

export const CATEGORIES: CategoryMeta[] = getCategoryMeta(PRODUCTS);

export const formatRWF = (n: number) => {
  const lang = i18n.language.split("-")[0];

  switch (lang) {
    case "en":
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n / 1300);
    case "fr":
      return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n / 1400);
    case "ar":
      return new Intl.NumberFormat("ar-AE", { style: "currency", currency: "AED", maximumFractionDigits: 2 }).format(n / 350);
    case "zh":
      return new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 2 }).format(n / 180);
    case "rw":
    default:
      return `RWF ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
};

export function getProductsByCategory(category: string) {
  return PRODUCTS.filter((product) => product.category === category);
}

export function searchProducts(q: string): Product[] {
  const term = q.trim().toLowerCase();
  if (!term) return [];

  return PRODUCTS.filter(
    (product) => product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term)
  ).slice(0, 40);
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get<ApiProduct[]>("/api/products");
    return data.map(mapApiProduct);
  } catch (error) {
    console.error("Failed to fetch products, falling back to static data", error);
    return PRODUCTS;
  }
}

export async function fetchProduct(id: string | number): Promise<Product | null> {
  try {
    const { data } = await api.get<ApiProduct>(`/api/products/${id}`);
    return mapApiProduct(data);
  } catch (error) {
    console.error(`Failed to fetch product ${id}`, error);
    return PRODUCTS.find((product) => product.id === Number(id)) || null;
  }
}

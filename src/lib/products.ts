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
  subcategoryId?: string | number;
  stock?: string | number;
  inStock?: boolean;
  imageUrl?: string;
  image_url?: string;
  image?: string;
  unit: string;
  description?: string | null;
  rating?: string | number | null;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseFiniteNumber(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : null;
}

function mapApiProduct(product: unknown): Product {
  if (!isRecord(product)) {
    throw new Error("Invalid product response");
  }

  const id = parseFiniteNumber(product.id);
  const price = parseFiniteNumber(product.price);
  const name = typeof product.name === "string" ? product.name : "";
  const category = typeof product.category === "string" ? product.category : "";

  if (id === null || price === null || !name || !category) {
    throw new Error("Invalid product response");
  }

  const stock = parseFiniteNumber(product.stock);
  const subcategoryId = parseFiniteNumber(product.subcategoryId) ?? 0;
  const image =
    (typeof product.imageUrl === "string" && product.imageUrl) ||
    (typeof product.image_url === "string" && product.image_url) ||
    (typeof product.image === "string" && product.image) ||
    "";
  const rating = parseFiniteNumber(product.rating);

  return {
    id,
    name,
    price,
    category,
    subcategoryId,
    inStock: typeof product.inStock === "boolean" ? product.inStock : (stock ?? 0) > 0,
    stock: stock ?? undefined,
    rating: rating ?? undefined,
    image,
    unit: typeof product.unit === "string" && product.unit ? product.unit : "Pcs",
    description: typeof product.description === "string" ? product.description : undefined,
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
  const rwf = `RWF ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  const lang = i18n.language.split("-")[0];

  if (lang === "rw") return rwf;

  // For other languages, show RWF first then converted (optional)
  // But requirement says "show a running RWF total", so RWF must be prominent.
  let converted = "";
  switch (lang) {
    case "en":
      converted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n / 1300);
      return `${rwf} (${converted})`;
    case "fr":
      converted = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(n / 1400);
      return `${rwf} (${converted})`;
    case "ar":
      converted = new Intl.NumberFormat("ar-AE", { style: "currency", currency: "AED", maximumFractionDigits: 2 }).format(n / 350);
      return `${rwf} (${converted})`;
    case "zh":
      converted = new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 2 }).format(n / 180);
      return `${rwf} (${converted})`;
    default:
      return rwf;
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
    if (!Array.isArray(data)) {
      throw new Error("Invalid products response");
    }
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

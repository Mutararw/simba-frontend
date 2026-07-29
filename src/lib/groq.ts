/**
 * Conversational search stub.
 *
 * In Lovable preview this falls back to local keyword matching since
 * Vite is purely client-side and we cannot expose your GROQ_API_KEY.
 *
 * After exporting to GitHub:
 *   1. Add a server route `/api/ai-search` (Next.js, Express, etc.)
 *   2. In that route, call:
 *        POST https://api.groq.com/openai/v1/chat/completions
 *        Authorization: Bearer ${process.env.GROQ_API_KEY}
 *        body: { model: "llama-3.3-70b-versatile",
 *                messages: [{role:"system", content: SYSTEM_PROMPT_WITH_CATALOG},
 *                           {role:"user", content: userMessage}],
 *                response_format: { type: "json_object" } }
 *   3. Set VITE_AI_SEARCH_URL=/api/ai-search and the code below will use it.
 */
import { PRODUCTS, searchProducts } from "./products";
import type { Product } from "./types";
import { api } from "./api";

export interface AiSearchResult {
  reply: string;
  products: Product[];
  addToCartIds?: string[];
}

interface ApiProduct {
  id: string | number;
  price: string | number;
  stock: number;
  imageUrl?: string;
  image_url?: string;
}

interface AiSearchApiResponse {
  reply?: string;
  products?: ApiProduct[];
  productIds?: Array<string | number>;
  addToCartIds?: string[];
}

export async function aiSearch(query: string): Promise<AiSearchResult> {
  try {
    const { data } = await api.post<AiSearchApiResponse>("/api/ai/chat", { query });

    const recommendedIds = (data.productIds || []).map(String);

    const matchedProducts = data.products
      ? data.products.map((product) => ({
          ...product,
          id: typeof product.id === "string" ? parseInt(product.id, 10) : Number(product.id),
          price: Number(product.price),
          inStock: product.stock > 0,
          image: product.imageUrl || product.image_url || "/placeholder.svg",
        }))
      : recommendedIds.length > 0
        ? PRODUCTS.filter(
            (product) => recommendedIds.includes(String(product.id))
          )
        : [];

    return {
      reply: data.reply || "I've found some products that might interest you.",
      products: matchedProducts,
      addToCartIds: (data.addToCartIds || []).map(String),
    };
  } catch (error) {
    console.error("AI search via backend failed, using fallback", error);

    const products = searchProducts(query);
    const reply = products.length
      ? `I found ${products.length} item${products.length > 1 ? "s" : ""} that match "${query}".`
      : `Sorry, I couldn't find anything matching "${query}". Try another keyword.`;
    return { reply, products };
  }
}

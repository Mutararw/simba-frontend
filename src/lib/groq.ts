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

export interface AiSearchResult {
  reply: string;
  products: Product[];
}

export async function aiSearch(query: string): Promise<AiSearchResult> {
  const endpoint = (import.meta as any).env?.VITE_AI_SEARCH_URL as string | undefined;

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, catalog_size: PRODUCTS.length }),
      });
      if (res.ok) return (await res.json()) as AiSearchResult;
    } catch (e) {
      console.warn("AI search endpoint failed, using fallback", e);
    }
  }

  // Fallback: smart keyword search with a friendly natural-language reply
  const products = searchProducts(query);
  const reply = products.length
    ? `I found ${products.length} item${products.length > 1 ? "s" : ""} that match "${query}".`
    : `Sorry, I couldn't find anything matching "${query}". Try another keyword.`;
  return { reply, products };
}
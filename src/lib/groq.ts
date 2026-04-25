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

export async function aiSearch(query: string): Promise<AiSearchResult> {
  try {
    const { data } = await api.post("/api/ai/chat", { query });
    
    // Convert returned productIds to full Product objects using the local cache
    const matchedProducts = data.productIds 
      ? PRODUCTS.filter(p => data.productIds.includes(String(p.id)) || data.productIds.includes(p.id))
      : [];

    return {
      reply: data.reply || "I didn't quite catch that. Could you try asking another way?",
      products: matchedProducts,
      addToCartIds: data.addToCartIds || []
    };
  } catch (error) {
    console.error("AI search via backend failed, using fallback", error);
    
    // Fallback: smart keyword search with a friendly natural-language reply
    const products = searchProducts(query);
    const reply = products.length
      ? `I found ${products.length} item${products.length > 1 ? "s" : ""} that match "${query}".`
      : `Sorry, I couldn't find anything matching "${query}". Try another keyword.`;
    return { reply, products };
  }
}
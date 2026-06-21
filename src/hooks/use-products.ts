import { useState, useEffect, useMemo } from "react";
import { fetchProducts, PRODUCTS, getCategoryMeta } from "@/lib/products";
import type { Product, CategoryMeta } from "@/lib/types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = useMemo(() => getCategoryMeta(products), [products]);

  return { products, categories, loading, error };
}

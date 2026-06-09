import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/shop/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { ProductFilters, type FilterState } from "@/components/shop/ProductFilters";

export default function Browse() {
  const { t } = useTranslation();
  const { products, categories, loading } = useProducts();
  const [params, setParams] = useSearchParams();
  const cat = params.get("cat") || (categories.length > 0 ? categories[0].key : "");
  const [q, setQ] = useState("");

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 100000;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, maxPrice],
    inStockOnly: false,
    sortBy: "relevance",
  });

  // Update price range when products load
  useMemo(() => {
    if (maxPrice > 0 && filters.priceRange[1] === 100000) {
      setFilters(f => ({ ...f, priceRange: [0, maxPrice] }));
    }
  }, [maxPrice]);

  const list = useMemo(() => {
    let l = products.filter((p) => p.category === cat);
    
    // Search query
    if (q.trim()) {
      const term = q.toLowerCase();
      l = l.filter((p) => p.name.toLowerCase().includes(term));
    }

    // Price range
    l = l.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Stock
    if (filters.inStockOnly) {
      l = l.filter((p) => p.inStock);
    }

    // Sort
    if (filters.sortBy === "price-low") {
      l = [...l].sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === "price-high") {
      l = [...l].sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === "name") {
      l = [...l].sort((a, b) => a.name.localeCompare(b.name));
    }

    return l;
  }, [cat, products, q, filters]);

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{t("nav.products")}</h1>

      <div className="sticky top-16 z-30 -mx-4 mt-4 bg-white/95 px-4 pb-3 pt-2 backdrop-blur shadow-sm border-b border-slate-200 dark:bg-white/95">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((c) => {
            const active = c.key === cat;
            return (
              <button
                key={c.key}
                onClick={() => setParams({ cat: c.key })}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-slate-200 bg-white text-slate-900 hover:border-primary/40"
                }`}
              >
                <span className="mr-1.5">{c.emoji}</span>{c.key}
              </button>
            );
          })}
        </div>
        
        <div className="mt-2 space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search in ${cat || "products"}…`}
              className="pl-9 h-11 rounded-xl bg-muted/50 border-none focus-visible:ring-primary"
            />
          </div>

          <ProductFilters 
            maxPrice={maxPrice} 
            initialFilters={filters} 
            onFilterChange={setFilters} 
          />
        </div>
      </div>

      <div className="mt-8">
        {list.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">{loading ? "Loading products..." : t("search.empty")}</p>
            {hasActiveFilters(filters, maxPrice) && (
              <Button variant="link" onClick={() => setFilters({ priceRange: [0, maxPrice], inStockOnly: false, sortBy: "relevance" })}>
                Clear filters to see more results
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function hasActiveFilters(filters: FilterState, maxPrice: number) {
  return filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice || filters.inStockOnly || filters.sortBy !== "relevance";
}
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/shop/ProductCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

export default function Browse() {
  const { t } = useTranslation();
  const { products, categories, loading } = useProducts();
  const [params, setParams] = useSearchParams();
  const cat = params.get("cat") || (categories.length > 0 ? categories[0].key : "");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    let l = products.filter((p) => p.category === cat);
    if (q.trim()) {
      const term = q.toLowerCase();
      l = l.filter((p) => p.name.toLowerCase().includes(term));
    }
    return l;
  }, [cat, products, q]);

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{t("nav.browse")}</h1>

      <div className="sticky top-16 z-30 -mx-4 mt-4 bg-background/90 px-4 pb-3 pt-2 backdrop-blur">
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
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
              >
                <span className="mr-1.5">{c.emoji}</span>{c.key}
              </button>
            );
          })}
        </div>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search in ${cat || "products"}…`}
            className="pl-9"
          />
        </div>
      </div>

      {list.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">{loading ? "Loading products..." : t("search.empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
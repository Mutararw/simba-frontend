import { useState } from "react";
import { Sparkles, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { aiSearch, type AiSearchResult } from "@/lib/groq";
import { ProductCard } from "./ProductCard";
import { useTranslation } from "react-i18next";

export function AiSearchBar() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiSearchResult | null>(null);

  async function ask() {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const r = await aiSearch(q);
      setResult(r);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => { e.preventDefault(); ask(); }}
        className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-ring"
      >
        <Search className="ml-2 h-5 w-5 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("search.placeholder")}
          className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" disabled={loading || !q.trim()} className="gap-1.5">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span className="hidden sm:inline">{t("search.askButton")}</span>
        </Button>
      </form>

      {result && (
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" /> {t("search.aiTitle")}
          </div>
          <p className="mb-4 rounded-xl bg-secondary p-3 text-sm text-secondary-foreground">{result.reply}</p>
          {result.products.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {result.products.slice(0, 10).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Search, Loader2, Mic, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { aiSearch, type AiSearchResult } from "@/lib/groq";
import { ProductCard } from "./ProductCard";
import { useTranslation } from "react-i18next";
import { useCart } from "@/store/cart";
import { PRODUCTS } from "@/lib/products";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognitionErrorEventLike {
  error?: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionCtor {
  new (): SpeechRecognitionLike;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

export function AiSearchBar() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiSearchResult | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<{ id: number; name: string; category: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const add = useCart((s) => s.add);

  useEffect(() => {
    if (!result) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setResult(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [result]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const query = q.toLowerCase();
    const matches = PRODUCTS
      .filter((p) => p.name.toLowerCase().includes(query))
      .slice(0, 8)
      .map((p) => ({ id: p.id, name: p.name, category: p.category }));
    setSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  }, [q]);

  const askWithQuery = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      setLoading(true);
      setShowSuggestions(false);
      try {
        const response = await aiSearch(query);
        setResult(response);

        if (response.addToCartIds && response.addToCartIds.length > 0) {
          const cartIds = response.addToCartIds.map(String);
          const itemsToAdd = PRODUCTS.filter((p) => cartIds.includes(String(p.id)));
          itemsToAdd.forEach((p) => {
            if (p.inStock) add(p);
          });

          if (itemsToAdd.length > 0) {
            toast.success(t("search.autoAdd", { count: itemsToAdd.length }), {
              icon: "🛒",
            });
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [add]
  );

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setQ(transcript);
      setIsListening(false);
      void askWithQuery(transcript);
    };
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast.error(t("search.voiceError"));
      };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [askWithQuery]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!recognitionRef.current) {
      toast.error(t("search.voiceSupport"));
      return;
    }

    recognitionRef.current.start();
    setIsListening(true);
  };

  const ask = async () => {
    await askWithQuery(q);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask();
        }}
        className={`flex items-center gap-2 rounded-2xl border bg-background/95 p-3 shadow-sm backdrop-blur transition-all duration-300 ${isListening ? "border-primary ring-2 ring-primary/30 shadow-[0_0_15px_rgba(16,185,129,0.18)]" : "border-border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring"}`}
      >
        <Search className={`ml-2 h-6 w-6 shrink-0 ${isListening ? "text-primary" : "text-muted-foreground"}`} />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
          placeholder={isListening ? t("search.listening") : t("search.placeholder")}
          className="flex-1 border-0 bg-transparent text-lg text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
        />

        {q && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => { setQ(""); setSuggestions([]); setShowSuggestions(false); }}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleListen}
          className={`rounded-full transition-colors shrink-0 ${isListening ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          {isListening ? (
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Mic className="h-5 w-5" />
            </motion.div>
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </Button>

        <Button
          type="submit"
          disabled={loading || !q.trim()}
          className="gap-1.5 rounded-xl bg-primary text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg shrink-0"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span className="hidden sm:inline">{t("search.askButton")}</span>
        </Button>
      </form>

      {showSuggestions && (
        <div ref={suggestionRef} className="absolute left-0 right-0 top-full z-[90] mt-1">
          <div className="rounded-xl border border-border bg-card p-1.5 shadow-xl">
            {suggestions.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setQ(p.name); setShowSuggestions(false); }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
              >
                <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-foreground truncate">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground">{p.category}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 right-0 top-full z-[100] mt-2"
        >
          <div className="w-full max-h-[calc(100vh-200px)] overflow-auto rounded-2xl border border-border bg-card/98 p-3 shadow-2xl backdrop-blur md:p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> {t("search.response")}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setResult(null)}
                className="h-7 rounded-full px-2 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {t("search.clear")}
              </Button>
            </div>
            <div className="rounded-xl border border-border bg-muted/60 p-3 text-xs leading-relaxed text-foreground shadow-sm md:text-sm">
              {result.reply}
            </div>
            {result.products.length > 0 && (
              <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3">
                {result.products.slice(0, 10).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

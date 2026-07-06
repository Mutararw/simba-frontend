import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Search, Loader2, Mic, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { aiSearch, type AiSearchResult } from "@/lib/groq";
import { ProductCard } from "./ProductCard";
import { useTranslation } from "react-i18next";
import { useCart } from "@/store/cart";
import { PRODUCTS } from "@/lib/products";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isOpen, setIsOpen] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiSearchResult | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState<{ id: number; name: string; category: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const add = useCart((s) => s.add);

  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setSuggestions([]);
      setShowSuggestions(false);
      setQ("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (q.trim().length < 2 || !isOpen) {
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
  }, [q, isOpen]);

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
    if (!SpeechRecognition || !isOpen) return;

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
  }, [askWithQuery, isOpen]);

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
    <div className="relative w-full flex justify-center" ref={containerRef}>
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="gap-2 rounded-full bg-primary px-5 py-6 text-base font-bold text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl hover:scale-105 transition-all"
            >
              <Sparkles className="h-5 w-5" />
              <span>Ask AI</span>
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void ask();
              }}
              className={`flex items-center gap-3 rounded-2xl border-2 p-4 shadow-xl transition-all duration-200 ${
                isListening
                  ? "border-primary bg-primary/5 ring-2 ring-primary/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                  : q
                    ? "border-primary bg-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:bg-gray-900"
                    : "border-border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:bg-gray-900"
              }`}
            >
              <Search className={`ml-1 h-7 w-7 shrink-0 ${isListening || q ? "text-primary" : "text-muted-foreground"}`} />
              <Input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={isListening ? t("search.listening") : t("search.placeholder")}
                className="flex-1 border-0 bg-transparent text-xl font-semibold text-foreground shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
              />

              {q && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => { setQ(""); setSuggestions([]); setShowSuggestions(false); }}
                  className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}

              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={toggleListen}
                className={`rounded-full transition-colors shrink-0 h-10 w-10 ${
                  isListening
                    ? "bg-primary/15 text-primary hover:bg-primary/25 hover:text-primary ring-2 ring-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
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
                className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg shrink-0 px-5 h-11"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                <span className="hidden sm:inline text-base font-semibold">{t("search.askButton")}</span>
              </Button>
            </form>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  ref={suggestionRef}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute left-0 right-0 z-[90] mt-2"
                >
                  <div className="rounded-xl border-2 border-border bg-card p-1.5 shadow-xl">
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
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 z-[100] mt-2"
                >
                  <div className="w-full max-h-[calc(100vh-250px)] overflow-auto rounded-2xl border-2 border-border bg-card p-4 shadow-2xl backdrop-blur">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-bold text-primary">
                        <Sparkles className="h-4 w-4" /> {t("search.response")}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setResult(null)}
                        className="h-7 rounded-full px-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        {t("search.clear")}
                      </Button>
                    </div>
                    <div className="rounded-xl border border-border bg-muted/60 p-4 text-sm leading-relaxed text-foreground shadow-sm md:text-base">
                      {result.reply}
                    </div>
                    {result.products.length > 0 && (
                      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
                        {result.products.slice(0, 10).map((p) => (
                          <ProductCard key={p.id} product={p} />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

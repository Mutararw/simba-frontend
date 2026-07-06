import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Search, Loader2, Mic, X, ArrowUpRight } from "lucide-react";
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const add = useCart((s) => s.add);

  const close = useCallback(() => {
    setIsOpen(false);
    setResult(null);
    setSuggestions([]);
    setShowSuggestions(false);
    setQ("");
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('button')) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

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
          itemsToAdd.forEach((p) => { if (p.inStock) add(p); });
          if (itemsToAdd.length > 0) {
            toast.success(t("search.autoAdd", { count: itemsToAdd.length }), { icon: "🛒" });
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
    recognition.onerror = () => { setIsListening(false); toast.error(t("search.voiceError")); };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => { recognition.stop(); recognitionRef.current = null; };
  }, [askWithQuery, isOpen]);

  const toggleListen = () => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    if (!recognitionRef.current) { toast.error(t("search.voiceSupport")); return; }
    recognitionRef.current.start();
    setIsListening(true);
  };

  const ask = async () => { await askWithQuery(q); };

  return (
    <div ref={overlayRef} className="relative">
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2 rounded-full bg-primary px-5 py-5 text-base font-bold text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl hover:scale-105 transition-all"
      >
        <Sparkles className="h-5 w-5" />
        <span>Ask AI</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) close(); }}
          >
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="fixed left-0 right-0 top-[80px] z-[210] mx-auto max-w-4xl px-4"
            >
              <div className="rounded-2xl border-2 border-primary/30 bg-white shadow-2xl dark:bg-gray-900 overflow-hidden">
                <form
                  onSubmit={(e) => { e.preventDefault(); void ask(); }}
                  className={`flex items-center gap-3 p-5 ${
                    isListening ? "bg-primary/5" : "bg-white dark:bg-gray-900"
                  }`}
                >
                  <Search className={`h-8 w-8 shrink-0 ${isListening || q ? "text-primary" : "text-muted-foreground"}`} />
                  <Input
                    ref={inputRef}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={isListening ? t("search.listening") : t("search.placeholder")}
                    className="flex-1 border-0 bg-transparent text-2xl font-semibold text-foreground shadow-none placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-14"
                  />
                  {q && (
                    <Button type="button" size="icon" variant="ghost" onClick={() => { setQ(""); setSuggestions([]); setShowSuggestions(false); setResult(null); }} className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted shrink-0">
                      <X className="h-6 w-6" />
                    </Button>
                  )}
                  <Button type="button" size="icon" variant="ghost" onClick={toggleListen} className={`rounded-full shrink-0 h-11 w-11 ${isListening ? "bg-primary/15 text-primary hover:bg-primary/25 ring-2 ring-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                    {isListening ? (
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <Mic className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      <Mic className="h-6 w-6" />
                    )}
                  </Button>
                  <Button type="submit" disabled={loading || !q.trim()} className="gap-2 rounded-xl bg-primary text-primary-foreground shadow-md hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg shrink-0 px-6 h-12 text-base font-bold">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                    <span className="hidden sm:inline">{t("search.askButton")}</span>
                  </Button>
                </form>

                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-border">
                      <div ref={suggestionRef} className="p-2">
                        {suggestions.map((p) => (
                          <button key={p.id} type="button" onClick={() => { setQ(p.name); setShowSuggestions(false); }} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors hover:bg-muted">
                            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0 flex-1">
                              <div className="font-medium text-foreground truncate text-base">{p.name}</div>
                              <div className="text-xs text-muted-foreground">{p.category}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {result && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-border">
                      <div className="max-h-[50vh] overflow-y-auto p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-bold text-primary">
                            <Sparkles className="h-4 w-4" /> {t("search.response")}
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setResult(null)} className="h-7 rounded-full px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">
                            {t("search.clear")}
                          </Button>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/60 p-5 text-base leading-relaxed text-foreground shadow-sm">
                          {result.reply}
                        </div>
                        {result.products.length > 0 && (
                          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                            {result.products.slice(0, 8).map((p) => (
                              <ProductCard key={p.id} product={p} />
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="border-t border-border bg-muted/30 px-5 py-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Powered by Groq AI</span>
                  <button onClick={close} className="text-xs font-medium text-primary hover:underline">Close</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

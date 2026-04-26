import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Search, Loader2, Mic } from "lucide-react";
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
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const add = useCart((s) => s.add);

  const askWithQuery = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      setLoading(true);
      try {
        const response = await aiSearch(query);
        setResult(response);

        if (response.addToCartIds && response.addToCartIds.length > 0) {
          const itemsToAdd = PRODUCTS.filter((p) => response.addToCartIds?.includes(String(p.id)));
          itemsToAdd.forEach((p) => {
            if (p.inStock) add(p);
          });

          if (itemsToAdd.length > 0) {
            toast.success(`Automatically added ${itemsToAdd.length} item(s) to your cart!`, {
              icon: "Cart",
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
      toast.error("Could not hear you properly. Please try again.");
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
      toast.error("Voice input is not supported in your browser.");
      return;
    }

    recognitionRef.current.start();
    setIsListening(true);
  };

  const ask = async () => {
    await askWithQuery(q);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask();
        }}
        className={`flex items-center gap-2 rounded-2xl border bg-card p-2 shadow-sm transition-all duration-300 ${isListening ? "border-primary ring-2 ring-primary/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "border-border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring"}`}
      >
        <Search className={`ml-2 h-5 w-5 ${isListening ? "text-primary" : "text-muted-foreground"}`} />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={isListening ? "Listening..." : t("search.placeholder")}
          className="flex-1 border-0 bg-transparent text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleListen}
          className={`rounded-full transition-colors ${isListening ? "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary" : "text-muted-foreground hover:text-foreground"}`}
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
          className="gap-1.5 rounded-xl bg-primary text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span className="hidden sm:inline">{t("search.askButton")}</span>
        </Button>
      </form>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" /> AI Assistant Response
          </div>
          <p className="mb-6 rounded-2xl border border-secondary bg-secondary/50 p-4 text-base leading-relaxed text-secondary-foreground shadow-sm">
            {result.reply}
          </p>
          {result.products.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {result.products.slice(0, 10).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

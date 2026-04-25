import { useState, useEffect, useRef } from "react";
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

export function AiSearchBar() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiSearchResult | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const add = useCart((s) => s.add);

  useEffect(() => {
    // Initialize Web Speech API if supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US'; // Could be dynamic based on i18n

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQ(transcript);
        setIsListening(false);
        // Automatically search after voice input
        askWithQuery(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast.error("Could not hear you properly. Please try again.");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        toast.error("Voice input is not supported in your browser.");
      }
    }
  };

  async function askWithQuery(query: string) {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const r = await aiSearch(query);
      setResult(r);

      // Auto-add to cart logic
      if (r.addToCartIds && r.addToCartIds.length > 0) {
        const itemsToAdd = PRODUCTS.filter(p => r.addToCartIds!.includes(String(p.id)));
        itemsToAdd.forEach(p => {
          if (p.inStock) {
            add(p);
          }
        });
        if (itemsToAdd.length > 0) {
          toast.success(`Automatically added ${itemsToAdd.length} item(s) to your cart!`, {
            icon: "🛒"
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function ask() {
    await askWithQuery(q);
  }

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => { e.preventDefault(); ask(); }}
        className={`flex items-center gap-2 rounded-2xl border bg-card p-2 shadow-sm transition-all duration-300 ${isListening ? 'border-primary ring-2 ring-primary/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-border focus-within:ring-2 focus-within:ring-ring focus-within:border-primary/50'}`}
      >
        <Search className={`ml-2 h-5 w-5 ${isListening ? 'text-primary' : 'text-muted-foreground'}`} />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={isListening ? "Listening..." : t("search.placeholder")}
          className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
        />
        
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={toggleListen}
          className={`rounded-full transition-colors ${isListening ? 'bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary' : 'text-muted-foreground hover:text-foreground'}`}
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
          className="gap-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          <span className="hidden sm:inline">{t("search.askButton")}</span>
        </Button>
      </form>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mt-6"
        >
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" /> AI Assistant Response
          </div>
          <p className="mb-6 rounded-2xl bg-secondary/50 border border-secondary p-4 text-base text-secondary-foreground leading-relaxed shadow-sm">
            {result.reply}
          </p>
          {result.products.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {result.products.slice(0, 10).map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
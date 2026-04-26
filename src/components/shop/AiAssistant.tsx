import { useState, useRef, useEffect, useCallback } from "react";
import { X, Mic, Send, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiSearch } from "@/lib/groq";
import { useCart } from "@/store/cart";
import { PRODUCTS } from "@/lib/products";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { Product } from "@/lib/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Product[]; 
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
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

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hi! I'm Simba's AI Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const add = useCart((s) => s.add);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const result = await aiSearch(text);
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.reply,
          products: result.products,
        };

        setMessages((prev) => [...prev, assistantMsg]);

        if (result.addToCartIds && result.addToCartIds.length > 0) {
          const cartIds = result.addToCartIds.map(String);
          const itemsToAdd = PRODUCTS.filter((p) => cartIds.includes(String(p.id)));
          let addedCount = 0;

          itemsToAdd.forEach((p) => {
            if (p.inStock) {
              add(p);
              addedCount++;
            }
          });

          if (addedCount > 0) {
            toast.success(`Automatically added ${addedCount} item(s) to your cart!`, { icon: "Cart" });
          }
        }
      } catch {
        toast.error("Failed to connect to AI Assistant.");
      } finally {
        setLoading(false);
      }
    },
    [add]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setInput(transcript);
      setIsListening(false);
      void handleSend(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Could not hear you properly.");
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [handleSend]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSend(input);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="icon"
              className="h-14 w-14 rounded-full bg-primary shadow-xl hover:bg-primary/90 hover:scale-105 transition-transform"
            >
              <Sparkles className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:w-[400px]"
          >
            <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-display font-semibold">Simba AI</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full text-primary-foreground hover:bg-primary-foreground/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-muted/30 p-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      msg.role === "user"
                        ? "rounded-tr-sm bg-primary text-primary-foreground"
                        : "rounded-tl-sm border border-border bg-background text-foreground"
                    }`}
                  >
                    {msg.content}
                    
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-3 -mx-2 overflow-x-auto no-scrollbar">
                        <div className="flex gap-3 pb-2 px-2" style={{ width: "max-content" }}>
                          {msg.products.map((p) => (
                            <div 
                              key={p.id} 
                              className="w-48 shrink-0 rounded-xl border border-border bg-card p-2 shadow-sm"
                            >
                              <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted mb-2">
                                <img src={p.imageUrl || p.image} alt={p.name} className="h-full w-full object-cover" />
                              </div>
                              <div className="text-[11px] font-medium line-clamp-1 mb-1">{p.name}</div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-primary">RWF {Number(p.price).toLocaleString()}</span>
                                <Button 
                                  size="sm" 
                                  className="h-6 px-2 text-[9px] rounded-full"
                                  onClick={() => {
                                    add({
                                      ...p,
                                      id: Number(p.id),
                                      price: Number(p.price),
                                      inStock: p.stock > 0 || p.inStock,
                                      image: p.imageUrl || p.image || ""
                                    });
                                    toast.success("Added to cart");
                                  }}
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm border border-border bg-background px-4 py-3 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border bg-background p-3">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={toggleListen}
                  className={`h-10 w-10 shrink-0 rounded-full transition-colors ${
                    isListening ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
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

                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Ask Simba AI..."}
                  className="flex-1 rounded-full border-border bg-muted focus-visible:ring-primary/50"
                  disabled={loading}
                />

                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || loading}
                  className="h-10 w-10 shrink-0 rounded-full bg-primary shadow-md hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

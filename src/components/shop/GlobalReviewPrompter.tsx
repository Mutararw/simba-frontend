import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useReviews } from "@/store/reviews";
import { useOrder } from "@/store/order";
import confetti from "canvas-confetti";

export function GlobalReviewPrompter() {
  const { t } = useTranslation();
  const location = useLocation();
  
  const hasReviewed = useReviews((s) => s.hasReviewed);
  const cardClickCount = useReviews((s) => s.cardClickCount);
  const isPromptOpen = useReviews((s) => s.isPromptOpen);
  const showThankYou = useReviews((s) => s.showThankYou);
  const hasDismissedCurrent = useReviews((s) => s.hasDismissedCurrent);
  const setPromptOpen = useReviews((s) => s.setPromptOpen);
  const setShowThankYou = useReviews((s) => s.setShowThankYou);
  const addReview = useReviews((s) => s.addReview);
  const incrementDismiss = useReviews((s) => s.incrementDismiss);
  const setDismissedCurrent = useReviews((s) => s.setDismissedCurrent);
  const resetCardClick = useReviews((s) => s.resetCardClick);

  const lastOrder = useOrder((s) => s.lastOrder);
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  
  const [isInReviewFrame, setIsInReviewFrame] = useState(false);
  
  // Use a single timer ref for all logic
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasFiredClickLogic = useRef(false);
  const hasFiredCheckoutLogic = useRef(false);

  // Reset session flags on mount
  useEffect(() => {
    setDismissedCurrent(false);
    resetCardClick();
  }, [setDismissedCurrent, resetCardClick]);

  // Observer for the review section
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInReviewFrame(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    const target = document.getElementById("review-section");
    if (target) {
      observer.observe(target);
    }

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  // Logic 1: 20 seconds in review frame (Cancelled if clicking starts)
  useEffect(() => {
    if (hasReviewed || isPromptOpen || hasDismissedCurrent || cardClickCount > 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (isInReviewFrame) {
      timerRef.current = setTimeout(() => {
        setPromptOpen(true);
      }, 20000); // 20 seconds idle
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isInReviewFrame, hasReviewed, isPromptOpen, hasDismissedCurrent, cardClickCount, setPromptOpen]);

  // Logic 2: After 4 review card clicks (wait 4 seconds)
  useEffect(() => {
    if (hasReviewed || isPromptOpen || hasDismissedCurrent || hasFiredClickLogic.current) return;

    if (cardClickCount >= 4) {
      hasFiredClickLogic.current = true;
      const timer = setTimeout(() => {
        setPromptOpen(true);
      }, 4000); // 4 seconds after 4th click
      return () => clearTimeout(timer);
    }
  }, [cardClickCount, hasReviewed, isPromptOpen, hasDismissedCurrent, setPromptOpen]);

  // Logic 3: Post-checkout trigger (Only on confirmation page)
  useEffect(() => {
    // This logic prompts EVEN IF they dismissed earlier prompts
    if (hasReviewed || isPromptOpen || hasFiredCheckoutLogic.current) return;

    if (lastOrder && location.pathname === "/confirmation") {
      hasFiredCheckoutLogic.current = true;
      const timer = setTimeout(() => {
        setPromptOpen(true);
      }, 3000); // Show prompt 3 seconds after checkout
      return () => clearTimeout(timer);
    }
  }, [lastOrder, hasReviewed, isPromptOpen, location.pathname, setPromptOpen]);

  // Confetti effect
  useEffect(() => {
    if (showThankYou) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 200 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 100 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { 
          particleCount, 
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#fd7e14', '#ffffff', '#ffd43b']
        }));
        confetti(Object.assign({}, defaults, { 
          particleCount, 
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#fd7e14', '#ffffff', '#ffd43b']
        }));
      }, 250);

      const closeTimer = setTimeout(() => {
        setShowThankYou(false);
      }, 8000);

      return () => {
        clearInterval(interval);
        clearTimeout(closeTimer);
      };
    }
  }, [showThankYou, setShowThankYou]);

  const handleSubmit = () => {
    if (rating === 0 || !name.trim() || !comment.trim()) return;
    addReview({ name, rating, text: comment });
    setRating(0);
    setComment("");
    setName("");
  };

  return (
    <>
      <AnimatePresence>
        {isPromptOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-[100] grid place-items-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-bold">How was your experience?</h3>
                  <button
                    onClick={incrementDismiss}
                    className="grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6">
                  We'd love to hear your thoughts on Simba Supermarket. Your review helps us improve our hospitality!
                </p>

                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`} className="transform transition-transform hover:scale-110 active:scale-95">
                      <Star className={`h-10 w-10 transition-colors ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <Input 
                    placeholder="Your Name (e.g. David M.)" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="rounded-xl"
                  />
                  <Textarea
                    placeholder="Tell us what you loved or what we can improve..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="h-24 resize-none rounded-xl"
                  />
                  <Button
                    className="w-full rounded-xl font-bold py-6 text-lg"
                    disabled={rating === 0 || !name.trim() || !comment.trim()}
                    onClick={handleSubmit}
                  >
                    Submit Review
                  </Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showThankYou && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-background/40 backdrop-blur-md"
            />
            <div className="fixed inset-0 z-[120] grid place-items-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 100, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: 0, transition: { type: "spring", bounce: 0.5, duration: 0.8 } }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                className="bg-card border-4 border-primary shadow-[0_0_50px_rgba(253,126,20,0.3)] rounded-[2.5rem] p-8 max-w-sm text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 z-0 opacity-10 flex items-center justify-center pointer-events-none">
                  <img 
                    src="https://www.simbaonlineshopping.com/images/simbaheaderM.png" 
                    alt="" 
                    className="w-full scale-150 object-contain rotate-[-15deg]"
                  />
                </div>

                <div className="relative z-10">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
                  >
                    <Gift className="h-10 w-10 text-primary" />
                  </motion.div>
                  
                  <h2 className="font-display text-3xl font-extrabold mb-4 text-foreground tracking-tight">
                    Happy Day! 🎉
                  </h2>
                  
                  <div className="space-y-4">
                    <p className="text-xl font-bold text-primary">
                      From the Simba family,
                    </p>
                    <p className="text-lg font-medium text-muted-foreground leading-relaxed">
                      We thank you for reviewing us! Your feedback helps us serve you better every single day.
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                    <Button 
                      className="mt-2 rounded-full w-full font-bold py-6 text-lg shadow-lg hover:shadow-primary/25 transition-all" 
                      onClick={() => setShowThankYou(false)}
                    >
                      You're Welcome! 🦁
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

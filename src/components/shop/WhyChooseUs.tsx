import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, X, User } from "lucide-react";
import { useReviews, type Review } from "@/store/reviews";

export function WhyChooseUs() {
  const { t } = useTranslation();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [localLiked, setLocalLiked] = useState<Record<string, boolean>>({});
  const { reviews, likeReview, incrementCardClick } = useReviews();

  const handleCardClick = (review: Review) => {
    setSelectedReview(review);
    incrementCardClick();
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!localLiked[id]) {
      setLocalLiked((prev) => ({ ...prev, [id]: true }));
      likeReview(id);
    }
  };

  return (
    <section id="review-section" className="container py-12 pb-20">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          {t("whyChooseUs", { defaultValue: "Why Choose Us" })}
        </h2>
        <span className="text-sm font-semibold text-primary">Over 10,000+ happy customers</span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {(reviews || []).map((review) => (
          <div
            key={review.id}
            className="premium-card cursor-pointer"
            onClick={() => handleCardClick(review)}
          >
            <div className="premium-card__shine" />
            <div className="premium-card__glow" />
            
            <div className="premium-card__content p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-card-foreground">{review.name}</h3>
                  <div className="flex gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="mt-4 line-clamp-4 text-sm text-muted-foreground">
                "{review.text}"
              </p>
              
              <div className="premium-card__footer mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{review.date}</span>
                <button
                  onClick={(e) => toggleLike(e, review.id)}
                  className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium transition-colors ${
                    localLiked[review.id] ? "bg-red-500/10 text-red-500" : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${localLiked[review.id] ? "fill-current" : ""}`} />
                  {review.likes + (localLiked[review.id] ? 1 : 0)}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedReview && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReview(null)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 grid place-items-center p-4 pointer-events-none">
              <motion.div
                layoutId={`review-${selectedReview.id}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl pointer-events-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
                      <User className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold">{selectedReview.name}</h3>
                      <div className="flex gap-1 text-yellow-500 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < selectedReview.rating ? "fill-current" : "text-muted"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="text-lg leading-relaxed text-foreground font-medium">
                  "{selectedReview.text}"
                </p>
                
                <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm font-medium text-muted-foreground">Verified Customer • {selectedReview.date}</span>
                  <button
                    onClick={(e) => toggleLike(e, selectedReview.id)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 font-bold transition-all ${
                      localLiked[selectedReview.id] 
                        ? "bg-red-500 text-white shadow-md shadow-red-500/20" 
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${localLiked[selectedReview.id] ? "fill-current" : ""}`} />
                    {localLiked[selectedReview.id] ? "Liked" : "Helpful"} ({(selectedReview.likes + (localLiked[selectedReview.id] ? 1 : 0))})
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

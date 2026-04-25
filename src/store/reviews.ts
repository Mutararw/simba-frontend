import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  likes: number;
}

interface ReviewsState {
  reviews: Review[];
  hasReviewed: boolean;
  dismissCount: number;
  likesGiven: number;
  cardClickCount: number;
  isPromptOpen: boolean;
  showThankYou: boolean;
  hasShownLikePrompt: boolean;
  hasDismissedCurrent: boolean;
  addReview: (review: Omit<Review, "id" | "date" | "likes">) => void;
  likeReview: (id: string) => void;
  incrementDismiss: () => void;
  incrementLikeCount: () => void;
  incrementCardClick: () => void;
  resetCardClick: () => void;
  setPromptOpen: (isOpen: boolean) => void;
  setShowThankYou: (show: boolean) => void;
  setHasShownLikePrompt: () => void;
  setDismissedCurrent: (val: boolean) => void;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Jean Claude N.",
    rating: 5,
    text: "Simba Supermarket always delivers fresh groceries. The 45-minute pickup time is incredibly accurate and convenient for my busy schedule.",
    date: "2 days ago",
    likes: 24,
  },
  {
    id: "r2",
    name: "Alice M.",
    rating: 5,
    text: "The new web platform is so smooth. Finding my favorite products and getting them ready for pick up at the Kimironko branch has never been easier.",
    date: "1 week ago",
    likes: 18,
  },
  {
    id: "r3",
    name: "David K.",
    rating: 4,
    text: "Great selection of products and very easy to navigate. I particularly like the location finder feature. Highly recommended!",
    date: "2 weeks ago",
    likes: 12,
  },
  {
    id: "r4",
    name: "Sarah U.",
    rating: 5,
    text: "Best customer service! I requested a review of my cart, and the AI assistant helped me find exactly what I needed without any hassle.",
    date: "3 weeks ago",
    likes: 31,
  },
  {
    id: "r5",
    name: "Eric M.",
    rating: 5,
    text: "I love the new MoMo integration for checkout. It makes paying for my groceries from the Nyarutarama branch fast and secure.",
    date: "1 month ago",
    likes: 15,
  },
  {
    id: "r6",
    name: "Marie Claire Uwase",
    rating: 5,
    text: "Always fully stocked with fresh vegetables and fruits. The Click & Collect option is perfect for avoiding queues during rush hour.",
    date: "1 month ago",
    likes: 27,
  },
  {
    id: "r7",
    name: "Patrick G.",
    rating: 4,
    text: "The website's dark mode and sleek design are a huge plus! Finding imported items that aren't available elsewhere is a breeze.",
    date: "2 months ago",
    likes: 9,
  },
  {
    id: "r8",
    name: "Joy K.",
    rating: 5,
    text: "Excellent experience overall. The customer support is very responsive, and the quality of their bakery products is unmatched in Kigali.",
    date: "2 months ago",
    likes: 42,
  }
];

export const useReviews = create<ReviewsState>()(
  persist(
    (set) => ({
      reviews: INITIAL_REVIEWS,
      hasReviewed: false,
      dismissCount: 0,
      likesGiven: 0,
      cardClickCount: 0,
      isPromptOpen: false,
      showThankYou: false,
      hasShownLikePrompt: false,
      hasDismissedCurrent: false,
      addReview: (review) =>
        set((state) => ({
          reviews: [
            {
              ...review,
              id: Date.now().toString(),
              date: "Just now",
              likes: 0,
            },
            ...state.reviews,
          ],
          hasReviewed: true,
          isPromptOpen: false,
          showThankYou: true,
        })),
      likeReview: (id) =>
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, likes: r.likes + 1 } : r
          ),
          likesGiven: state.likesGiven + 1,
        })),
      incrementDismiss: () =>
        set((state) => ({
          dismissCount: state.dismissCount + 1,
          isPromptOpen: false,
          hasDismissedCurrent: true,
        })),
      incrementLikeCount: () =>
        set((state) => ({ likesGiven: state.likesGiven + 1 })),
      incrementCardClick: () =>
        set((state) => ({ cardClickCount: state.cardClickCount + 1 })),
      resetCardClick: () => set({ cardClickCount: 0 }),
      setPromptOpen: (isOpen) => set({ isPromptOpen: isOpen }),
      setShowThankYou: (show) => set({ showThankYou: show }),
      setHasShownLikePrompt: () => set({ hasShownLikePrompt: true }),
      setDismissedCurrent: (val) => set({ hasDismissedCurrent: val }),
    }),
    {
      name: "simba-reviews-storage",
      partialize: (state) => ({
        reviews: state.reviews,
        hasReviewed: state.hasReviewed,
        dismissCount: state.dismissCount,
        likesGiven: state.likesGiven,
        cardClickCount: state.cardClickCount,
        hasShownLikePrompt: state.hasShownLikePrompt,
      }),
      merge: (persistedState: any, currentState) => {
        const merged = { ...currentState, ...persistedState };
        
        // Ensure default reviews are always present by checking IDs
        const existingIds = new Set((merged.reviews || []).map((r: Review) => r.id));
        const missingDefaults = INITIAL_REVIEWS.filter(r => !existingIds.has(r.id));
        
        if (missingDefaults.length > 0) {
          merged.reviews = [...(merged.reviews || []), ...missingDefaults];
        }
        
        return merged;
      },
    }
  )
);

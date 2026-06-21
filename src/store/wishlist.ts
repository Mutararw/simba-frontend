import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

interface WishlistState {
  items: Product[];
  addItem: (p: Product) => void;
  removeItem: (id: number) => void;
  isInWishlist: (id: number) => boolean;
}

function getItems(state: WishlistState) {
  return Array.isArray(state.items) ? state.items : [];
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (p) => {
        const items = getItems(get());
        if (!items.some(i => i.id === p.id)) {
          set({ items: [...items, p] });
        }
      },
      removeItem: (id) => set({ items: getItems(get()).filter(i => i.id !== id) }),
      isInWishlist: (id) => getItems(get()).some(i => i.id === id),
    }),
    { name: "simba_wishlist" }
  )
);

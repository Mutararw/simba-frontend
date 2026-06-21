import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";

interface WishlistState {
  items: Product[];
  addItem: (p: Product) => void;
  removeItem: (id: number) => void;
  isInWishlist: (id: number) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (p) => {
        if (!get().items.some(i => i.id === p.id)) {
          set({ items: [...get().items, p] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),
      isInWishlist: (id) => get().items.some(i => i.id === id),
    }),
    { name: "simba_wishlist" }
  )
);

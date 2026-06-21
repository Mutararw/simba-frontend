import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/types";

interface CartState {
  items: CartItem[];
  savedItems: CartItem[];
  add: (p: Product, qty?: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
  saveForLater: (id: number) => void;
  moveToCart: (id: number) => void;
  removeSaved: (id: number) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      add: (p, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.product.id === p.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.product.id === p.id ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return { items: [...s.items, { product: p, qty }] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.product.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0
            ? s.items.filter((i) => i.product.id !== id)
            : s.items.map((i) => (i.product.id === id ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.qty * i.product.price, 0),
      saveForLater: (id) =>
        set((s) => {
          const item = s.items.find((i) => i.product.id === id);
          if (!item) return {};
          return {
            items: s.items.filter((i) => i.product.id !== id),
            savedItems: s.savedItems.find((i) => i.product.id === id)
              ? s.savedItems
              : [...s.savedItems, item],
          };
        }),
      moveToCart: (id) =>
        set((s) => {
          const item = s.savedItems.find((i) => i.product.id === id);
          if (!item) return {};
          
          const existing = s.items.find((i) => i.product.id === id);
          let newItems;
          if (existing) {
            newItems = s.items.map((i) =>
              i.product.id === id ? { ...i, qty: i.qty + item.qty } : i
            );
          } else {
            newItems = [...s.items, item];
          }

          return {
            savedItems: s.savedItems.filter((i) => i.product.id !== id),
            items: newItems,
          };
        }),
      removeSaved: (id) =>
        set((s) => ({
          savedItems: s.savedItems.filter((i) => i.product.id !== id),
        })),
    }),
    { name: "simba_cart" }
  )
);
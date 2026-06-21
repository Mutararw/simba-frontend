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

function getItems(state: CartState) {
  return Array.isArray(state.items) ? state.items : [];
}

function getSavedItems(state: CartState) {
  return Array.isArray(state.savedItems) ? state.savedItems : [];
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
      add: (p, qty = 1) =>
        set((s) => {
          const items = getItems(s);
          const existing = items.find((i) => i.product.id === p.id);
          if (existing) {
            return {
              items: items.map((i) =>
                i.product.id === p.id ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return { items: [...items, { product: p, qty }] };
        }),
      remove: (id) => set((s) => ({ items: getItems(s).filter((i) => i.product.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: qty <= 0
            ? getItems(s).filter((i) => i.product.id !== id)
            : getItems(s).map((i) => (i.product.id === id ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
      count: () => getItems(get()).reduce((n, i) => n + i.qty, 0),
      subtotal: () => getItems(get()).reduce((n, i) => n + i.qty * i.product.price, 0),
      saveForLater: (id) =>
        set((s) => {
          const items = getItems(s);
          const savedItems = getSavedItems(s);
          const item = items.find((i) => i.product.id === id);
          if (!item) return {};
          return {
            items: items.filter((i) => i.product.id !== id),
            savedItems: savedItems.find((i) => i.product.id === id)
              ? savedItems
              : [...savedItems, item],
          };
        }),
      moveToCart: (id) =>
        set((s) => {
          const items = getItems(s);
          const savedItems = getSavedItems(s);
          const item = savedItems.find((i) => i.product.id === id);
          if (!item) return {};
          
          const existing = items.find((i) => i.product.id === id);
          let newItems;
          if (existing) {
            newItems = items.map((i) =>
              i.product.id === id ? { ...i, qty: i.qty + item.qty } : i
            );
          } else {
            newItems = [...items, item];
          }

          return {
            savedItems: savedItems.filter((i) => i.product.id !== id),
            items: newItems,
          };
        }),
      removeSaved: (id) =>
        set((s) => ({
          savedItems: getSavedItems(s).filter((i) => i.product.id !== id),
        })),
    }),
    { name: "simba_cart" }
  )
);

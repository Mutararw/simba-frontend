import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

export interface PickupOrder {
  id: string;
  branchId: string;
  branchName: string;
  pickupTime: string;
  items: CartItem[];
  total: number;
  deposit: number;
  createdAt: string;
}

interface OrderState {
  pendingDraft: { branchId?: string; pickupTime?: string };
  setDraft: (d: Partial<OrderState["pendingDraft"]>) => void;
  lastOrder: PickupOrder | null;
  setLastOrder: (o: PickupOrder | null) => void;
}

export const useOrder = create<OrderState>()(
  persist(
    (set) => ({
      pendingDraft: {},
      setDraft: (d) => set((s) => ({ pendingDraft: { ...s.pendingDraft, ...d } })),
      lastOrder: null,
      setLastOrder: (o) => set({ lastOrder: o }),
    }),
    { name: "simba_order" }
  )
);
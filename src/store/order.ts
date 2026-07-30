import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";

export interface PickupOrder {
  id: string;
  userId?: string;
  branchId?: string;
  branchName?: string;
  pickupTime?: string;
  address?: string;
  district?: string;
  zone?: string;
  deliverySlot?: string;
  deliveryFee?: number;
  items: CartItem[];
  total: number;
  deposit: number;
  status?: string;
  createdAt: string;
}

interface OrderState {
  pendingDraft: { 
    branchId?: string; 
    pickupTime?: string;
    orderType?: 'pickup' | 'delivery';
    address?: string;
    district?: string;
    zone?: string;
    deliverySlot?: string;
    deliveryFee?: number;
  };
  setDraft: (d: Partial<OrderState["pendingDraft"]>) => void;
  lastOrder: PickupOrder | null;
  setLastOrder: (o: PickupOrder | null) => void;
}

export const useOrder = create<OrderState>()(
  persist(
    (set) => ({
      pendingDraft: { orderType: 'pickup' },
      setDraft: (d) => set((s) => ({ pendingDraft: { ...s.pendingDraft, ...d } })),
      lastOrder: null,
      setLastOrder: (o) => set({ lastOrder: o }),
    }),
    { name: "simba_order" }
  )
);
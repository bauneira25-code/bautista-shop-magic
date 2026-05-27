import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PurchaseMode } from "@/lib/mockData";

export interface LocalCartItem {
  id: string;
  slug: string;
  title: string;
  emoji: string;
  gradient: string;
  mode: PurchaseMode;
  unitPrice: number;
  quantity: number;
  variant?: string;
  color?: string;
  customQty?: number;
  customFee?: number;
}

interface LocalCart {
  items: LocalCartItem[];
  add: (item: LocalCartItem) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
}

export const useLocalCart = create<LocalCart>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      setQty: (id, qty) =>
        set({
          items: qty <= 0
            ? get().items.filter((i) => i.id !== id)
            : get().items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        }),
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
      total: () => get().items.reduce((s, i) => s + i.quantity * i.unitPrice, 0),
    }),
    {
      name: "neiba-local-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

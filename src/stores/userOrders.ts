import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PurchaseMode } from "@/lib/mockData";

export interface UserOrderItem {
  slug: string;
  title: string;
  emoji: string;
  gradient: string;
  unitPrice: number;
  quantity: number;
  variant?: string;
  color?: string;
  customQty?: number;
}

export interface UserOrder {
  id: string;
  createdAt: number;
  mode: PurchaseMode;
  items: UserOrderItem[];
  total: number;
  paymentMethod: string;
  cardLast4?: string;
  delivery: "envio" | "retiro";
  shippingAddress?: string;
  receiver?: { nombre: string; apellido: string; telefono: string };
  status: "processing" | "packaging" | "shipping" | "delivered";
  progress: number;
  eta: string;
  isImport?: boolean;
  importerName?: string;
}

interface UserOrdersState {
  orders: UserOrder[];
  add: (o: UserOrder) => void;
  clear: () => void;
}

export const useUserOrders = create<UserOrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      add: (o) => set({ orders: [o, ...get().orders] }),
      clear: () => set({ orders: [] }),
    }),
    { name: "neiba-user-orders", storage: createJSONStorage(() => localStorage) },
  ),
);

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
  customization?: { text?: string; style?: string; imageName?: string };
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
  status: "processing" | "customization" | "packaging" | "shipping" | "delivered";
  progress: number;
  eta: string;
  // Group-specific
  groupTarget?: number;
  groupJoined?: number;
  groupEndsAt?: number; // timestamp ms
  whatsappNotify?: boolean;
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

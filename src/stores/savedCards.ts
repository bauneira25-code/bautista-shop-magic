import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface SavedCard {
  id: string;
  brand: "visa" | "master" | "amex" | "otra";
  last4: string;
  holder: string;
  exp: string; // MM/AA
  type: "debito" | "credito";
}

interface SavedCardsState {
  cards: SavedCard[];
  add: (c: Omit<SavedCard, "id">) => SavedCard;
  remove: (id: string) => void;
}

const detectBrand = (n: string): SavedCard["brand"] => {
  const d = n.replace(/\s/g, "");
  if (/^4/.test(d)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(d)) return "master";
  if (/^3[47]/.test(d)) return "amex";
  return "otra";
};

export const detectCardBrand = detectBrand;

export const useSavedCards = create<SavedCardsState>()(
  persist(
    (set, get) => ({
      cards: [],
      add: (c) => {
        const card: SavedCard = { ...c, id: `card-${Date.now()}` };
        set({ cards: [...get().cards, card] });
        return card;
      },
      remove: (id) => set({ cards: get().cards.filter((c) => c.id !== id) }),
    }),
    { name: "neiba-cards", storage: createJSONStorage(() => localStorage) },
  ),
);

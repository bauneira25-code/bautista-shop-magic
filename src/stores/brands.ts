import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Brand {
  id: string;
  name: string;
  owner: string;
  logoName?: string;
  registeredAt: number;
}

interface BrandStore {
  brands: Brand[];
  register: (b: Omit<Brand, "id" | "registeredAt">) => void;
  isTaken: (name: string) => boolean;
}

// Frases típicas / genéricas que NO se pueden registrar
const GENERIC_PHRASES = [
  "amor", "vida", "love", "buena vibra", "good vibes", "happy", "feliz",
  "exito", "éxito", "marca", "tienda", "shop", "store", "the best", "lo mejor",
  "premium", "original", "calidad",
];

export const isGenericPhrase = (name: string) => {
  const n = name.trim().toLowerCase();
  if (n.length < 3) return true;
  if (n.split(/\s+/).length > 5) return true; // demasiado largo, parece frase
  return GENERIC_PHRASES.some((g) => n === g || n.includes(g));
};

export const useBrands = create<BrandStore>()(
  persist(
    (set, get) => ({
      brands: [
        { id: "b-seed-1", name: "NEIBA", owner: "admin", registeredAt: Date.now() - 1000000 },
      ],
      register: (b) =>
        set({
          brands: [
            ...get().brands,
            { ...b, id: `b-${Date.now()}`, registeredAt: Date.now() },
          ],
        }),
      isTaken: (name) =>
        get().brands.some((b) => b.name.trim().toLowerCase() === name.trim().toLowerCase()),
    }),
    { name: "neiba-brands", storage: createJSONStorage(() => localStorage) },
  ),
);

export const BRAND_REGISTRATION_PRICE = 30000;

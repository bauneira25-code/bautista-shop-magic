import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Gender = "mujer" | "hombre" | "no-id";

interface UserPrefs {
  gender: Gender | null;
  onboarded: boolean;
  views: Record<string, number>; // category -> count
  setGender: (g: Gender) => void;
  trackView: (category: string) => void;
  reset: () => void;
}

export const useUserPrefs = create<UserPrefs>()(
  persist(
    (set, get) => ({
      gender: null,
      onboarded: false,
      views: {},
      setGender: (g) => set({ gender: g, onboarded: true }),
      trackView: (category) =>
        set({ views: { ...get().views, [category]: (get().views[category] ?? 0) + 1 } }),
      reset: () => set({ gender: null, onboarded: false, views: {} }),
    }),
    { name: "neiba-user-prefs", storage: createJSONStorage(() => localStorage) },
  ),
);

// Bias categories by gender
export const GENDER_BIAS: Record<Gender, string[]> = {
  mujer: ["belleza", "joyeria", "hogar", "tech"],
  hombre: ["tech", "electronica", "gym", "joyeria"],
  "no-id": ["tech", "hogar", "belleza", "gym", "electronica", "joyeria"],
};

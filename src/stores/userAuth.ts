import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface UserProfile {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono: string;
  direccion: string;
}

interface UserAuth {
  user: UserProfile | null;
  setUser: (u: UserProfile) => void;
  logout: () => void;
}

export const useUserAuth = create<UserAuth>()(
  persist(
    (set) => ({
      user: null,
      setUser: (u) => set({ user: u }),
      logout: () => set({ user: null }),
    }),
    { name: "neiba-user", storage: createJSONStorage(() => localStorage) },
  ),
);

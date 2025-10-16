import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  email: string;
  setEmail: (value: string) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      email: "",
      setEmail: (email: string) => set({ email }),
    }),
    { name: "auth-storage" }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  email: string;
  setEmail: (value: string) => void;
  logOut: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      email: "",
      setEmail: (email: string) => set({ email }),
      logOut: () => {
        set({ email: "" });
        localStorage.removeItem("wallet-storage");
      },
    }),
    { name: "auth-storage" }
  )
);

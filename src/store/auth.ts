import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  setUser: (u: User | null) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({ user: null, setUser: (user) => set({ user }) }),
    { name: "simba_auth" }
  )
);
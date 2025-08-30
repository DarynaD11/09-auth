import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

const initialUser: User = {
  username: "",
  email: "",
  avatar: "",
};

type AuthStore = {
  user: User;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: initialUser,
      isAuthenticated: false,
      setUser: (user: User) => set({ user, isAuthenticated: true }),
      clearIsAuthenticated: () =>
        set({ user: initialUser, isAuthenticated: false }),
    }),
    {
      name: "auth",
    }
  )
);

import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>(() => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user: User | null = userRaw ? (JSON.parse(userRaw) as User) : null;

  return {
    user,
    token,
    isAuthenticated: !!token,
    setAuth: (user: User, token: string) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      useAuthStore.setState({ user, token, isAuthenticated: true });
    },
    clearAuth: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      useAuthStore.setState({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    },
  };
});

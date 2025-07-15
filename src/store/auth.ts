import { create } from "zustand";
import Cookies from "js-cookie";
import { setAuthToken } from "@/services/api";

interface User {
  id: string;
  username: string;
  email: string;
  gender?: string;
  birthdate?: string;
  favorites?: string;
  nickname?: string;
  about_me?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => {
    Cookies.set("token", token, { expires: 7 });
    setAuthToken(token);
    set({ user, token });
  },
  logout: () => {
    Cookies.remove("token");
    setAuthToken(null);
    set({ user: null, token: null });
  },
  setUser: (user) => set((state) => ({ ...state, user })),
}));

export function initAuth() {
  const token = Cookies.get("token");
  if (token) {
    setAuthToken(token);
    return token;
  }
  return null;
} 
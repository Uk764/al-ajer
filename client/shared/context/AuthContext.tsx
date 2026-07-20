"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, check if a token/user is already saved in the browser
  useEffect(() => {
    const savedToken = localStorage.getItem("al-ajer-token");
    const savedUser = localStorage.getItem("al-ajer-user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  function login(newUser: User, newToken: string) {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem("al-ajer-token", newToken);
    localStorage.setItem("al-ajer-user", JSON.stringify(newUser));
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("al-ajer-token");
    localStorage.removeItem("al-ajer-user");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
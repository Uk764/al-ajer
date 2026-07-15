"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

interface CartContextType {
  itemCount: number;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token, user, isLoading: authLoading } = useAuth();
  const [itemCount, setItemCount] = useState(0);

  const refreshCart = useCallback(async () => {
    if (!token || !user) {
      setItemCount(0);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const items: { quantity: number }[] = data.items || [];
      const total = items.reduce((sum, item) => sum + item.quantity, 0);
      setItemCount(total);
    } catch (error) {
      console.error("Failed to refresh cart count:", error);
    }
  }, [token, user]);

  // Whenever login state changes (login, logout, or initial page load), refresh the count
  useEffect(() => {
    if (authLoading) return;
    refreshCart();
  }, [authLoading, refreshCart]);

  return (
    <CartContext.Provider value={{ itemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
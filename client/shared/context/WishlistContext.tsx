"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/shared/lib/api";

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("alajer_wishlist");
      if (stored) {
        setWishlistItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load wishlist:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("alajer_wishlist", JSON.stringify(wishlistItems));
    } catch (e) {
      console.error("Failed to save wishlist:", e);
    }
  }, [wishlistItems, isLoaded]);

  const addToWishlist = (product: Product) => {
    setWishlistItems((prev) => {
      if (prev.some((item) => item._id === product._id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const toggleWishlist = (product: Product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (exists) {
        return prev.filter((item) => item._id !== product._id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

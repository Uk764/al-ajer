"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/shared/lib/api";

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  toggleCompare: (product: Product) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  compareCount: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("alajer_compare");
      if (stored) {
        setCompareItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load compare list:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever compare list changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("alajer_compare", JSON.stringify(compareItems));
    } catch (e) {
      console.error("Failed to save compare list:", e);
    }
  }, [compareItems, isLoaded]);

  const addToCompare = (product: Product) => {
    setCompareItems((prev) => {
      if (prev.some((item) => item._id === product._id)) return prev;
      if (prev.length >= 4) {
        alert("You can compare up to 4 products at a time. Please remove one first.");
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const toggleCompare = (product: Product) => {
    setCompareItems((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (exists) {
        return prev.filter((item) => item._id !== product._id);
      } else {
        if (prev.length >= 4) {
          alert("You can compare up to 4 products at a time. Please remove one first.");
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  const isInCompare = (productId: string) => {
    return compareItems.some((item) => item._id === productId);
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        compareCount: compareItems.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}

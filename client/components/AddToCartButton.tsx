"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled?: boolean;
}) {
  const { token, user } = useAuth();
  const { refreshCart } = useCart();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAddToCart() {
    if (!user || !token) {
      router.push("/login");
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      setAdded(true);
      refreshCart();
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <Button size="lg" disabled={disabled || isAdding} onClick={handleAddToCart}>
      {disabled ? "Out of Stock" : isAdding ? "Adding..." : added ? "Added ✓" : "Add to Cart"}
    </Button>
  );
}
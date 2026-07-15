"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CartItem {
  product: {
    _id: string;
    name: string;
    slug: string;
    sellingPrice: number;
    thumbnailUrl: string | null;
  };
  quantity: number;
}

export default function CartPage() {
  const { token, user, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // wait until we know if user is logged in

    if (!user || !token) {
      setIsLoading(false);
      return;
    }

    fetchCart();
  }, [authLoading, user, token]);

  async function fetchCart() {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(data.items || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateQuantity(productId: string, quantity: number) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });
    fetchCart();
  }

  async function removeItem(productId: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCart();
  }

  const total = items.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);

  if (authLoading || isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Please login to view your cart.</p>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Your cart is empty.</p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {/* Items list */}
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.product._id}>
                  <CardContent className="p-4 flex gap-4 items-center">
                    <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.product.thumbnailUrl ? (
                        <Image
                          src={item.product.thumbnailUrl}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-xs text-muted-foreground">No image</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <Link href={`/products/${item.product.slug}`} className="font-medium hover:text-primary">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">AED {item.product.sellingPrice}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => removeItem(item.product._id)}
                    >
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <div>
              <Card>
                <CardContent className="p-4">
                  <h2 className="font-semibold mb-4">Order Summary</h2>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>AED {total}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between font-bold mb-4">
                    <span>Total</span>
                    <span className="text-primary">AED {total}</span>
                  </div>
                  <Link href="/checkout">
                    <Button className="w-full">Proceed to Checkout</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
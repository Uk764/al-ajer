"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";

interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  shippingAddress: string;
  phone: string;
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const { token, isLoading: authLoading } = useAuth();
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !token) return;

    async function fetchOrder() {
      try {
        // We fetch the user's full order history and find this one,
        // since we don't have a dedicated "get single order" endpoint yet
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: Order[] = await res.json();
        const found = data.find((o) => o._id === orderId);
        if (!found) {
          setError("Order not found");
        } else {
          setOrder(found);
        }
      } catch {
        setError("Failed to load order");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [authLoading, token, orderId]);

  if (authLoading || isLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading order...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{error || "Order not found"}</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Order Placed!</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Thank you — we've received your order.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono text-sm">{order._id}</p>
              </div>
              <Badge variant="secondary" className="capitalize">
                {order.status}
              </Badge>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>AED {item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-bold mb-4">
              <span>Total</span>
              <span className="text-primary">AED {order.totalAmount}</span>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Delivering to: {order.shippingAddress}</p>
              <p>Phone: {order.phone}</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AccountPage() {
  const { user, token, isLoading: authLoading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !token) return;

    async function fetchOrders() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrders();
  }, [authLoading, token]);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Please login to view your account.</p>
        <Link href="/login">
          <Button>Login</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">My Account</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Name:</span> {user.name}</p>
            <p><span className="text-muted-foreground">Email:</span> {user.email}</p>
            <p><span className="text-muted-foreground">Role:</span> <span className="capitalize">{user.role}</span></p>
            <Button variant="outline" size="sm" className="mt-3" onClick={logout}>
              Logout
            </Button>
          </CardContent>
        </Card>

        <h2 className="text-lg font-semibold mb-3">Order History</h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link key={order._id} href={`/orders/${order._id}`}>
                <Card className="hover:border-primary transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">{order._id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary">AED {order.totalAmount}</span>
                      <Badge variant="secondary" className="capitalize">
                        {order.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
        <Separator className="my-8" />
      </div>
    </main>
  );
}
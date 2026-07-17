"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Package, ShoppingBag, Tags, AlertTriangle } from "lucide-react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalCategories: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    async function fetchStats() {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [productsRes, ordersRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=1`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { headers }),
        ]);

        const products = await productsRes.json();
        const orders = await ordersRes.json();
        const categories = await categoriesRes.json();

        setStats({
          totalProducts: products.pagination?.total || 0,
          totalOrders: Array.isArray(orders) ? orders.length : 0,
          totalCategories: Array.isArray(categories) ? categories.length : 0,
          pendingOrders: Array.isArray(orders)
            ? orders.filter((o: { status: string }) => o.status === "pending").length
            : 0,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [token]);

  const cards = [
    {
      label: "Total Products",
      value: stats?.totalProducts,
      icon: Package,
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders,
      icon: ShoppingBag,
    },
    {
      label: "Categories",
      value: stats?.totalCategories,
      icon: Tags,
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders,
      icon: AlertTriangle,
      highlight: (stats?.pendingOrders ?? 0) > 0,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Overview of your store
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <Icon
                  className={`h-4 w-4 ${
                    card.highlight ? "text-destructive" : "text-muted-foreground"
                  }`}
                />
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    card.highlight ? "text-destructive" : ""
                  }`}
                >
                  {isLoading ? "..." : card.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
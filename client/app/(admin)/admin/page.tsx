"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import { getReportSummary, ReportSummaryResponse } from "@/shared/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Package,
  ShoppingBag,
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  RefreshCw,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<ReportSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  async function fetchDashboardData() {
    setIsLoading(true);
    setError("");
    try {
      if (!token) return;
      const res = await getReportSummary(token);
      setData(res);
    } catch (err: any) {
      console.error("Dashboard load failure:", err);
      setError("Failed to load dashboard metrics. Make sure you are logged in as an administrator.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-muted rounded-xl"></div>
          <div className="h-96 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-destructive/15 text-destructive border border-destructive/20 p-6 rounded-xl space-y-4 max-w-xl">
        <h3 className="font-bold text-lg">Error Loading Dashboard</h3>
        <p className="text-sm">{error || "Something went wrong."}</p>
        <Button onClick={fetchDashboardData} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  const { summary, recentOrders, recentCustomers, salesByCategory, topProducts, salesTrend } = data;

  // Find max sales trend value to scale SVG chart
  const maxTrendAmount = Math.max(...salesTrend.map((t) => t.amount), 100);

  // Calculate percentages for categories progress bars
  const totalSalesFromCategories = salesByCategory.reduce((sum, c) => sum + c.value, 0);

  return (
    <div className="space-y-8">
      {/* Dashboard Title & Refresh */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent flex items-center gap-2">
            Dashboard
            <Sparkles className="h-5 w-5 text-gold shrink-0" />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time business performance analytics and summary
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start">
          <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 py-1 px-2.5">
            Live Feed Sync
          </Badge>
          <Button variant="outline" size="sm" onClick={fetchDashboardData} className="gap-2 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <Card className="relative overflow-hidden bg-card/60 border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Total Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold tracking-tight text-white">
              AED {summary.totalSales.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <p className="text-[9px] text-emerald-500 font-semibold uppercase mt-1">
              Live Aggregate
            </p>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card className="bg-card/60 border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{summary.totalCustomers}</div>
            <p className="text-[9px] text-zinc-500 font-semibold uppercase mt-1">
              Unique Signups
            </p>
          </CardContent>
        </Card>

        {/* Active Products */}
        <Card className="bg-card/60 border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Active Products
            </CardTitle>
            <Package className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{summary.totalProducts}</div>
            <p className="text-[9px] text-zinc-500 font-semibold uppercase mt-1">
              Active Catalog Items
            </p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="bg-card/60 border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{summary.totalOrders}</div>
            <p className="text-[9px] text-zinc-500 font-semibold uppercase mt-1">
              Completed & Pending
            </p>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className={`bg-card/60 border-border/80 transition-colors ${summary.pendingOrders > 0 ? "border-amber-500/20" : ""}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Pending Orders
            </CardTitle>
            <Clock className={`h-4 w-4 ${summary.pendingOrders > 0 ? "text-amber-500 animate-pulse" : "text-zinc-500"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.pendingOrders > 0 ? "text-amber-500" : "text-white"}`}>
              {summary.pendingOrders}
            </div>
            <p className={`text-[9px] font-semibold uppercase mt-1 ${summary.pendingOrders > 0 ? "text-amber-500/80" : "text-zinc-500"}`}>
              Awaiting Action
            </p>
          </CardContent>
        </Card>

        {/* Low-stock Products */}
        <Card className={`bg-card/60 border-border/80 transition-colors ${summary.lowStockCount > 0 ? "border-destructive/20 bg-destructive/5" : ""}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className={`h-4 w-4 ${summary.lowStockCount > 0 ? "text-destructive" : "text-zinc-500"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.lowStockCount > 0 ? "text-destructive" : "text-white"}`}>
              {summary.lowStockCount}
            </div>
            <p className={`text-[9px] font-semibold uppercase mt-1 ${summary.lowStockCount > 0 ? "text-destructive/80" : "text-zinc-500"}`}>
              Requires Reorder
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphs & Sales Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend SVG graph */}
        <Card className="lg:col-span-2 bg-card/60 border-border/85 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base uppercase tracking-widest text-white flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-gold" />
              Sales Trend (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end min-h-[260px] pt-6">
            {salesTrend.length === 0 ? (
              <div className="text-center py-12 text-xs text-muted-foreground">No recent transaction data.</div>
            ) : (
              <div className="w-full flex-1 flex flex-col justify-between">
                {/* SVG Visual Graph */}
                <div className="h-44 w-full relative pt-2">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160">
                    {/* Y-axis gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={140 - p * 120}
                        x2="600"
                        y2={140 - p * 120}
                        stroke="#1e1e1e"
                        strokeDasharray="4 4"
                      />
                    ))}

                    {/* Gradient Area under line */}
                    <path
                      d={`M 0 140 ${salesTrend
                        .map((t, idx) => {
                          const x = (idx / 6) * 600;
                          const y = 140 - (t.amount / maxTrendAmount) * 120;
                          return `L ${x} ${y}`;
                        })
                        .join(" ")} L 600 140 Z`}
                      fill="url(#goldGradient)"
                      className="opacity-15"
                    />

                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Line path */}
                    <path
                      d={salesTrend
                        .map((t, idx) => {
                          const x = (idx / 6) * 600;
                          const y = 140 - (t.amount / maxTrendAmount) * 120;
                          return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                        })
                        .join(" ")}
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Data dots */}
                    {salesTrend.map((t, idx) => {
                      const x = (idx / 6) * 600;
                      const y = 140 - (t.amount / maxTrendAmount) * 120;
                      return (
                        <g key={idx} className="group/dot">
                          <circle
                            cx={x}
                            cy={y}
                            r="5"
                            fill="#0e0e0e"
                            stroke="#eab308"
                            strokeWidth="2.5"
                            className="cursor-pointer transition-all duration-200 group-hover/dot:r-7"
                          />
                          <text
                            x={x}
                            y={y - 12}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="9"
                            fontWeight="bold"
                            className="opacity-0 group-hover/dot:opacity-100 transition-opacity bg-black duration-150 font-mono"
                          >
                            AED {t.amount.toFixed(0)}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between border-t border-zinc-900 pt-4 mt-2 px-1 text-[9px] font-extrabold font-mono text-zinc-500 uppercase tracking-wider">
                  {salesTrend.map((t) => (
                    <span key={t.date}>{t.date}</span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sales by Category progress metrics */}
        <Card className="bg-card/60 border-border/85">
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-widest text-white flex items-center gap-2">
              <Boxes className="h-4.5 w-4.5 text-gold" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {salesByCategory.length === 0 ? (
              <div className="text-center py-12 text-xs text-muted-foreground">No category sales metrics.</div>
            ) : (
              salesByCategory.map((cat) => {
                const percentage = totalSalesFromCategories > 0 ? (cat.value / totalSalesFromCategories) * 100 : 0;
                return (
                  <div key={cat.name} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                      <span>{cat.name}</span>
                      <span className="text-gold">AED {cat.value.toFixed(2)}</span>
                    </div>
                    {/* Custom progress bar */}
                    <div className="w-full bg-[#181818] h-2 rounded-full overflow-hidden border border-zinc-900">
                      <div
                        className="bg-gold h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-zinc-500 font-extrabold uppercase tracking-widest">
                      <span>Breakdown Share</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Products & Recent Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Selling Products */}
        <Card className="lg:col-span-2 bg-card/60 border-border/85">
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-widest text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="h-4.5 w-4.5 text-gold" />
                Top Selling Products
              </span>
              <Link href="/admin/products" className="text-[10px] font-mono uppercase text-gold hover:underline flex items-center gap-1">
                Catalog <ArrowUpRight className="h-3 w-3" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">No sales registered yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 text-zinc-500 font-extrabold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Product Title</th>
                      <th className="py-2.5 px-3 text-center">Qty Sold</th>
                      <th className="py-2.5 px-3 text-right">Revenue Generated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {topProducts.map((p, idx) => (
                      <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-3 px-3 font-semibold text-zinc-200 uppercase truncate max-w-xs">{p.name}</td>
                        <td className="py-3 px-3 text-center font-mono text-zinc-300 font-semibold">{p.quantity}</td>
                        <td className="py-3 px-3 text-right font-semibold text-gold font-mono">AED {p.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Customers List */}
        <Card className="bg-card/60 border-border/85">
          <CardHeader>
            <CardTitle className="text-base uppercase tracking-widest text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-gold" />
                Recent Signups
              </span>
              <Link href="/admin/customers" className="text-[10px] font-mono uppercase text-gold hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCustomers.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">No registered customers.</div>
            ) : (
              recentCustomers.map((cust) => {
                const initials = cust.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                return (
                  <div key={cust._id} className="flex items-center justify-between p-2.5 rounded bg-secondary/10 border border-zinc-900">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#1b1a14] border border-gold/10 flex items-center justify-center text-[10px] text-gold font-black tracking-widest shrink-0 shadow-inner">
                        {initials || "C"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-200 uppercase truncate leading-tight">{cust.name}</p>
                        <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">{cust.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[8px] font-mono text-zinc-500 shrink-0 border-zinc-800">
                      {new Date(cust.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Wide Section */}
      <Card className="bg-card/60 border-border/85">
        <CardHeader>
          <CardTitle className="text-base uppercase tracking-widest text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-4.5 w-4.5 text-gold" />
              Recent Orders Feed
            </span>
            <Link href="/admin/orders" className="text-[10px] font-mono uppercase text-gold hover:underline flex items-center gap-1">
              Orders Queue <ArrowRight className="h-3 w-3" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-xs text-muted-foreground">No recent transaction orders.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 font-extrabold uppercase tracking-wider">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Order Status</th>
                    <th className="py-3 px-4">Date Submited</th>
                    <th className="py-3 px-4 text-right">View Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-secondary/20 transition-colors align-middle">
                      <td className="py-3 px-4 font-mono font-bold text-zinc-400 text-[10px]">{ord._id}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-zinc-200 uppercase text-[11px]">{ord.user?.name || "Guest Customer"}</p>
                        <p className="text-[9px] text-zinc-500 font-medium leading-none mt-0.5">{ord.user?.email || "No Email"}</p>
                      </td>
                      <td className="py-3 px-4 font-semibold text-gold font-mono">AED {ord.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            ord.status === "delivered"
                              ? "default"
                              : ord.status === "pending"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-[9px] uppercase tracking-wider font-extrabold"
                        >
                          {ord.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-zinc-500 font-mono">
                        {new Date(ord.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`/admin/orders`}>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-gold">
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
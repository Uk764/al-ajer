"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import { getReportSummary, ReportSummaryResponse } from "@/shared/lib/api";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { RefreshCw, DollarSign, ShoppingBag, AlertTriangle, Users, TrendingUp, Package, Tag, ArrowUpRight } from "lucide-react";

export default function AdminReportsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<ReportSummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReport();
  }, [token]);

  async function fetchReport() {
    if (!token) return;
    setIsLoading(true);
    setError("");
    try {
      const summary = await getReportSummary(token);
      setData(summary);
    } catch {
      setError("Failed to load business intelligence reports.");
    } finally {
      setIsLoading(false);
    }
  }

  // Predefined colors for categories chart
  const colors = ["#d4af37", "#a855f7", "#3b82f6", "#10b981", "#f97316", "#ec4899", "#14b8a6", "#64748b"];

  // Donut chart path calculator helpers
  const totalCategorySales = data?.salesByCategory?.reduce((sum, item) => sum + item.value, 0) || 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Business Reports</h1>
          <p className="text-sm text-muted-foreground">Store analytics and performance indicators</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchReport} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => window.print()} className="gap-2" variant="outline">
            Export PDF / Print
          </Button>
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}

      {isLoading || !data ? (
        <div className="text-center py-20 text-muted-foreground">Loading reports overview...</div>
      ) : (
        <div className="space-y-6">
          {/* KPI Dashboard Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Sales Revenue
                </CardTitle>
                <div className="h-7 w-7 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-black text-white">
                  AED {data.summary.totalSales.toLocaleString()}
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase">Excluding cancelled orders</p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Average Order Value
                </CardTitle>
                <div className="h-7 w-7 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-black text-white">
                  AED {Math.round(data.summary.averageOrderValue).toLocaleString()}
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase">Per completed checkout</p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Orders Logged
                </CardTitle>
                <div className="h-7 w-7 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-black text-white">
                  {data.summary.totalOrders}
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase">
                  {data.summary.pendingOrders} Pending / {data.summary.completedOrders} Delivered
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Low Stock alerts
                </CardTitle>
                <div className={`h-7 w-7 rounded flex items-center justify-center ${data.summary.lowStockCount > 0 ? "bg-red-500/10 border border-red-500/20 text-red-500 animate-pulse" : "bg-zinc-550/10 text-muted-foreground"}`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-xl md:text-2xl font-black ${data.summary.lowStockCount > 0 ? "text-red-500" : "text-white"}`}>
                  {data.summary.lowStockCount} Items
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase">Below custom reorder Level</p>
              </CardContent>
            </Card>
          </div>

          {/* SVG Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Trend Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase text-zinc-300">Sales Trend (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                {data.salesTrend.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent trend data.</p>
                ) : (
                  <div className="w-full h-full flex flex-col justify-between">
                    {/* Native SVG Line/Area Chart */}
                    <svg className="w-full h-44 overflow-visible" viewBox="0 0 500 150">
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="500" y2="20" stroke="#1f1f1f" strokeWidth="1" strokeDasharray="3" />
                      <line x1="0" y1="65" x2="500" y2="65" stroke="#1f1f1f" strokeWidth="1" strokeDasharray="3" />
                      <line x1="0" y1="110" x2="500" y2="110" stroke="#1f1f1f" strokeWidth="1" strokeDasharray="3" />
                      <line x1="0" y1="150" x2="500" y2="150" stroke="#2a2a2a" strokeWidth="1.5" />

                      {/* Line Paths */}
                      {(() => {
                        const maxVal = Math.max(...data.salesTrend.map((d) => d.amount), 100);
                        const points = data.salesTrend.map((d, index) => {
                          const x = (index / (data.salesTrend.length - 1)) * 500;
                          const y = 150 - (d.amount / maxVal) * 120; // scale to fit
                          return { x, y, amount: d.amount, date: d.date };
                        });

                        const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                        const areaD = `${pathD} L 500 150 L 0 150 Z`;

                        return (
                          <>
                            {/* Glowing Area Fill */}
                            <path d={areaD} fill="url(#salesTrendGradient)" opacity="0.15" />
                            {/* Border Line */}
                            <path d={pathD} fill="none" stroke="#d4af37" strokeWidth="2.5" />
                            {/* Markers */}
                            {points.map((p, i) => (
                              <g key={i} className="group/dot cursor-pointer">
                                <circle cx={p.x} cy={p.y} r="4" fill="#070707" stroke="#d4af37" strokeWidth="2" />
                                <circle cx={p.x} cy={p.y} r="8" fill="#d4af37" opacity="0" className="hover:opacity-30 transition-opacity" />
                                <title>{`${p.date}: AED ${p.amount}`}</title>
                              </g>
                            ))}
                            {/* Gradient definition */}
                            <defs>
                              <linearGradient id="salesTrendGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#d4af37" />
                                <stop offset="100%" stopColor="#070707" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                          </>
                        );
                      })()}
                    </svg>
                    {/* Dates Labels */}
                    <div className="flex justify-between text-[9px] font-mono text-zinc-500 uppercase tracking-widest px-1">
                      {data.salesTrend.map((d) => (
                        <span key={d.date}>{d.date}</span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sales by Category Donut Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase text-zinc-300">Sales by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex flex-col sm:flex-row items-center justify-around gap-4">
                {data.salesByCategory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No category sales logged.</p>
                ) : (
                  <>
                    {/* Donut drawing */}
                    <div className="relative w-36 h-36 flex-shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#161616" strokeWidth="3" />
                        {(() => {
                          let accumulatedPercent = 0;
                          return data.salesByCategory.map((item, index) => {
                            const percent = (item.value / totalCategorySales) * 100;
                            const strokeDash = `${percent} ${100 - percent}`;
                            const strokeOffset = 100 - accumulatedPercent;
                            accumulatedPercent += percent;
                            const color = colors[index % colors.length];

                            return (
                              <circle
                                key={item.name}
                                cx="18"
                                cy="18"
                                r="15.915"
                                fill="none"
                                stroke={color}
                                strokeWidth="3.2"
                                strokeDasharray={strokeDash}
                                strokeDashoffset={strokeOffset}
                              />
                            );
                          });
                        })()}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Total</span>
                        <span className="text-sm font-black text-white">AED {Math.round(totalCategorySales).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Donut Legend */}
                    <div className="flex-1 space-y-1.5 max-h-48 overflow-y-auto w-full">
                      {data.salesByCategory.slice(0, 5).map((item, index) => {
                        const percent = ((item.value / totalCategorySales) * 100).toFixed(1);
                        const color = colors[index % colors.length];
                        return (
                          <div key={item.name} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2">
                              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                              <span className="font-medium text-zinc-300 truncate max-w-[120px]">{item.name}</span>
                            </div>
                            <span className="font-mono text-muted-foreground">{percent}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Selling Products Bar Chart & Customer Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Products Horizontal Bar Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase text-zinc-300">Top Selling Products (by Revenue)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.topProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No sales transactions found.</p>
                ) : (
                  data.topProducts.map((p, i) => {
                    const maxRevenue = data.topProducts[0]?.revenue || 1;
                    const percentWidth = (p.revenue / maxRevenue) * 100;
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-white truncate max-w-sm">{p.name}</span>
                          <span className="font-bold text-gold">AED {p.revenue.toLocaleString()}</span>
                        </div>
                        <div className="h-2.5 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-600 to-gold rounded-full"
                            style={{ width: `${percentWidth}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">Volume Sold: {p.quantity} units</span>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Quick Metrics Directory Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold uppercase text-zinc-300">Summary Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-gold">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Total Active Customers</p>
                    <p className="text-sm font-extrabold text-white">{data.summary.totalCustomers} Accounts</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-gold">
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Catalog Items Count</p>
                    <p className="text-sm font-extrabold text-white">{data.summary.totalProducts} active products</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-gold">
                    <Tag className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Conversion Rate Indicator</p>
                    <p className="text-sm font-extrabold text-white">
                      {(data.summary.totalCustomers > 0 ? (data.summary.totalOrders / data.summary.totalCustomers) : 0).toFixed(2)} orders/customer
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

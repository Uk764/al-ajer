"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import {
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  AdminOrder,
} from "@/shared/lib/api";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Label } from "@/shared/components/ui/label";
import { RefreshCw, X, ShoppingBag, Truck, CheckCircle2, AlertTriangle, Eye } from "lucide-react";

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Drawer / View detail modal states
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchData();
  }, [token]);

  async function fetchData() {
    if (!token) return;
    setIsLoading(true);
    setError("");
    try {
      const data = await getAllOrdersAdmin(token);
      setOrders(data);
    } catch {
      setError("Failed to load customer orders.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: string) {
    if (!token) return;
    setIsUpdatingStatus(true);
    setError("");
    setSuccess("");

    try {
      const updated = await updateOrderStatusAdmin(token, orderId, newStatus);
      setSuccess(`Order status updated to "${newStatus}"`);
      // Update local state list
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
      // Update selected order in view modal
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update order status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  const statusBadges: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    confirmed: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    shipped: "bg-purple-500/10 text-purple-500 border border-purple-500/20",
    delivered: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    cancelled: "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20",
  };

  const statusIcons: Record<string, any> = {
    pending: AlertTriangle,
    confirmed: ShoppingBag,
    shipped: Truck,
    delivered: CheckCircle2,
    cancelled: X,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Orders</h1>
          <p className="text-sm text-muted-foreground">Manage and track delivery orders status</p>
        </div>
        <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-600/15 text-green-500 p-3 rounded-md mb-4 text-sm">{success}</div>}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Orders Log ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground text-sm">Loading orders log...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No orders received yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium bg-secondary/10">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items Count</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Delivery Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-xs font-bold text-white max-w-[120px] truncate">
                        {order._id}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-sm">{order.user?.name || "Deleted User"}</p>
                        <span className="text-[11px] text-muted-foreground">{order.user?.email || ""}</span>
                      </td>
                      <td className="py-3 px-4 text-center">{order.items?.length || 0}</td>
                      <td className="py-3 px-4 font-bold text-gold">AED {order.totalAmount}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded capitalize font-medium ${statusBadges[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Slide-Over Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border-l border-border w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/10">
              <div>
                <h3 className="font-bold text-lg text-white">Order Details</h3>
                <span className="font-mono text-xs text-muted-foreground">ID: {selectedOrder._id}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status Section */}
              <div className="bg-secondary/20 border border-border p-4 rounded-lg flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Current Status:</span>
                  <Badge className={`capitalize py-1 ${statusBadges[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Update Status:</Label>
                  <div className="grid grid-cols-5 gap-1">
                    {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedOrder._id, status)}
                        disabled={isUpdatingStatus}
                        className={`text-[10px] capitalize py-1.5 border rounded-md font-bold transition-all ${
                          selectedOrder.status === status
                            ? "bg-primary border-primary text-primary-foreground scale-95"
                            : "border-border hover:bg-secondary text-muted-foreground"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Customer Contact */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">Customer Details</h4>
                <div className="text-sm bg-zinc-900 border border-zinc-800 rounded-lg p-3 space-y-1">
                  <p className="font-semibold text-white">{selectedOrder.user?.name || "Deleted User"}</p>
                  <p className="text-muted-foreground">{selectedOrder.user?.email || "No Email"}</p>
                  <p className="text-muted-foreground font-mono text-xs">Contact Phone: {selectedOrder.phone}</p>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">Shipping Destination</h4>
                <div className="text-sm bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                  <p className="leading-relaxed text-zinc-300">{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">Ordered Items ({selectedOrder.items?.length || 0})</h4>
                <div className="divide-y divide-border border border-border rounded-lg bg-zinc-900 overflow-hidden">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="p-3 flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <span className="text-xs text-muted-foreground">
                          AED {item.price} × {item.quantity}
                        </span>
                      </div>
                      <span className="font-semibold text-gold">AED {item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer summary */}
            <div className="p-4 border-t border-border bg-secondary/20 flex flex-col gap-3">
              <div className="flex justify-between items-center font-bold">
                <span className="text-zinc-400">Grand Total:</span>
                <span className="text-lg text-gold">AED {selectedOrder.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

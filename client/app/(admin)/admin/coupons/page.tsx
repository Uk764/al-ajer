"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  Coupon,
} from "@/shared/lib/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Plus, Pencil, Trash2, X, RefreshCw } from "lucide-react";

export default function AdminCouponsPage() {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscountAmount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    isActive: true,
  });

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  useEffect(() => {
    fetchData();
  }, [token]);

  async function fetchData() {
    if (!token) return;
    setIsLoading(true);
    setError("");
    try {
      const data = await getCoupons(token);
      setCoupons(data);
    } catch {
      setError("Failed to load coupons.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddClick() {
    setEditingCoupon(null);
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscountAmount: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days later
      usageLimit: "",
      isActive: true,
    });
    setError("");
    setIsModalOpen(true);
  }

  function handleEditClick(coupon: Coupon) {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscountAmount: coupon.maxDiscountAmount ? coupon.maxDiscountAmount.toString() : "",
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split("T")[0] : "",
      endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split("T")[0] : "",
      usageLimit: coupon.usageLimit ? coupon.usageLimit.toString() : "",
      isActive: coupon.isActive !== false,
    });
    setError("");
    setIsModalOpen(true);
  }

  function handleDeleteClick(coupon: Coupon) {
    setCouponToDelete(coupon);
    setIsDeleteConfirmOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) return;

    try {
      const payload: Record<string, unknown> = {
        code: formData.code.toUpperCase().trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount),
        maxDiscountAmount: formData.maxDiscountAmount === "" ? null : Number(formData.maxDiscountAmount),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        usageLimit: formData.usageLimit === "" ? null : Number(formData.usageLimit),
        isActive: formData.isActive,
      };

      if (editingCoupon) {
        await updateCoupon(token, editingCoupon._id, payload);
        setSuccess("Coupon updated successfully.");
      } else {
        await createCoupon(token, payload);
        setSuccess("Coupon created successfully.");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to save coupon.");
    }
  }

  async function handleConfirmDelete() {
    if (!token || !couponToDelete) return;
    setError("");
    setSuccess("");

    try {
      await deleteCoupon(token, couponToDelete._id);
      setSuccess("Coupon deleted successfully.");
      setIsDeleteConfirmOpen(false);
      setCouponToDelete(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete coupon.");
      setIsDeleteConfirmOpen(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
          <p className="text-sm text-muted-foreground">Manage discount codes and promotional offers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" /> Add Coupon
          </Button>
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-600/15 text-green-500 p-3 rounded-md mb-4 text-sm">{success}</div>}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Coupons ({coupons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading coupons...</div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No coupons found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Min. Spend</th>
                    <th className="py-3 px-4">Validity Period</th>
                    <th className="py-3 px-4">Usage</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {coupons.map((coupon) => {
                    const isExpired = new Date(coupon.endDate) < new Date();
                    return (
                      <tr key={coupon._id} className="hover:bg-secondary/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-sm tracking-wide text-primary">
                          {coupon.code}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `AED ${coupon.discountValue}`}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">AED {coupon.minOrderAmount}</td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {new Date(coupon.startDate).toLocaleDateString()} -{" "}
                          <span className={isExpired ? "text-destructive font-semibold" : ""}>
                            {new Date(coupon.endDate).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {coupon.usageCount} / {coupon.usageLimit || "∞"}
                        </td>
                        <td className="py-3 px-4">
                          {isExpired ? (
                            <Badge variant="destructive">Expired</Badge>
                          ) : (
                            <Badge variant={coupon.isActive !== false ? "default" : "secondary"}>
                              {coupon.isActive !== false ? "Active" : "Inactive"}
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(coupon)}
                              title="Edit Coupon"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(coupon)}
                              title="Delete Coupon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-semibold text-lg">{editingCoupon ? "Edit Coupon" : "Add Coupon"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="code">Coupon Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                      placeholder="e.g. SUMMER25"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="discountType">Discount Type</Label>
                    <select
                      id="discountType"
                      value={formData.discountType}
                      onChange={(e) => setFormData((p) => ({ ...p, discountType: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (AED)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="discountValue">Value</Label>
                    <Input
                      type="number"
                      id="discountValue"
                      min="0"
                      value={formData.discountValue}
                      onChange={(e) => setFormData((p) => ({ ...p, discountValue: Number(e.target.value) }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="minOrderAmount">Min. Spend</Label>
                    <Input
                      type="number"
                      id="minOrderAmount"
                      min="0"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData((p) => ({ ...p, minOrderAmount: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="maxDiscountAmount">Max. Discount</Label>
                    <Input
                      type="number"
                      id="maxDiscountAmount"
                      min="0"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData((p) => ({ ...p, maxDiscountAmount: e.target.value }))}
                      placeholder="None"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      type="date"
                      id="startDate"
                      value={formData.startDate}
                      onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      type="date"
                      id="endDate"
                      value={formData.endDate}
                      onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="usageLimit">Usage Limit (Total)</Label>
                    <Input
                      type="number"
                      id="usageLimit"
                      min="1"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData((p) => ({ ...p, usageLimit: e.target.value }))}
                      placeholder="e.g. 100 (Blank = ∞)"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">Active Coupon</Label>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-border flex justify-end gap-2 bg-secondary/20">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCoupon ? "Save Changes" : "Create Coupon"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-sm rounded-lg shadow-lg overflow-hidden animate-in fade-in duration-150">
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">Delete Coupon</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete coupon code <strong>{couponToDelete?.code}</strong>?
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

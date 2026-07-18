"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import {
  getAllInventory,
  upsertInventory,
  deleteInventoryRecord,
  getBranches,
  getProducts,
  InventoryRecord,
  Branch,
  Product,
} from "@/shared/lib/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Plus, Pencil, Trash2, X, RefreshCw, AlertTriangle } from "lucide-react";

export default function AdminInventoryPage() {
  const { token } = useAuth();
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState("");

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InventoryRecord | null>(null);
  const [formData, setFormData] = useState({
    productId: "",
    branchId: "",
    quantity: 0,
    reorderLevel: 5,
  });

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<InventoryRecord | null>(null);

  useEffect(() => {
    fetchData();
  }, [token]);

  async function fetchData() {
    if (!token) return;
    setIsLoading(true);
    setError("");
    try {
      const [inventoryData, branchesData, productsData] = await Promise.all([
        getAllInventory(token),
        getBranches(),
        getProducts({ limit: 100, all: true }), // Load some products for linking
      ]);
      setInventory(inventoryData);
      setBranches(branchesData);
      setProducts(productsData.products);
    } catch {
      setError("Failed to load inventory data.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddClick() {
    setEditingRecord(null);
    setFormData({
      productId: products[0]?._id || "",
      branchId: branches[0]?._id || "",
      quantity: 0,
      reorderLevel: 5,
    });
    setError("");
    setIsModalOpen(true);
  }

  function handleEditClick(record: InventoryRecord) {
    setEditingRecord(record);
    setFormData({
      productId: record.product?._id || "",
      branchId: record.branch?._id || "",
      quantity: record.quantity,
      reorderLevel: record.reorderLevel,
    });
    setError("");
    setIsModalOpen(true);
  }

  function handleDeleteClick(record: InventoryRecord) {
    setRecordToDelete(record);
    setIsDeleteConfirmOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) return;

    try {
      await upsertInventory(token, {
        product: formData.productId,
        branch: formData.branchId,
        quantity: Number(formData.quantity),
        reorderLevel: Number(formData.reorderLevel),
      });

      setSuccess("Inventory stock updated successfully.");
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to update inventory.");
    }
  }

  async function handleConfirmDelete() {
    if (!token || !recordToDelete) return;
    setError("");
    setSuccess("");

    try {
      await deleteInventoryRecord(token, recordToDelete._id);
      setSuccess("Inventory record deleted successfully.");
      setIsDeleteConfirmOpen(false);
      setRecordToDelete(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete inventory record.");
      setIsDeleteConfirmOpen(false);
    }
  }

  // Filter inventory list
  const filteredInventory = inventory.filter((record) => {
    const productName = record.product?.name?.toLowerCase() || "";
    const productSku = record.product?.sku?.toLowerCase() || "";
    const matchesSearch =
      productName.includes(searchQuery.toLowerCase()) ||
      productSku.includes(searchQuery.toLowerCase());

    const matchesBranch =
      !selectedBranchFilter || record.branch?._id === selectedBranchFilter;

    return matchesSearch && matchesBranch;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Stock</h1>
          <p className="text-sm text-muted-foreground">Manage product stock quantities across branches</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" /> Update / Add Stock
          </Button>
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-600/15 text-green-500 p-3 rounded-md mb-4 text-sm">{success}</div>}

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by Product Name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <select
            value={selectedBranchFilter}
            onChange={(e) => setSelectedBranchFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All Branches</option>
            {branches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Stock Records ({filteredInventory.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading stock levels...</div>
          ) : filteredInventory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No inventory records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Branch</th>
                    <th className="py-3 px-4">In Stock</th>
                    <th className="py-3 px-4">Reorder Level</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInventory.map((record) => {
                    const isLowStock = record.quantity <= record.reorderLevel;
                    return (
                      <tr key={record._id} className="hover:bg-secondary/40 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-medium">{record.product?.name || "Deleted Product"}</p>
                          <span className="text-xs text-muted-foreground uppercase">{record.product?.unit || "piece"}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs">{record.product?.sku || "-"}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-xs">{record.branch?.name || "Deleted Branch"}</p>
                          <span className="text-[10px] text-muted-foreground font-mono">{record.branch?.code || "-"}</span>
                        </td>
                        <td className="py-3 px-4 font-bold">{record.quantity}</td>
                        <td className="py-3 px-4 text-muted-foreground">{record.reorderLevel}</td>
                        <td className="py-3 px-4">
                          {isLowStock ? (
                            <Badge variant="destructive" className="gap-1.5 py-0.5">
                              <AlertTriangle className="h-3 w-3" /> Low Stock
                            </Badge>
                          ) : (
                            <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                              Healthy
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(record)}
                              title="Adjust Stock"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(record)}
                              title="Delete Record"
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
              <h3 className="font-semibold text-lg">{editingRecord ? "Adjust Stock Level" : "Create New Stock Entry"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="product">Product</Label>
                  <select
                    id="product"
                    value={formData.productId}
                    onChange={(e) => setFormData((p) => ({ ...p, productId: e.target.value }))}
                    disabled={!!editingRecord}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {products.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="branch">Branch Store</Label>
                  <select
                    id="branch"
                    value={formData.branchId}
                    onChange={(e) => setFormData((p) => ({ ...p, branchId: e.target.value }))}
                    disabled={!!editingRecord}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {branches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="quantity">Quantity in Stock</Label>
                    <Input
                      type="number"
                      id="quantity"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData((p) => ({ ...p, quantity: Number(e.target.value) }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reorderLevel">Reorder Level (Warning)</Label>
                    <Input
                      type="number"
                      id="reorderLevel"
                      min="0"
                      value={formData.reorderLevel}
                      onChange={(e) => setFormData((p) => ({ ...p, reorderLevel: Number(e.target.value) }))}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-border flex justify-end gap-2 bg-secondary/20">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRecord ? "Save Changes" : "Save Stock Entry"}
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
              <h3 className="font-semibold text-lg mb-2">Delete Stock Record</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete the stock record of <strong>{recordToDelete?.product?.name}</strong> at <strong>{recordToDelete?.branch?.name}</strong>?
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

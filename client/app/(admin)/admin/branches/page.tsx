"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  Branch,
} from "@/shared/lib/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Plus, Pencil, Trash2, X, RefreshCw } from "lucide-react";

export default function AdminBranchesPage() {
  const { token } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
    phone: "",
    isActive: true,
  });

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    setError("");
    try {
      const data = await getBranches();
      setBranches(data);
    } catch {
      setError("Failed to load branches.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddClick() {
    setEditingBranch(null);
    setFormData({
      name: "",
      code: "",
      address: "",
      city: "",
      phone: "",
      isActive: true,
    });
    setError("");
    setIsModalOpen(true);
  }

  function handleEditClick(branch: Branch) {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      city: branch.city,
      phone: branch.phone,
      isActive: branch.isActive !== false,
    });
    setError("");
    setIsModalOpen(true);
  }

  function handleDeleteClick(branch: Branch) {
    setBranchToDelete(branch);
    setIsDeleteConfirmOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) return;

    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
      };

      if (editingBranch) {
        await updateBranch(token, editingBranch._id, payload);
        setSuccess("Branch updated successfully.");
      } else {
        await createBranch(token, payload);
        setSuccess("Branch created successfully.");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    }
  }

  async function handleConfirmDelete() {
    if (!token || !branchToDelete) return;
    setError("");
    setSuccess("");

    try {
      await deleteBranch(token, branchToDelete._id);
      setSuccess("Branch deleted successfully.");
      setIsDeleteConfirmOpen(false);
      setBranchToDelete(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete branch.");
      setIsDeleteConfirmOpen(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Branches</h1>
          <p className="text-sm text-muted-foreground">Manage store branches and warehouse locations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" /> Add Branch
          </Button>
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-600/15 text-green-500 p-3 rounded-md mb-4 text-sm">{success}</div>}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Branches ({branches.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading branches...</div>
          ) : branches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No branches found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Address</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {branches.map((branch) => (
                    <tr key={branch._id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-xs">{branch.code}</td>
                      <td className="py-3 px-4 font-medium">{branch.name}</td>
                      <td className="py-3 px-4">{branch.city}</td>
                      <td className="py-3 px-4">{branch.phone}</td>
                      <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">{branch.address}</td>
                      <td className="py-3 px-4">
                        <Badge variant={branch.isActive !== false ? "default" : "secondary"}>
                          {branch.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(branch)}
                            title="Edit Branch"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(branch)}
                            title="Delete Branch"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
              <h3 className="font-semibold text-lg">{editingBranch ? "Edit Branch" : "Add New Branch"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="code">Branch Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value }))}
                      placeholder="e.g. DXB01"
                      required
                      disabled={!!editingBranch} // keep code immutable to avoid product inventory relation mess
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Branch Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Deira Showroom"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                      placeholder="e.g. Dubai"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="e.g. 04XXXXXXX"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                    placeholder="e.g. Near Metro Station, Deira"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">Active Branch</Label>
                </div>
              </div>
              <div className="p-4 border-t border-border flex justify-end gap-2 bg-secondary/20">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBranch ? "Save Changes" : "Create Branch"}
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
              <h3 className="font-semibold text-lg mb-2">Delete Branch</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete branch <strong>{branchToDelete?.name}</strong>? This will remove all associated inventory records.
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

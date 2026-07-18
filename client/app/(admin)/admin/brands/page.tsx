"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  Brand,
} from "@/shared/lib/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Plus, Pencil, Trash2, X, RefreshCw, Upload, Image as ImageIcon } from "lucide-react";

export default function AdminBrandsPage() {
  const { token } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    logoUrl: "",
    isActive: true,
  });

  const [isUploading, setIsUploading] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    setError("");
    try {
      const data = await getBrands();
      setBrands(data);
    } catch {
      setError("Failed to load brands.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddClick() {
    setEditingBrand(null);
    setFormData({
      name: "",
      slug: "",
      logoUrl: "",
      isActive: true,
    });
    setError("");
    setIsModalOpen(true);
  }

  function handleEditClick(brand: Brand) {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      logoUrl: brand.logoUrl || "",
      isActive: brand.isActive !== false,
    });
    setError("");
    setIsModalOpen(true);
  }

  function handleDeleteClick(brand: Brand) {
    setBrandToDelete(brand);
    setIsDeleteConfirmOpen(true);
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug === "" || prev.slug === prev.name.toLowerCase().replace(/\s+/g, "-") ? slug : prev.slug,
    }));
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setIsUploading(true);
    setError("");

    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setFormData((prev) => ({ ...prev, logoUrl: data.url }));
    } catch (err: any) {
      setError(err.message || "Failed to upload logo.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) return;

    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
        logoUrl: formData.logoUrl || null,
        isActive: formData.isActive,
      };

      if (editingBrand) {
        await updateBrand(token, editingBrand._id, payload);
        setSuccess("Brand updated successfully.");
      } else {
        await createBrand(token, payload);
        setSuccess("Brand created successfully.");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    }
  }

  async function handleConfirmDelete() {
    if (!token || !brandToDelete) return;
    setError("");
    setSuccess("");

    try {
      await deleteBrand(token, brandToDelete._id);
      setSuccess("Brand deleted successfully.");
      setIsDeleteConfirmOpen(false);
      setBrandToDelete(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete brand.");
      setIsDeleteConfirmOpen(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Brands</h1>
          <p className="text-sm text-muted-foreground">Manage product brands and manufacturers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" /> Add Brand
          </Button>
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-600/15 text-green-500 p-3 rounded-md mb-4 text-sm">{success}</div>}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Brands ({brands.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading brands...</div>
          ) : brands.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No brands found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="py-3 px-4">Logo</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {brands.map((brand) => (
                    <tr key={brand._id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3 px-4">
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="h-8 w-12 object-contain bg-zinc-900 rounded border border-zinc-800 p-1"
                          />
                        ) : (
                          <div className="h-8 w-12 bg-zinc-900 rounded border border-zinc-850 flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium">{brand.name}</td>
                      <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{brand.slug}</td>
                      <td className="py-3 px-4">
                        <Badge variant={brand.isActive !== false ? "default" : "secondary"}>
                          {brand.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(brand)}
                            title="Edit Brand"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(brand)}
                            title="Delete Brand"
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
              <h3 className="font-semibold text-lg">{editingBrand ? "Edit Brand" : "Add New Brand"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Brand Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Hilti"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="e.g. hilti"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="logo">Brand Logo</Label>
                  <div className="flex items-center gap-3">
                    {formData.logoUrl && (
                      <img
                        src={formData.logoUrl}
                        alt="Preview"
                        className="h-10 w-16 object-contain bg-zinc-900 border border-zinc-800 rounded p-1"
                      />
                    )}
                    <div className="flex-1 relative">
                      <Input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Label
                        htmlFor="logo"
                        className="flex items-center justify-center gap-2 border border-input rounded-md h-10 px-3 cursor-pointer hover:bg-secondary transition-colors text-sm font-medium"
                      >
                        <Upload className="h-4 w-4" />
                        {isUploading ? "Uploading..." : "Upload Logo Image"}
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">Active Brand</Label>
                </div>
              </div>
              <div className="p-4 border-t border-border flex justify-end gap-2 bg-secondary/20">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {editingBrand ? "Save Changes" : "Create Brand"}
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
              <h3 className="font-semibold text-lg mb-2">Delete Brand</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete brand <strong>{brandToDelete?.name}</strong>? This action cannot be undone.
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

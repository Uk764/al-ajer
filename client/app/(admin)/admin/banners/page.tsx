"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  Banner,
} from "@/shared/lib/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Plus, Pencil, Trash2, X, RefreshCw, Upload, Image as ImageIcon } from "lucide-react";

export default function AdminBannersPage() {
  const { token } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    buttonText: "",
    buttonLink: "",
    sortOrder: 0,
    isActive: true,
  });

  const [isUploading, setIsUploading] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  useEffect(() => {
    fetchData();
  }, [token]);

  async function fetchData() {
    setIsLoading(true);
    setError("");
    try {
      const data = await getBanners(token || undefined);
      setBanners(data);
    } catch {
      setError("Failed to load banners.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddClick() {
    setEditingBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      imageUrl: "",
      linkUrl: "",
      buttonText: "",
      buttonLink: "",
      sortOrder: banners.length,
      isActive: true,
    });
    setError("");
    setIsModalOpen(true);
  }

  function handleEditClick(banner: Banner) {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      imageUrl: banner.imageUrl || "",
      linkUrl: banner.linkUrl || "",
      buttonText: banner.buttonText || "",
      buttonLink: banner.buttonLink || "",
      sortOrder: banner.sortOrder,
      isActive: banner.isActive !== false,
    });
    setError("");
    setIsModalOpen(true);
  }

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
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

      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err: any) {
      setError(err.message || "Failed to upload banner image.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleDeleteClick(banner: Banner) {
    setBannerToDelete(banner);
    setIsDeleteConfirmOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) return;

    if (!formData.imageUrl) {
      setError("Banner image is required.");
      return;
    }

    try {
      const payload: Record<string, unknown> = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        imageUrl: formData.imageUrl,
        linkUrl: formData.linkUrl || null,
        buttonText: formData.buttonText || null,
        buttonLink: formData.buttonLink || null,
        sortOrder: Number(formData.sortOrder),
        isActive: formData.isActive,
      };

      if (editingBanner) {
        await updateBanner(token, editingBanner._id, payload);
        setSuccess("Banner updated successfully.");
      } else {
        await createBanner(token, payload);
        setSuccess("Banner created successfully.");
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to save banner.");
    }
  }

  async function handleConfirmDelete() {
    if (!token || !bannerToDelete) return;
    setError("");
    setSuccess("");

    try {
      await deleteBanner(token, bannerToDelete._id);
      setSuccess("Banner deleted successfully.");
      setIsDeleteConfirmOpen(false);
      setBannerToDelete(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete banner.");
      setIsDeleteConfirmOpen(false);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Homepage Banners</h1>
          <p className="text-sm text-muted-foreground">Manage promo slider banners and landing highlights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" /> Add Banner
          </Button>
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-600/15 text-green-500 p-3 rounded-md mb-4 text-sm">{success}</div>}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Banners ({banners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm">Loading banners...</div>
          ) : banners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No banners found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="py-3 px-4">Preview</th>
                    <th className="py-3 px-4">Title / Info</th>
                    <th className="py-3 px-4">Link URL</th>
                    <th className="py-3 px-4">Sort Order</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {banners.map((banner) => (
                    <tr key={banner._id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3 px-4">
                        {banner.imageUrl ? (
                          <img
                            src={banner.imageUrl}
                            alt={banner.title}
                            className="h-12 w-24 object-cover bg-zinc-900 border border-zinc-800 rounded"
                          />
                        ) : (
                          <div className="h-12 w-24 bg-zinc-900 rounded border border-zinc-850 flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-sm">{banner.title}</p>
                        {banner.subtitle && <p className="text-xs text-muted-foreground">{banner.subtitle}</p>}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-mono text-xs max-w-xs truncate">
                        {banner.linkUrl || "None"}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold">{banner.sortOrder}</td>
                      <td className="py-3 px-4">
                        <Badge variant={banner.isActive !== false ? "default" : "secondary"}>
                          {banner.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(banner)}
                            title="Edit Banner"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(banner)}
                            title="Delete Banner"
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
              <h3 className="font-semibold text-lg">{editingBanner ? "Edit Banner" : "Add Banner"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Banner Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. MEGA HARDWARE SALE"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subtitle">Subtitle / Callout</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))}
                    placeholder="e.g. Up to 40% Off on Power Tools"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="imageUrl">Banner Image</Label>
                  <div className="flex flex-col gap-3">
                    {formData.imageUrl && (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="h-24 w-full object-cover bg-zinc-900 border border-zinc-800 rounded"
                      />
                    )}
                    <div className="relative">
                      <Input
                        type="file"
                        id="bannerImage"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="hidden"
                      />
                      <Label
                        htmlFor="bannerImage"
                        className="flex items-center justify-center gap-2 border border-input rounded-md h-10 px-3 cursor-pointer hover:bg-secondary transition-colors text-sm font-medium"
                      >
                        <Upload className="h-4 w-4" />
                        {isUploading ? "Uploading..." : "Upload Banner Image"}
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="buttonText">Button Text (CTA)</Label>
                    <Input
                      id="buttonText"
                      value={formData.buttonText}
                      onChange={(e) => setFormData((p) => ({ ...p, buttonText: e.target.value }))}
                      placeholder="e.g. SHOP NOW"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="buttonLink">Button Action Link</Label>
                    <Input
                      id="buttonLink"
                      value={formData.buttonLink}
                      onChange={(e) => setFormData((p) => ({ ...p, buttonLink: e.target.value }))}
                      placeholder="e.g. /shop?category=power-tools"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="linkUrl">Link Destination URL</Label>
                    <Input
                      id="linkUrl"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData((p) => ({ ...p, linkUrl: e.target.value }))}
                      placeholder="e.g. /shop?category=power-tools"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      type="number"
                      id="sortOrder"
                      min="0"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData((p) => ({ ...p, sortOrder: Number(e.target.value) }))}
                    />
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
                  <Label htmlFor="isActive" className="cursor-pointer">Active Banner</Label>
                </div>
              </div>
              <div className="p-4 border-t border-border flex justify-end gap-2 bg-secondary/20">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {editingBanner ? "Save Changes" : "Create Banner"}
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
              <h3 className="font-semibold text-lg mb-2">Delete Banner</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete banner <strong>{bannerToDelete?.title}</strong>?
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

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/shared/context/AuthContext";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
  Product,
  Category,
  Brand,
} from "@/shared/lib/api";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Upload,
  PlusCircle,
  FileSpreadsheet,
} from "lucide-react";

export default function AdminProductsPage() {
  const { token } = useAuth();

  // Lists & pagination
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Loading & statuses
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("");

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    barcode: "",
    description: "",
    category: "",
    brand: "",
    costPrice: 0,
    sellingPrice: 0,
    discountedPrice: "",
    stock: 0,
    unit: "piece",
    thumbnailUrl: "",
    images: [] as string[],
    specifications: [] as { key: string; value: string }[],
    isActive: true,
    featured: false,
  });

  // Spec helper state
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });

  // Upload/Import states
  const [isUploading, setIsUploading] = useState(false);
  const [isBulkImporting, setIsBulkImporting] = useState(false);
  const [bulkImportResults, setBulkImportResults] = useState<any>(null);

  useEffect(() => {
    // Initial fetch for categories and brands
    async function loadMeta() {
      try {
        const [cats, brs] = await Promise.all([getCategories(), getBrands()]);
        setCategories(cats);
        setBrands(brs);
      } catch (err) {
        console.error("Failed to load categories/brands metadata", err);
      }
    }
    loadMeta();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, selectedCategoryFilter, selectedBrandFilter, token]);

  async function fetchProducts() {
    setIsLoading(true);
    setError("");
    try {
      const data = await getProducts({
        page: pagination.page,
        limit: pagination.limit,
        category: selectedCategoryFilter || undefined,
        brand: selectedBrandFilter || undefined,
        search: searchQuery || undefined,
        all: true, // We want inactive ones too
      });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch {
      setError("Failed to fetch products catalog.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
    fetchProducts();
  }

  function handleAddClick() {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      sku: "",
      barcode: "",
      description: "",
      category: categories[0]?._id || "",
      brand: brands[0]?._id || "",
      costPrice: 0,
      sellingPrice: 0,
      discountedPrice: "",
      stock: 0,
      unit: "piece",
      thumbnailUrl: "",
      images: [],
      specifications: [],
      isActive: true,
      featured: false,
    });
    setNewSpec({ key: "", value: "" });
    setError("");
    setIsModalOpen(true);
  }

  function handleEditClick(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      barcode: product.barcode,
      description: product.description || "",
      category: typeof product.category === "object" ? product.category._id : product.category,
      brand: typeof product.brand === "object" ? product.brand._id : product.brand,
      costPrice: product.costPrice || 0,
      sellingPrice: product.sellingPrice,
      discountedPrice: product.discountedPrice ? product.discountedPrice.toString() : "",
      stock: product.stock ?? 0,
      unit: product.unit || "piece",
      thumbnailUrl: product.thumbnailUrl || "",
      images: product.images || [],
      specifications: product.specifications || [],
      isActive: product.isActive !== false,
      featured: Boolean(product.featured),
    });
    setNewSpec({ key: "", value: "" });
    setError("");
    setIsModalOpen(true);
  }

  function handleDeleteClick(product: Product) {
    setProductToDelete(product);
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, isThumbnail: boolean) {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setIsUploading(true);
    setError("");

    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: uploadFormData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      if (isThumbnail) {
        setFormData((prev) => ({ ...prev, thumbnailUrl: data.url }));
      } else {
        setFormData((prev) => ({ ...prev, images: [...prev.images, data.url] }));
      }
    } catch (err: any) {
      setError(err.message || "Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  function addSpecification() {
    if (!newSpec.key || !newSpec.value) return;
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { ...newSpec }],
    }));
    setNewSpec({ key: "", value: "" });
  }

  function removeSpecification(index: number) {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
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
        sku: formData.sku.toUpperCase().trim(),
        barcode: formData.barcode.trim() || `NOBARCODE-${formData.sku.toUpperCase()}`,
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        discountedPrice: formData.discountedPrice === "" ? null : Number(formData.discountedPrice),
        stock: Number(formData.stock),
        unit: formData.unit,
        thumbnailUrl: formData.thumbnailUrl || null,
        images: formData.images,
        specifications: formData.specifications,
        isActive: formData.isActive,
        featured: Boolean(formData.featured),
      };

      if (editingProduct) {
        await updateProduct(token, editingProduct._id, payload);
        setSuccess("Product updated successfully.");
      } else {
        await createProduct(token, payload);
        setSuccess("Product created successfully.");
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.message || "Failed to save product.");
    }
  }

  async function handleToggleFeatured(product: Product, featured: boolean) {
    if (!token) return;

    const previousProducts = products;
    setProducts((prev) => prev.map((item) => (item._id === product._id ? { ...item, featured } : item)));
    setTogglingFeaturedId(product._id);
    setError("");
    setSuccess("");

    try {
      await updateProduct(token, product._id, { featured });
      setSuccess(`${product.name} ${featured ? "marked" : "removed"} as featured.`);
    } catch (err: any) {
      setProducts(previousProducts);
      setError(err.message || "Failed to update featured status.");
    } finally {
      setTogglingFeaturedId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!token || !productToDelete) return;
    setError("");
    setSuccess("");

    try {
      await deleteProduct(token, productToDelete._id);
      setSuccess("Product deleted successfully.");
      setIsDeleteConfirmOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (err: any) {
      setError(err.message || "Failed to delete product.");
      setIsDeleteConfirmOpen(false);
    }
  }

  async function handleBulkImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setIsBulkImporting(true);
    setBulkImportResults(null);
    setError("");

    const importFormData = new FormData();
    importFormData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bulk-import/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: importFormData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Bulk import failed");

      setBulkImportResults(data.summary);
      setSuccess(`Import complete: ${data.summary.created} created, ${data.summary.updated} updated.`);
      fetchProducts();
    } catch (err: any) {
      setError(err.message || "Bulk import failed.");
    } finally {
      setIsBulkImporting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Product Catalog</h1>
          <p className="text-sm text-muted-foreground">Manage and edit your 15,000+ building material inventory items</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="icon" onClick={fetchProducts} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" onClick={() => setIsBulkModalOpen(true)} className="gap-2">
            <FileSpreadsheet className="h-4 w-4" /> Bulk Import
          </Button>
          <Button onClick={handleAddClick} className="gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-600/15 text-green-500 p-3 rounded-md mb-4 text-sm">{success}</div>}

      {/* Filter and search bar */}
      <Card className="mb-6 bg-card/60">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedBrandFilter}
                onChange={(e) => setSelectedBrandFilter(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Button type="submit" className="w-full" variant="secondary">
                Apply Filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground text-sm">Loading products catalog...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No products found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium bg-secondary/10">
                    <th className="py-3.5 px-4 w-16">Preview</th>
                    <th className="py-3.5 px-4">Name / Sku</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Brand</th>
                    <th className="py-3.5 px-4">Cost Price</th>
                    <th className="py-3.5 px-4">Selling Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Featured</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-secondary/40 transition-colors">
                      <td className="py-3 px-4">
                        {product.thumbnailUrl ? (
                          <img
                            src={product.thumbnailUrl}
                            alt={product.name}
                            className="h-10 w-10 object-cover bg-zinc-900 rounded border border-zinc-800"
                          />
                        ) : (
                          <div className="h-10 w-10 bg-zinc-900 rounded border border-zinc-850 flex items-center justify-center text-muted-foreground">
                            No image
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-sm leading-tight text-white">{product.name}</p>
                        <span className="text-[11px] font-mono text-muted-foreground uppercase">{product.sku}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs">
                          {typeof product.category === "object" ? product.category?.name : "-"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs">
                          {typeof product.brand === "object" ? product.brand?.name : "-"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">AED {product.costPrice || 0}</td>
                      <td className="py-3 px-4 font-semibold">
                        {product.discountedPrice ? (
                          <div>
                            <span className="line-through text-xs text-muted-foreground mr-1.5">
                              AED {product.sellingPrice}
                            </span>
                            <span className="text-gold">AED {product.discountedPrice}</span>
                          </div>
                        ) : (
                          `AED ${product.sellingPrice}`
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-white">{product.stock ?? 0}</span>
                          <Badge
                            variant={
                              Number(product.stock ?? 0) === 0
                                ? "destructive"
                                : Number(product.stock ?? 0) < 10
                                  ? "secondary"
                                  : "default"
                            }
                            className="w-fit"
                          >
                            {Number(product.stock ?? 0) === 0
                              ? "Out of Stock"
                              : Number(product.stock ?? 0) < 10
                                ? "Low Stock"
                                : "In Stock"}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={product.isActive !== false ? "default" : "secondary"}>
                          {product.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={Boolean(product.featured)}
                            disabled={togglingFeaturedId === product._id}
                            onChange={(e) => handleToggleFeatured(product, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary"
                          />
                          {togglingFeaturedId === product._id ? "Updating..." : Boolean(product.featured) ? "Yes" : "No"}
                        </label>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(product)}
                            title="Edit Product"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(product)}
                            title="Delete Product"
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

      {/* Pagination controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">
            Showing Page {pagination.page} of {pagination.totalPages} ({pagination.total} items total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Product Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card border border-border w-full max-w-2xl rounded-lg shadow-lg overflow-hidden animate-in fade-in duration-150 my-8">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-semibold text-lg">{editingProduct ? "Edit Product" : "Add Product"}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[80vh]">
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" value={formData.name} onChange={handleNameChange} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="sku">SKU Code</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData((p) => ({ ...p, sku: e.target.value }))}
                      placeholder="e.g. FST-M8-50"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) => setFormData((p) => ({ ...p, barcode: e.target.value }))}
                      placeholder="e.g. 629XXXX"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="unit">Sales Unit</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData((p) => ({ ...p, unit: e.target.value }))}
                      placeholder="e.g. piece, box, kg"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="brand">Brand</Label>
                    <select
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData((p) => ({ ...p, brand: e.target.value }))}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      required
                    >
                      {brands.map((b) => (
                        <option key={b._id} value={b._id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="costPrice">Cost Price (AED)</Label>
                    <Input
                      type="number"
                      id="costPrice"
                      step="0.01"
                      min="0"
                      value={formData.costPrice}
                      onChange={(e) => setFormData((p) => ({ ...p, costPrice: Number(e.target.value) }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="sellingPrice">Selling Price (AED)</Label>
                    <Input
                      type="number"
                      id="sellingPrice"
                      step="0.01"
                      min="0"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData((p) => ({ ...p, sellingPrice: Number(e.target.value) }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="discountedPrice">Sale Price (Optional)</Label>
                    <Input
                      type="number"
                      id="discountedPrice"
                      step="0.01"
                      min="0"
                      value={formData.discountedPrice}
                      onChange={(e) => setFormData((p) => ({ ...p, discountedPrice: e.target.value }))}
                      placeholder="None"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      type="number"
                      id="stock"
                      min="0"
                      step="1"
                      value={formData.stock}
                      onChange={(e) => setFormData((p) => ({ ...p, stock: Number(e.target.value) }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    className="w-full p-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Provide details about dimensions, load capacity, applications..."
                  />
                </div>

                {/* Specs Section */}
                <div className="space-y-3 border-t border-border pt-4">
                  <h4 className="font-semibold text-sm text-white">Technical Specifications</h4>
                  <div className="flex gap-2">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Feature (e.g. Size)"
                        value={newSpec.key}
                        onChange={(e) => setNewSpec((p) => ({ ...p, key: e.target.value }))}
                      />
                      <Input
                        placeholder="Value (e.g. M8 x 50mm)"
                        value={newSpec.value}
                        onChange={(e) => setNewSpec((p) => ({ ...p, value: e.target.value }))}
                      />
                    </div>
                    <Button type="button" variant="secondary" onClick={addSpecification} size="icon">
                      <PlusCircle className="h-5 w-5" />
                    </Button>
                  </div>
                  {formData.specifications.length > 0 && (
                    <div className="bg-secondary/20 p-3 rounded-md space-y-1.5">
                      {formData.specifications.map((spec, i) => (
                        <div key={i} className="flex justify-between items-center text-xs bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5">
                          <span className="font-bold">{spec.key}:</span>
                          <div className="flex items-center gap-2">
                            <span>{spec.value}</span>
                            <button
                              type="button"
                              onClick={() => removeSpecification(i)}
                              className="text-destructive hover:scale-110"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Images Upload */}
                <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
                  <div className="space-y-2">
                    <Label>Product Thumbnail</Label>
                    <div className="flex items-center gap-3">
                      {formData.thumbnailUrl && (
                        <img
                          src={formData.thumbnailUrl}
                          alt="Thumbnail"
                          className="h-10 w-10 object-cover bg-zinc-900 border rounded"
                        />
                      )}
                      <div className="flex-1">
                        <Input
                          type="file"
                          id="thumbnailUpload"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, true)}
                          className="hidden"
                        />
                        <Label
                          htmlFor="thumbnailUpload"
                          className="flex items-center justify-center gap-2 border border-input rounded-md h-10 px-3 cursor-pointer hover:bg-secondary text-xs"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          {isUploading ? "Uploading..." : "Upload Thumbnail"}
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Gallery Images</Label>
                    <Input
                      type="file"
                      id="galleryUpload"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                    />
                    <Label
                      htmlFor="galleryUpload"
                      className="flex items-center justify-center gap-2 border border-input rounded-md h-10 px-3 cursor-pointer hover:bg-secondary text-xs"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Add Gallery Image
                    </Label>
                  </div>
                </div>

                {formData.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto py-1">
                    {formData.images.map((img, i) => (
                      <div key={i} className="relative group shrink-0">
                        <img
                          src={img}
                          alt="Gallery"
                          className="h-12 w-12 object-cover bg-zinc-900 border rounded"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                          className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                        >
                          <X className="h-2 w-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-primary"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">Active in Catalog (Visible to clients)</Label>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={Boolean(formData.featured)}
                    onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-primary"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">Featured Product (Shown on homepage)</Label>
                </div>
              </div>
              <div className="p-4 border-t border-border flex justify-end gap-2 bg-secondary/20">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {editingProduct ? "Save Changes" : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-lg shadow-lg overflow-hidden animate-in fade-in duration-150">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-semibold text-lg">Bulk Import Products</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsBulkModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload a spreadsheet (Excel `.xlsx` or CSV `.csv`) to import products in bulk.
                Make sure headers match: <code>name</code>, <code>slug</code>, <code>sku</code>, <code>category</code>, <code>brand</code>, <code>costPrice</code>, <code>sellingPrice</code>, <code>unit</code>.
              </p>
              <div className="relative border-2 border-dashed border-zinc-800 rounded-lg p-6 flex flex-col items-center justify-center">
                <Input
                  type="file"
                  id="bulkFile"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleBulkImport}
                  className="hidden"
                />
                <FileSpreadsheet className="h-8 w-8 text-gold mb-2" />
                <Label
                  htmlFor="bulkFile"
                  className="flex items-center justify-center gap-2 border border-input rounded-md h-10 px-4 cursor-pointer hover:bg-secondary text-sm font-medium"
                >
                  {isBulkImporting ? "Importing file..." : "Choose Spreadsheet File"}
                </Label>
              </div>
              {bulkImportResults && (
                <div className="bg-secondary/30 p-4 rounded border text-xs space-y-1">
                  <p className="font-bold text-white mb-1">Import Summary:</p>
                  <p>Total Processed Rows: {bulkImportResults.totalRows || 0}</p>
                  <p className="text-emerald-500">Created: {bulkImportResults.created || 0}</p>
                  <p className="text-blue-400">Updated: {bulkImportResults.updated || 0}</p>
                  <p className="text-red-500">Failed: {bulkImportResults.failed || 0}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card border border-border w-full max-w-sm rounded-lg shadow-lg overflow-hidden animate-in fade-in duration-150">
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">Delete Product</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This will permanently erase it from the product listings database.
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

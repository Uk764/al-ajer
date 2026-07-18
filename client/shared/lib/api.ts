const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  barcode: string;
  description: string;
  sellingPrice: number;
  costPrice?: number;
  discountedPrice: number | null;
  thumbnailUrl: string | null;
  images: string[];
  unit: string;
  specifications: { key: string; value: string }[];
  isActive?: boolean;
  createdAt: string;
  category: { _id: string; name: string; slug: string };
  brand: { _id: string; name: string; slug: string };
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getProducts(params?: {
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  page?: number;
  inStock?: boolean;
  onSale?: boolean;
  all?: boolean;
}): Promise<ProductsResponse> {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.category) query.set("category", params.category);
  if (params?.brand) query.set("brand", params.brand);
  if (params?.minPrice) query.set("minPrice", params.minPrice.toString());
  if (params?.maxPrice) query.set("maxPrice", params.maxPrice.toString());
  if (params?.search) query.set("search", params.search);
  if (params?.sort) query.set("sort", params.sort);
  if (params?.page) query.set("page", params.page.toString());
  if (params?.inStock) query.set("inStock", "true");
  if (params?.onSale) query.set("onSale", "true");
  if (params?.all) query.set("all", "true");

  const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_BASE_URL}/products/slug/${slug}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch product");

  return res.json();
}

export async function getProductByIdAdmin(token: string, id: string): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function createProduct(token: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create product");
  }
  return res.json();
}

export async function updateProduct(token: string, id: string, data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update product");
  }
  return res.json();
}

export async function deleteProduct(token: string, id: string) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete product");
  }
  return res.json();
}

// Category Types & API
export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: { _id: string; name: string; slug: string } | null;
  isActive?: boolean;
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/categories`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json();
}

export async function createCategory(token: string, data: Record<string, unknown>): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create category");
  }
  return res.json();
}

export async function updateCategory(token: string, id: string, data: Record<string, unknown>): Promise<Category> {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update category");
  }
  return res.json();
}

export async function deleteCategory(token: string, id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete category");
  }
  return res.json();
}

// Brand Types & API
export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  isActive?: boolean;
}

export async function getBrands(): Promise<Brand[]> {
  const res = await fetch(`${API_BASE_URL}/brands`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch brands");
  return res.json();
}

export async function createBrand(token: string, data: Record<string, unknown>): Promise<Brand> {
  const res = await fetch(`${API_BASE_URL}/brands`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create brand");
  }
  return res.json();
}

export async function updateBrand(token: string, id: string, data: Record<string, unknown>): Promise<Brand> {
  const res = await fetch(`${API_BASE_URL}/brands/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update brand");
  }
  return res.json();
}

export async function deleteBrand(token: string, id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/brands/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete brand");
  }
  return res.json();
}

// Branch Types & API
export interface Branch {
  _id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  isActive: boolean;
}

export async function getBranches(): Promise<Branch[]> {
  const res = await fetch(`${API_BASE_URL}/branches`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch branches");
  return res.json();
}

export async function createBranch(token: string, data: Record<string, unknown>): Promise<Branch> {
  const res = await fetch(`${API_BASE_URL}/branches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create branch");
  }
  return res.json();
}

export async function updateBranch(token: string, id: string, data: Record<string, unknown>): Promise<Branch> {
  const res = await fetch(`${API_BASE_URL}/branches/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update branch");
  }
  return res.json();
}

export async function deleteBranch(token: string, id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/branches/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete branch");
  }
  return res.json();
}

// Inventory Types & API
export interface InventoryRecord {
  _id: string;
  product: { _id: string; name: string; sku: string; sellingPrice: number; unit?: string } | null;
  branch: { _id: string; name: string; code: string } | null;
  quantity: number;
  reorderLevel: number;
}

export async function getInventoryByProduct(productId: string): Promise<InventoryRecord[]> {
  const res = await fetch(`${API_BASE_URL}/inventory/product/${productId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
}

export async function getAllInventory(token: string): Promise<InventoryRecord[]> {
  const res = await fetch(`${API_BASE_URL}/inventory`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch all inventory");
  return res.json();
}

export async function upsertInventory(token: string, data: Record<string, unknown>): Promise<InventoryRecord> {
  const res = await fetch(`${API_BASE_URL}/inventory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update inventory");
  }
  return res.json();
}

export async function deleteInventoryRecord(token: string, id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/inventory/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete inventory record");
  }
  return res.json();
}

// Customer & Staff Types & API
export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}

export async function getCustomers(token: string): Promise<AdminUser[]> {
  const res = await fetch(`${API_BASE_URL}/auth/customers`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}

export async function getStaff(token: string): Promise<AdminUser[]> {
  const res = await fetch(`${API_BASE_URL}/auth/staff`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch staff members");
  return res.json();
}

export async function createStaff(token: string, data: Record<string, unknown>): Promise<AdminUser> {
  const res = await fetch(`${API_BASE_URL}/auth/staff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create staff member");
  }
  return res.json();
}

export async function updateAdminUser(token: string, id: string, data: Record<string, unknown>): Promise<AdminUser> {
  const res = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update user");
  }
  return res.json();
}

export async function deleteAdminUser(token: string, id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete user");
  }
  return res.json();
}

// Coupon Types & API
export interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
}

export async function getCoupons(token: string): Promise<Coupon[]> {
  const res = await fetch(`${API_BASE_URL}/coupons`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch coupons");
  return res.json();
}

export async function createCoupon(token: string, data: Record<string, unknown>): Promise<Coupon> {
  const res = await fetch(`${API_BASE_URL}/coupons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create coupon");
  }
  return res.json();
}

export async function updateCoupon(token: string, id: string, data: Record<string, unknown>): Promise<Coupon> {
  const res = await fetch(`${API_BASE_URL}/coupons/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update coupon");
  }
  return res.json();
}

export async function deleteCoupon(token: string, id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/coupons/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete coupon");
  }
  return res.json();
}

// Banner Types & API
export interface Banner {
  _id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export async function getBanners(token?: string): Promise<Banner[]> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/banners`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch banners");
  return res.json();
}

export async function createBanner(token: string, data: Record<string, unknown>): Promise<Banner> {
  const res = await fetch(`${API_BASE_URL}/banners`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create banner");
  }
  return res.json();
}

export async function updateBanner(token: string, id: string, data: Record<string, unknown>): Promise<Banner> {
  const res = await fetch(`${API_BASE_URL}/banners/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update banner");
  }
  return res.json();
}

export async function deleteBanner(token: string, id: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/banners/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete banner");
  }
  return res.json();
}

// Order Types & Admin API
export interface AdminOrder {
  _id: string;
  user: { _id: string; name: string; email: string };
  items: { product: string; name: string; price: number; quantity: number }[];
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAllOrdersAdmin(token: string): Promise<AdminOrder[]> {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch all orders");
  return res.json();
}

export async function updateOrderStatusAdmin(
  token: string,
  id: string,
  status: string
): Promise<AdminOrder> {
  const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update order status");
  }
  return res.json();
}

// Report Types & API
export interface ReportSummaryResponse {
  summary: {
    totalSales: number;
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    averageOrderValue: number;
    lowStockCount: number;
    totalCustomers: number;
    totalProducts: number;
  };
  recentOrders: {
    _id: string;
    user: { name: string; email: string };
    totalAmount: number;
    status: string;
    createdAt: string;
  }[];
  salesByCategory: { name: string; value: number }[];
  topProducts: { name: string; quantity: number; revenue: number }[];
  salesTrend: { date: string; amount: number }[];
}

export async function getReportSummary(token: string): Promise<ReportSummaryResponse> {
  const res = await fetch(`${API_BASE_URL}/reports/summary`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch report summary");
  return res.json();
}
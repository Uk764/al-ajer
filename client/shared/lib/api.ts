const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  barcode: string;
  description: string;
  sellingPrice: number;
  discountedPrice: number | null;
  thumbnailUrl: string | null;
  images: string[];
  unit: string;
  specifications: { key: string; value: string }[];
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

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE_URL}/categories`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json();
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
}

export async function getBrands(): Promise<Brand[]> {
  const res = await fetch(`${API_BASE_URL}/brands`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch brands");
  return res.json();
}

export interface InventoryRecord {
  _id: string;
  quantity: number;
  branch: { _id: string; name: string; code: string };
}

export async function getInventoryByProduct(productId: string): Promise<InventoryRecord[]> {
  const res = await fetch(`${API_BASE_URL}/inventory/product/${productId}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch inventory");

  return res.json();
}

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
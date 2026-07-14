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
  sort?: string;
  page?: number;
}): Promise<ProductsResponse> {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.category) query.set("category", params.category);
  if (params?.sort) query.set("sort", params.sort);
  if (params?.page) query.set("page", params.page.toString());

  const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
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

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(`${API_BASE_URL}/products/slug/${slug}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch product");

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
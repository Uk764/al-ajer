const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  sellingPrice: number;
  discountedPrice: number | null;
  thumbnailUrl: string | null;
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

export async function getProducts(params?: { limit?: number }): Promise<ProductsResponse> {
  const query = params?.limit ? `?limit=${params.limit}` : "";
  const res = await fetch(`${API_BASE_URL}/products${query}`, {
    cache: "no-store", // always fetch fresh data, don't use Next.js's cache — important since stock/prices change
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
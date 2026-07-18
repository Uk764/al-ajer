import { getProductBySlug, getInventoryByProduct, getProducts } from "@/shared/lib/api";
import ProductDetailsClient from "@/customer/components/ProductDetailsClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch inventory and related products in parallel
  const [inventory, relatedProductsData] = await Promise.all([
    getInventoryByProduct(product._id).catch(() => []),
    getProducts({ category: product.category._id, limit: 6 }).catch(() => ({
      products: [],
      pagination: { total: 0, page: 1, limit: 6, totalPages: 1 },
    })),
  ]);

  // Filter out the current product from related products list
  const relatedProducts = relatedProductsData.products
    .filter((p) => p._id !== product._id)
    .slice(0, 5);

  return (
    <ProductDetailsClient
      product={product}
      inventory={inventory}
      relatedProducts={relatedProducts}
    />
  );
}
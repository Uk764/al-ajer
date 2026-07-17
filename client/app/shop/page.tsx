import { getProducts, getCategories, getBrands } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import SortControl from "@/components/SortControl";
import ShopFilters from "@/components/ShopFilters";
import AddToCartButton from "@/components/AddToCartButton";
import { Heart } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

function isNew(createdAt: string) {
  const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return days < 14;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const { category, brand, minPrice, maxPrice, sort, page } = await searchParams;

  const [productsData, categories, brands] = await Promise.all([
    getProducts({
      category,
      brand,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sort,
      page: page ? parseInt(page) : 1,
      limit: 12,
    }),
    getCategories(),
    getBrands(),
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">All Products</h1>
          <p className="text-sm text-muted-foreground">
            {productsData.pagination.total} products
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <ShopFilters categories={categories} brands={brands} />

          <div className="flex-1">
            <div className="flex justify-end mb-4">
              <SortControl />
            </div>

            {productsData.products.length === 0 ? (
              <p className="text-muted-foreground text-center py-20">
                No products match these filters.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {productsData.products.map((product) => (
                  <Card
                    key={product._id}
                    className="hover:border-primary transition-colors h-full flex flex-col overflow-hidden"
                  >
                    <div className="relative">
                      <Link href={`/products/${product.slug}`}>
                        <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                          {product.thumbnailUrl ? (
                            <Image
                              src={product.thumbnailUrl}
                              alt={product.name}
                              width={200}
                              height={200}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              No image
                            </span>
                          )}
                        </div>
                      </Link>
                      {product.discountedPrice ? (
                        <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground border-0">
                          Sale
                        </Badge>
                      ) : (
                        isNew(product.createdAt) && (
                          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground border-0">
                            New
                          </Badge>
                        )
                      )}
                      <button
                        aria-label="Add to wishlist"
                        className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80 flex items-center justify-center hover:text-primary"
                      >
                        <Heart className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <Link href={`/products/${product.slug}`}>
                      <CardContent className="p-3 pb-1">
                        <Badge variant="secondary" className="mb-1.5 text-[10px]">
                          {product.brand.name}
                        </Badge>
                        <h3 className="font-medium text-xs line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="mt-1.5 font-bold text-primary text-sm">
                          AED {product.discountedPrice ?? product.sellingPrice}
                        </p>
                      </CardContent>
                    </Link>
                    <CardContent className="pt-1 pb-3 px-3 mt-auto">
                      <AddToCartButton productId={product._id} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {productsData.pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from(
                  { length: productsData.pagination.totalPages },
                  (_, i) => i + 1
                ).map((p) => (
                  <span
                    key={p}
                    className={`px-3 py-1.5 rounded-md text-sm border ${
                      p === (page ? parseInt(page) : 1)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
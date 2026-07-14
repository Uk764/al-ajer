import { getProducts, getCategories } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import SortControl from "@/components/SortControl";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { sort, page } = await searchParams;

  const categories = await getCategories();
  const currentCategory = categories.find((c) => c.slug === slug);

  if (!currentCategory) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <Link href="/" className="text-primary underline mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const productsData = await getProducts({
    category: currentCategory._id,
    sort,
    page: page ? parseInt(page) : 1,
    limit: 12,
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header row: category name + sort control */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">{currentCategory.name}</h1>
            <p className="text-sm text-muted-foreground">
              {productsData.pagination.total} products
            </p>
          </div>
          <SortControl />
        </div>

        {/* Product grid */}
        {productsData.products.length === 0 ? (
          <p className="text-muted-foreground text-center py-20">
            No products found in this category yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {productsData.products.map((product) => (
              <Link key={product._id} href={`/products/${product.slug}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
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
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {product.brand.name}
                    </Badge>
                    <h3 className="font-medium text-sm line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="mt-2 font-bold text-primary">
                      AED {product.sellingPrice}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination info (simple version for now) */}
        {productsData.pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: productsData.pagination.totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Link
                  key={pageNum}
                  href={`/category/${slug}?page=${pageNum}${sort ? `&sort=${sort}` : ""}`}
                  className={`px-3 py-1.5 rounded-md text-sm border ${
                    pageNum === (page ? parseInt(page) : 1)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary"
                  }`}
                >
                  {pageNum}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}
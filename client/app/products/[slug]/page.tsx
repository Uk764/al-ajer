import { getProducts, getCategories } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

export default async function Home() {
  const [productsData, categories] = await Promise.all([
    getProducts({ limit: 8 }),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-5xl font-bold text-primary tracking-wide">
            AL AJER
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Building Material Trading LLC
          </p>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
            Premium hardware, power tools, and building materials — trusted
            across 3 stores in the UAE.
          </p>
          <Button size="lg" className="mt-6">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category) => (
            <Link key={category._id} href={`/category/${category.slug}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardContent className="flex items-center justify-center py-8">
                  <span className="font-medium text-center">
                    {category.name}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {productsData.products.map((product) => (
            <Card
              key={product._id}
              className="hover:border-primary transition-colors h-full flex flex-col"
            >
              <Link href={`/products/${product.slug}`}>
                <CardContent className="p-4 pb-2">
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
              </Link>
              <CardContent className="pt-0 pb-4 px-4 mt-auto">
                <AddToCartButton productId={product._id} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
import { getProducts, getCategories } from "@/shared/lib/api";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/customer/components/AddToCartButton";
import {
  ShieldCheck,
  Wrench,
  Truck,
  Headset,
  Wallet,
  Boxes,
  Hammer,
  Zap,
  Heart,
  Phone,
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  "power-tools": Wrench,
  "hand-tools": Hammer,
  "building-material": Boxes,
  fasteners: Zap,
};

function isNew(createdAt: string) {
  const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return days < 14;
}

export default async function Home() {
  const [productsData, categories] = await Promise.all([
    getProducts({ limit: 10 }),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section
      className="relative overflow-hidden border-b border-border"
      style={{
      backgroundImage:
      "url('https://res.cloudinary.com/ypd6ye8m/image/upload/v1784295164/al-ajer/products/tw762ewjs9biyxogdqlr.png')",
    backgroundSize: "cover",
    backgroundPosition: "center left",
  }}
>
  {/* Dark overlay for text readability */}
  <div className="absolute inset-0 bg-linear-to-r from-black via-black/85 to-black/30"></div>

  <div className="relative mx-auto max-w-7xl px-4 py-24 md:py-32">
    <div className="max-w-xl">
      <p className="text-xs tracking-[0.3em] text-primary uppercase mb-4">
        Premium Quality
      </p>

      <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
        Building Materials &amp; Industrial Solutions
      </h1>

      <p className="mt-6 text-lg text-gray-300">
        Your trusted partner for fasteners, power tools, hardware and
        construction materials in the UAE.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/shop">
          <Button size="lg">
            Explore Products →
          </Button>
        </Link>

        <Link href="/contact">
          <Button size="lg" variant="outline">
            <Phone className="mr-2 h-4 w-4" />
            Contact Sales
          </Button>
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* USP strip */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          {[
            { icon: ShieldCheck, title: "Premium Quality", sub: "100% genuine products" },
            { icon: Wrench, title: "Wide Range", sub: "15,000+ products" },
            { icon: Truck, title: "Fast Delivery", sub: "Across UAE" },
            { icon: Headset, title: "Expert Support", sub: "24/7 customer support" },
            { icon: Wallet, title: "Secure Payment", sub: "100% secure checkout" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold">{item.title}</p>
                <p className="text-[11px] text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Shop <span className="text-primary">by Category</span>
          </h2>
          <Link href="/shop" className="text-sm text-primary hover:underline">
            View All Categories →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] || Boxes;
            return (
              <Link key={category._id} href={`/category/${category.slug}`}>
                <Card className="hover:border-primary transition-colors cursor-pointer overflow-hidden">
                  {/* Category photo placeholder — swap for a real image per category */}
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <Icon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <CardContent className="py-3 text-center">
                    <span className="font-medium text-xs uppercase tracking-wide">
                      {category.name}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Featured <span className="text-primary">Products</span>
          </h2>
          <Link href="/shop" className="text-sm text-primary hover:underline">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
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
                    {product.discountedPrice && (
                      <span className="ml-1.5 text-xs text-muted-foreground line-through font-normal">
                        AED {product.sellingPrice}
                      </span>
                    )}
                  </p>
                </CardContent>
              </Link>
              <CardContent className="pt-1 pb-3 px-3 mt-auto">
                <AddToCartButton productId={product._id} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
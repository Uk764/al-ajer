import { getProducts, getCategories, getBrands } from "@/shared/lib/api";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import SortControl from "@/customer/components/SortControl";
import ShopFilters from "@/customer/components/ShopFilters";
import AddToCartButton from "@/customer/components/AddToCartButton";
import {
  Heart,
  Eye,
  RefreshCw,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    inStock?: string;
    onSale?: string;
    minRating?: string;
  }>;
}

function isNew(createdAt: string) {
  const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return days < 14;
}

export default async function ShopPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    sort,
    page,
    inStock,
    onSale,
    minRating,
  } = resolvedParams;

  const currentPage = page ? parseInt(page) : 1;

  const [productsData, categories, brands] = await Promise.all([
    getProducts({
      category,
      brand,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sort,
      page: currentPage,
      limit: 12,
    }),
    getCategories(),
    getBrands(),
  ]);

  // Convert resolvedParams into a standard flat object for helper links
  const paramsMap: Record<string, string> = {};
  Object.entries(resolvedParams).forEach(([k, v]) => {
    if (v !== undefined) paramsMap[k] = v;
  });

  function getClearFilterLink(paramToRemove: string) {
    const params = new URLSearchParams();
    Object.entries(paramsMap).forEach(([k, v]) => {
      if (k !== paramToRemove && k !== "page") {
        params.set(k, v);
      }
    });
    const qs = params.toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  }

  function getPaginationLink(pageNum: number) {
    const params = new URLSearchParams();
    Object.entries(paramsMap).forEach(([k, v]) => {
      params.set(k, v);
    });
    params.set("page", String(pageNum));
    return `/shop?${params.toString()}`;
  }

  // Active filter helper details
  const activeCategoryObj = categories.find((c) => c._id === category);
  const activeBrandObj = brands.find((b) => b._id === brand);

  const activeFilters = [
    activeCategoryObj ? { label: `Category: ${activeCategoryObj.name}`, key: "category" } : null,
    activeBrandObj ? { label: `Brand: ${activeBrandObj.name}`, key: "brand" } : null,
    minPrice ? { label: `Min: AED ${minPrice}`, key: "minPrice" } : null,
    maxPrice ? { label: `Max: AED ${maxPrice}`, key: "maxPrice" } : null,
    inStock === "true" ? { label: "In Stock Only", key: "inStock" } : null,
    onSale === "true" ? { label: "On Sale Offers", key: "onSale" } : null,
    minRating ? { label: `${minRating} Stars & Up`, key: "minRating" } : null,
  ].filter(Boolean) as { label: string; key: string }[];

  return (
    <main className="min-h-screen bg-[#070707] text-[#f5f5f5] font-sans">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Page title and counts */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wider text-white">
              Shop <span className="text-gold">Catalog</span>
            </h1>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest mt-1">
              Showing {productsData.products.length} of {productsData.pagination.total} products
            </p>
          </div>

          <div className="flex items-center gap-3">
            <SortControl />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <ShopFilters categories={categories} brands={brands} />

          {/* Product Listing Section */}
          <div className="flex-1 space-y-6">
            {/* Active Filters Tag Strip */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 bg-[#0c0c0c] border border-zinc-900 rounded-lg p-3 px-4">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mr-2 flex items-center gap-1.5">
                  <Filter className="h-3 w-3 text-gold" />
                  Active:
                </span>
                {activeFilters.map((f) => (
                  <Link
                    key={f.key}
                    href={getClearFilterLink(f.key)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161616] border border-zinc-800 text-[10px] text-zinc-300 font-bold uppercase tracking-wider hover:text-gold hover:border-gold/40 transition-colors"
                  >
                    {f.label}
                    <X className="h-2.5 w-2.5 text-zinc-500 hover:text-gold" />
                  </Link>
                ))}
                <Link
                  href="/shop"
                  className="text-[10px] uppercase font-bold tracking-widest text-gold hover:text-gold-hover ml-auto"
                >
                  Clear All
                </Link>
              </div>
            )}

            {/* Product Cards List */}
            {productsData.products.length === 0 ? (
              <div className="text-center py-24 bg-[#0c0c0c] border border-zinc-900 rounded-lg">
                <X className="h-10 w-10 text-gold mx-auto mb-4 animate-bounce" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">No Products Found</h3>
                <p className="text-zinc-500 text-xs mt-2 max-w-xs mx-auto">
                  We couldn't find any products matching those filters. Try adjusting your selections or clear all filters.
                </p>
                <Link href="/shop">
                  <Badge className="bg-gold hover:bg-gold-hover text-black px-4 py-1.5 mt-6 uppercase font-bold tracking-wider text-[10px] cursor-pointer">
                    Clear Filters
                  </Badge>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {productsData.products.map((product) => (
                  <Card
                    key={product._id}
                    className="group hover:border-gold/60 border-zinc-900 bg-[#0c0c0c] hover:bg-[#111111] hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 h-full flex flex-col overflow-hidden rounded-lg"
                  >
                    {/* Image Container with Actions */}
                    <div className="relative aspect-square bg-[#161616] overflow-hidden">
                      <Link href={`/products/${product.slug}`} className="block w-full h-full">
                        <div className="relative w-full h-full p-4 flex items-center justify-center">
                          {product.thumbnailUrl ? (
                            <Image
                              src={product.thumbnailUrl}
                              alt={product.name}
                              width={220}
                              height={220}
                              className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <span className="text-zinc-600 text-xs uppercase tracking-widest font-semibold">
                              No Image
                            </span>
                          )}
                        </div>
                      </Link>

                      {/* Status Badges */}
                      {product.discountedPrice ? (
                        <Badge className="absolute top-3 left-3 bg-[#e53e3e] text-white hover:bg-[#e53e3e] text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border-0 shadow-md">
                          Sale
                        </Badge>
                      ) : (
                        isNew(product.createdAt) && (
                          <Badge className="absolute top-3 left-3 bg-gold text-black hover:bg-gold text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border-0 shadow-md">
                            New
                          </Badge>
                        )
                      )}

                      {/* Quick Actions (Wishlist, Compare, Quick View) */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1.5 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          aria-label="Add to wishlist"
                          className="h-8 w-8 rounded-full bg-black/80 hover:bg-gold hover:text-black text-gold flex items-center justify-center shadow-lg transition-colors border border-zinc-800 cursor-pointer"
                        >
                          <Heart className="h-3.5 w-3.5" />
                        </button>
                        <button
                          aria-label="Quick view"
                          className="h-8 w-8 rounded-full bg-black/80 hover:bg-gold hover:text-black text-gold flex items-center justify-center shadow-lg transition-colors border border-zinc-800 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          aria-label="Compare"
                          className="h-8 w-8 rounded-full bg-black/80 hover:bg-gold hover:text-black text-gold flex items-center justify-center shadow-lg transition-colors border border-zinc-800 cursor-pointer"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Product Metadata & Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate max-w-[90px]">
                          {product.brand.name}
                        </span>

                        {/* Stars */}
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="h-2.5 w-2.5 fill-gold text-gold" />
                          ))}
                        </div>
                      </div>

                      <Link href={`/products/${product.slug}`} className="block">
                        <h3 className="font-bold text-xs line-clamp-2 text-zinc-200 hover:text-gold transition-colors duration-200 leading-tight">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mt-auto pt-4">
                        <p className="font-extrabold text-gold text-sm flex items-center">
                          AED {product.discountedPrice ?? product.sellingPrice}
                          {product.discountedPrice && (
                            <span className="ml-2 text-[10px] text-zinc-500 line-through font-normal">
                              AED {product.sellingPrice}
                            </span>
                          )}
                        </p>

                        <div className="mt-3">
                          <AddToCartButton productId={product._id} />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Premium Pagination */}
            {productsData.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 border-t border-zinc-900 pt-8 mt-12">
                {/* Previous Page Button */}
                {currentPage > 1 ? (
                  <Link
                    href={getPaginationLink(currentPage - 1)}
                    className="h-9 w-9 rounded border border-zinc-800 text-zinc-400 hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="h-9 w-9 rounded border border-zinc-900 text-zinc-700 flex items-center justify-center cursor-not-allowed">
                    <ChevronLeft className="h-4 w-4" />
                  </span>
                )}

                {/* Page Number List */}
                {Array.from(
                  { length: productsData.pagination.totalPages },
                  (_, i) => i + 1
                ).map((p) => {
                  const isCurrent = p === currentPage;
                  return (
                    <Link
                      key={p}
                      href={getPaginationLink(p)}
                      className={`h-9 w-9 rounded text-xs font-bold flex items-center justify-center transition-all duration-200 border ${
                        isCurrent
                          ? "bg-gold text-black border-gold shadow-md shadow-gold/20"
                          : "border-zinc-800 text-zinc-400 bg-transparent hover:border-gold/60 hover:text-gold"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}

                {/* Next Page Button */}
                {currentPage < productsData.pagination.totalPages ? (
                  <Link
                    href={getPaginationLink(currentPage + 1)}
                    className="h-9 w-9 rounded border border-zinc-800 text-zinc-400 hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="h-9 w-9 rounded border border-zinc-900 text-zinc-700 flex items-center justify-center cursor-not-allowed">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
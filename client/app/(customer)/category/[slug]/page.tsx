import { getProducts, getCategories, getBrands } from "@/shared/lib/api";
import Link from "next/link";
import SortControl from "@/customer/components/SortControl";
import ShopFilters from "@/customer/components/ShopFilters";
import ProductCard from "@/customer/components/ProductCard";
import { X, ChevronLeft, ChevronRight, Filter } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    inStock?: string;
    onSale?: string;
    minRating?: string;
    search?: string;
  }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedParams = await searchParams;
  const {
    brand,
    minPrice,
    maxPrice,
    sort,
    page,
    inStock,
    onSale,
    minRating,
    search,
  } = resolvedParams;

  const currentPage = page ? parseInt(page) : 1;

  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands(),
  ]);

  const currentCategory = categories.find((c) => c.slug === slug);

  if (!currentCategory) {
    return (
      <main className="min-h-screen bg-[#070707] text-[#f5f5f5] flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <X className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">Category Not Found</h1>
          <Link href="/categories" className="inline-block text-gold hover:underline uppercase text-xs font-bold tracking-widest">
            Back to Categories
          </Link>
        </div>
      </main>
    );
  }

  // Fetch products under this category
  const productsData = await getProducts({
    category: currentCategory._id,
    brand,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    sort,
    page: currentPage,
    limit: 12,
    search,
    inStock: inStock === "true",
    onSale: onSale === "true",
  });

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
    return `/category/${slug}${qs ? `?${qs}` : ""}`;
  }

  function getPaginationLink(pageNum: number) {
    const params = new URLSearchParams();
    Object.entries(paramsMap).forEach(([k, v]) => {
      params.set(k, v);
    });
    params.set("page", String(pageNum));
    return `/category/${slug}?${params.toString()}`;
  }

  // Active filter helper details
  const activeBrandObj = brands.find((b) => b._id === brand);

  const activeFilters = [
    search ? { label: `Search: "${search}"`, key: "search" } : null,
    activeBrandObj ? { label: `Brand: ${activeBrandObj.name}`, key: "brand" } : null,
    minPrice ? { label: `Min: AED ${minPrice}`, key: "minPrice" } : null,
    maxPrice ? { label: `Max: AED ${maxPrice}`, key: "maxPrice" } : null,
    inStock === "true" ? { label: "In Stock Only", key: "inStock" } : null,
    onSale === "true" ? { label: "On Sale Offers", key: "onSale" } : null,
    minRating ? { label: `${minRating} Stars & Up`, key: "minRating" } : null,
  ].filter(Boolean) as { label: string; key: string }[];

  return (
    <main className="min-h-screen bg-[#070707] text-[#f5f5f5] font-sans pb-20">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Page title and counts */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wider text-white">
              {currentCategory.name}
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
          <ShopFilters categories={categories} brands={brands} hideCategoryFilter={true} />

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
                  href={`/category/${slug}`}
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
                <Link href={`/category/${slug}`}>
                  <span className="inline-block bg-gold hover:bg-gold-hover text-black px-4 py-1.5 mt-6 uppercase font-bold tracking-wider text-[10px] cursor-pointer rounded">
                    Clear Filters
                  </span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {productsData.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Premium Pagination */}
            {productsData.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 border-t border-zinc-900 pt-8 mt-12">
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
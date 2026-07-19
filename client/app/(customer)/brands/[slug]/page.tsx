import { getBrands, getProducts } from "@/shared/lib/api";
import Link from "next/link";
import ProductCard from "@/customer/components/ProductCard";
import SortControl from "@/customer/components/SortControl";
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}

const brandDetails: Record<string, { desc: string; tagline: string; themeClass: string; titleStyle: string }> = {
  "bosch": {
    desc: "Renowned for engineering excellence and innovation. Bosch professional power tools and accessories are built to meet the highest standards in speed, precision, and durability.",
    tagline: "INVENTED FOR LIFE & ENGINEERED FOR PROFESSIONALS",
    themeClass: "border-blue-500/20 shadow-blue-500/5",
    titleStyle: "font-sans font-bold tracking-wide italic text-zinc-100",
  },
  "dewalt": {
    desc: "Guaranteed Tough. DeWalt is a leading manufacturer of industrial power tools and hand tools, designed for extreme durability in heavy-duty commercial construction environments.",
    tagline: "GUARANTEED TOUGH. BUILT FOR THE JOBSITE.",
    themeClass: "border-yellow-500/20 shadow-yellow-500/5",
    titleStyle: "font-sans font-black italic text-yellow-500",
  },
  "makita": {
    desc: "A global manufacturer of industrial quality power tools. Makita delivers lightweight, high-performance cordless tooling systems utilizing advanced brushless motor technology.",
    tagline: "ADVANCED CORDLESS SYSTEMS FOR GREATER EFFICIENCY",
    themeClass: "border-teal-400/20 shadow-teal-400/5",
    titleStyle: "font-serif tracking-widest font-black text-teal-400",
  },
  "milwaukee": {
    desc: "Industry-leading heavy-duty power tools and accessories. Milwaukee specializes in professional trade-focused solutions, driving productivity and extreme durability.",
    tagline: "NOTHING BUT HEAVY DUTY. TRADE-FOCUSED SOLUTIONS.",
    themeClass: "border-red-600/20 shadow-red-600/5",
    titleStyle: "font-sans font-extrabold italic text-red-600 tracking-tighter",
  },
  "hilti": {
    desc: "Leading-edge technology for construction professionals. Hilti products, software, and services power the professional construction industry, specializing in anchors, drilling, and direct fastening.",
    tagline: "PROFESSIONAL ANCHOR SYSTEMS & DIRECT FASTENING SOLUTIONS",
    themeClass: "border-red-500/20 shadow-red-500/5",
    titleStyle: "font-mono tracking-tighter font-black text-red-500",
  },
  "stanley": {
    desc: "A world leader in hand tools, storage solutions, and security. Stanley is the brand professionals rely on for measuring, cutting, layout, and heavy mechanics work.",
    tagline: "PERFORMANCE HAND TOOLS. QUALITY SECURED SINCE 1843.",
    themeClass: "border-zinc-400/20 shadow-zinc-400/5",
    titleStyle: "font-sans font-black tracking-widest text-zinc-100",
  },
  "ingco": {
    desc: "Professional tools made affordable. Ingco focuses on providing high-quality tools (including hand tools, power tools, and hardware) at competitive price points.",
    tagline: "PROFESSIONAL INDUSTRIAL TOOLS MADE AFFORDABLE FOR ALL",
    themeClass: "border-amber-500/20 shadow-amber-500/5",
    titleStyle: "font-sans font-extrabold uppercase italic text-amber-500",
  },
};

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const { slug } = await params;
  const { sort, page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;

  const brands = await getBrands();
  const currentBrand = brands.find((b) => b.slug.toLowerCase() === slug.toLowerCase());

  if (!currentBrand) {
    return (
      <main className="min-h-screen bg-[#070707] text-[#f5f5f5] flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <X className="h-12 w-12 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">Brand Not Found</h1>
          <Link href="/brands" className="inline-block text-gold hover:underline uppercase text-xs font-bold tracking-widest">
            Back to Brands Catalog
          </Link>
        </div>
      </main>
    );
  }

  // Fetch products under this brand
  const productsData = await getProducts({
    brand: currentBrand._id,
    sort,
    page: currentPage,
    limit: 12,
  });

  const detail = brandDetails[currentBrand.slug.toLowerCase()] || {
    desc: `Discover the full catalog of professional products manufactured by ${currentBrand.name}, stocked and distributed by AL AJER in the UAE.`,
    tagline: "INDUSTRIAL ENGINEERING & QUALITY SOLUTIONS",
    themeClass: "border-gold/20 shadow-gold/5",
    titleStyle: "font-sans font-black uppercase text-gold",
  };

  return (
    <main className="min-h-screen bg-[#070707] text-[#f5f5f5] font-sans pb-20">
      {/* 1. Brand Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#0a0a0a] to-[#070707] border-b border-zinc-900/60 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <span className="text-[9px] tracking-[0.3em] font-extrabold text-gold uppercase mb-3.5 flex items-center justify-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            AUTHORIZED PARTNER BRAND
          </span>
          {currentBrand.logoUrl ? (
            <div className="relative h-20 w-44 mx-auto mb-4 bg-zinc-900/40 p-4 rounded-lg border border-zinc-800/80 flex items-center justify-center">
              <img
                src={currentBrand.logoUrl}
                alt={currentBrand.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ) : (
            <h1 className={`text-4xl md:text-6xl font-black uppercase tracking-wider mb-2 ${detail.titleStyle}`}>
              {currentBrand.name}
            </h1>
          )}
          <p className="text-[10px] tracking-[0.25em] font-extrabold text-zinc-500 uppercase mt-2">
            {detail.tagline}
          </p>
          <div className="w-12 h-0.5 bg-gold mx-auto mt-6"></div>
          <p className="mt-6 text-xs md:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            {detail.desc}
          </p>
        </div>
      </section>

      {/* 2. Catalog Section */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        {/* Header row with stats & sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-6 mb-8 gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300">
              Brand <span className="text-gold">Catalog</span>
            </h2>
            <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest mt-1">
              Showing {productsData.products.length} of {productsData.pagination.total} products
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SortControl />
          </div>
        </div>

        {/* Product Grid */}
        {productsData.products.length === 0 ? (
          <div className="text-center py-20 bg-[#0c0c0c] border border-zinc-900 rounded-lg">
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider">No products available for this brand yet.</p>
            <Link href="/brands" className="inline-block mt-4 text-[10px] font-extrabold uppercase tracking-widest text-gold hover:underline">
              Browse All Brands
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {productsData.products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {productsData.pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 border-t border-zinc-900 pt-8 mt-12">
            {currentPage > 1 ? (
              <Link
                href={`/brands/${slug}?page=${currentPage - 1}${sort ? `&sort=${sort}` : ""}`}
                className="h-9 w-9 rounded border border-zinc-800 text-zinc-400 hover:border-gold hover:text-gold flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <span className="h-9 w-9 rounded border border-zinc-900 text-zinc-700 flex items-center justify-center cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" />
              </span>
            )}

            {Array.from({ length: productsData.pagination.totalPages }, (_, i) => i + 1).map((p) => {
              const isCurrent = p === currentPage;
              return (
                <Link
                  key={p}
                  href={`/brands/${slug}?page=${p}${sort ? `&sort=${sort}` : ""}`}
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
                href={`/brands/${slug}?page=${currentPage + 1}${sort ? `&sort=${sort}` : ""}`}
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
      </section>
    </main>
  );
}

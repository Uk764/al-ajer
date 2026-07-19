import { getBrands, getProducts } from "@/shared/lib/api";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export const metadata = {
  title: "Brands | AL AJER Industrial Supplies",
  description: "Explore our range of premium brands including Bosch, Makita, DeWalt, Milwaukee, Stanley, and more.",
};

// Distinct design layouts for brands to match their corporate identity in the list
const brandDesigns: Record<string, { fontClass: string; bgClass: string; borderClass: string; tag: string }> = {
  "bosch": {
    fontClass: "font-sans font-bold tracking-wide italic",
    bgClass: "from-[#0c0c0c] to-[#121212]",
    borderClass: "hover:border-blue-500/40",
    tag: "German Engineering",
  },
  "dewalt": {
    fontClass: "font-sans font-black italic text-yellow-500",
    bgClass: "from-[#0d0d0a] to-[#13130f]",
    borderClass: "hover:border-yellow-500/40",
    tag: "Guaranteed Tough",
  },
  "makita": {
    fontClass: "font-serif tracking-widest font-black text-teal-400",
    bgClass: "from-[#0a0d0d] to-[#0f1414]",
    borderClass: "hover:border-teal-400/40",
    tag: "Industrial Power Tools",
  },
  "milwaukee": {
    fontClass: "font-sans font-extrabold italic text-red-600 tracking-tighter",
    bgClass: "from-[#0d0a0a] to-[#140f0f]",
    borderClass: "hover:border-red-600/40",
    tag: "Nothing but Heavy Duty",
  },
  "hilti": {
    fontClass: "font-mono tracking-tighter font-black text-red-500",
    bgClass: "from-[#0d0a0a] to-[#140f0f]",
    borderClass: "hover:border-red-500/40",
    tag: "Premium Anchor Systems",
  },
  "stanley": {
    fontClass: "font-sans font-black tracking-widest text-zinc-100",
    bgClass: "from-[#0c0c0c] to-[#161616]",
    borderClass: "hover:border-zinc-400/40",
    tag: "Performance Hand Tools",
  },
  "ingco": {
    fontClass: "font-sans font-extrabold uppercase italic text-amber-500",
    bgClass: "from-[#0d0b0a] to-[#14110f]",
    borderClass: "hover:border-amber-500/40",
    tag: "Professional Tools Made Easy",
  },
};

export default async function BrandsPage() {
  const brandsList = await getBrands();

  // Fetch product counts dynamically in parallel
  const brandsWithCounts = await Promise.all(
    brandsList.map(async (brand) => {
      try {
        const prodData = await getProducts({ brand: brand._id, limit: 1 });
        return {
          ...brand,
          productCount: prodData.pagination.total,
        };
      } catch (err) {
        console.error(`Failed to fetch count for brand ${brand.name}`, err);
        return {
          ...brand,
          productCount: 0,
        };
      }
    })
  );

  return (
    <main className="min-h-screen bg-[#070707] text-[#f5f5f5] font-sans pb-20">
      {/* 1. Header Section */}
      <section className="relative py-24 bg-gradient-to-b from-[#0a0a0a] to-[#070707] border-b border-zinc-900/60 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <span className="text-[10px] tracking-[0.3em] font-extrabold text-gold uppercase mb-3 block">
            PARTNER BRANDS
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white">
            TRUSTED <span className="text-gold">MANUFACTURERS</span>
          </h1>
          <div className="w-16 h-1 bg-gold mx-auto mt-6 rounded-full"></div>
          <p className="mt-6 text-xs md:text-sm text-zinc-400 max-w-xl mx-auto uppercase tracking-wider leading-relaxed font-semibold">
            Authorized distributor of high-performance industrial tooling, construction consumables, and electrical equipment in the UAE.
          </p>
        </div>
      </section>

      {/* 2. Brands Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brandsWithCounts.map((brand) => {
            const slugLower = brand.slug.toLowerCase();
            const design = brandDesigns[slugLower] || {
              fontClass: "font-sans font-bold tracking-wide",
              bgClass: "from-[#0c0c0c] to-[#121212]",
              borderClass: "hover:border-gold/40",
              tag: "Industrial Equipment",
            };

            return (
              <Link key={brand._id} href={`/brands/${brand.slug}`} className="group block">
                <div className={`h-full bg-gradient-to-br ${design.bgClass} border border-zinc-900 ${design.borderClass} group-hover:shadow-2xl group-hover:shadow-gold/5 transition-all duration-300 rounded-lg p-6 flex flex-col justify-between items-center text-center cursor-pointer min-h-[220px]`}>
                  {/* Brand Logo Box */}
                  <div className="w-full flex-1 flex flex-col justify-center items-center py-4 h-24 relative">
                    {brand.logoUrl ? (
                      <div className="h-16 w-full relative flex items-center justify-center filter grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 transition-all duration-300">
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="max-h-full max-w-[80%] object-contain"
                        />
                      </div>
                    ) : (
                      <span className={`text-2xl md:text-3xl select-none transition-transform duration-300 group-hover:scale-105 ${design.fontClass}`}>
                        {brand.name}
                      </span>
                    )}
                    <span className="text-[8px] font-bold text-zinc-500 tracking-[0.2em] uppercase mt-3">
                      {design.tag}
                    </span>
                  </div>

                  {/* Brand Meta Data */}
                  <div className="w-full border-t border-zinc-900/60 pt-4 flex items-center justify-between gap-2 mt-4">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-500 bg-[#161616] px-2 py-1 rounded">
                      {brand.productCount} SKUs
                    </span>
                    
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-gold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      VIEW PRODUCTS
                      <ArrowRight className="h-3 w-3 stroke-[2.5]" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

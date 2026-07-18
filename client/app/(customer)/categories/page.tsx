import { getCategories, getProducts } from "@/shared/lib/api";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Box, Shield, Wrench, Hammer, Droplets, Cpu, Boxes, Zap, ChevronRight } from "lucide-react";

// Image mapping for categories to give a highly premium visual appeal
const categoryImages: Record<string, string> = {
  "fasteners": "https://res.cloudinary.com/ypd6ye8m/image/upload/v1784295164/al-ajer/products/tw762ewjs9biyxogdqlr.png",
  "power-tools": "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600",
  "hand-tools": "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&q=80&w=600",
  "safety-equipment": "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&q=80&w=600",
  "plumbing": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600",
  "building-material": "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=600",
  "power-accessories": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=600",
  "hand-equipment": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600",
};

const categoryIcons: Record<string, any> = {
  "fasteners": Zap,
  "power-tools": Wrench,
  "hand-tools": Hammer,
  "safety-equipment": Shield,
  "plumbing": Droplets,
  "building-material": Boxes,
  "power-accessories": Cpu,
  "hand-equipment": Box,
};

// Rich presets for subcategories if there is no deep hierarchy in db
const subcategoryPresets: Record<string, string[]> = {
  "fasteners": ["Hex Bolts", "Machine Screws", "Nylon Anchors", "Washers & Nuts", "Threaded Rods"],
  "power-tools": ["Drills & Drivers", "Rotary Hammers", "Circular Saws", "Angle Grinders", "Demolition Hammers"],
  "hand-tools": ["Wrenches & Spanners", "Screwdrivers", "Pliers & Cutters", "Hammers & Mallets", "Sockets & Ratchets"],
  "safety-equipment": ["Safety Helmets", "High-Vis Vests", "Protective Gloves", "Safety Goggles", "Ear Protection"],
  "plumbing": ["Pipes & Fittings", "Valves & Cocks", "Hose Clamps", "Taps & Mixers", "Plumbing Adhesives"],
  "building-material": ["Gypsum Boards", "Steel Mesh", "Cement Products", "Waterproofing", "Plywood"],
  "power-accessories": ["Drill Bits", "Cutting Discs", "Grinding Wheels", "Sanding Belts", "Router Bits"],
};

export const metadata = {
  title: "Categories | AL AJER Industrial Supplies",
  description: "Browse our extensive categories of premium hardware, fasteners, power tools, safety gear, and construction materials.",
};

export default async function CategoriesPage() {
  const categoriesList = await getCategories();

  // Fetch product counts dynamically in parallel
  const categoriesWithCounts = await Promise.all(
    categoriesList.map(async (cat) => {
      try {
        const prodData = await getProducts({ category: cat._id, limit: 1 });
        return {
          ...cat,
          productCount: prodData.pagination.total,
        };
      } catch (err) {
        console.error(`Failed to fetch count for category ${cat.name}`, err);
        return {
          ...cat,
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
            OUR CATALOG
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white">
            EXPLORE <span className="text-gold">DEPARTMENTS</span>
          </h1>
          <div className="w-16 h-1 bg-gold mx-auto mt-6 rounded-full"></div>
          <p className="mt-6 text-xs md:text-sm text-zinc-400 max-w-xl mx-auto uppercase tracking-wider leading-relaxed font-semibold">
            Browse our full catalog of commercial and industrial materials. Over 15,000 top-tier products sourced from globally renowned brands.
          </p>
        </div>
      </section>

      {/* 2. Categories Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesWithCounts.map((category) => {
            const imageSrc = categoryImages[category.slug] || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600";
            const IconComponent = categoryIcons[category.slug] || Box;
            const subcategories = subcategoryPresets[category.slug] || ["General Supplies", "Industrial Consumables", "Accessories"];

            return (
              <div
                key={category._id}
                className="group flex flex-col justify-between bg-[#0c0c0c] border border-zinc-900 hover:border-gold/60 transition-all duration-300 rounded-xl overflow-hidden shadow-2xl hover:shadow-gold/5 h-full"
              >
                <div>
                  {/* Category Image Header */}
                  <div className="relative aspect-video w-full overflow-hidden border-b border-zinc-900/60 bg-zinc-950">
                    <Image
                      src={imageSrc}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 brightness-[0.7] group-hover:opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/40 to-transparent"></div>
                    
                    {/* Category Icon Badge floating on image */}
                    <div className="absolute bottom-4 left-4 h-10 w-10 rounded bg-black/85 border border-zinc-800 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-300">
                      <IconComponent className="h-5 w-5 stroke-[2]" />
                    </div>

                    {/* Product count badge */}
                    <div className="absolute top-4 right-4 bg-gold/10 border border-gold/30 text-gold text-[10px] font-extrabold px-3 py-1 rounded tracking-wider uppercase">
                      {category.productCount} Products
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <h2 className="text-lg font-black uppercase text-white tracking-wider group-hover:text-gold transition-colors duration-300">
                      {category.name}
                    </h2>
                    
                    {/* Subcategories list */}
                    <div className="mt-6 space-y-2.5">
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
                        Key Categories
                      </p>
                      <ul className="space-y-1.5 pt-1">
                        {subcategories.map((sub, i) => (
                          <li key={i}>
                            <Link
                              href={`/shop?category=${category._id}`}
                              className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-gold flex items-center gap-1.5 transition-colors"
                            >
                              <ChevronRight className="h-3 w-3 text-gold/60" />
                              {sub}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="p-6 pt-0 mt-4">
                  <Link href={`/shop?category=${category._id}`} className="block">
                    <button className="w-full bg-[#141414] hover:bg-gold text-zinc-300 hover:text-black font-extrabold uppercase tracking-widest text-[10px] py-3.5 rounded border border-zinc-800 hover:border-gold transition-all duration-300 flex items-center justify-center gap-2 group-hover:border-gold/40 cursor-pointer">
                      View Catalog
                      <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

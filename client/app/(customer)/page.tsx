import { getProducts, getCategories, getBanners, getBrands } from "@/shared/lib/api";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/customer/components/ProductCard";
import NewsletterForm from "@/customer/components/NewsletterForm";
import HeroSlider from "@/customer/components/HeroSlider";
import {
  ShieldCheck,
  Wrench,
  Truck,
  Headset,
  Wallet,
  Boxes,
  Hammer,
  Zap,
  ArrowRight,
  Phone,
  Sparkles,
  Shield,
  Droplets,
  Cpu,
  CheckCircle,
} from "lucide-react";

// Fallback/Preset configurations matching reference images
const categoryIcons = {
  "fasteners": Zap,
  "power-tools": Wrench,
  "hand-tools": Hammer,
  "hand-equipment": Shield,
  "safety-equipment": ShieldCheck,
  "plumbing": Droplets,
  "power-accessories": Cpu,
  "building-material": Boxes,
};

const referenceCategories = [
  { name: "Fasteners", desc: "Powerful Connectors", slug: "fasteners" },
  { name: "Power Tools", desc: "High Performance", slug: "power-tools" },
  { name: "Hand Tools", desc: "High Performance", slug: "hand-tools" },
  { name: "Hand Equipment", desc: "Maximum Protection", slug: "hand-equipment" },
  { name: "Safety Equipment", desc: "Maximum Protection", slug: "safety-equipment" },
  { name: "Plumbing", desc: "Complete Systems", slug: "plumbing" },
  { name: "Power Accessories", desc: "Premium Quality", slug: "power-accessories" },
  { name: "Building Materials", desc: "Premium Quality", slug: "building-material" },
];

export default async function Home() {
  const [productsData, categories, banners, brands] = await Promise.all([
    getProducts({ limit: 10 }),
    getCategories(),
    getBanners().catch(() => []),
    getBrands().catch(() => []),
  ]);

  // Map database categories to reference categories for correct links
  const categoriesMap = new Map(categories.map((c) => [c.slug, c]));

  return (
    <main className="min-h-screen bg-[#070707] text-[#f5f5f5] overflow-x-hidden font-sans">
      {/* 1. Hero Section Slider */}
      <HeroSlider banners={banners} />

      {/* 2. Top USP Strip */}
      <section className="relative z-20 -mt-10 mx-auto max-w-7xl px-4">
        <div className="bg-[#0c0c0c] border border-zinc-900 rounded-lg py-5 px-6 shadow-2xl grid grid-cols-2 md:grid-cols-5 gap-6 divide-zinc-900 md:divide-x">
          {[
            { icon: ShieldCheck, title: "Premium Quality", sub: "100% Genuine Products" },
            { icon: Wrench, title: "Wide Range", sub: "15,000+ Products" },
            { icon: Truck, title: "Fast Delivery", sub: "Across UAE" },
            { icon: Headset, title: "Expert Support", sub: "24/7 Customer Support" },
            { icon: Wallet, title: "Secure Payment", sub: "100% Secure Checkout" },
          ].map((item, idx) => (
            <div key={item.title} className={`flex items-center gap-3.5 ${idx > 0 ? "md:pl-6" : ""}`}>
              <item.icon className="h-5 w-5 text-gold shrink-0" />
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-white leading-tight">{item.title}</p>
                <p className="text-[9px] text-zinc-500 font-medium uppercase mt-0.5 leading-none">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Shop by Category */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-zinc-900/60">
          <div className="flex items-center gap-3.5">
            <div className="h-4 w-1 bg-gold rounded-full"></div>
            <h2 className="text-lg md:text-xl font-black tracking-widest uppercase text-white">
              SHOP BY <span className="text-gold">CATEGORY</span>
            </h2>
          </div>
          <Link href="/shop" className="text-[10px] font-extrabold uppercase tracking-widest text-gold hover:text-gold-hover transition-colors flex items-center gap-1.5 group">
            View All Categories
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {referenceCategories.map((refCat) => {
            const dbCat = categoriesMap.get(refCat.slug);
            const href = dbCat ? `/shop?category=${dbCat._id}` : `/shop`;
            const IconComponent = categoryIcons[refCat.slug as keyof typeof categoryIcons] || Boxes;

            return (
              <Link key={refCat.slug} href={href}>
                <div className="group bg-[#0c0c0c] border border-zinc-900 hover:border-gold transition-all duration-300 rounded-lg p-6 flex flex-col items-center justify-center text-center h-44 cursor-pointer">
                  <div className="h-12 w-12 rounded bg-[#161616] border border-zinc-800 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all duration-300 mb-4">
                    <IconComponent className="h-5 w-5 stroke-[2]" />
                  </div>
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-white group-hover:text-gold transition-colors duration-300">
                    {refCat.name}
                  </h3>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold mt-1">
                    {refCat.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-zinc-900/60">
          <div className="flex items-center gap-3.5">
            <div className="h-4 w-1 bg-gold rounded-full"></div>
            <h2 className="text-lg md:text-xl font-black tracking-widest uppercase text-white">
              FEATURED <span className="text-gold">PRODUCTS</span>
            </h2>
          </div>
          <Link href="/shop" className="text-[10px] font-extrabold uppercase tracking-widest text-gold hover:text-gold-hover transition-colors flex items-center gap-1.5 group">
            View All Products
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {productsData.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Top Brands Showcase */}
      <section className="border-t border-b border-zinc-900 bg-[#0a0a0a] py-14 my-10">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-zinc-500 mb-10">
            TOP BRANDS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {brands.filter(b => b.isActive !== false).map((brand) => {
              const brandLower = brand.name.toLowerCase();
              let textStyle = "font-sans font-bold";
              if (brandLower.includes("hilti")) textStyle = "font-mono tracking-tighter font-black";
              else if (brandLower.includes("dewalt")) textStyle = "font-sans font-extrabold italic text-yellow-500";
              else if (brandLower.includes("bosch")) textStyle = "font-sans font-bold";
              else if (brandLower.includes("makita")) textStyle = "font-serif tracking-widest font-black text-teal-400";
              else if (brandLower.includes("milwaukee")) textStyle = "font-sans font-extrabold italic text-red-600";
              else if (brandLower.includes("stanley")) textStyle = "font-sans font-black tracking-wide";
              else if (brandLower.includes("ingco")) textStyle = "font-sans font-extrabold uppercase italic text-amber-500";

              return (
                <Link key={brand._id} href={`/brands/${brand.slug}`} className="flex items-center justify-center">
                  {brand.logoUrl ? (
                    <div className="h-10 w-28 relative flex items-center justify-center filter grayscale contrast-125 opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <span
                      className={`text-2xl text-zinc-500 hover:text-gold transition-colors duration-300 ${textStyle} select-none cursor-pointer`}
                    >
                      {brand.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Al Ajer (Company Highlights) */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3.5 mb-6">
              <div className="h-4 w-1 bg-gold rounded-full"></div>
              <h2 className="text-lg md:text-xl font-black tracking-widest uppercase text-white">
                WHY CHOOSE <span className="text-gold">AL AJER?</span>
              </h2>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed uppercase tracking-wider font-semibold">
              Serving the construction, fabrication, and engineering sectors in the United Arab Emirates for over two decades.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {[
                { title: "20+ Years of Experience", desc: "Trusted by Professionals" },
                { title: "Large Inventory in UAE", desc: "15,000+ items across 3 stores" },
                { title: "Competitive Prices", desc: "Manufacturer-backed rates" },
                { title: "Fast & Reliable Delivery", desc: "Efficient logistics nationwide" },
                { title: "Dedicated Customer Support", desc: "Personalized B2B/B2C services" },
                { title: "100% Genuine Products", desc: "Authorized dealer of top brands" },
              ].map((hl) => (
                <div key={hl.title} className="flex gap-3">
                  <CheckCircle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{hl.title}</h4>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase mt-0.5">{hl.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about" className="inline-block mt-10">
              <Button className="bg-gold hover:bg-gold-hover text-black font-extrabold uppercase tracking-widest text-[9px] px-6 py-4 rounded cursor-pointer">
                LEARN MORE
              </Button>
            </Link>
          </div>

          <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-900 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600"
              alt="Al Ajer Industrial Supply"
              fill
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/30 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* 7. Bottom USP Strip */}
      <section className="bg-[#0b0b0b] border-t border-b border-zinc-900 py-10 my-10">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { title: "OUR STORES", desc: "3 Stores Across UAE" },
            { title: "EASY RETURNS", desc: "7 Days Return Policy" },
            { title: "BULK ORDERS", desc: "Special Prices" },
            { title: "SECURE PAYMENT", desc: "Multiple Options" },
          ].map((item) => (
            <div key={item.title} className="text-center md:text-left flex flex-col items-center md:items-start">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gold">{item.title}</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mt-1">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Stay Updated (Newsletter Section) */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="bg-[#0c0c0c] border border-zinc-900 rounded-lg p-8 md:p-12 text-center relative overflow-hidden shadow-2xl max-w-4xl mx-auto">
          <div className="relative z-10 max-w-xl mx-auto">
            <span className="text-[10px] font-extrabold text-gold uppercase tracking-[0.2em]">
              STAY UPDATED
            </span>
            <h3 className="text-xl md:text-2xl font-black uppercase text-white mt-4 tracking-wide">
              Subscribe to our newsletter for the latest offers and updates.
            </h3>

            <div className="mt-8">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
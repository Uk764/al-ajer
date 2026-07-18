import { getProducts, getCategories } from "@/shared/lib/api";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/customer/components/AddToCartButton";
import NewsletterForm from "@/customer/components/NewsletterForm";
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
  Star,
  Eye,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle,
} from "lucide-react";

const categoryIcons: Record<string, React.ElementType> = {
  "power-tools": Wrench,
  "hand-tools": Hammer,
  "building-material": Boxes,
  fasteners: Zap,
};

// Hardcoded industrial category graphics mapping for design excellence
const categoryImages: Record<string, string> = {
  "fasteners": "https://images.unsplash.com/photo-1565192647048-f997ed8799d4?auto=format&fit=crop&q=80&w=400",
  "power-tools": "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400",
  "hand-tools": "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=400",
  "building-material": "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400",
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
    <main className="min-h-screen bg-[#070707] text-[#f5f5f5] overflow-x-hidden font-sans">
      {/* 1. Hero Section */}
      <section
        className="relative overflow-hidden border-b border-zinc-900/60 min-h-[70vh] md:min-h-[85vh] flex items-center bg-[#070707]"
        style={{
          backgroundImage:
            "radial-gradient(circle at right center, rgba(212, 175, 55, 0.08) 0%, transparent 60%)",
        }}
      >
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/ypd6ye8m/image/upload/v1784295164/al-ajer/products/tw762ewjs9biyxogdqlr.png"
            alt="Al Ajer Industrial Tools"
            fill
            priority
            className="object-cover object-right md:object-right opacity-30 md:opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/90 to-transparent"></div>
          <div className="absolute inset-0 bg-linear-to-t from-[#070707] via-transparent to-[#070707]/30"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:py-32 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold mb-6 animate-pulse">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-[10px] tracking-[0.25em] font-bold uppercase">
                Premium Quality • Since 2001
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-white tracking-wide uppercase">
              Building Materials &amp; <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-gold via-gold-hover to-gold-dark">
                Industrial Solutions
              </span>
            </h1>

            <p className="mt-6 text-base md:text-lg text-zinc-400 leading-relaxed font-normal">
              Your trusted partner for premium Fasteners, Power Tools, Hand Tools, Safety Equipment, Plumbing and Construction Materials in the UAE. Managing over 15,000+ items across 3 physical retail branches.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <Link href="/shop">
                <Button size="lg" className="bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs px-8 py-6 rounded-md shadow-lg shadow-gold/15 active:scale-95 transition-all duration-200 cursor-pointer">
                  Explore Products
                  <ArrowRight className="ml-2 h-4 w-4 text-black" />
                </Button>
              </Link>

              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-2 border-gold text-gold hover:bg-gold hover:text-black font-bold uppercase tracking-wider text-xs px-8 py-6 rounded-md transition-all duration-300 cursor-pointer">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. USP Strip */}
      <section className="relative z-20 -mt-10 mx-auto max-w-7xl px-4">
        <div className="bg-[#0b0b0b] border border-zinc-800/80 rounded-xl py-6 px-8 shadow-2xl grid grid-cols-2 md:grid-cols-5 gap-6 gap-y-8 divide-zinc-800 md:divide-x">
          {[
            { icon: ShieldCheck, title: "Premium Quality", sub: "100% Genuine Products" },
            { icon: Wrench, title: "Wide Range", sub: "15,000+ Active Items" },
            { icon: Truck, title: "Fast Delivery", sub: "Reliable Across UAE" },
            { icon: Headset, title: "Expert Support", sub: "Dedicated Assistance" },
            { icon: Wallet, title: "Secure Payment", sub: "100% Protected Checkout" },
          ].map((item, idx) => (
            <div key={item.title} className={`flex items-center gap-4 ${idx > 0 ? "md:pl-6" : ""}`}>
              <div className="h-10 w-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0 border border-gold/25">
                <item.icon className="h-5 w-5 text-gold animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">{item.title}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5 font-medium">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Shop by Category */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="h-1 w-12 bg-gold mb-3 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wider uppercase text-white">
              Shop By <span className="text-gold">Category</span>
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-gold hover:text-gold-hover transition-colors flex items-center gap-1.5 group">
            View All Categories
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category) => {
            const Icon = categoryIcons[category.slug] || Boxes;
            const imgUrl = categoryImages[category.slug] || "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=400";
            return (
              <Link key={category._id} href={`/category/${category.slug}`}>
                <Card className="group relative hover:border-gold/60 border-zinc-900 bg-[#0c0c0c] hover:bg-[#121212] transition-all duration-300 cursor-pointer overflow-hidden h-48 rounded-lg shadow-xl shadow-black/40">
                  <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300">
                    <Image
                      src={imgUrl}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"></div>
                  </div>

                  <CardContent className="absolute bottom-0 inset-x-0 p-5 z-10 flex flex-col justify-end h-full">
                    <div className="h-8 w-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-3 group-hover:bg-gold group-hover:text-black text-gold transition-all duration-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-widest text-white group-hover:text-gold transition-colors duration-300">
                      {category.name}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-10 bg-radial-gradient">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="h-1 w-12 bg-gold mb-3 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wider uppercase text-white">
              Featured <span className="text-gold">Products</span>
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-widest text-gold hover:text-gold-hover transition-colors flex items-center gap-1.5 group">
            Explore Full Catalog
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {productsData.products.map((product) => (
            <Card
              key={product._id}
              className="group hover:border-gold/60 border-zinc-900 bg-[#0a0a0a] hover:bg-[#0f0f0f] hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 h-full flex flex-col overflow-hidden rounded-lg"
            >
              {/* Image & Quick Action Overlay */}
              <div className="relative aspect-square bg-[#121212] overflow-hidden">
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

                {/* Overlays / Icons */}
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

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate max-w-20">
                    {product.brand.name}
                  </span>
                  
                  {/* Rating Stars (Standard Design Showcase) */}
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
      </section>

      {/* 5. Promotional Section */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="bg-[#0b0b0b] border border-zinc-800/80 rounded-xl overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(212,175,55,0.05)_0%,transparent_50%)]"></div>
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12 relative z-10">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded border border-gold/20">
                Bulk Orders &amp; Export
              </span>
              <h3 className="text-2xl md:text-4xl font-extrabold uppercase text-white mt-6 tracking-wide">
                Specialized Wholesale <br />
                <span className="text-gold">Supply Across GCC</span>
              </h3>
              <p className="text-zinc-400 mt-4 text-sm leading-relaxed">
                As direct importers and distributors, we supply major contractors, warehouse networks, and building material shops. Contact our team to receive custom quotes, certificate catalogs, and technical support.
              </p>
              <div className="mt-8 flex gap-4">
                <Link href="/contact">
                  <Button className="bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs px-6 py-5 rounded cursor-pointer">
                    Request Wholesale Quote
                  </Button>
                </Link>
                <Link href="/stores">
                  <Button variant="outline" className="border-zinc-800 hover:border-gold hover:bg-transparent text-white font-bold uppercase tracking-wider text-xs px-6 py-5 rounded cursor-pointer">
                    Find Branches
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-800">
              <Image
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600"
                alt="Al Ajer GCC Wholesale supply"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Why Choose Al Ajer (Company Highlights) */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="h-1 w-12 bg-gold mb-3 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-wider uppercase text-white">
              Why Choose <span className="text-gold">Al Ajer?</span>
            </h2>
            <p className="text-zinc-400 mt-4 text-sm leading-relaxed">
              Serving the construction, fabrication, and engineering sectors in the United Arab Emirates for over two decades. We combine product quality with custom logistics solutions to keep projects on track.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {[
                { title: "20+ Years Experience", desc: "Trusted industrial distributor." },
                { title: "UAE Wide Distribution", desc: "Fast logistics delivery channels." },
                { title: "Over 15,000 Products", desc: "One-stop wholesale provider." },
                { title: "Competitive Pricing", desc: "Manufacturer-backed rates." },
              ].map((hl) => (
                <div key={hl.title} className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">{hl.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{hl.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square md:aspect-4/3 rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600"
              alt="Al Ajer warehouse trading"
              fill
              className="object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-linear-to-tr from-black via-black/30 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* 7. Top Brands Showcase */}
      <section className="border-t border-b border-zinc-900 bg-[#0a0a0a] py-14">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-8">
            Authorised Partners &amp; Leading Brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
            {[
              { name: "Hilti", font: "font-mono tracking-tighter" },
              { name: "DeWalt", font: "font-sans font-extrabold italic" },
              { name: "Bosch", font: "font-sans font-bold" },
              { name: "Makita", font: "font-serif tracking-widest font-black" },
              { name: "Milwaukee", font: "font-sans font-extrabold italic text-red-600" },
              { name: "Stanley", font: "font-sans font-black tracking-wide" },
              { name: "Ingco", font: "font-sans font-extrabold uppercase italic text-yellow-500" },
            ].map((brand) => (
              <span
                key={brand.name}
                className={`text-xl md:text-2xl text-zinc-600 hover:text-gold transition-colors duration-300 ${brand.font} select-none cursor-pointer`}
              >
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Stay Updated (Newsletter Section) */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="bg-[#0b0b0b] border border-zinc-800/80 rounded-xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.04)_0%,transparent_60%)]"></div>
          <div className="relative z-10 max-w-xl mx-auto">
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">
              Subscribe to Newsletter
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold uppercase text-white mt-4 tracking-wide">
              Stay Updated with Industry Prices
            </h3>
            <p className="text-zinc-500 mt-3 text-xs leading-relaxed max-w-sm mx-auto">
              Get notified of clearance deals, wholesale stock listings, and industrial material catalog updates.
            </p>

            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
import Image from "next/image";
import { CheckCircle2, Eye, ShieldCheck, Target, Award, Users, Warehouse, Milestone } from "lucide-react";

export const metadata = {
  title: "About Us | AL AJER Building Material Trading LLC",
  description: "Learn about AL AJER's legacy, our mission, vision, and our warehousing and distribution capacity across the UAE.",
};

const stats = [
  { value: "20+", label: "Years Experience", desc: "Supplying industrial sectors since 2006" },
  { value: "15K+", label: "Product SKUs", desc: "Fasteners, power tools, safety equipment & more" },
  { value: "3+", label: "Retail Stores", desc: "Convenient locations across the UAE" },
  { value: "10K+", label: "B2B Clients", desc: "Trusted by top construction companies" },
];

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600",
    title: "Distribution Center",
    desc: "Over 50,000 sq ft centralized inventory capacity",
  },
  {
    src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=600",
    title: "Logistics Operations",
    desc: "Efficient fleet supporting nationwide deliveries",
  },
  {
    src: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600",
    title: "Heavy Stock Management",
    desc: "Vast reserves of structural fasteners and fittings",
  },
  {
    src: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=600",
    title: "Quality Control",
    desc: "Inspecting and sorting structural grade supplies",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-[#f5f5f5] font-sans overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative min-h-[50vh] flex items-center bg-[#070707] border-b border-zinc-900/60 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/ypd6ye8m/image/upload/v1784295164/al-ajer/products/tw762ewjs9biyxogdqlr.png"
            alt="Al Ajer Warehouse Facility"
            fill
            priority
            className="object-cover object-center opacity-25 brightness-[0.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/35"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/30"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 w-full text-center md:text-left">
          <div className="max-w-3xl">
            <span className="text-[10px] tracking-[0.3em] font-extrabold text-gold uppercase mb-4 block">
              ESTABLISHED 2006
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] text-white tracking-wide uppercase">
              TWO DECADES OF <br />
              <span className="text-gold">INDUSTRIAL TRUST</span>
            </h1>
            <p className="mt-6 text-sm text-zinc-400 leading-relaxed max-w-xl font-medium uppercase tracking-wider">
              AL AJER is a premier importer, exporter, and distributor of structural fasteners, construction materials, power tools, and hardware products in the GCC.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Company Story */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="h-4 w-1 bg-gold rounded-full"></div>
              <h2 className="text-lg md:text-xl font-black tracking-widest uppercase text-white">
                OUR <span className="text-gold">LEGACY</span>
              </h2>
            </div>
            
            <p className="text-zinc-300 text-xs md:text-sm leading-relaxed uppercase tracking-wider font-semibold">
              Serving the construction, structural engineering, oil & gas, fabrication, and MEP sectors across the GCC.
            </p>
            
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
              Founded in Dubai, United Arab Emirates, AL AJER Building Material Trading LLC has grown from a local retail supplier into a major industrial trading powerhouse. For over 20 years, we have worked hand-in-hand with leading international manufacturers to supply certified, heavy-duty engineering products.
            </p>
            
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
              We specialize in offering customized fastener solutions, high-grade structural bolts, heavy power machinery, anchoring adhesives, safety clothing, and plumbing systems. By maintaining a large, permanent inventory, we ensure quick turnarounds and zero downtime for massive projects nationwide.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {[
                "100% Genuine Certified Stock",
                "Extensive GCC Distribution Network",
                "Advanced Logistics Fleet",
                "Specialized B2B Project Pricing",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-5 relative aspect-square rounded-xl overflow-hidden border border-zinc-900 shadow-2xl bg-zinc-950">
            <Image
              src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600"
              alt="Engineering Site Support"
              fill
              className="object-cover opacity-75 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* 3. Achievements Statistics Section */}
      <section className="bg-[#0b0b0b] border-t border-b border-zinc-900 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-6 bg-[#0c0c0c] border border-zinc-900/60 rounded-lg group hover:border-gold/40 transition-colors">
                <p className="text-3xl md:text-4xl font-black text-gold tracking-tight group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </p>
                <h4 className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-white mt-3">
                  {stat.label}
                </h4>
                <p className="text-[9px] md:text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-1.5 leading-snug">
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Mission & Vision */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-[#0c0c0c] border border-zinc-900 p-8 md:p-10 rounded-xl flex gap-6 items-start hover:border-gold/30 transition-all duration-300">
            <div className="h-12 w-12 rounded bg-[#161616] border border-zinc-800 flex items-center justify-center text-gold shrink-0">
              <Target className="h-6 w-6" />
            </div>
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-black uppercase tracking-widest text-white">
                OUR <span className="text-gold">MISSION</span>
              </h3>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                To streamline industrial sourcing for structural builders and commercial engineers by supplying high-caliber, fully certified fasteners, machinery, and materials. We aim to guarantee efficiency, uncompromising safety, and unbeatable value across all infrastructural undertakings in the UAE.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-[#0c0c0c] border border-zinc-900 p-8 md:p-10 rounded-xl flex gap-6 items-start hover:border-gold/30 transition-all duration-300">
            <div className="h-12 w-12 rounded bg-[#161616] border border-zinc-800 flex items-center justify-center text-gold shrink-0">
              <Eye className="h-6 w-6" />
            </div>
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-black uppercase tracking-widest text-white">
                OUR <span className="text-gold">VISION</span>
              </h3>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                To be recognized as the ultimate, most reliable B2B supply hub in the GCC region, synonymous with superior engineering quality and robust client relationships. We envision integrating tech-driven distribution platforms to facilitate seamless logistics and inventory procurement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Warehouse & Infrastructure Gallery */}
      <section className="border-t border-zinc-900 bg-[#090909] py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <span className="text-[10px] tracking-[0.25em] font-extrabold text-gold uppercase mb-3 block">
              LOGISTICS CAPABILITY
            </span>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
              WAREHOUSING & <span className="text-gold">DISTRIBUTION</span>
            </h2>
            <div className="w-10 h-0.5 bg-gold mx-auto mt-4"></div>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-4 max-w-md mx-auto leading-relaxed">
              Equipped with heavy overhead gantries, optimized racking systems, and real-time inventory management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((image, idx) => (
              <div
                key={idx}
                className="group relative h-72 rounded-lg overflow-hidden border border-zinc-900 bg-zinc-950 shadow-2xl flex flex-col justify-end p-5 cursor-pointer"
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover absolute inset-0 opacity-40 group-hover:scale-105 group-hover:opacity-60 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                <div className="relative z-10 space-y-1">
                  <div className="h-8 w-8 rounded bg-[#161616] border border-zinc-800 flex items-center justify-center text-gold mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Warehouse className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    {image.title}
                  </h4>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wide leading-none">
                    {image.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

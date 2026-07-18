import { getBranches } from "@/shared/lib/api";
import { Phone, MapPin, Clock, ExternalLink, Mail, Building } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Our Stores | AL AJER Industrial Supplies",
  description: "Find our physical stores and showrooms in Dubai and Abu Dhabi. View addresses, timings, and directions.",
};

// Premium metadata to enrich branch information from the backend
interface StoreDetails {
  displayTitle: string;
  fullAddress: string;
  image: string;
  email: string;
  mapIframe: string;
  timings: string;
  directionsUrl: string;
}

const storeDetailsMap: Record<string, StoreDetails> = {
  "BR1": {
    displayTitle: "Dubai Headquarters & Showroom (Al Quoz)",
    fullAddress: "Showroom 12, Industrial Area 4, Al Quoz, Behind Al Quoz Mall, Dubai, United Arab Emirates",
    image: "https://images.unsplash.com/photo-1513826308678-366974791a31?auto=format&fit=crop&q=80&w=600",
    email: "alquoz@alajer.com",
    timings: "Monday - Saturday: 8:00 AM - 8:00 PM | Sunday: Closed",
    directionsUrl: "https://maps.google.com/?q=Al+Quoz+Industrial+Area+4+Dubai",
    mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14444.606277977463!2d55.2281862554199!3d25.16439055812903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6a27e8d35687%3A0xe54e6fa16b0807b!2sAl%20Quoz%20Industrial%20Area%204%20-%20Dubai!5e0!3m2!1sen!2sae!4v1784300000000!5m2!1sen!2sae",
  },
  "BR2": {
    displayTitle: "Deira Retail Showroom (Nakheel)",
    fullAddress: "Shop 14-15, Al Nakheel Road, Near Sabkha Bus Station, Deira, Dubai, United Arab Emirates",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=600",
    email: "deira@alajer.com",
    timings: "Monday - Saturday: 8:00 AM - 8:30 PM | Sunday: Closed",
    directionsUrl: "https://maps.google.com/?q=Sabkha+Deira+Dubai",
    mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.2045582312674!2d55.3051052!3d25.2637213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f433989c89af5%3A0x6b10854d924d5ae!2sNakheel%20Rd%20-%20Deira%20-%20Sabkha%20-%20Dubai!5e0!3m2!1sen!2sae!4v1784300100000!5m2!1sen!2sae",
  },
  "BR3": {
    displayTitle: "Abu Dhabi Industrial Branch (Musaffah)",
    fullAddress: "Store M-40, Musaffah Industrial Area, Near Musaffah Gardens, Abu Dhabi, United Arab Emirates",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600",
    email: "musaffah@alajer.com",
    timings: "Monday - Saturday: 8:00 AM - 7:30 PM | Sunday: Closed",
    directionsUrl: "https://maps.google.com/?q=Musaffah+M-40+Abu+Dhabi",
    mapIframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14545.98638198905!2d54.51268615!3d24.3465876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e41df40000001%3A0x2db4e81566cf2fb7!2sM-40%20-%20Musaffah%20-%20Abu%20Dhabi!5e0!3m2!1sen!2sae!4v1784300200000!5m2!1sen!2sae",
  },
};

export default async function StoresPage() {
  const branchesList = await getBranches();

  // Enhance backend data with premium store metadata, keeping dynamic data integration
  const enhancedBranches = branchesList.map((branch) => {
    const details = storeDetailsMap[branch.code] || {
      displayTitle: branch.name,
      fullAddress: `${branch.address}, ${branch.city}`,
      image: "https://images.unsplash.com/photo-1513826308678-366974791a31?auto=format&fit=crop&q=80&w=600",
      email: "info@alajer.com",
      timings: "Monday - Saturday: 8:00 AM - 8:00 PM | Sunday: Closed",
      directionsUrl: `https://maps.google.com/?q=${encodeURIComponent(branch.address + " " + branch.city)}`,
      mapIframe: "",
    };

    return {
      ...branch,
      ...details,
    };
  });

  return (
    <main className="min-h-screen bg-[#070707] text-[#f5f5f5] font-sans pb-20">
      {/* 1. Hero Header */}
      <section className="relative py-24 bg-gradient-to-b from-[#0a0a0a] to-[#070707] border-b border-zinc-900/60 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <span className="text-[10px] tracking-[0.3em] font-extrabold text-gold uppercase mb-3 block">
            OUR SHOWROOMS
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white">
            STORE <span className="text-gold">LOCATIONS</span>
          </h1>
          <div className="w-16 h-1 bg-gold mx-auto mt-6 rounded-full"></div>
          <p className="mt-6 text-xs md:text-sm text-zinc-400 max-w-xl mx-auto uppercase tracking-wider leading-relaxed font-semibold">
            Visit our fully-stocked outlets to purchase directly, inspect product samples, or consult with our technical sales experts.
          </p>
        </div>
      </section>

      {/* 2. Showrooms / Store Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="space-y-16">
          {enhancedBranches.map((store, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={store._id}
                className={`flex flex-col lg:flex-row gap-8 items-stretch bg-[#0c0c0c] border border-zinc-900 rounded-xl overflow-hidden shadow-2xl hover:border-gold/30 transition-all duration-300 ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Store Visual Column */}
                <div className="relative lg:w-5/12 min-h-[300px] bg-zinc-950 overflow-hidden">
                  <Image
                    src={store.image}
                    alt={store.displayTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover opacity-70 group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent lg:hidden"></div>
                </div>

                {/* Store Details and Map Column */}
                <div className="lg:w-7/12 p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest text-gold bg-gold/10 border border-gold/20 px-2.5 py-0.5 rounded">
                        Branch Code: {store.code}
                      </span>
                      <h2 className="text-xl font-black uppercase tracking-wide text-white pt-1">
                        {store.displayTitle}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Address */}
                      <div className="flex gap-2.5">
                        <MapPin className="h-4.5 w-4.5 text-gold shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold uppercase text-[9px] text-zinc-500 tracking-wider">Showroom Address</p>
                          <p className="text-zinc-300 mt-1 leading-relaxed">{store.fullAddress}</p>
                        </div>
                      </div>

                      {/* Timings */}
                      <div className="flex gap-2.5">
                        <Clock className="h-4.5 w-4.5 text-gold shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold uppercase text-[9px] text-zinc-500 tracking-wider">Business Hours</p>
                          <p className="text-zinc-300 mt-1 leading-relaxed">{store.timings}</p>
                        </div>
                      </div>

                      {/* Contact Phone */}
                      <div className="flex gap-2.5">
                        <Phone className="h-4.5 w-4.5 text-gold shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold uppercase text-[9px] text-zinc-500 tracking-wider">Phone / WhatsApp</p>
                          <a
                            href={`tel:${store.phone}`}
                            className="text-zinc-300 hover:text-gold mt-1 block font-bold transition-colors"
                          >
                            {store.phone}
                          </a>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex gap-2.5">
                        <Mail className="h-4.5 w-4.5 text-gold shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold uppercase text-[9px] text-zinc-500 tracking-wider">Email Inquiry</p>
                          <a
                            href={`mailto:${store.email}`}
                            className="text-zinc-300 hover:text-gold mt-1 block transition-colors"
                          >
                            {store.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Google Map iframe Embed (rendered server-side, fall back if no iframe URL exists) */}
                  {store.mapIframe ? (
                    <div className="mt-8 border border-zinc-900 rounded-lg overflow-hidden h-48 relative shadow-inner bg-zinc-950">
                      <iframe
                        src={store.mapIframe}
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) grayscale(100%) brightness(90%) contrast(110%)" }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="opacity-70 hover:opacity-100 transition-opacity duration-300"
                      />
                    </div>
                  ) : null}

                  {/* Actions Row */}
                  <div className="mt-8 pt-6 border-t border-zinc-900/60 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-zinc-600" />
                      <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                        {store.city}, UAE
                      </span>
                    </div>

                    <a
                      href={store.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold-hover text-black font-extrabold uppercase tracking-widest text-[9px] px-5 py-3 rounded transition-all active:scale-95 shadow-md shadow-gold/15 cursor-pointer"
                    >
                      GET DIRECTIONS
                      <ExternalLink className="h-3 w-3 stroke-[3]" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

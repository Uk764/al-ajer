"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Banner } from "@/shared/lib/api";

interface HeroSliderProps {
  banners: Banner[];
}

export default function HeroSlider({ banners }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const activeBanners = banners.filter((b) => b.isActive !== false);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === activeBanners.length - 1 ? 0 : prevIndex + 1
    );
  }, [activeBanners.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? activeBanners.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (activeBanners.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000); // cycle every 5s

    return () => clearInterval(interval);
  }, [activeBanners.length, isHovered, handleNext]);

  // If there are no custom banners, render the fallback/default hero
  if (activeBanners.length === 0) {
    return (
      <section className="relative min-h-[75vh] md:min-h-[85vh] flex items-center bg-[#070707] border-b border-zinc-900/60 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://res.cloudinary.com/ypd6ye8m/image/upload/v1784295164/al-ajer/products/tw762ewjs9biyxogdqlr.png"
            alt="Al Ajer Warehouse Background"
            fill
            priority
            className="object-cover object-right opacity-30 brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/30"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:py-32 w-full">
          <div className="max-w-2xl">
            <span className="text-[10px] tracking-[0.25em] font-extrabold text-gold uppercase mb-4 block animate-fade-in">
              PREMIUM QUALITY
            </span>

            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] text-white tracking-wide uppercase animate-slide-in">
              BUILDING MATERIALS & <br />
              <span className="text-gold">INDUSTRIAL SOLUTIONS</span>
            </h1>

            <p className="mt-6 text-sm md:text-base text-zinc-400 leading-relaxed max-w-lg animate-fade-in-delayed">
              Your trusted partner for Fasteners, Power Tools, Hardware &amp; Construction Materials in UAE.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 items-center animate-fade-in-delayed">
              <Link href="/shop">
                <Button className="bg-gold hover:bg-gold-hover text-black font-extrabold uppercase tracking-widest text-[10px] px-8 py-5 h-12 rounded shadow-lg shadow-gold/15 active:scale-95 transition-all duration-200 cursor-pointer">
                  SHOP NOW
                  <ArrowRight className="ml-2 h-4 w-4 text-black stroke-[3]" />
                </Button>
              </Link>

              <a href="tel:+971558830854">
                <Button variant="outline" className="border-2 border-zinc-800 hover:border-gold hover:bg-transparent text-white font-extrabold uppercase tracking-widest text-[10px] px-8 py-5 h-12 rounded transition-all duration-300 cursor-pointer gap-2">
                  <Phone className="h-4 w-4 text-gold" />
                  CONTACT SALES
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative min-h-[75vh] md:min-h-[85vh] flex items-center bg-[#070707] border-b border-zinc-900/60 overflow-hidden group/slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {activeBanners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner._id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Image & Overlays */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover object-center opacity-40 brightness-[0.4] transition-transform duration-[8000ms] ease-out scale-105"
                  style={{
                    transform: isActive ? "scale(1.0)" : "scale(1.05)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/30"></div>
              </div>

              {/* Slide Content */}
              <div className="relative z-20 mx-auto max-w-7xl px-4 py-20 md:py-32 h-full flex items-center w-full">
                <div className="max-w-2xl text-left">
                  {banner.subtitle && (
                    <span className="text-[10px] tracking-[0.25em] font-extrabold text-gold uppercase mb-4 block animate-fade-in">
                      {banner.subtitle}
                    </span>
                  )}

                  <h1 className="text-4xl md:text-6xl font-black leading-[1.1] text-white tracking-wide uppercase animate-slide-in">
                    {banner.title}
                  </h1>

                  <div className="mt-10 flex flex-wrap gap-4 items-center animate-fade-in-delayed">
                    <Link href={banner.linkUrl || "/shop"}>
                      <Button className="bg-gold hover:bg-gold-hover text-black font-extrabold uppercase tracking-widest text-[10px] px-8 py-5 h-12 rounded shadow-lg shadow-gold/15 active:scale-95 transition-all duration-200 cursor-pointer">
                        DISCOVER MORE
                        <ArrowRight className="ml-2 h-4 w-4 text-black stroke-[3]" />
                      </Button>
                    </Link>

                    <a href="tel:+971558830854">
                      <Button variant="outline" className="border-2 border-zinc-800 hover:border-gold hover:bg-transparent text-white font-extrabold uppercase tracking-widest text-[10px] px-8 py-5 h-12 rounded transition-all duration-300 cursor-pointer gap-2">
                        <Phone className="h-4 w-4 text-gold" />
                        CONTACT SALES
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full border border-zinc-800 bg-[#0e0e0e]/60 hover:bg-gold hover:text-black hover:border-gold text-zinc-400 flex items-center justify-center transition-all duration-300 opacity-0 group-hover/slider:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full border border-zinc-800 bg-[#0e0e0e]/60 hover:bg-gold hover:text-black hover:border-gold text-zinc-400 flex items-center justify-center transition-all duration-300 opacity-0 group-hover/slider:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {activeBanners.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive ? "w-8 bg-gold" : "w-2 bg-zinc-600 hover:bg-zinc-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

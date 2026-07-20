"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Star, X, Check, ChevronRight } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Brand {
  _id: string;
  name: string;
  slug: string;
}

export default function ShopFilters({
  categories,
  brands,
  hideCategoryFilter = false,
  hideBrandFilter = false,
}: {
  categories: Category[];
  brands: Brand[];
  hideCategoryFilter?: boolean;
  hideBrandFilter?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentBrand = searchParams.get("brand") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentInStock = searchParams.get("inStock") === "true";
  const currentOnSale = searchParams.get("onSale") === "true";
  const currentMinRating = searchParams.get("minRating") || "";

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  // Sync inputs with URL
  useEffect(() => {
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset pagination
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleParam(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === "true") {
      params.delete(key);
    } else {
      params.set(key, "true");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function applyPriceRange() {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice); else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice); else params.delete("maxPrice");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    setMinPrice("");
    setMaxPrice("");
    router.push(pathname);
  }

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-8 bg-[#0c0c0c] border border-zinc-900 rounded-lg p-6 shadow-xl">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">Filters</h3>
          <div className="h-0.5 w-6 bg-gold mt-1"></div>
        </div>
        {(searchParams.toString() !== "") && (
          <button
            onClick={clearAll}
            className="text-[10px] uppercase font-bold tracking-wider text-gold hover:text-gold-hover transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      {!hideCategoryFilter && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Categories
          </h4>
          <div className="space-y-1.5">
            {categories.map((cat) => {
              const isSelected = currentCategory === cat._id;
              return (
                <button
                  key={cat._id}
                  onClick={() => updateParam("category", isSelected ? null : cat._id)}
                  className={`flex items-center justify-between w-full text-left text-xs px-3 py-2 rounded-md font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-gold/10 border-l-2 border-gold text-gold pl-4"
                      : "text-zinc-400 hover:text-gold hover:bg-zinc-900/50 border-l-2 border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ChevronRight className={`h-3 w-3 transition-transform ${isSelected ? "rotate-90 text-gold" : "text-zinc-600"}`} />
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Brands */}
      {!hideBrandFilter && (
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Brands
          </h4>
          <div className="space-y-2">
            {brands.map((brand) => {
              const isSelected = currentBrand === brand._id;
              return (
                <label
                  key={brand._id}
                  className="flex items-center gap-3 text-xs font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer select-none group"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => updateParam("brand", isSelected ? null : brand._id)}
                      className="sr-only"
                    />
                    <div className={`h-4.5 w-4.5 rounded border transition-all duration-200 flex items-center justify-center ${
                      isSelected
                        ? "border-gold bg-gold text-black shadow-md shadow-gold/25"
                        : "border-zinc-800 bg-[#121212] group-hover:border-gold/40"
                    }`}>
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </div>
                  <span>{brand.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          Price Range (AED)
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-9 text-xs bg-[#121212] border-zinc-800 focus:border-gold text-white rounded placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <span className="text-zinc-600 text-xs">-</span>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-9 text-xs bg-[#121212] border-zinc-800 focus:border-gold text-white rounded placeholder:text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button
            size="sm"
            onClick={applyPriceRange}
            className="w-full bg-[#121212] hover:bg-gold hover:text-black border border-zinc-800 hover:border-gold text-zinc-300 font-bold uppercase tracking-wider text-[10px] h-9 transition-all duration-200 rounded cursor-pointer"
          >
            Apply Range
          </Button>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          Availability
        </h4>
        <div className="space-y-2.5">
          <label className="flex items-center gap-3 text-xs font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer select-none group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={currentInStock}
                onChange={() => toggleParam("inStock")}
                className="sr-only"
              />
              <div className={`h-4.5 w-4.5 rounded border transition-all duration-200 flex items-center justify-center ${
                currentInStock
                  ? "border-gold bg-gold text-black shadow-md shadow-gold/25"
                  : "border-zinc-800 bg-[#121212] group-hover:border-gold/40"
              }`}>
                {currentInStock && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
            </div>
            <span>In Stock Only</span>
          </label>

          <label className="flex items-center gap-3 text-xs font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer select-none group">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                checked={currentOnSale}
                onChange={() => toggleParam("onSale")}
                className="sr-only"
              />
              <div className={`h-4.5 w-4.5 rounded border transition-all duration-200 flex items-center justify-center ${
                currentOnSale
                  ? "border-gold bg-gold text-black shadow-md shadow-gold/25"
                  : "border-zinc-800 bg-[#121212] group-hover:border-gold/40"
              }`}>
                {currentOnSale && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
            </div>
            <span>On Sale/Offers</span>
          </label>
        </div>
      </div>

      {/* Ratings Filter */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          Customer Rating
        </h4>
        <div className="space-y-2">
          {[5, 4, 3].map((stars) => {
            const isSelected = currentMinRating === String(stars);
            return (
              <button
                key={stars}
                onClick={() => updateParam("minRating", isSelected ? null : String(stars))}
                className={`flex items-center gap-2.5 text-xs font-semibold text-left w-full px-2 py-1 rounded transition-colors cursor-pointer ${
                  isSelected
                    ? "text-gold bg-gold/5"
                    : "text-zinc-400 hover:text-gold hover:bg-zinc-900/35"
                }`}
              >
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3 w-3 ${
                        s <= stars ? "fill-gold text-gold" : "text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <span>{stars === 5 ? "5 Stars" : `& Up`}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
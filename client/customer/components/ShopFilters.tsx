"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

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
}: {
  categories: Category[];
  brands: Brand[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentBrand = searchParams.get("brand") || "";
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
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
    router.push(pathname);
  }

  return (
    <aside className="w-full md:w-56 shrink-0 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Filters</h3>
          <button onClick={clearAll} className="text-xs text-primary hover:underline">
            Clear all
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
          Category
        </h4>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateParam("category", cat._id)}
              className={`block w-full text-left text-sm px-2 py-1.5 rounded-md ${
                searchParams.get("category") === cat._id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
          Brand
        </h4>
        <div className="space-y-1">
          {brands.map((brand) => (
            <label key={brand._id} className="flex items-center gap-2 text-sm cursor-pointer px-2 py-1">
              <input
                type="radio"
                name="brand"
                checked={currentBrand === brand._id}
                onChange={() => updateParam("brand", brand._id)}
                className="accent-primary"
              />
              {brand.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
          Price (AED)
        </h4>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-8 text-xs"
          />
          <span className="text-muted-foreground text-xs">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <Button size="sm" variant="outline" className="w-full mt-2" onClick={applyPriceRange}>
          Apply
        </Button>
      </div>
    </aside>
  );
}
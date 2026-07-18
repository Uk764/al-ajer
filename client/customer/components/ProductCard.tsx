"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, RefreshCw, ShoppingCart, Star } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { useWishlist } from "@/shared/context/WishlistContext";
import { useCompare } from "@/shared/context/CompareContext";
import { useCart } from "@/shared/context/CartContext";
import { useAuth } from "@/shared/context/AuthContext";
import { useRouter } from "next/navigation";
import { Product } from "@/shared/lib/api";

interface ProductCardProps {
  product: Product;
}

function isNew(createdAt: string) {
  const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return days < 14;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();
  const { refreshCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();

  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const isWishlisted = isInWishlist(product._id);
  const isCompared = isInCompare(product._id);

  // Deterministic ratings
  let hash = 0;
  for (let i = 0; i < product._id.length; i++) {
    hash = product._id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const ratingVal = 4.0 + (Math.abs(hash) % 11) * 0.1; // 4.0 to 5.0

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !token) {
      router.push("/login");
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      setAdded(true);
      refreshCart();
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  const productUrl = `/products/${product.slug}`;

  return (
    <div className="group border border-zinc-900 bg-[#0c0c0c] hover:border-gold/80 hover:shadow-2xl hover:shadow-gold/5 transition-all duration-300 rounded-lg overflow-hidden flex flex-col h-full relative">
      {/* Image container */}
      <div className="relative aspect-square bg-[#151515] overflow-hidden flex items-center justify-center p-6 border-b border-zinc-900/40">
        <Link href={productUrl} className="block w-full h-full relative">
          {product.thumbnailUrl ? (
            <Image
              src={product.thumbnailUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-contain group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
              No Image
            </div>
          )}
        </Link>

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountedPrice ? (
            <Badge className="bg-red-600 text-white hover:bg-red-600 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border-0 shadow-md">
              Sale
            </Badge>
          ) : (
            isNew(product.createdAt) && (
              <Badge className="bg-gold text-black hover:bg-gold text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border-0 shadow-md">
                New
              </Badge>
            )
          )}
        </div>

        {/* Quick Action Icons overlay on Hover */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={handleWishlistToggle}
            aria-label="Add to wishlist"
            className={`h-8 w-8 rounded-full bg-black/80 flex items-center justify-center shadow-lg transition-colors border border-zinc-800 cursor-pointer ${
              isWishlisted ? "text-gold bg-black border-gold/40" : "text-zinc-400 hover:text-gold hover:bg-[#121212]"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isWishlisted ? "fill-gold text-gold" : ""}`} />
          </button>
          <button
            onClick={handleCompareToggle}
            aria-label="Compare"
            className={`h-8 w-8 rounded-full bg-black/80 flex items-center justify-center shadow-lg transition-colors border border-zinc-800 cursor-pointer ${
              isCompared ? "text-gold bg-black border-gold/40" : "text-zinc-400 hover:text-gold hover:bg-[#121212]"
            }`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isCompared ? "animate-spin-once" : ""}`} />
          </button>
        </div>
      </div>

      {/* Info container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Stars */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest truncate max-w-[100px]">
              {product.brand.name}
            </span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-2.5 w-2.5 ${
                    s <= Math.round(ratingVal) ? "fill-gold text-gold" : "text-zinc-800"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Name */}
          <Link href={productUrl} className="block group-hover:text-gold transition-colors duration-200">
            <h3 className="font-extrabold text-xs line-clamp-2 text-zinc-200 uppercase tracking-wide leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Add to Cart Inline */}
        <div className="mt-4 pt-3 border-t border-zinc-900/60 flex items-center justify-between gap-3">
          <div>
            <p className="font-black text-white text-xs tracking-wider">
              AED {product.discountedPrice ?? product.sellingPrice}
            </p>
            {product.discountedPrice && (
              <span className="text-[9px] text-zinc-500 line-through block leading-tight font-medium mt-0.5">
                AED {product.sellingPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`h-8 w-8 rounded flex items-center justify-center shrink-0 transition-all duration-300 cursor-pointer ${
              added
                ? "bg-green-600 text-white"
                : "bg-gold hover:bg-gold-hover text-black active:scale-95 shadow-md shadow-gold/20"
            }`}
          >
            {isAdding ? (
              <span className="h-3.5 w-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, RefreshCw, ShoppingCart, Star, CheckCircle, Truck, RefreshCcw, ShieldCheck, CreditCard, ChevronRight, Check, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useWishlist } from "@/shared/context/WishlistContext";
import { useCompare } from "@/shared/context/CompareContext";
import { useCart } from "@/shared/context/CartContext";
import { useAuth } from "@/shared/context/AuthContext";
import { Product, InventoryRecord } from "@/shared/lib/api";
import ProductCard from "@/customer/components/ProductCard";

interface ProductDetailsClientProps {
  product: Product;
  inventory: InventoryRecord[];
  relatedProducts: Product[];
}

export default function ProductDetailsClient({
  product,
  inventory,
  relatedProducts,
}: ProductDetailsClientProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();
  const { refreshCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();

  // Combine thumbnail and images array
  const allImages = [product.thumbnailUrl, ...(product.images || [])].filter(Boolean) as string[];
  
  // States
  const [activeImage, setActiveImage] = useState(allImages[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Sync active image with product change
  useEffect(() => {
    setActiveImage(allImages[0] || "");
    setQuantity(1);
    setActiveTab("description");
  }, [product]);

  // Calculate stock status
  const totalStock = inventory.reduce((sum, record) => sum + record.quantity, 0);
  const isInStock = totalStock > 0;

  // Toggle wishlist / compare
  const isWishlisted = isInWishlist(product._id);
  const isCompared = isInCompare(product._id);

  // Deterministic ratings
  let hash = 0;
  for (let i = 0; i < product._id.length; i++) {
    hash = product._id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const ratingVal = 4.0 + (Math.abs(hash) % 11) * 0.1; // 4.0 to 5.0
  const reviewCount = 10 + (Math.abs(hash) % 141); // 10 to 150 reviews

  // Handle Add to Cart
  async function handleAddToCart() {
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
        body: JSON.stringify({ productId: product._id, quantity }),
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

  // Handle Buy Now
  async function handleBuyNow() {
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
        body: JSON.stringify({ productId: product._id, quantity }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      refreshCart();
      router.push("/cart");
    } catch (error) {
      console.error(error);
      alert("Failed to proceed with purchase. Please try again.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070707] text-[#f5f5f5] font-sans py-8">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* 1. Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-500 mb-8">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3 text-zinc-700" />
          <Link href={`/shop?category=${product.category._id}`} className="hover:text-gold transition-colors">
            {product.category.name}
          </Link>
          <ChevronRight className="h-3 w-3 text-zinc-700" />
          <span className="text-gold truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* 2. Main Product Info Grid */}
        <div className="grid md:grid-cols-2 gap-10 bg-[#0c0c0c] border border-zinc-900 rounded-xl p-6 md:p-8 shadow-2xl">
          
          {/* Left Column: Image Gallery & Actions */}
          <div className="space-y-6">
            {/* Active Image Box */}
            <div className="relative aspect-square bg-[#151515] border border-zinc-900/60 rounded-lg overflow-hidden flex items-center justify-center p-8 group">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">No Image</span>
              )}

              {/* Status Badges */}
              {product.discountedPrice && (
                <Badge className="absolute top-4 left-4 bg-red-600 text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 border-0 shadow-md">
                  Sale
                </Badge>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {allImages.length > 1 && (
              <div className="flex flex-wrap gap-3.5 justify-center">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative h-16 w-16 bg-[#151515] border rounded overflow-hidden flex items-center justify-center p-1 transition-all duration-200 cursor-pointer ${
                      activeImage === img ? "border-gold scale-105" : "border-zinc-800 hover:border-gold/40"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      width={56}
                      height={56}
                      className="object-contain w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Wishlist & Compare Quick Actions */}
            <div className="flex justify-center gap-8 pt-4 border-t border-zinc-900/40 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex items-center gap-2 transition-colors cursor-pointer ${
                  isWishlisted ? "text-gold hover:text-gold-hover" : "text-zinc-500 hover:text-gold"
                }`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-gold text-gold" : ""}`} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>

              <button
                onClick={() => toggleCompare(product)}
                className={`flex items-center gap-2 transition-colors cursor-pointer ${
                  isCompared ? "text-gold hover:text-gold-hover" : "text-zinc-500 hover:text-gold"
                }`}
              >
                <RefreshCw className="h-4 w-4" />
                {isCompared ? "Remove Compare" : "Compare"}
              </button>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            
            {/* Header info */}
            <div>
              {/* Brand Link */}
              <Link href={`/shop?brand=${product.brand._id}`} className="text-xs font-black uppercase text-gold hover:underline tracking-widest">
                {product.brand.name}
              </Link>
              
              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide leading-tight mt-2">
                {product.name}
              </h1>

              {/* Rating & Stock Status */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-gold text-xs">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3 w-3 ${
                          s <= Math.round(ratingVal) ? "fill-gold text-gold" : "text-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-zinc-500">({reviewCount} Reviews)</span>
                </div>

                {/* Stock Indicator */}
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                  {isInStock ? (
                    <span className="flex items-center gap-1 text-green-500">
                      <Check className="h-4 w-4 stroke-[3]" />
                      In Stock
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500">
                      <X className="h-4 w-4 stroke-[3]" />
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Price section */}
            <div className="p-4 bg-[#111] border border-zinc-900 rounded-lg">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white">
                  AED {(product.discountedPrice ?? product.sellingPrice).toFixed(2)}
                </span>
                {product.discountedPrice && (
                  <span className="text-sm text-zinc-500 line-through font-semibold">
                    AED {product.sellingPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                Prices include 5% VAT.
              </p>
            </div>

            {/* Description Short */}
            <p className="text-zinc-400 text-xs leading-relaxed">
              {product.description || "Premium quality industrial tool designed for professional engineering and hardware solutions. Built with high-grade components for long-term durability and efficiency."}
            </p>

            {/* Technical Quick Specs Grid */}
            <div className="border-t border-b border-zinc-900 py-4 grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span className="font-bold text-zinc-500 uppercase tracking-wider">Brand</span>
                <span className="font-semibold text-white uppercase">{product.brand.name}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span className="font-bold text-zinc-500 uppercase tracking-wider">Category</span>
                <span className="font-semibold text-white uppercase">{product.category.name}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span className="font-bold text-zinc-500 uppercase tracking-wider">SKU</span>
                <span className="font-mono text-zinc-300">{product.sku}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                <span className="font-bold text-zinc-500 uppercase tracking-wider">Unit</span>
                <span className="font-semibold text-zinc-300 uppercase">{product.unit || "piece"}</span>
              </div>
            </div>

            {/* Branch Stock Breakdown Drawer/Display */}
            <div className="bg-[#111]/60 border border-zinc-900 rounded-lg p-4">
              <h4 className="text-[10px] font-extrabold text-gold uppercase tracking-[0.15em] mb-2.5">
                Branch Stock Availability
              </h4>
              {inventory.length === 0 ? (
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">No branch stock details available.</p>
              ) : (
                <div className="space-y-1.5 text-xs">
                  {inventory.map((item) => (
                    <div key={item._id} className="flex justify-between items-center bg-[#161616]/60 p-2 rounded">
                      <span className="font-semibold text-zinc-300 uppercase tracking-wider">
                        {item.branch ? `${item.branch.name} (${item.branch.code})` : "Unknown Branch"}
                      </span>
                      <span className={`font-black tracking-wider ${item.quantity > 0 ? "text-green-500" : "text-zinc-500"}`}>
                        {item.quantity > 0 ? `${item.quantity} units` : "Out of stock"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Panel (Quantity, Add to Cart, Buy Now) */}
            <div className="space-y-4 pt-4 border-t border-zinc-900/60">
              <div className="flex flex-wrap items-center gap-4">
                {/* Quantity selector */}
                <div className="flex items-center border border-zinc-800 rounded bg-[#111] overflow-hidden h-11 shrink-0 select-none">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={!isInStock}
                    className="px-3.5 text-zinc-500 hover:text-gold disabled:text-zinc-800 transition-colors font-bold text-base cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-extrabold text-white text-xs">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={!isInStock}
                    className="px-3.5 text-zinc-500 hover:text-gold disabled:text-zinc-800 transition-colors font-bold text-base cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={!isInStock || isAdding}
                  className={`flex-1 min-w-[140px] border h-11 font-extrabold uppercase tracking-widest text-[10px] rounded cursor-pointer transition-all duration-300 ${
                    added
                      ? "bg-green-600 border-green-600 text-white"
                      : "bg-transparent border-gold text-gold hover:bg-gold hover:text-black shadow-md shadow-gold/5"
                  }`}
                >
                  {isAdding ? "Processing..." : added ? "Added ✓" : "ADD TO CART"}
                </Button>

                {/* Buy Now Button */}
                <Button
                  onClick={handleBuyNow}
                  disabled={!isInStock || isAdding}
                  className="flex-1 min-w-[140px] bg-gold hover:bg-gold-hover text-black font-extrabold uppercase tracking-widest text-[10px] h-11 rounded cursor-pointer shadow-lg shadow-gold/15 active:scale-[0.98] transition-all duration-200"
                >
                  BUY NOW
                </Button>
              </div>
            </div>

          </div>
        </div>

        {/* 3. USP Grid Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { icon: Truck, title: "Fast Delivery", sub: "Across UAE" },
            { icon: RefreshCcw, title: "7 Days Return", sub: "Easy Returns" },
            { icon: ShieldCheck, title: "Original Products", sub: "100% Genuine" },
            { icon: CreditCard, title: "Secure Payment", sub: "100% Safe" },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#0c0c0c] border border-zinc-900 rounded-xl p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center shrink-0 text-gold">
                <item.icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-white leading-tight">{item.title}</p>
                <p className="text-[9px] text-zinc-500 font-semibold uppercase mt-0.5 leading-none">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Tab details Layout */}
        <div className="mt-14 bg-[#0c0c0c] border border-zinc-900 rounded-xl overflow-hidden shadow-2xl">
          {/* Tab Headers */}
          <div className="flex border-b border-zinc-900 bg-[#0f0f0f]/60 overflow-x-auto">
            {[
              { id: "description", label: "Description" },
              { id: "specifications", label: "Specifications" },
              { id: "reviews", label: `Reviews (${reviewCount})` },
              { id: "shipping", label: "Shipping & Returns" },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4.5 text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2 shrink-0 cursor-pointer ${
                    isSelected
                      ? "text-gold border-gold bg-[#0c0c0c]"
                      : "text-zinc-500 border-transparent hover:text-zinc-300"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="p-6 md:p-8 text-xs leading-relaxed text-zinc-300">
            {activeTab === "description" && (
              <div className="space-y-6">
                <p className="text-zinc-400">
                  {product.description || "This premium tool is sourced directly from certified manufacturers, complying with high industrial standards in the UAE. Designed for contractors, maintenance firms, and DIY users requiring performance, reliability, and precision."}
                </p>

                {/* Key Features List from Specs */}
                {product.specifications && product.specifications.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px]">
                      Key Features
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-2 list-inside list-disc text-zinc-400">
                      {product.specifications.map((spec, i) => (
                        <li key={i}>
                          <span className="font-bold text-zinc-300">{spec.key}:</span> {spec.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="max-w-xl">
                <div className="border border-zinc-900 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      <tr className="border-b border-zinc-900 bg-[#0e0e0e]/40">
                        <td className="p-3 font-bold text-zinc-500 uppercase w-1/3">Brand</td>
                        <td className="p-3 text-zinc-300 font-semibold uppercase">{product.brand.name}</td>
                      </tr>
                      <tr className="border-b border-zinc-900">
                        <td className="p-3 font-bold text-zinc-500 uppercase">Category</td>
                        <td className="p-3 text-zinc-300 font-semibold uppercase">{product.category.name}</td>
                      </tr>
                      <tr className="border-b border-zinc-900 bg-[#0e0e0e]/40">
                        <td className="p-3 font-bold text-zinc-500 uppercase">SKU</td>
                        <td className="p-3 text-zinc-400 font-mono">{product.sku}</td>
                      </tr>
                      <tr className="border-b border-zinc-900">
                        <td className="p-3 font-bold text-zinc-500 uppercase">Barcode</td>
                        <td className="p-3 text-zinc-400 font-mono">{product.barcode}</td>
                      </tr>
                      {product.specifications &&
                        product.specifications.map((spec, index) => (
                          <tr
                            key={index}
                            className={`border-b border-zinc-900 ${
                              index % 2 === 0 ? "bg-[#0e0e0e]/40" : ""
                            }`}
                          >
                            <td className="p-3 font-bold text-zinc-500 uppercase">{spec.key}</td>
                            <td className="p-3 text-zinc-300 font-semibold">{spec.value}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-4 pb-6 border-b border-zinc-900">
                  <div className="text-center">
                    <span className="text-3xl font-black text-white">{ratingVal.toFixed(1)}</span>
                    <span className="text-[10px] block text-zinc-500 uppercase mt-0.5">out of 5</span>
                  </div>
                  <div>
                    <div className="flex text-gold">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4.5 w-4.5 ${
                            s <= Math.round(ratingVal) ? "fill-gold text-gold" : "text-zinc-800"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase mt-1 block">
                      Based on {reviewCount} customer reviews
                    </span>
                  </div>
                </div>

                {/* Simulated Reviews List */}
                <div className="space-y-5 pt-4">
                  {[
                    {
                      name: "Ahmed K.",
                      rating: 5,
                      date: "2026-06-15",
                      comment: "Excellent power and battery life. Sourced this for our fabrication warehouse in Dubai. Highly recommended for heavy duty work!",
                    },
                    {
                      name: "John D.",
                      rating: 5,
                      date: "2026-06-02",
                      comment: "Solid build quality. The dual speed settings are very helpful and ergonomic. Genuine manufacturer seal. Al Ajer is always reliable.",
                    },
                    {
                      name: "Saeed M.",
                      rating: 4,
                      date: "2026-05-20",
                      comment: "Great customer service and fast delivery across Dubai Al Quoz. The specs matched exactly what we needed. Highly recommended.",
                    },
                  ].map((rev, i) => (
                    <div key={i} className="p-4 bg-[#111] border border-zinc-900/60 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-white text-[11px] uppercase tracking-wider">{rev.name}</span>
                        <span className="text-[10px] text-zinc-600 font-bold">{rev.date}</span>
                      </div>
                      <div className="flex text-gold">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3 w-3 ${s <= rev.rating ? "fill-gold text-gold" : "text-zinc-800"}`}
                          />
                        ))}
                      </div>
                      <p className="text-zinc-400 text-xs leading-relaxed mt-1.5">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4 max-w-xl text-zinc-400">
                <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px] mb-2">
                  Delivery &amp; Shipping Policy
                </h4>
                <p>
                  We offer fast and reliable shipping across all emirates in the UAE: Dubai, Abu Dhabi, Sharjah, Ajman, Fujairah, Ras Al Khaimah, and Umm Al Quwain.
                </p>
                <ul className="list-inside list-disc space-y-1 mt-2 text-zinc-400">
                  <li><span className="font-bold text-zinc-300">Dubai &amp; Sharjah:</span> Standard delivery within 1-2 business days.</li>
                  <li><span className="font-bold text-zinc-300">Other Emirates:</span> Delivery within 2-3 business days.</li>
                  <li><span className="font-bold text-zinc-300">Self Pickup:</span> Available at our main physical stores in Al Quoz, Dubai.</li>
                  <li><span className="font-bold text-zinc-300">Cash on Delivery:</span> Surcharge free for B2B accounts.</li>
                </ul>
                <h4 className="font-extrabold text-white uppercase tracking-wider text-[11px] mt-6 mb-2">
                  Returns &amp; Exchanges
                </h4>
                <p>
                  Items can be returned or exchanged within 7 days of purchase in their original packaging and unused condition. Please contact sales to raise return orders.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 5. Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3.5 mb-8 pb-4 border-b border-zinc-900/60">
              <div className="h-4 w-1 bg-gold rounded-full"></div>
              <h2 className="text-lg md:text-xl font-black tracking-widest uppercase text-white">
                RELATED <span className="text-gold">PRODUCTS</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

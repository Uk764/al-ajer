"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ShoppingCart, User, Menu, Heart, ChevronDown, Hammer, Trash2, X, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useCart } from "@/shared/context/CartContext";
import { useAuth } from "@/shared/context/AuthContext";
import { useWishlist } from "@/shared/context/WishlistContext";
import { useCompare } from "@/shared/context/CompareContext";
import { getCategories, Category, getInventoryByProduct } from "@/shared/lib/api";
import TopBar from "@/customer/components/TopBar";
import NavMenu from "@/customer/components/NavMenu";
import AddToCartButton from "@/customer/components/AddToCartButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";

const ADMIN_ROLES = ["admin", "manager", "staff"];

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, token } = useAuth();
  const { wishlistItems, removeFromWishlist, wishlistCount } = useWishlist();
  const { compareItems, removeFromCompare, clearCompare, compareCount } = useCompare();
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // States
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories in header", err));
  }, []);

  // Sync inputs with URL
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "");
  }, [searchParams]);

  let accountHref = "/login";
  if (mounted && user) {
    accountHref = ADMIN_ROLES.includes(user.role) ? "/admin" : "/account";
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`/shop?${params.toString()}`);
  };

  // Get all unique specification keys across compared products
  const uniqueSpecKeys = Array.from(
    new Set(
      compareItems.flatMap((item) => (item.specifications || []).map((s) => s.key))
    )
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#0a0a0a]/95 backdrop-blur border-b border-zinc-900/60">
        <TopBar />

        <div className="border-b border-zinc-900 bg-[#0e0e0e]/80">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
              <div className="h-11 w-11 rounded-full border-2 border-gold flex items-center justify-center flex-shrink-0 group-hover:border-gold-hover transition-colors duration-300">
                <Hammer className="h-5 w-5 text-gold group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-2xl font-extrabold tracking-wider text-gold group-hover:text-gold-hover transition-colors duration-300">
                  AL AJER
                </span>
                <span className="text-[9px] tracking-widest text-zinc-500 uppercase font-medium">
                  Building Material Trading LLC
                </span>
              </div>
            </Link>

            {/* Search bar with category dropdown */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden flex-1 max-w-xl md:flex items-stretch border border-zinc-800 focus-within:border-gold rounded-md overflow-visible bg-[#141414] transition-colors duration-200"
            >
              {/* Category Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  type="button"
                  className="h-full flex items-center gap-1.5 px-4 bg-[#1a1a1a] text-[11px] uppercase tracking-wider text-zinc-300 font-bold hover:text-gold border-r border-zinc-800 transition-colors flex-shrink-0 cursor-pointer"
                >
                  {selectedCategory
                    ? categories.find((c) => c._id === selectedCategory)?.name || "Category"
                    : "All Categories"}
                  <ChevronDown className="h-3 w-3 text-gold" />
                </button>
                {categoryDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setCategoryDropdownOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-1.5 w-56 rounded-md bg-[#0e0e0e] border border-zinc-800 z-50 py-1.5 shadow-2xl max-h-64 overflow-y-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory("");
                          setCategoryDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-[10px] font-bold text-zinc-400 hover:text-gold hover:bg-gold/5 transition-colors uppercase tracking-widest border-b border-zinc-900 pb-2 mb-1"
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat._id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat._id);
                            setCategoryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-1.5 text-[10px] font-bold transition-colors uppercase tracking-widest ${
                            selectedCategory === cat._id
                              ? "text-gold bg-gold/5"
                              : "text-zinc-400 hover:text-gold hover:bg-gold/5"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Text Input */}
              <div className="flex-1 flex items-center relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 15,000+ products..."
                  className="w-full h-10 px-4 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                />
              </div>

              {/* Search Submit Button */}
              <button
                type="submit"
                className="px-5 bg-gold hover:bg-gold-hover text-black font-semibold flex items-center justify-center flex-shrink-0 transition-colors duration-200 cursor-pointer"
              >
                <Search className="h-4.5 w-4.5" />
              </button>
            </form>

            {/* Right side icons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Account */}
              <Link href={accountHref} className="hidden md:block">
                <Button
                  variant="ghost"
                  className="flex-col h-auto py-1.5 px-3.5 gap-1 text-zinc-400 hover:text-gold hover:bg-[#161616] transition-all duration-200"
                >
                  <User className="h-5 w-5" />
                  <span className="text-[10px] font-medium tracking-wide">
                    {!mounted ? "Login" : user ? "Account" : "Login"}
                  </span>
                </Button>
              </Link>

              {/* Wishlist Sheet Drawer */}
              <Sheet>
                <SheetTrigger asChild>
                  <button className="relative flex flex-col items-center justify-center py-1.5 px-3.5 gap-1 text-zinc-400 hover:text-gold transition-all duration-200 cursor-pointer bg-transparent border-0 outline-none">
                    <Heart className="h-5 w-5" />
                    <span className="text-[10px] font-medium tracking-wide">Wishlist</span>
                    {mounted && wishlistCount > 0 && (
                      <span className="absolute top-1 right-3.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold text-black text-[10px] font-bold shadow-lg shadow-gold/20 animate-pulse">
                        {wishlistCount}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="bg-[#0c0c0c] border-zinc-900 text-[#f5f5f5] w-full sm:max-w-md p-6 overflow-y-auto"
                >
                  <SheetHeader className="border-b border-zinc-900 pb-4 mb-6">
                    <SheetTitle className="text-lg font-extrabold uppercase tracking-wider text-white">
                      My <span className="text-gold">Wishlist</span> ({mounted ? wishlistCount : 0})
                    </SheetTitle>
                  </SheetHeader>
                  {!mounted || wishlistItems.length === 0 ? (
                    <div className="text-center py-20">
                      <Heart className="h-10 w-10 text-gold mx-auto mb-4 opacity-50" />
                      <p className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">Your wishlist is empty.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {wishlistItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex gap-4 p-3 bg-[#111111] border border-zinc-900 rounded-lg items-center relative group"
                        >
                          <div className="w-16 h-16 bg-[#161616] rounded overflow-hidden flex items-center justify-center shrink-0">
                            {item.thumbnailUrl ? (
                              <Image
                                src={item.thumbnailUrl}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="object-contain w-full h-full"
                              />
                            ) : (
                              <span className="text-[10px] text-zinc-600">No Image</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${item.slug}`}
                              className="block text-xs font-bold text-zinc-200 hover:text-gold truncate"
                            >
                              {item.name}
                            </Link>
                            <p className="text-[10px] text-zinc-500 mt-0.5">{item.brand.name}</p>
                            <p className="text-xs font-bold text-gold mt-1.5">
                              AED {item.discountedPrice ?? item.sellingPrice}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 shrink-0">
                            <AddToCartButton productId={item._id} />
                            <button
                              onClick={() => removeFromWishlist(item._id)}
                              className="text-[9px] text-zinc-500 hover:text-red-500 font-extrabold uppercase tracking-widest flex items-center gap-1 bg-transparent border-0 cursor-pointer justify-center"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </SheetContent>
              </Sheet>

              {/* Cart */}
              <Link href="/cart" className="relative group">
                <Button
                  variant="ghost"
                  className="flex-col h-auto py-1.5 px-3.5 gap-1 text-zinc-400 hover:text-gold hover:bg-[#161616] transition-all duration-200"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-[10px] font-medium tracking-wide">Cart</span>
                </Button>
                {mounted && itemCount > 0 && (
                  <span className="absolute top-1 right-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold text-black text-[10px] font-bold shadow-lg shadow-gold/20 animate-pulse">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Icon */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-zinc-400 hover:text-gold cursor-pointer"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-zinc-900 bg-[#0e0e0e] py-4 px-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
            {/* Search Input for Mobile */}
            <form onSubmit={handleSearchSubmit} className="flex border border-zinc-800 rounded overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-3 py-2 bg-[#141414] text-sm text-zinc-100 outline-none"
              />
              <button type="submit" className="bg-gold px-4 text-black">
                <Search className="h-4 w-4" />
              </button>
            </form>
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-xs uppercase font-bold tracking-widest text-zinc-300 hover:text-gold"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-xs uppercase font-bold tracking-widest text-zinc-300 hover:text-gold"
              >
                Shop
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-xs uppercase font-bold tracking-widest text-zinc-300 hover:text-gold"
              >
                About Us
              </Link>
              <Link
                href="/stores"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-xs uppercase font-bold tracking-widest text-zinc-300 hover:text-gold"
              >
                Our Stores
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-xs uppercase font-bold tracking-widest text-zinc-300 hover:text-gold"
              >
                Contact Us
              </Link>
              <Link
                href={accountHref}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-xs uppercase font-bold tracking-widest text-zinc-300 hover:text-gold border-t border-zinc-900 mt-2 pt-2 flex items-center gap-2"
              >
                <User className="h-4 w-4 text-gold" />
                {!mounted ? "Login / Register" : user ? "My Account" : "Login / Register"}
              </Link>
            </div>
          </div>
        )}

        <NavMenu />
      </header>

      {/* 4. Product Comparison Floating Bar */}
      {mounted && compareCount > 0 && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0c0c0c] border-2 border-gold/40 rounded-xl py-3.5 px-5 shadow-2xl shadow-black/80 flex items-center gap-6 max-w-lg md:max-w-xl animate-bounce-short">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-gold animate-ping" />
            <p className="text-xs font-bold uppercase tracking-wider text-white">
              Compare <span className="text-gold">List</span> ({compareCount}/4)
            </p>
          </div>

          {/* Thumbnails of items */}
          <div className="flex gap-2">
            {compareItems.map((item) => (
              <div
                key={item._id}
                className="relative h-10 w-10 bg-[#161616] border border-zinc-800 rounded overflow-hidden flex items-center justify-center group/item shrink-0"
              >
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <span className="text-[8px] text-zinc-600">No Image</span>
                )}
                <button
                  onClick={() => removeFromCompare(item._id)}
                  className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5 text-red-500 stroke-[3]" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => setIsCompareOpen(true)}
              className="bg-gold hover:bg-gold-hover text-black font-extrabold uppercase tracking-wider text-[10px] px-3.5 py-1.5 h-8 rounded"
            >
              Compare Now
            </Button>
            <button
              onClick={clearCompare}
              className="text-[10px] uppercase font-bold text-zinc-500 hover:text-zinc-200 tracking-wider bg-transparent border-0 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Comparison Modal Overlay */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[#0b0b0b] border border-zinc-800 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-900 bg-[#0e0e0e]">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">
                  Product <span className="text-gold">Comparison</span>
                </h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">
                  Comparing specifications side-by-side
                </p>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="h-8 w-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {compareItems.length === 0 ? (
                <div className="text-center py-20 text-zinc-500">
                  No products added to compare.
                </div>
              ) : (
                <div className="min-w-[600px] border border-zinc-900 rounded-lg overflow-hidden bg-[#0c0c0c]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-900 bg-[#0f0f0f]">
                        <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider w-1/5">Specification</th>
                        {compareItems.map((item) => (
                          <th key={item._id} className="p-4 font-bold text-zinc-200 text-center w-1/4 border-l border-zinc-900">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-20 h-20 bg-[#161616] rounded flex items-center justify-center p-2 relative">
                                {item.thumbnailUrl ? (
                                  <Image
                                    src={item.thumbnailUrl}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    className="object-contain w-full h-full"
                                  />
                                ) : (
                                  <span className="text-[9px] text-zinc-600">No Image</span>
                                )}
                                <button
                                  onClick={() => removeFromCompare(item._id)}
                                  className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="line-clamp-2 leading-tight uppercase font-extrabold tracking-wider text-[10px] hover:text-gold block max-w-[150px]">
                                {item.name}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {/* Price Row */}
                      <tr className="border-b border-zinc-900 hover:bg-zinc-900/10">
                        <td className="p-4 font-bold text-zinc-400 uppercase tracking-wider">Price</td>
                        {compareItems.map((item) => (
                          <td key={item._id} className="p-4 text-center font-extrabold text-gold border-l border-zinc-900">
                            AED {item.discountedPrice ?? item.sellingPrice}
                            {item.discountedPrice && (
                              <span className="block text-[10px] text-zinc-500 line-through font-normal mt-0.5">
                                AED {item.sellingPrice}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>

                      {/* Brand Row */}
                      <tr className="border-b border-zinc-900 hover:bg-zinc-900/10">
                        <td className="p-4 font-bold text-zinc-400 uppercase tracking-wider">Brand</td>
                        {compareItems.map((item) => (
                          <td key={item._id} className="p-4 text-center text-zinc-300 font-semibold uppercase tracking-wider border-l border-zinc-900">
                            {item.brand.name}
                          </td>
                        ))}
                      </tr>

                      {/* Category Row */}
                      <tr className="border-b border-zinc-900 hover:bg-zinc-900/10">
                        <td className="p-4 font-bold text-zinc-400 uppercase tracking-wider">Category</td>
                        {compareItems.map((item) => (
                          <td key={item._id} className="p-4 text-center text-zinc-300 font-semibold uppercase tracking-wider border-l border-zinc-900">
                            {item.category.name}
                          </td>
                        ))}
                      </tr>

                      {/* SKU Row */}
                      <tr className="border-b border-zinc-900 hover:bg-zinc-900/10">
                        <td className="p-4 font-bold text-zinc-400 uppercase tracking-wider">SKU</td>
                        {compareItems.map((item) => (
                          <td key={item._id} className="p-4 text-center text-zinc-400 font-mono border-l border-zinc-900">
                            {item.sku}
                          </td>
                        ))}
                      </tr>

                      {/* Unique Specs Rows */}
                      {uniqueSpecKeys.map((key) => (
                        <tr key={key} className="border-b border-zinc-900 hover:bg-zinc-900/10">
                          <td className="p-4 font-bold text-zinc-400 uppercase tracking-wider">{key}</td>
                          {compareItems.map((item) => {
                            const val = (item.specifications || []).find((s) => s.key === key)?.value || "-";
                            return (
                              <td key={item._id} className="p-4 text-center text-zinc-300 font-semibold border-l border-zinc-900">
                                {val}
                              </td>
                            );
                          })}
                        </tr>
                      ))}

                      {/* Actions Row */}
                      <tr className="hover:bg-zinc-900/10">
                        <td className="p-4 font-bold text-zinc-400 uppercase tracking-wider">Action</td>
                        {compareItems.map((item) => (
                          <td key={item._id} className="p-4 text-center border-l border-zinc-900">
                            <AddToCartButton productId={item._id} />
                            <Link href={`/products/${item.slug}`} onClick={() => setIsCompareOpen(false)} className="inline-flex items-center gap-1 text-[10px] font-bold text-gold hover:text-gold-hover uppercase tracking-widest mt-2">
                              View Details
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
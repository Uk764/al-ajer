"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, Heart, ChevronDown, Hammer } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useCart } from "@/shared/context/CartContext";
import { useAuth } from "@/shared/context/AuthContext";
import TopBar from "@/customer/components/TopBar";
import NavMenu from "@/customer/components/NavMenu";

const ADMIN_ROLES = ["admin", "manager", "staff"];

export default function Navbar() {
  const { itemCount } = useCart();
  const { user } = useAuth();

  let accountHref = "/login";
  if (user) {
    accountHref = ADMIN_ROLES.includes(user.role) ? "/admin" : "/account";
  }

  return (
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
          <div className="hidden flex-1 max-w-xl md:flex items-stretch border border-zinc-800 focus-within:border-gold rounded-md overflow-hidden bg-[#141414] transition-colors duration-200">
            <button className="flex items-center gap-1.5 px-4 bg-[#1a1a1a] text-xs text-zinc-300 font-medium hover:text-gold border-r border-zinc-800 transition-colors flex-shrink-0 cursor-pointer">
              All Categories
              <ChevronDown className="h-3 w-3 text-gold" />
            </button>
            <div className="flex-1 flex items-center relative">
              <input
                placeholder="Search 15,000+ products..."
                className="w-full h-10 px-3 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
              />
            </div>
            <button className="px-5 bg-gold hover:bg-gold-hover text-black font-semibold flex items-center justify-center flex-shrink-0 transition-colors duration-200 cursor-pointer">
              <Search className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href={accountHref} className="hidden md:block">
              <Button variant="ghost" className="flex-col h-auto py-1.5 px-3.5 gap-1 text-zinc-400 hover:text-gold hover:bg-[#161616] transition-all duration-200">
                <User className="h-5 w-5" />
                <span className="text-[10px] font-medium tracking-wide">
                  {user ? "Account" : "Login"}
                </span>
              </Button>
            </Link>
            
            <Button variant="ghost" className="hidden md:flex flex-col h-auto py-1.5 px-3.5 gap-1 text-zinc-400 hover:text-gold hover:bg-[#161616] transition-all duration-200">
              <Heart className="h-5 w-5" />
              <span className="text-[10px] font-medium tracking-wide">Wishlist</span>
            </Button>
            
            <Link href="/cart" className="relative group">
              <Button variant="ghost" className="flex-col h-auto py-1.5 px-3.5 gap-1 text-zinc-400 hover:text-gold hover:bg-[#161616] transition-all duration-200">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-[10px] font-medium tracking-wide">Cart</span>
              </Button>
              {itemCount > 0 && (
                <span className="absolute top-1 right-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gold text-black text-[10px] font-bold shadow-lg shadow-gold/20 animate-pulse">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
            
            <Button variant="ghost" size="icon" className="md:hidden text-zinc-400 hover:text-gold">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      <NavMenu />
    </header>
  );
}
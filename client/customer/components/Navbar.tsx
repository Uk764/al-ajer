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
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur">
      <TopBar />

      <div className="border-b border-border">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="h-11 w-11 rounded-full border-2 border-primary flex items-center justify-center flex-shrink-0">
              <Hammer className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-bold tracking-wide text-primary">
                AL AJER
              </span>
              <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
                Building Material Trading LLC
              </span>
            </div>
          </Link>

          {/* Search bar with category dropdown */}
          <div className="hidden flex-1 max-w-xl md:flex items-stretch border border-border rounded-md overflow-hidden">
            <button className="flex items-center gap-1 px-3 bg-secondary text-xs text-muted-foreground border-r border-border flex-shrink-0">
              All Categories
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="flex-1 flex items-center relative">
              <input
                placeholder="Search 15,000+ products..."
                className="w-full h-9 px-3 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button className="px-4 bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
              <Search className="h-4 w-4" />
            </button>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Link href={accountHref} className="hidden md:block">
              <Button variant="ghost" className="flex-col h-auto py-1.5 px-3 gap-0.5">
                <User className="h-5 w-5" />
                <span className="text-[10px] text-muted-foreground">
                  {user ? "Account" : "Login"}
                </span>
              </Button>
            </Link>
            <Button variant="ghost" className="hidden md:flex flex-col h-auto py-1.5 px-3 gap-0.5">
              <Heart className="h-5 w-5" />
              <span className="text-[10px] text-muted-foreground">Wishlist</span>
            </Button>
            <Link href="/cart" className="relative">
              <Button variant="ghost" className="flex-col h-auto py-1.5 px-3 gap-0.5">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-[10px] text-muted-foreground">Cart</span>
              </Button>
              {itemCount > 0 && (
                <span className="absolute top-0 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <NavMenu />
    </header>
  );
}
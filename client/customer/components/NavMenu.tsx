"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "About Us", href: "/about" },
  { label: "Our Stores", href: "/stores" },
  { label: "Contact Us", href: "/contact" },
];

export default function NavMenu() {
  const pathname = usePathname();

  return (
    <div className="hidden md:block border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 flex items-center gap-2">
        {menuItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-5 py-3.5 text-xs tracking-wider uppercase font-medium transition-colors ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
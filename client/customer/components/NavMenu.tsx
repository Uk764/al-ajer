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
    <div className="hidden md:block border-b border-zinc-900 bg-[#0c0c0c]">
      <div className="mx-auto max-w-7xl px-4 flex items-center justify-center gap-1">
        {menuItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative px-5 py-4 text-[11px] tracking-widest uppercase font-semibold transition-all duration-300 overflow-hidden flex items-center ${
                isActive
                  ? "text-gold bg-zinc-900/40"
                  : "text-zinc-400 hover:text-gold"
              }`}
            >
              <span>{item.label}</span>
              {/* Gold animated line indicator */}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-gold transition-all duration-300 ${
                  isActive ? "w-full scale-x-100" : "w-full scale-x-0 group-hover:scale-x-100 hover:scale-x-100"
                } origin-left`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
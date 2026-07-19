"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/shared/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tags,
  Boxes,
  Award,
  Store,
  UserCog,
  Ticket,
  Image as ImageIcon,
  BarChart3,
  LogOut,
  MessageSquare,
} from "lucide-react";

const ADMIN_ROLES = ["admin", "manager", "staff"];

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Brands", href: "/admin/brands", icon: Award },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Branches", href: "/admin/branches", icon: Store },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Staff", href: "/admin/staff", icon: UserCog },
  { label: "Coupons", href: "/admin/coupons", icon: Ticket },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!ADMIN_ROLES.includes(user.role)) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !ADMIN_ROLES.includes(user.role)) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card shrink-0 flex flex-col">
        <div className="p-6 border-b border-border">
          <span className="text-xl font-bold text-primary tracking-wide">
            AL AJER
          </span>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-secondary hover:text-foreground w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
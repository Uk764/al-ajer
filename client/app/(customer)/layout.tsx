"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/customer/components/Navbar";
import Footer from "@/customer/components/Footer";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayout =
    pathname === "/login" ||
    pathname === "/register";

  return (
    <>
      {!hideLayout && (
        <Suspense fallback={<div className="h-32 bg-[#0a0a0a]" />}>
          <Navbar />
        </Suspense>
      )}

      {children}

      {!hideLayout && <Footer />}
    </>
  );
}
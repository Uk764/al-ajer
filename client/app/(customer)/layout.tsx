"use client";

import { usePathname } from "next/navigation";
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
      {!hideLayout && <Navbar />}

      {children}

      {!hideLayout && <Footer />}
    </>
  );
}
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";

const sortOptions = [
  { label: "Newest", value: "" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A-Z", value: "name_asc" },
];

export default function SortControl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "";
  const currentLabel = sortOptions.find((o) => o.value === currentSort)?.label || "Sort";

  function handleSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    params.delete("page"); // reset to page 1 whenever sort changes
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-zinc-800 bg-[#0e0e0e] text-zinc-300 hover:border-gold hover:text-gold transition-all duration-200 font-bold uppercase tracking-wider text-[10px] rounded-md shadow-sm cursor-pointer px-4 h-9">
          Sort: {currentLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-[#0e0e0e] border-zinc-800 text-zinc-300">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSortChange(option.value)}
            className="text-xs font-medium hover:bg-gold/10 hover:text-gold focus:bg-gold/10 focus:text-gold cursor-pointer transition-colors"
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
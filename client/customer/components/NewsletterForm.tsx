"use client";

import { Button } from "@/shared/components/ui/button";

export default function NewsletterForm() {
  return (
    
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        placeholder="Enter your email address"
        required
        className="flex-1 h-11 px-4 rounded-md border border-zinc-800 bg-[#121212] text-sm text-white placeholder:text-zinc-600 outline-none focus:border-gold transition-colors"
      />
      <Button
        type="submit"
        className="bg-gold hover:bg-gold-hover text-black font-bold uppercase tracking-wider text-xs px-6 h-11 rounded cursor-pointer"
      >
        Subscribe
      </Button>
    </form>
  );
}

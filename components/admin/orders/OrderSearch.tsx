"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState, Suspense } from "react";

function OrderSearchInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (term: string) => {
    setQuery(term);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative">
      <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isPending ? "text-[var(--color-brand-green)] animate-pulse" : "text-gray-400"}`} />
      <input 
        type="text" 
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search Order ID, Name, Email, Date..." 
        className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] transition-all min-w-[280px]"
      />
    </div>
  );
}
export default function OrderSearch() {
  return (
    <Suspense fallback={
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          disabled
          placeholder="Search Order ID, Name, Email, Date..."
          className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm min-w-[280px] opacity-60"
        />
      </div>
    }>
      <OrderSearchInner />
    </Suspense>
  );
}
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Loader2, Leaf } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

interface SearchResult {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images?: string[];
  categoryId?: { name: string };
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Auto-focus on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  const fetchResults = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.products || []);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(val), 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open search"
        className="flex items-center gap-2 px-3 sm:px-4 py-2.5 bg-brand-bg hover:bg-brand-primary/8 border border-[#E8E6E1] hover:border-brand-primary/30 rounded-xl text-brand-text-muted hover:text-brand-primary transition-all duration-200 group"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:block text-sm font-bold">Search...</span>
        <kbd className="hidden sm:flex items-center gap-0.5 ml-1 px-1.5 py-0.5 bg-white border border-[#E8E6E1] rounded-md text-[10px] font-bold text-brand-text-muted group-hover:border-brand-primary/30 transition-colors">
          <span className="text-[10px]">⌘</span>K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="search-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[80] bg-brand-text/30 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <motion.div
              key="search-modal"
              initial={{ opacity: 0, scale: 0.97, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-10 left-1/2 -translate-x-1/2 z-[90] w-[95vw] max-w-2xl"
            >
              <div className="bg-white rounded-[2rem] premium-shadow border border-[#E8E6E1] overflow-hidden">

                {/* Search Input */}
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center gap-4 px-6 py-5 border-b border-[#E8E6E1]">
                    {loading ? (
                      <Loader2 className="w-5 h-5 text-brand-primary animate-spin shrink-0" />
                    ) : (
                      <Search className="w-5 h-5 text-brand-text-muted shrink-0" />
                    )}
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={handleChange}
                      placeholder='Search products... e.g. "mango chips"'
                      className="flex-1 text-base font-medium text-brand-text bg-transparent outline-none placeholder:text-brand-text-muted/60"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
                        className="p-1.5 text-brand-text-muted hover:text-brand-primary transition-colors rounded-lg hover:bg-brand-primary/5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!query.trim()}
                      className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-brand-primary disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-black rounded-xl hover:bg-[#164a20] transition-colors uppercase tracking-widest"
                    >
                      Search <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Results */}
                {results.length > 0 ? (
                  <div className="max-h-[55vh] overflow-y-auto">
                    <div className="px-6 pt-4 pb-2">
                      <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-[0.2em]">
                        {results.length} result{results.length !== 1 ? "s" : ""} found
                      </p>
                    </div>
                    <div className="px-3 pb-3 flex flex-col gap-0.5">
                      {results.map((product) => (
                        <Link
                          key={product._id}
                          href={`/products/${product.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-brand-primary/5 transition-all group"
                        >
                          <div className="w-14 h-14 rounded-xl bg-brand-bg border border-[#E8E6E1] flex items-center justify-center overflow-hidden shrink-0 group-hover:border-brand-primary/30 transition-colors">
                            {product.images?.[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-2" />
                            ) : (
                              <Leaf className="w-6 h-6 text-brand-text-muted/50" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-brand-text truncate group-hover:text-brand-primary transition-colors">{product.name}</p>
                            {product.categoryId?.name && (
                              <p className="text-xs font-bold text-brand-text-muted mt-0.5">{product.categoryId.name}</p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-base font-black text-brand-primary">₹{product.price.toFixed(2)}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-brand-text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>

                    {/* See All */}
                    <div className="border-t border-[#E8E6E1] px-6 py-4">
                      <button
                        onClick={() => { setOpen(false); router.push(`/products?q=${encodeURIComponent(query)}`); }}
                        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-black text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all uppercase tracking-widest"
                      >
                        View all results for "{query}" <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : query.trim().length >= 2 && !loading ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-7 h-7 text-brand-text-muted" />
                    </div>
                    <p className="text-base font-bold text-brand-text mb-2">No results for "{query}"</p>
                    <p className="text-sm text-brand-text-muted font-medium">Try a different search term or browse our categories.</p>
                  </div>
                ) : (
                  <div className="px-6 py-8">
                    <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-[0.2em] mb-4">Quick Links</p>
                    <div className="flex flex-wrap gap-2">
                      {["Mango Chips", "Banana Flakes", "Dried Fruits", "Healthy Snacks"].map((term) => (
                        <button
                          key={term}
                          onClick={() => { setQuery(term); fetchResults(term); }}
                          className="px-4 py-2 bg-brand-bg border border-[#E8E6E1] text-sm font-bold text-brand-text rounded-full hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Hint */}
              <div className="flex items-center justify-center gap-4 mt-3 text-xs font-bold text-white/70">
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-white/20 rounded-md text-[10px]">↵</kbd> to search</span>
                <span className="flex items-center gap-1.5"><kbd className="px-1.5 py-0.5 bg-white/20 rounded-md text-[10px]">Esc</kbd> to close</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

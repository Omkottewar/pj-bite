"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, Sparkles, ArrowRight } from "lucide-react";
import { showSuccess, showToast } from "@/lib/swal";

export default function WishlistPage() {
  const { status } = useSession();
  const { items, removeItem: removeFromWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.images?.[0] || "",
      vendorId: "",
    });
    showSuccess("Added to Cart!", `${item.name} is now in your cart.`);
  };

  const handleRemove = async (id: string) => {
    removeFromWishlist(id);
    showToast("Removed from wishlist", "success");
    if (status === "authenticated") {
      await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      }).catch(() => null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      {/* Hero Header */}
      <div className="relative bg-white border-b border-[#E8E6E1] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-brand-bg pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shadow-sm">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-text-muted">Your Collection</p>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-text tracking-tighter font-serif">Wishlist</h1>
            </div>
          </div>
          <p className="text-sm text-brand-text-muted font-medium max-w-md">
            {items.length > 0
              ? `${items.length} ${items.length === 1 ? "item" : "items"} saved — ready to add to cart anytime.`
              : "Save products you love and come back to them anytime."}
          </p>
          {status !== "authenticated" && items.length > 0 && (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 mt-4 text-xs font-black text-brand-primary hover:underline"
            >
              Sign in to save across devices <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {items.length === 0 ? (
          /* ── Empty State ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-24 gap-6"
          >
            <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center shadow-inner">
              <Heart className="w-10 h-10 text-rose-300" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-brand-text tracking-tight mb-2">Your wishlist is empty</h2>
              <p className="text-sm text-brand-text-muted font-medium max-w-xs">
                Browse our collection and tap the heart icon to save your favourite products.
              </p>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-full font-black text-sm hover:bg-[#164a20] transition-all shadow-lg shadow-brand-primary/20 hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" /> Explore Products
            </Link>
          </motion.div>
        ) : (
          /* ── Wishlist Grid ── */
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            <AnimatePresence>
              {items.map((item, idx) => {
                const imageUrl = item.images?.[0] || "";
                const hasDiscount = item.originalPrice && item.originalPrice > item.price;
                const savingsPct = hasDiscount
                  ? Math.round(((item.originalPrice! - item.price) / item.originalPrice!) * 100)
                  : 0;

                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: idx * 0.04 } }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    className="group bg-white rounded-[1.25rem] border border-gray-100 hover:border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-300 flex flex-col relative"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-[#E8E6E1] flex items-center justify-center text-rose-400 hover:bg-rose-50 hover:border-rose-300 transition-all shadow-sm"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Discount badge */}
                    {hasDiscount && (
                      <div className="absolute top-2.5 left-2.5 z-20 bg-red-500/90 backdrop-blur-sm text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                        −{savingsPct}% OFF
                      </div>
                    )}

                    {/* Product Image */}
                    <Link href={`/products/${item.slug}`} className="block relative">
                      <div className="aspect-[4/3] bg-gradient-to-b from-[#fcfpf8] to-[#f5f2ec] overflow-hidden relative">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.name}
                            fill
                            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out will-change-transform drop-shadow-sm"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Heart className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">PJ BITE</p>
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 leading-snug hover:text-brand-primary transition-colors mb-3">
                          {item.name}
                        </h3>
                      </Link>

                      <div className="mt-auto flex flex-col gap-3">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm sm:text-base font-black text-gray-900">₹{item.price}</span>
                          {hasDiscount && (
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹{item.originalPrice}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-full py-1.5 sm:py-2 bg-brand-primary text-white text-[9px] sm:text-[10px] font-black rounded-lg uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-black transition-all shadow-sm hover:shadow-md group/btn"
                        >
                          <ShoppingCart className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
                          Add To Cart
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

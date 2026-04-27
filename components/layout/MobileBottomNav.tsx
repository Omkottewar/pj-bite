"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useSession } from "next-auth/react";
import { Home, Grid3x3, ShoppingCart, Heart, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { label: "Home",      href: "/",           icon: Home },
  { label: "Shop",      href: "/products",   icon: Grid3x3 },
  { label: "Cart",      href: null,          icon: ShoppingCart, isCart: true },
  { label: "Wishlist",  href: "/wishlist",   icon: Heart,        isWishlist: true },
  { label: "Account",   href: "/dashboard",  icon: UserCircle },
];

export default function MobileBottomNav() {
  const pathname     = usePathname();
  const openCart     = useCartStore((s) => s.openCart);
  const openAuthModal = useCartStore((s) => s.openAuthModal);
  const items        = useCartStore((s) => s.items);
  const wishlistItems = useWishlistStore((s) => s.items);
  const { status }   = useSession();

  const [cartCount,     setCartCount]     = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mounted,       setMounted]       = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted) {
      setCartCount(items.reduce((a, i) => a + i.quantity, 0));
      setWishlistCount(wishlistItems.length);
    }
  }, [items, wishlistItems, mounted]);

  if (pathname.startsWith("/admin")) return null;

  const isActive = (href: string | null) => {
    if (!href) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-[#E8E6E1] shadow-[0_-4px_20px_rgba(0,0,0,0.07)]">
      <div className="flex items-stretch h-[58px]">
        {NAV.map(({ label, href, icon: Icon, isCart, isWishlist }) => {
          const active = (isCart || isWishlist) ? (isWishlist ? pathname === "/wishlist" : false) : isActive(href);

          const inner = (
            <span className={`flex flex-col items-center justify-center gap-[3px] w-full h-full relative select-none transition-colors
              ${active ? (isWishlist ? "text-rose-500" : "text-brand-primary") : "text-[#9A9A9A]"}`}>
              {active && (
                <motion.span
                  layoutId="bottom-active"
                  className={`absolute top-0 inset-x-3 h-[2px] rounded-b-full ${isWishlist ? "bg-rose-500" : "bg-brand-primary"}`}
                />
              )}
              <span className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 ${isWishlist && active ? "fill-rose-400 text-rose-500" : ""}`}
                  strokeWidth={active ? 2.5 : 1.8}
                />

                {/* Cart badge */}
                {isCart && mounted && cartCount > 0 && (
                  <AnimatePresence>
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.6 }}
                      className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] px-0.5 bg-brand-primary text-white text-[8px] font-black flex items-center justify-center rounded-full border border-white"
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </motion.span>
                  </AnimatePresence>
                )}

                {/* Wishlist badge */}
                {isWishlist && mounted && wishlistCount > 0 && (
                  <AnimatePresence>
                    <motion.span
                      key={wishlistCount}
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.6 }}
                      className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] px-0.5 bg-rose-500 text-white text-[8px] font-black flex items-center justify-center rounded-full border border-white"
                    >
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </motion.span>
                  </AnimatePresence>
                )}
              </span>
              <span className="text-[9.5px] font-semibold leading-none">{label}</span>
            </span>
          );

          if (label === "Account" && status !== "authenticated") {
            return (
              <button 
                key={label} 
                onClick={() => openAuthModal()} 
                className="flex-1 flex items-center justify-center focus:outline-none"
              >
                {inner}
              </button>
            );
          }

          if (isCart) {
            return (
              <button key={label} onClick={openCart} aria-label="Open Cart" className="flex-1 flex items-center justify-center focus:outline-none">
                {inner}
              </button>
            );
          }

          return (
            <Link key={label} href={href!} aria-label={label} className="flex-1 flex items-center justify-center">
              {inner}
            </Link>
          );
        })}
      </div>
      {/* iOS safe area padding */}
      <div className="h-[env(safe-area-inset-bottom,0px)] bg-white" />
    </nav>
  );
}

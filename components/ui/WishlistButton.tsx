"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { motion, AnimatePresence } from "framer-motion";

interface WishlistButtonProps {
  productId: string;
  product?: any;
  size?: "sm" | "md";
  className?: string;
}

export default function WishlistButton({ productId, product, size = "md", className = "" }: WishlistButtonProps) {
  const { isWishlisted, addItem, removeItem } = useWishlistStore();
  const [burst, setBurst] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const liked = isWishlisted(productId);
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  const btnSize = size === "sm" ? "w-7 h-7" : "w-9 h-9";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (liked) {
      removeItem(productId);
    } else if (product) {
      addItem({
        _id: product._id || product.id || productId,
        name: product.name || "Product",
        slug: product.slug || productId,
        price: product.price || 0,
        originalPrice: product.originalPrice,
        images: product.images
      });
      setBurst(true);
      setTimeout(() => setBurst(false), 600);
    }
  };

  if (!isMounted) {
    return (
      <button
        className={`relative ${btnSize} rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-md border border-white/60 group ${className}`}
        aria-label="Wishlist"
      >
        <Heart className={`${iconSize} text-gray-400`} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`relative ${btnSize} rounded-full flex items-center justify-center bg-white/90 backdrop-blur-sm shadow-md border border-white/60 transition-all duration-200 hover:scale-110 group ${className}`}
      aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
    >
      {/* Heart Icon */}
      <motion.div
        key={liked ? "liked" : "unliked"}
        initial={liked ? { scale: 0.5 } : { scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
      >
        <Heart
          className={`${iconSize} transition-colors duration-200 ${
            liked ? "fill-red-500 text-red-500" : "text-gray-400 group-hover:text-red-400"
          }`}
        />
      </motion.div>

      {/* Burst Particles */}
      <AnimatePresence>
        {burst &&
          [0, 60, 120, 180, 240, 300].map((angle) => (
            <motion.span
              key={angle}
              className="absolute w-1 h-1 rounded-full bg-red-400 pointer-events-none"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((angle * Math.PI) / 180) * 14,
                y: Math.sin((angle * Math.PI) / 180) * 14,
                opacity: 0,
                scale: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ))}
      </AnimatePresence>
    </button>
  );
}

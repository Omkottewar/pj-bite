"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductGallery({ images, productName }: { images: string[]; productName: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images && images.length > 0 ? images : [""]; // Fallback to empty if none

  return (
    <div className="w-full">
      {/* Main Image Frame */}
      <div className="w-full aspect-square bg-[var(--background)] rounded-[2rem] p-4 flex items-center justify-center relative overflow-hidden premium-shadow border border-[var(--color-brand-green)]/10">
        <AnimatePresence mode="wait">
          {displayImages[currentIndex] ? (
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              src={displayImages[currentIndex]}
              alt={`${productName} - Image ${currentIndex + 1}`}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          ) : (
             <div className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm">No Image</div>
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2 hide-scrollbar snap-x">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 snap-center ${
                currentIndex === idx
                  ? "border-[var(--color-brand-green)] opacity-100 scale-105 premium-shadow"
                  : "border-transparent opacity-50 hover:opacity-100 bg-[var(--background)] hover:scale-100"
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

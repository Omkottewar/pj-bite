"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductImageGallery({ images }: { images: string[] }) {
  const [activeImage, setActiveImage] = useState(0);

  const displayImages = images?.length > 0 ? images : ["https://placehold.co/800x800/f8f9fa/a0a0a0?text=No+Image"];

  return (
    <div className="flex flex-col gap-5 lg:sticky lg:top-28">
      {/* Main Hero Image */}
      <div className="w-full aspect-[4/5] lg:aspect-[3/4] xl:aspect-square bg-white rounded-[2rem] border border-[#E8E6E1]/80 overflow-hidden relative premium-shadow flex items-center justify-center p-6 group">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={displayImages[activeImage]}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700"
            alt="Product View"
          />
        </AnimatePresence>
        
        {/* Subtle inner highlight */}
        <div className="absolute inset-0 border border-white/60 rounded-[2rem] pointer-events-none" />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`relative w-24 h-24 shrink-0 rounded-2xl flex items-center justify-center p-2.5 overflow-hidden transition-all duration-300 snap-center ${
                activeImage === idx 
                  ? "bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transform -translate-y-1" 
                  : "bg-white/50 border border-[#E8E6E1]/60 hover:border-brand-primary/30 opacity-60 hover:opacity-100 hover:bg-white saturate-50 hover:saturate-100"
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain mix-blend-multiply" />
              
              {/* Active Ring Indicator */}
              {activeImage === idx && (
                <motion.div 
                  layoutId="active-ring"
                  className="absolute inset-0 rounded-2xl border-2 border-brand-primary pointer-events-none"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

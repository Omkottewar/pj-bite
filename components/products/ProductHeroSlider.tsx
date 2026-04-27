"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";

export default function ProductHeroSlider({ 
  images, 
  name, 
  heroHighlights, 
  claims 
}: { 
  images: string[]; 
  name: string; 
  heroHighlights: string[]; 
  claims: string[]; 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If no images, or just 1, fallback gracefully.
  const displayImages = images.length > 0 ? images : ["https://placehold.co/800x800/f8f9fa/a0a0a0?text=No+Image"];

  useEffect(() => {
    if (displayImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayImages.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));

  // Determine the active Highlight/Subtitle based on the slide index natively.
  const activeSubtitle = heroHighlights && heroHighlights.length > 0
    ? heroHighlights[currentIndex % heroHighlights.length]
    : name;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
      <div className="relative w-full h-[350px] sm:h-[400px] lg:h-[450px] overflow-hidden bg-gray-900 flex items-center rounded-3xl sm:rounded-[2.5rem] shadow-2xl ring-1 ring-black/5">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImages[currentIndex]}
            alt={name}
            className="w-full h-full object-cover opacity-70"
          />
          {/* Elegant Gradient Overlay mapping premium visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-14 text-white">
        <div className="max-w-2xl">
          <motion.div
            key={`text-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 leading-[1.1]">
              {name}
            </h1>
            
            <p className="text-base sm:text-lg text-[var(--color-brand-green)] font-semibold tracking-wide mb-6">
              {activeSubtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
              {claims.map((claim, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-brand-green)] flex-shrink-0" />
                  <span className="text-[13px] sm:text-sm font-medium text-gray-200">{claim}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {displayImages.length > 1 && (
        <div className="absolute top-1/2 -translate-y-1/2 right-6 flex flex-col gap-2 z-20">
          <button
            onClick={prevSlide}
            className="w-8 h-8 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
          >
            <ChevronLeft className="w-4 h-4 -ml-0.5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-8 h-8 rounded-full border border-white/20 bg-[var(--color-brand-green)] flex items-center justify-center text-white hover:bg-white hover:text-[var(--color-brand-green)] transition-all"
          >
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      )}

      {/* Progress Indicators */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-6 left-8 flex gap-1.5 z-20">
          {displayImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                idx === currentIndex ? "w-6 bg-[var(--color-brand-green)]" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  </div>
  );
}

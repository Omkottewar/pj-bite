"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Fallback Explicit Array mapping User's exact requested 6 properties perfectly.
const explicitHeroProducts = [
  {
    name: "Mixed Dried Fruit & Nuts",
    subtitle: "Wholesome Nutrition in Every Bite",
    claims: ["No Added Sugar", "No Preservatives", "Packed with Goodness", "Farm Direct"],
    image: "https://images.unsplash.com/photo-1596591606968-35edbc2fa706?auto=format&fit=crop&q=80",
    slug: "mixed-dried-fruit-flax"
  },
  {
    name: "Premium Walnut Kernels",
    subtitle: "Brain Food directly from Kashmir",
    claims: ["No Processing", "100% Natural", "Omega-3 Rich"],
    image: "https://plus.unsplash.com/premium_photo-1671587630737-14264663e26f?q=80&w=1200",
    slug: "dried-guava-flax"
  },
  {
    name: "Dried Afghan Apricots",
    subtitle: "Naturally Sweet & Chewy",
    claims: ["No Added Sugar", "High Fiber", "Antioxidant Rich"],
    image: "https://images.unsplash.com/photo-1599813589998-971c0dfaa5ed?q=80&w=1200",
    slug: "dried-mango-flax" 
  },
  {
    name: "Roasted Pistachios",
    subtitle: "Lightly Salted, Perfectly Crunchy",
    claims: ["Protein Packed", "Heart Healthy", "Premium Grade"],
    image: "https://images.unsplash.com/photo-1588693724391-4cf468202b37?q=80&w=1200",
    slug: "dried-avocado-flax"
  },
  {
    name: "Medjool Dates Jumbo",
    subtitle: "Caramel-like Natural Sweetness",
    claims: ["No Added Sugar", "Energy Boosting", "Farm Direct"],
    image: "https://images.unsplash.com/photo-1615485987158-9418e20e837f?q=80&w=1200",
    slug: "dried-pineapple-flax"
  },
  {
    name: "Californian Almonds",
    subtitle: "Crunchy & Nutrient Dense",
    claims: ["Vitamin E Rich", "100% Organic", "Raw & Unsalted"],
    image: "https://images.unsplash.com/photo-1505253818610-18e388151bbf?q=80&w=1200",
    slug: "dried-sapota-flax"
  }
];

export default function CollectionHeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % explicitHeroProducts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % explicitHeroProducts.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? explicitHeroProducts.length - 1 : prev - 1));

  const activeSlide = explicitHeroProducts[currentIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
      <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[500px] overflow-hidden bg-brand-primary-dark flex items-center rounded-3xl sm:rounded-[2.5rem] shadow-2xl shadow-brand-primary/10 border border-brand-primary/20">
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
              src={activeSlide.image}
              alt={activeSlide.name}
              className="w-full h-full object-cover opacity-[0.85]"
            />
            {/* Elegant Gradient Overlay mapping premium visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-primary-dark via-brand-primary-dark/60 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 text-white max-w-4xl">
          <motion.div
            key={`text-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-accent">Featured Selection {currentIndex + 1}/6</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-4 leading-[1.1] font-serif text-white">
              {activeSlide.name}
            </h1>
            
            <p className="text-base sm:text-lg text-brand-bg font-semibold tracking-wide mb-8 font-serif italic">
              {activeSlide.subtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mb-10">
              {activeSlide.claims.map((claim, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent flex-shrink-0" />
                  <span className="text-sm font-bold text-white/90 uppercase tracking-widest">{claim}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/products/${activeSlide.slug}`}
              className="inline-flex items-center gap-3 bg-brand-accent hover:bg-white hover:text-brand-primary-dark hover:scale-105 transition-all text-brand-primary-dark font-black px-8 py-3.5 rounded-xl shadow-xl shadow-black/20 text-sm uppercase tracking-widest"
            >
              Discover
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-6 right-6 flex gap-3 z-20">
          <button
            onClick={prevSlide}
            className="w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-accent hover:border-brand-accent hover:text-brand-primary-dark transition-all shadow-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="w-12 h-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-accent hover:border-brand-accent hover:text-brand-primary-dark transition-all shadow-md"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="absolute bottom-8 left-8 sm:left-12 flex gap-2 z-20">
          {explicitHeroProducts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 transition-all duration-300 rounded-full ${
                idx === currentIndex ? "w-8 bg-brand-accent" : "w-2 bg-white/40 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

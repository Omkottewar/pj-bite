"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Grid3x3, ShoppingCart, Search, User, Star, ChevronDown,
  Shield, Leaf, Truck, Award, Plus, Minus,
  ChevronRight, ChevronLeft, ArrowRight, Package, Sprout, Sun, CheckCircle,
  Gift, Dumbbell, Utensils, Sparkles, Flame
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import WishlistButton from "@/components/ui/WishlistButton";
import { showSuccess, showToast } from "@/lib/swal";

// ── Stats ──────────────────────────────────────────────────────────────────
// ── Stats (Trust Strip) ───────────────────────────────────────────────────
const STATS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
        <path d="M12 2L15 8H9L12 2Z" fill="#22C55E" stroke="none" />
        <circle cx="12" cy="14" r="8" stroke="#1a3a20" />
        <path d="M12 10V18" stroke="#D4A017" />
        <path d="M8 14H16" stroke="#D4A017" />
      </svg>
    ),
    label: "No Colour Added",
    subline: "100% Raw Nature"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
        <path d="M20 7L12 3L4 7V17L12 21L20 17V7Z" stroke="#1a3a20" />
        <path d="M12 8L12 16M8 12L16 12" stroke="#22C55E" />
      </svg>
    ),
    label: "No Added Sugar",
    subline: "Natural Fruit Sugars"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
        <path d="M10 2L8 8H16L14 2H10Z" fill="#1a3a20" stroke="none" />
        <path d="M8 8C5 8 4 12 4 15C4 19 8 22 12 22C16 22 20 19 20 15C20 12 19 8 16 8" stroke="#1a3a20" />
        <circle cx="12" cy="15" r="3" fill="#22C55E" stroke="none" />
      </svg>
    ),
    label: "No Chemical",
    subline: "Zero Toxins"
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#1a3a20" />
        <path d="M7 12L10 15L17 8" stroke="#22C55E" />
      </svg>
    ),
    label: "No Flavour",
    subline: "Authentic Taste"
  },
];

const HERO_SLIDES = [
  { img: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=1200&auto=format&fit=crop", title: "Healthy Tasty & Ready When Cravings Strike." },
  { img: "https://images.unsplash.com/photo-1629824908064-05bf4705ecbd?q=80&w=1200&auto=format&fit=crop", title: "100% Natural Freshly Harvested Almonds." },
  { img: "https://images.unsplash.com/photo-1596591606975-97e3a9dc1def?q=80&w=1200&auto=format&fit=crop", title: "Premium Walnuts for a Healthy Brain." },
  { img: "https://images.unsplash.com/photo-1521994191316-ff264fabb9c5?q=80&w=1200&auto=format&fit=crop", title: "Rich, Sweet & Nutritious Dates." },
  { img: "https://images.unsplash.com/photo-1615486171448-4fb3255dc703?q=80&w=1200&auto=format&fit=crop", title: "Handpicked Cashews for Daily Energy." },
];

// ── Benefits ───────────────────────────────────────────────────────────────
const BENEFITS = [
  { icon: Truck, label: "Free Shipping", sub: "On Orders Above ₹499" },
  { icon: Shield, label: "100% Natural", sub: "No Preservatives Added" },
  { icon: Leaf, label: "Farm Direct", sub: "Sourced From Farmers" },
  { icon: Award, label: "Quality Assured", sub: "FSSAI Licensed Lab Tested" },
];

// ── Shop By Purpose ────────────────────────────────────────────────────────
const PURPOSES = [
  { label: "Gifting", Icon: Gift, href: "/products?category=gifts" },
  { label: "Snacking", Icon: Sprout, href: "/products?category=snacks" },
  { label: "Cooking", Icon: Utensils, href: "/products?category=cooking" },
  { label: "Fitness", Icon: Dumbbell, href: "/products?category=fitness" },
];

// ── FAQs ───────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "How long do dry fruits stay fresh?", a: "When stored in an airtight container in a cool, dry place, our dry fruits stay fresh for 6–12 months. Refrigeration can extend shelf life further." },
  { q: "Are your products free from preservatives?", a: "Yes! We use natural dehydration technology to preserve fruits. No artificial preservatives, chemicals, or additives are ever used." },
  { q: "Which dry fruit is best for daily consumption?", a: "Almonds, walnuts, and dates are excellent for daily use. They are packed with Omega-3, fiber, and natural energy." },
  { q: "Do you offer bulk orders for businesses?", a: "Absolutely! We offer special pricing for bulk orders. Contact us at infopjbite@gmail.com for corporate or wholesale inquiries." },
  { q: "How are your products sourced?", a: "We work directly with farmers across India and abroad, eliminating middlemen to ensure freshness, fair pricing, and quality." },
];

// ── Testimonials ───────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Priya S.", location: "Mumbai", rating: 5, text: "Best dry fruits I've tasted! The almonds are so fresh and crunchy. Love the packaging too — airtight and eco-friendly." },
  { name: "Rahul M.", location: "Pune", rating: 5, text: "Ordered the premium mix for Diwali gifting. Everyone loved it. Will definitely order again for the next season!" },
  { name: "Sneha K.", location: "Bangalore", rating: 5, text: "Great quality, fast delivery. The cashews melt in your mouth. Price is very reasonable for premium quality." },
];

/** nature picks data */
const NATURE_PICKS = [
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5"><path d="M12 2C7 2 4 8 4 14C4 20 9 22 12 22C18 22 20 18 20 12C20 6 15 2 12 2Z"/><path d="M12 2C13.5 0 16 1 16 3" stroke="#22C55E"/></svg>, name: "Dried Mango", tagline: "Tropical Sweetness. Naturally Preserved.", claims: ["Rich in Vitamin A", "Natural Energy Booster", "Source of Fiber"], line: "Naturally sweet mango packed with vitamins and fiber." },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="1.5"><path d="M12 2C8 2 6 8 6 15C6 19.5 9 22 12 22C15 22 18 19.5 18 15C18 8 16 2 12 2Z"/><circle cx="12" cy="15" r="3" stroke="#A16207"/></svg>, name: "Dried Avocado", tagline: "Creamy Nutrition. Power Packed.", claims: ["Source of Healthy Fats", "Supports Heart Health", "High in Fiber"], line: "A superfood snack rich in healthy fats and nutrition." },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="1.5"><rect x="7" y="9" width="10" height="13" rx="4"/><path d="M7 13L17 13M7 17L17 17M11 9V22M12 9C12 5 10 3 10 3C10 3 14 5 14 9" stroke="#22C55E"/></svg>, name: "Dried Pineapple", tagline: "Tangy. Juicy. Naturally Energizing.", claims: ["Rich in Vitamin C", "Supports Immunity", "Aids Digestion"], line: "A tropical snack packed with natural Vitamin C." },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="#84CC16" strokeWidth="1.5"><circle cx="12" cy="13" r="9"/><circle cx="12" cy="13" r="2" stroke="#EF4444"/><path d="M12 4C14 2 16 2 16 2" stroke="#22C55E"/></svg>, name: "Dried Guava", tagline: "Immunity Boosting Goodness.", claims: ["High in Vitamin C", "Rich in Antioxidants", "Good Source of Fiber"], line: "A nutrient-rich fruit loaded with Vitamin C." },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5"><path d="M12 22C6 22 4 12 6 7C6 7 9 9 12 9C15 9 18 7 18 7C20 12 18 22 12 22Z"/><path d="M12 9C12 5 10 3 12 3C14 3 12 5 12 9" stroke="#22C55E"/></svg>, name: "Dried Strawberry", tagline: "Sweet. Tangy. Naturally Powerful.", claims: ["Rich in Vitamin C", "High in Antioxidants", "Supports Skin Health"], line: "A vibrant berry packed with antioxidants and flavor." },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="#A16207" strokeWidth="1.5"><circle cx="12" cy="13" r="8"/><path d="M12 5C14 3 15 3 15 3" stroke="#22C55E"/></svg>, name: "Dried Sapota (Chikoo)", tagline: "Naturally Sweet. Energy Packed.", claims: ["Rich in Natural Energy", "Source of Fiber", "Contains Iron & Potassium"], line: "A naturally sweet, energy-rich traditional fruit snack." },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="1.5"><path d="M4 13C4 18 9 22 15 22C19 22 21 19 21 17C21 15 17 13 14 13C10 13 7 10 7 7C7 5 9 3 9 3C5 5 4 9 4 13Z"/><path d="M14 13C12 10 10 6 9 3" stroke="#A16207" strokeDasharray="2 2"/></svg>, name: "Dried Banana", tagline: "Instant Energy. Anytime Snack.", claims: ["Source of Potassium", "Natural Energy Booster", "Supports Muscle Function"], line: "A quick energy snack rich in potassium." },
  { icon: <svg viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.5"><circle cx="10" cy="14" r="6"/><circle cx="16" cy="10" r="4"/><circle cx="15" cy="18" r="3" stroke="#EAB308"/></svg>, name: "Mixed Dried Fruits", tagline: "A Blend of Nature's Best.", claims: ["Rich in Fiber & Antioxidants", "Variety of Nutrients", "Perfect for Gifting"], line: "A wholesome mix of fruits for everyday nutrition." },
];

/** quality cards data */
const QUALITY_CARDS = [
  { img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop", title: <>In-House R&D Experts</>, desc: "Our in-house R&D team ensures every product meets the highest standards of nutrition and safety.", alt: "R&D Experts" },
  { img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop", title: <>See the Proof.<br/>Don't Just Trust Us.</>, desc: <>Lab reports for every batch.<br/>Because real trust is built on transparency.</>, alt: "Lab Report" },
  { img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop", title: <>Pesticide Residue Test</>, desc: <>Every batch is tested for pesticide residue.<br/>Zero chemical contamination guaranteed.</>, alt: "Pesticide Test" },
  { img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop", title: <>Nutritional Analysis &amp;<br/>Shelf Life of the Product</>, desc: <>Comprehensive nutrition profiling &amp; shelf-life<br/>testing ensures premium quality in every bite.</>, alt: "Nutritional Analysis" },
];

function ProductCard({ product }: { product: any }) {
  const { addItem, setBuyNowItem, openCheckout, openAuthModal } = useCartStore((state) => state);
  const { status } = useSession();
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    addItem({
      id: product._id?.toString() || product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || "",
      vendorId: product.vendorId?.toString() || "",
    });
    showSuccess("Added to Cart!", `${product.name} is now in your cart.`);
    setTimeout(() => setAdding(false), 800);
  };

  const handleBuyNow = () => {
    if (status !== "authenticated") {
      showToast("Sign in to buy now! 💚");
      openAuthModal();
      return;
    }

    setBuyNowItem({
      id: product._id?.toString() || product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || "",
      vendorId: product.vendorId?.toString() || "",
      quantity: 1,
    });
    openCheckout();
  };

  const img = product.images?.[0] || product.image || "https://placehold.co/400x400/f5f0e8/8b7355?text=Dry+Fruit";
  const originalPrice = product.originalPrice || Math.round(product.price * 1.2);
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const productId = product._id?.toString() || product.id || "";

  return (
    <div className="group bg-white rounded-[1.25rem] border border-gray-100 hover:border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-300 flex flex-col h-full relative">
      {/* Image Container */}
      <div className="relative">
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5 items-start">
          {discount > 0 && (
            <span className="bg-red-500/90 backdrop-blur-sm text-white text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-sm">
              {discount}% OFF
            </span>
          )}
          {product.tag && (
            <span className={`backdrop-blur-sm text-white text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-sm flex items-center gap-1 ${product.tag === 'New' ? 'bg-[#1a3a20]' : 'bg-brand-primary/90'}`}>
              {product.tag === 'New' && <Sparkles className="w-2 h-2" />} {product.tag}
            </span>
          )}
        </div>
        
        {/* Wishlist Heart Button */}
        {productId && (
          <div className="absolute top-2.5 right-2.5 z-20">
            <WishlistButton productId={productId} product={product} size="sm" />
          </div>
        )}
        
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-[4/3] bg-gradient-to-b from-[#fcfaf8] to-[#f5f2ec] relative overflow-hidden">
            <Image 
              src={img} 
              alt={product.name} 
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out will-change-transform drop-shadow-sm" 
            />
          </div>
        </Link>
      </div>

      {/* Info Container */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <p className="text-[8px] sm:text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">PJ BITE</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 leading-snug hover:text-brand-primary transition-colors mb-2" title={product.name}>
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-0.5 mb-3" aria-label="5 star rating">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
          ))}
          <span className="text-[9px] text-gray-500 font-bold ml-1">(12)</span>
        </div>
        
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex items-baseline gap-1.5 text-gray-900">
            <span className="text-sm sm:text-base font-black">₹{product.price}</span>
            {discount > 0 && (
              <>
                <span className="sr-only">Original price: </span>
                <span className="text-[10px] text-gray-500 line-through">₹{originalPrice}</span>
              </>
            )}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={handleAdd}
              className={`flex-1 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black rounded-lg uppercase tracking-widest transition-all duration-200 shadow-sm border ${
                adding
                  ? "bg-brand-accent text-white border-brand-accent"
                  : "bg-white text-brand-primary border-brand-primary hover:bg-brand-primary hover:text-white"
              }`}
            >
              {adding ? "Added ✓" : "Add Cart"}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black rounded-lg uppercase tracking-widest bg-brand-primary text-white hover:bg-[#164a20] transition-all duration-200 shadow-sm"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── VerticalQualitySlider (MOBILE ONLY) ────────────────────────────────────
function VerticalQualitySlider() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % QUALITY_CARDS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const card = QUALITY_CARDS[currentIdx];

  return (
    <div 
      className="relative min-h-[380px] sm:min-h-[440px] flex flex-col items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full bg-[#FAF4E8] rounded-2xl overflow-hidden flex flex-col items-center pt-8 px-5 shadow-md border border-[#EBE3D3]"
        >
          <div className="text-center mb-5">
            <Sun className="w-6 h-6 text-[#E0D5B5] mx-auto mb-3" />
            <h3 className="text-[#1A3A20] text-[16px] font-black leading-tight mb-2 drop-shadow-sm">{card.title}</h3>
            <p className="text-[#4F5E48] text-[11px] font-bold leading-relaxed">{card.desc}</p>
          </div>
          
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-[105%] mt-auto h-48 sm:h-56 relative -bottom-2 rounded-t-[20px] overflow-hidden drop-shadow-sm"
          >
            <Image
              src={card.img}
              alt={card.alt}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover object-top"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination Dots */}
      <div className="flex gap-2.5 mt-6">
        {QUALITY_CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`transition-all duration-300 rounded-full ${
              currentIdx === i 
                ? "w-8 h-2 bg-brand-primary" 
                : "w-2 h-2 bg-brand-primary/20 hover:bg-brand-primary/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── CategoryCircle ─────────────────────────────────────────────────────────
function CategoryCircle({ cat }: { cat: any }) {
  return (
    <Link href={`/products?category=${cat.slug}`} className="flex flex-col items-center gap-3 shrink-0 group outline-none">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#fcfbf9] border border-[#E8E6E1] group-hover:border-brand-primary/50 group-hover:bg-white shadow-[0_4px_15px_rgba(0,0,0,0.02)] group-hover:shadow-[0_12px_25px_rgba(0,0,0,0.08)] transition-all duration-500 flex items-center justify-center group-hover:-translate-y-1.5 ring-4 ring-transparent group-hover:ring-brand-primary/5 overflow-hidden">
        {cat.image ? (
          <Image 
            src={cat.image} 
            alt={cat.name} 
            width={64} 
            height={64} 
            className="w-12 h-12 sm:w-16 sm:h-16 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <Leaf className="w-8 h-8 text-brand-primary/30 group-hover:scale-110 group-hover:text-brand-primary transition-all duration-500" strokeWidth={1.5} />
        )}
      </div>
      <span className="text-[11px] sm:text-[12px] font-black text-brand-text uppercase tracking-widest text-center leading-tight max-w-[85px] group-hover:text-brand-primary transition-colors">{cat.name}</span>
    </Link>
  );
}


// ── TestimonialsSection ─────────────────────────────────────────────────────
const ALL_REVIEWS = [
  { text: "Absolutely love the quality! The almonds are so fresh and crunchy. Zero artificial taste — just pure goodness in every bite.", name: "Priya S.", detail: "Mumbai · Almonds Premium" },
  { text: "Ordered the Diwali gift box and everyone loved it. The packaging is premium and the dry fruits taste absolutely amazing.", name: "Rahul M.", detail: "Pune · Gift Collection" },
  { text: "Great quality, fast delivery. The cashews melt in your mouth. Price is very reasonable for this level of premium quality.", name: "Sneha K.", detail: "Bangalore · Cashews" },
  { text: "The mixed fruit pack is my daily morning snack now. Natural, no sugar coating, and the freshness is unmatched anywhere else.", name: "Arjun V.", detail: "Jaipur · Mixed Fruit Pack" },
  { text: "Tried the walnuts after my doctor recommended them. Best I've had — not bitter at all, perfectly dried and full of flavour.", name: "Divya R.", detail: "Ahmedabad · Walnuts" },
  { text: "Farm-direct sourcing really shows. You can taste the difference from supermarket stuff. Will always order from PJ Bite.", name: "Ishita B.", detail: "Kolkata · Dates Premium" },
];

function TestimonialsSection() {
  const [page, setPage] = useState(0);
  const PER_PAGE = 6; // always show 6 (2 cols × 3 rows)
  const totalPages = Math.ceil(ALL_REVIEWS.length / PER_PAGE);
  const visible = ALL_REVIEWS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section className="mt-12 px-4 pb-2">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-[26px] sm:text-[34px] font-black text-brand-primary font-serif text-center mb-8 tracking-tight">
          500+ Happy Clients
        </h2>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-5 items-stretch">

          {/* LEFT — tall promo image panel */}
          <div className="relative w-full lg:w-[260px] shrink-0 rounded-2xl overflow-hidden min-h-[220px] lg:min-h-0 shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=600&auto=format&fit=crop"
              alt="Healthy dry fruits mix"
              fill
              sizes="(max-width: 1024px) 100vw, 260px"
              className="object-cover"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            {/* Text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-white text-lg font-black leading-tight mb-1">
                Have this daily.<br />
                <span className="text-brand-accent">Double your energy.</span>
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 mt-3 bg-brand-accent text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg hover:bg-[#c49015] transition-colors"
              >
                Shop Now <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* RIGHT — review grid + dots */}
          <div className="flex-1 flex gap-4 items-center">
            {/* 2-col grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {visible.map((r, i) => (
                <motion.div
                  key={`${page}-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-[#ECEAE5] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] transition-shadow duration-300 flex flex-col justify-between min-h-[120px]"
                >
                  <p className="text-[13px] text-[#3a3a3a] leading-relaxed font-medium mb-4 flex-1">
                    {r.text}
                  </p>
                  <p className="text-[12px] font-black text-brand-text">
                    {r.name} <span className="text-brand-text-muted font-semibold">- {r.detail}</span>
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Vertical dot navigation */}
            {totalPages > 1 && (
              <div className="hidden sm:flex flex-col gap-2.5 pl-1 shrink-0">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    aria-label={`Page ${i + 1}`}
                    className="transition-all duration-300"
                    style={{
                      width: i === page ? "10px" : "8px",
                      height: i === page ? "10px" : "8px",
                      borderRadius: "50%",
                      background: i === page ? "#1a3a20" : "#ccc",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile pagination dots */}
        {totalPages > 1 && (
          <div className="flex sm:hidden justify-center gap-2 mt-5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`rounded-full transition-all duration-300 ${i === page ? "w-6 h-2 bg-brand-primary" : "w-2 h-2 bg-gray-300"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── NewArrivalAddBtn ────────────────────────────────────────────────────────
function NewArrivalAddBtn({ product }: { product: any }) {
  const { addItem } = useCartStore((s) => s);
  const [adding, setAdding] = useState(false);

  const handle = () => {
    setAdding(true);
    addItem({
      id: product._id?.toString() || product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || product.image || "",
      vendorId: product.vendorId?.toString() || "",
    });
    showSuccess("Added to Cart!", `${product.name} is now in your cart.`);
    setTimeout(() => setAdding(false), 900);
  };

  return (
    <button
      onClick={handle}
      className={`w-full py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${
        adding
          ? "bg-brand-primary text-white border-brand-primary"
          : "bg-white text-brand-primary border-brand-primary hover:bg-brand-primary hover:text-white"
      }`}
    >
      {adding ? "Added ✓" : "+ Add to Cart"}
    </button>
  );
}

// ── BrandCarousel (ARC VERSION) ──────────────────────────────────────────
function BrandCarousel({ categories }: { categories: any[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const rafRef = useRef<number>(0);
  
  // Dragging refs
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  const [windowWidth, setWindowWidth] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const SPEED = 0.8;

  const baseItems = [
    ...categories.map((c) => ({ ...c, id: c._id || Math.random(), isAll: false })),
  ];
  
  // Create enough clones for seamless infinite scroll
  const allItems = baseItems.length > 0 ? [...baseItems, ...baseItems, ...baseItems, ...baseItems, ...baseItems, ...baseItems] : [];

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    
    const track = trackRef.current;
    if (!track) return;

    const trackWidth = track.scrollWidth / (allItems.length / baseItems.length);

    const tick = () => {
      if (!pausedRef.current && track && !isDraggingRef.current) {
        posRef.current += SPEED;
      }
      
      // Ensure positive and negative seamless wrapping
      if (trackWidth > 0) {
        while (posRef.current < 0) {
          posRef.current += trackWidth;
        }
        while (posRef.current >= trackWidth) {
          posRef.current -= trackWidth;
        }
      }

      if (track) {
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [baseItems.length, allItems.length]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    pausedRef.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const delta = startXRef.current - e.clientX;
    posRef.current += delta;
    startXRef.current = e.clientX;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    pausedRef.current = false;
  };

  const scrollLeft = () => {
    posRef.current -= 200;
  };

  const scrollRight = () => {
    posRef.current += 200;
  };

  if (allItems.length === 0) return null;

  return (
    <section className="mt-12 overflow-hidden py-12 relative bg-gradient-to-b from-transparent via-[#FAF9F6]/30 to-transparent group">
      {/* Header */}
      <div className="px-4 max-w-7xl mx-auto mb-2 flex flex-col items-center text-center">
        <p className="text-[10px] font-black text-brand-primary/60 uppercase tracking-[0.4em] mb-1">Discover</p>
        <h2 className="text-[26px] sm:text-[34px] font-black text-brand-text uppercase tracking-widest font-serif leading-none">Shop by Category</h2>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={scrollLeft}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white backdrop-blur-md border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.05)] rounded-full flex items-center justify-center text-brand-primary transition-all duration-300 hover:scale-110"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
      </button>

      <button 
        onClick={scrollRight}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white backdrop-blur-md border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.05)] rounded-full flex items-center justify-center text-brand-primary transition-all duration-300 hover:scale-110"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
      </button>

      <div 
        ref={wrapRef}
        className="relative w-full min-h-[180px] sm:min-h-[280px] mt-2 flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-pan-y"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; setHoveredIdx(null); handlePointerUp(); }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          ref={trackRef}
          className="flex gap-6 sm:gap-12 will-change-transform absolute left-0 transition-transform duration-75 ease-out"
          style={{ width: "max-content", touchAction: "none" }}
        >
          {allItems.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            
            return (
              <div
                key={`${item.id}-${idx}`}
                className="relative flex flex-col items-center shrink-0"
                onMouseEnter={() => setHoveredIdx(idx)}
              >
                <ArcItem 
                  item={item} 
                  idx={idx} 
                  posRef={posRef} 
                  wrapRef={wrapRef}
                  isHovered={isHovered}
                  windowWidth={windowWidth}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Sub-component to handle individual item motion logic
function ArcItem({ item, idx, posRef, wrapRef, isHovered, windowWidth }: any) {
  const itemRef = useRef<HTMLAnchorElement>(null);
  const [transform, setTransform] = useState({ y: 0, scale: 1, opacity: 1 });

  useEffect(() => {
    let raf: number;
    const updateMotion = () => {
      const el = itemRef.current;
      const wrap = wrapRef.current;
      if (!el || !wrap) return;

      const rect = el.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      
      const centerX = wrapRect.left + wrapRect.width / 2;
      const itemX = rect.left + rect.width / 2;
      
      // Normalized distance from center (-1 to 1)
      const dist = (itemX - centerX) / (windowWidth / 1.5);
      const absDist = Math.abs(dist);

      // Parabolic Arc Logic: y = depth * dist^2
      // On mobile we flatten the arc
      const arcDepth = windowWidth < 640 ? 60 : 120;
      const y = Math.min(absDist * absDist * arcDepth, arcDepth + 50);
      
      // Scale logic: larger in center
      const scaleBase = windowWidth < 640 ? 0.85 : 1;
      const scale = scaleBase + (Math.max(0, 1 - absDist * 1.5) * 0.25);
      
      // Opacity fades at the far edges
      const opacity = Math.max(0, 1 - (absDist * absDist * 0.8));

      setTransform({ y, scale, opacity });
      raf = requestAnimationFrame(updateMotion);
    };

    raf = requestAnimationFrame(updateMotion);
    return () => cancelAnimationFrame(raf);
  }, [windowWidth]);

  return (
    <Link
      ref={itemRef}
      href={`/products?category=${item.slug}`}
      className="flex flex-col items-center gap-5 transition-transform duration-300 ease-out"
      style={{
        transform: `translateY(${transform.y}px) scale(${transform.scale + (isHovered ? 0.1 : 0)})`,
        opacity: transform.opacity,
        zIndex: Math.round(100 - transform.y),
      }}
    >
      {/* Floating Disk */}
      <div className="relative group">
        {/* Glow Ring (appears when near center or hovered) */}
        <div 
          className={`absolute -inset-4 rounded-full transition-all duration-700 blur-xl opacity-0 group-hover:opacity-60 bg-brand-primary/20 ${
            transform.scale > 1.15 ? "opacity-40" : ""
          }`}
        />
        
        {/* Highlight Ring (as seen in image) */}
        <div 
          className={`absolute -inset-2 rounded-full border-2 border-brand-primary/10 transition-all duration-500 scale-90 group-hover:scale-100 group-hover:border-brand-primary/40 ${
            transform.scale > 1.2 ? "border-brand-primary/30 scale-100" : ""
          }`}
        />

        <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white border border-[#E8E6E1] shadow-[0_4px_10px_rgba(0,0,0,0.03)] group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.06)] flex items-center justify-center transition-all duration-500 overflow-hidden">
          {item.image ? (
            <Image 
              src={item.image} 
              alt={item.name} 
              width={48} 
              height={48} 
              className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]" 
            />
          ) : (
            <Leaf className="w-10 h-10 text-brand-primary/30" strokeWidth={1.5} />
          )}
        </div>
      </div>

      <div className="w-[80px] sm:w-[120px] px-1">
        <span className={`block text-[8px] sm:text-[9.5px] font-black text-brand-text uppercase tracking-[0.12em] text-center transition-all duration-300 leading-tight ${
          isHovered || transform.scale > 1.2 ? "text-brand-primary scale-105" : "opacity-60"
        }`}>
          {item.name}
        </span>
      </div>
    </Link>
  );
}


const BENEFIT_PRODUCTS = [
  {
    name: "Dried Mixed Fruit Pack",
    tagline: "Total Health Multiplier.",
    benefits: ["Boosts Immunity", "High Energy Levels", "Supports Vitality"],
    desc: "A balanced combination of fruits providing multiple vitamins, minerals, fiber & natural fruit sugars, supporting overall health, energy, and immunity.",
    svg: (
      <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.5">
        <motion.circle 
          animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          cx="12" cy="24" r="5.5" fill="#FFF3CC" stroke="#D4A017" strokeWidth="1.6"
        />
        <motion.circle 
          animate={{ scale: [1, 1.08, 1], x: [-1, 1, -1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          cx="22" cy="28" r="5" fill="#FFE4E4" stroke="#EF4444" strokeWidth="1.6"
        />
        <motion.circle 
          animate={{ scale: [1, 1.06, 1], y: [-1, 1, -1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          cx="30" cy="22" r="4.5" fill="#E8FFE4" stroke="#22C55E" strokeWidth="1.6"
        />
        <motion.path 
          animate={{ rotate: [-10, 10, -10], originX: "20px", originY: "12px" }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          d="M20 12 C19 8 17 7 17 7" stroke="#3B7A3B" strokeWidth="1.4"
        />
      </svg>
    ),
    bgColor: "bg-amber-50"
  },
  {
    name: "Mango Dices & Slices",
    tagline: "Tropical Immunity Booster.",
    benefits: ["Rich in Vitamin A & C", "Improves Eye Health", "Promotes Glowing Skin"],
    desc: "Rich in antioxidants, supports immunity, improves eye health, promotes glowing skin, and provides quick natural energy.",
    svg: (
      <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.5">
        <motion.path 
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          d="M20 32C12 32 10 22 14 15C16.5 9.5 20 8 20 8C20 8 23.5 9.5 26 15C30 22 28 32 20 32Z" fill="#FFF3CC" stroke="#D4A017" strokeWidth="1.7"
        />
        <motion.path 
          animate={{ rotate: [-15, 15, -15], originX: "20px", originY: "8px" }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          d="M20 8C18 5 15 4.5 15 7C15 8 17 8.5 20 8Z" fill="#3B7A3B" stroke="none"
        />
      </svg>
    ),
    bgColor: "bg-orange-50"
  },
  {
    name: "Dried Guava Flakes",
    tagline: "Gut Health Specialist.",
    benefits: ["Excellent Fiber Source", "Aids Digestion", "Regulates Blood Sugar"],
    desc: "Excellent source of fiber, Vitamin C & lycopene, improves digestion, supports gut health, boosts immunity, and helps regulate blood sugar.",
    svg: (
      <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.5">
        <motion.circle 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          cx="20" cy="21" r="11" fill="#E8FFE4" stroke="#22C55E" strokeWidth="1.7"
        />
        <motion.circle 
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          cx="20" cy="21" r="3" fill="#FFEECC" stroke="#D4A017" strokeWidth="1.3"
        />
      </svg>
    ),
    bgColor: "bg-green-50"
  },
  {
    name: "Dried Kiwi Slices",
    tagline: "Zesty Heart Defender.",
    benefits: ["High Vitamin K & C", "Improves Heart Health", "Enhances Digestion"],
    desc: "High in Vitamin C, Vitamin K & fiber, enhances digestion, supports immunity, improves heart health, and promotes healthy skin.",
    svg: (
      <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.5">
        <motion.ellipse 
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          cx="20" cy="21" rx="12" ry="12" fill="#C8F7C5" stroke="#22C55E" strokeWidth="1.7"
        />
        <motion.ellipse 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          cx="20" cy="21" rx="4" ry="4" fill="#FFF3CC" stroke="#D4A017" strokeWidth="1.3"
        />
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <motion.circle 
            key={i}
            animate={{ x: [0, Math.cos(deg) * 2, 0], y: [0, Math.sin(deg) * 2, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            cx={20 + 7 * Math.cos(deg * Math.PI/180)} 
            cy={21 + 7 * Math.sin(deg * Math.PI/180)} 
            r="0.8" fill="#1a1a1a"
          />
        ))}
      </svg>
    ),
    bgColor: "bg-emerald-50"
  },
  {
    name: "Dried Avocado Flakes",
    tagline: "Superfood Heart Fuel.",
    benefits: ["Rich in Healthy Fats", "Vitamin E Support", "Skin & Hair Vitality"],
    desc: "Rich in healthy fats (MUFA), Vitamin E & potassium, supports heart health, improves skin and hair health, and helps maintain energy levels.",
    svg: (
      <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.5">
        <motion.path 
          animate={{ scaleY: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          d="M20 33C13 33 11 25 13 18C15 12 18 9 20 9C22 9 25 12 27 18C29 25 27 33 20 33Z" fill="#C8F7C5" stroke="#22C55E" strokeWidth="1.7"
        />
        <motion.ellipse 
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          cx="20" cy="26" rx="4.5" ry="5.5" fill="#8B5E3C" stroke="#5C3317" strokeWidth="1.3"
        />
      </svg>
    ),
    bgColor: "bg-green-50"
  },
  {
    name: "Dried Strawberry Slices",
    tagline: "Antioxidant Powerhouse.",
    benefits: ["Reduces Oxidative Stress", "Polyphenol Rich", "Skin Rejuvenation"],
    desc: "Loaded with Vitamin C, antioxidants & polyphenols, supports skin health, boosts immunity, improves heart health, and reduces oxidative stress.",
    svg: (
      <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.5">
        <motion.path 
          animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          d="M20 33C14 33 11 23 13 16C13 16 16 18 20 18C24 18 27 16 27 16C29 23 26 33 20 33Z" fill="#FFD3D3" stroke="#EF4444" strokeWidth="1.7"
        />
        <motion.path 
          animate={{ rotate: [-10, 10, -10], originX: "20px", originY: "18px" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          d="M20 18C20 14 18 11 20 11C22 11 20 14 20 18Z" stroke="#22C55E" strokeWidth="1.5" fill="none"
        />
      </svg>
    ),
    bgColor: "bg-red-50"
  },
  {
    name: "Dried Pineapple Slices",
    tagline: "Digestive Catalyst.",
    benefits: ["Enzyme Bromelain", "Supports Bone Health", "Aids Digestion"],
    desc: "High in Vitamin C, manganese & bromelain enzyme, aids digestion, reduces inflammation, supports immunity, and promotes bone health.",
    svg: (
      <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.5">
        <motion.ellipse 
          animate={{ x: [-1, 1, -1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          cx="20" cy="24" rx="9" ry="10" fill="#FFF3CC" stroke="#D4A017" strokeWidth="1.7"
        />
        <motion.path 
          animate={{ rotate: [-15, 15, -15], originX: "20px", originY: "14px" }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          d="M20 14 C20 8 20 6 20 4" stroke="#3B7A3B" strokeWidth="1.7" fill="none"
        />
      </svg>
    ),
    bgColor: "bg-yellow-50"
  },
  {
    name: "Dried Banana Chips",
    tagline: "Sustained Energy Snack.",
    benefits: ["Potassium & Magnesium", "Supports Muscle Function", "Heart Health Support"],
    desc: "Packed with potassium, magnesium & dietary fiber, helps maintain heart health, supports muscle function, aids digestion, and provides sustained energy.",
    svg: (
      <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.5">
        <motion.path 
          animate={{ scaleX: [1, 1.05, 1], rotate: [-3, 3, -3] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          d="M8 26C8 20 12 12 20 11C28 10 33 16 32 22C32 26 28 30 20 30C14 30 8 30 8 26Z" fill="#FFF3CC" stroke="#D4A017" strokeWidth="1.7"
        />
      </svg>
    ),
    bgColor: "bg-amber-50"
  },
  {
    name: "Dried Papaya Slices",
    tagline: "Internal Detoxifyer.",
    benefits: ["Papain Enzyme", "Detoxes the Body", "Skin Health Focus"],
    desc: "Contains Vitamin A, Vitamin C & papain enzyme, improves digestion, supports skin health, boosts immunity, and helps detox the body.",
    svg: (
      <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.5">
        <motion.path 
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          d="M20 34C14 34 11 25 12 18C13 13 16 9 20 9C24 9 27 13 28 18C29 25 26 34 20 34Z" fill="#FFD38C" stroke="#F59E0B" strokeWidth="1.7"
        />
        <motion.ellipse 
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          cx="20" cy="25" rx="3.5" ry="4.5" fill="#1a3a20" stroke="#0f2014" strokeWidth="1"
        />
      </svg>
    ),
    bgColor: "bg-orange-50"
  },
  {
    name: "Dried Jackfruit Slices",
    tagline: "Metabolism Optimizer.",
    benefits: ["Antioxidant Rich", "Boosts Metabolism", "Supports Gut Health"],
    desc: "Rich in fiber, antioxidants & Vitamin B complex, supports digestion, boosts metabolism, improves energy levels, and promotes gut health.",
    svg: (
      <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.5">
        <motion.path 
          animate={{ skewX: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          d="M12 14C12 14 10 20 12 26C14 31 18 34 22 33C28 31 31 25 30 19C29 14 25 10 20 10C15 10 12 12 12 14Z" fill="#FFF3CC" stroke="#D4A017" strokeWidth="1.7"
        />
      </svg>
    ),
    bgColor: "bg-yellow-50"
  },
  {
    name: "Dried Orange Slices",
    tagline: "Natural Shield.",
    benefits: ["Flavonoids & Vit C", "Strengthens Immunity", "Hydration Balance"],
    desc: "Rich in Vitamin C & flavonoids, strengthens immunity, supports skin health, improves hydration balance, and acts as a natural antioxidant.",
    svg: (
      <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.5">
        <motion.circle 
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          cx="20" cy="21" r="12" fill="#FFE4CC" stroke="#F97316" strokeWidth="1.7"
        />
        <motion.path 
          animate={{ rotate: [-20, 20, -20], originX: "20px", originY: "9px" }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          d="M20 9C21 7 22.5 6 22.5 6" stroke="#3B7A3B" strokeWidth="1.4"
        />
      </svg>
    ),
    bgColor: "bg-orange-50"
  },
  {
    name: "Dried Chikoo (Sapota)",
    tagline: "Iron & Energy Source.",
    benefits: ["Boosts Stamina", "Hemoglobin Support", "Natural Sweetness"],
    desc: "Natural source of iron, fiber & energy, supports digestion, improves hemoglobin levels, boosts stamina, and provides natural sweetness.",
    svg: (
      <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.5">
        <motion.ellipse 
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          cx="20" cy="22" rx="10" ry="11" fill="#DEB887" stroke="#8B5E3C" strokeWidth="1.7"
        />
      </svg>
    ),
    bgColor: "bg-stone-50"
  },
  {
    name: "Dried Dragon Fruit",
    tagline: "Prebiotic Superfruit.",
    benefits: ["Gut Health Support", "Immune Booster", "Wholesome Wellness"],
    desc: "Packed with antioxidants, fiber & prebiotics, supports digestion, boosts immunity, promotes gut health, and helps maintain overall wellness.",
    svg: (
      <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.5">
        <motion.ellipse 
          animate={{ scale: [1, 1.05, 1], rotate: [-1, 1, -1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          cx="20" cy="22" rx="11" ry="12" fill="#FFB3D9" stroke="#EC4899" strokeWidth="1.7"
        />
        <motion.ellipse 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          cx="20" cy="22" rx="7" ry="8" fill="#fff" stroke="#EC4899" strokeWidth="1"
        />
      </svg>
    ),
    bgColor: "bg-pink-50"
  },
  {
    name: "Dried Jackfruit Dices",
    tagline: "Fiber & Heart Health.",
    benefits: ["High Antioxidants", "Supports Heart Health", "Natural Energy Boost"],
    desc: "Rich in fiber, antioxidants & vitamin C, supports digestion, boosts immunity, promotes heart health, provides natural energy, and helps maintain overall wellness.",
    svg: (
      <svg viewBox="0 0 40 40" fill="none" strokeWidth="1.5">
        <motion.path 
          animate={{ rotateY: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          d="M12 14C12 14 10 20 12 26C14 31 18 34 22 33C28 31 31 25 30 19C29 14 25 10 20 10C15 10 12 12 12 14Z" fill="#FFDB4D" stroke="#D4A017" strokeWidth="1.7"
        />
      </svg>
    ),
    bgColor: "bg-amber-50"
  }
];



// ── BenefitsCarousel (DETAILED CARDS) ───────────────────────────────────────
function BenefitsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const rafRef = useRef<number>(0);
  const SPEED = 0.55;

  // Dragging refs
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const halfWidth = track.scrollWidth / 2;

    const tick = () => {
      if (!pausedRef.current && track && !isDraggingRef.current) {
        posRef.current += SPEED;
      }

      // Ensure positive and negative seamless wrapping
      if (halfWidth > 0) {
        while (posRef.current < 0) {
          posRef.current += halfWidth;
        }
        while (posRef.current >= halfWidth) {
          posRef.current -= halfWidth;
        }
      }

      if (track) {
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    pausedRef.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const delta = startXRef.current - e.clientX;
    posRef.current += delta;
    startXRef.current = e.clientX;
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    pausedRef.current = false;
  };

  const scrollLeft = () => {
    posRef.current -= 340; // Approx one card width + gap
  };

  const scrollRight = () => {
    posRef.current += 340;
  };

  const allItems = [...BENEFIT_PRODUCTS, ...BENEFIT_PRODUCTS, ...BENEFIT_PRODUCTS];

  return (
    <section className="mt-16 overflow-hidden bg-[#FAF7F2] py-8 relative group/benefits">
       <div className="px-4 max-w-7xl mx-auto mb-10 text-center">
          <p className="text-[10px] font-black text-brand-primary/60 uppercase tracking-[0.3em] mb-2">Immunity & Vitality</p>
          <h2 className="text-[24px] sm:text-[32px] font-black text-brand-text uppercase tracking-widest font-serif leading-tight">Nature's Pick: Health Benefits</h2>
       </div>

      {/* Navigation Arrows */}
      <button 
        onClick={scrollLeft}
        className="absolute left-2 sm:left-6 top-[60%] -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white backdrop-blur-md border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.05)] rounded-full flex items-center justify-center text-brand-primary transition-all duration-300 hover:scale-110"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
      </button>

      <button 
        onClick={scrollRight}
        className="absolute right-2 sm:right-6 top-[60%] -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white backdrop-blur-md border border-gray-200 shadow-[0_4px_15px_rgba(0,0,0,0.05)] rounded-full flex items-center justify-center text-brand-primary transition-all duration-300 hover:scale-110"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
      </button>

      <div className="relative">
        {/* Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-[#FAF7F2] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-[#FAF7F2] to-transparent pointer-events-none" />

        <div 
          className="overflow-hidden cursor-grab active:cursor-grabbing pb-10 select-none touch-pan-y"
          onMouseEnter={() => pausedRef.current = true}
          onMouseLeave={() => { pausedRef.current = false; handlePointerUp(); }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div 
            ref={trackRef}
            className="flex gap-6 will-change-transform px-4 transition-transform duration-75 ease-out"
            style={{ width: "max-content", touchAction: "none" }}
          >
            {allItems.map((item, idx) => (
              <div 
                key={`${item.name}-${idx}`}
                className="w-[280px] sm:w-[320px] bg-white rounded-[2.5rem] border border-[#E8E6E1] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 group flex flex-col items-start gap-5 pointer-events-none"
              >
                {/* Icon Wrapper */}
                <div className={`w-16 h-16 rounded-3xl ${item.bgColor} flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-all duration-500`}>
                   <motion.div 
                     whileHover={{ scale: 1.15, rotate: [0, 5, -5, 0] }}
                     transition={{ duration: 0.3 }}
                     className="w-10 h-10 flex items-center justify-center relative z-10"
                   >
                     {item.svg}
                   </motion.div>
                   
                   {/* Background Glow */}
                   <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                </div>

                {/* Content */}
                <div className="w-full">
                  <h3 className="text-lg font-black text-brand-text mb-1 group-hover:text-brand-primary transition-colors">{item.name}</h3>
                  <p className="text-[11px] font-bold text-brand-primary uppercase tracking-widest mb-4 italic">"{item.tagline}"</p>
                  
                  {/* Benefit Points */}
                  <ul className="space-y-2.5 mb-6">
                    {item.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-[12px] font-bold text-brand-text-muted">
                        <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                           <CheckCircle className="w-2.5 h-2.5 text-green-600" />
                        </div>
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  {/* Divider */}
                  <div className="w-full h-px bg-[#F0EDE8] mb-4" />

                  {/* Summary Description */}
                  <p className="text-[12px] font-medium text-brand-text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FAQ Item ───────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#E8E6E1] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-bold text-brand-text pr-2">{q}</span>
        <span className={`shrink-0 w-5 h-5 rounded-full border-2 border-brand-primary flex items-center justify-center transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          {open ? <Minus className="w-2.5 h-2.5 text-brand-primary" /> : <Plus className="w-2.5 h-2.5 text-brand-primary" />}
        </span>
      </button>
      {open && (
        <p className="text-sm text-brand-text-muted font-medium pb-4 leading-relaxed pr-6">{a}</p>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function HomeClient({
  dbBanners = [],
  dbProducts = [],
  dbCategories = [],
  dbBlogs = [],
  dbNewArrivals = [],
}: {
  dbBanners?: any[];
  dbProducts: any[];
  dbCategories?: any[];
  dbBlogs?: any[];
  dbNewArrivals?: any[];
}) {
  const heroBanner = dbBanners[0] || null;
  const slides = dbBanners.length > 0 ? dbBanners.map((b: any) => ({ img: b.imageUrl, title: b.title })) : HERO_SLIDES;
  
  const [[heroIdx, direction], setHeroState] = useState([0, 0]);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-scroll refs (Nature Picks section)
  const scrollRefNature = useRef<HTMLDivElement>(null);
  const scrollPosNature = useRef(0);
  const [isPausedNature, setIsPausedNature] = useState(false);

  // Generic Auto-Scroll Hook Logic
  useEffect(() => {
    let animationFrameId: number;
    const speed = 0.8; 

    const startScroll = () => {
      if (!isPausedNature && scrollRefNature.current) {
        const el = scrollRefNature.current;
        scrollPosNature.current += speed;
        if (scrollPosNature.current >= el.scrollWidth / 2) {
          scrollPosNature.current = 0;
        }
        el.scrollLeft = scrollPosNature.current;
      }
      animationFrameId = requestAnimationFrame(startScroll);
    };

    animationFrameId = requestAnimationFrame(startScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPausedNature]);


  const paginate = useCallback((newDir: number) => {
    setHeroState(([prev]) => [
      (prev + newDir + slides.length) % slides.length,
      newDir
    ]);
  }, [slides.length]);

  const goTo = useCallback((idx: number) => {
    setHeroState(([prev]) => [idx, idx > prev ? 1 : -1]);
  }, []);

  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => paginate(1), 5500);
  }, [paginate]);

  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [slides.length, resetAutoPlay]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-28 lg:pb-8">


      {/* ── 2. HERO SECTION ── */}
      <section className="relative">
        {/* Hero Image Slider */}
        <div className="relative w-full h-[60vw] min-h-[320px] max-h-[500px] bg-[#1a3a20] overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={heroIdx}
              custom={direction}
              initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0.5 }}
              transition={{ type: "tween", ease: [0.77, 0, 0.18, 1], duration: 0.25 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) { paginate(1); resetAutoPlay(); }
                else if (info.offset.x > 60) { paginate(-1); resetAutoPlay(); }
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <Image
                src={slides[heroIdx]?.img}
                alt={slides[heroIdx]?.title || "Hero banner"}
                fill
                priority={heroIdx === 0}
                className="object-cover scale-[1.04] animate-ken-burns"
                draggable={false}
              />
              {/* Multi-layer gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

              {/* Hero Text */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-10 pb-16 sm:pb-20">
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
                >
                  <p className="text-brand-accent text-[10px] font-black uppercase tracking-[0.3em] mb-2 drop-shadow-md">PJ Bite Premium</p>
                  <h1 className="text-white text-[22px] sm:text-3xl font-black font-serif leading-tight mb-4 max-w-sm sm:max-w-lg drop-shadow-xl">
                    {slides[heroIdx]?.title}
                  </h1>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-brand-primary text-white text-xs font-black px-6 py-3 rounded-full uppercase tracking-widest hover:bg-[#164a20] transition-colors shadow-lg"
                  >
                    Shop Now <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prev/Next Arrow Controls */}
          <button
            onClick={() => { paginate(-1); resetAutoPlay(); }}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          <button
            onClick={() => { paginate(1); resetAutoPlay(); }}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          {/* Enhanced Dot Indicators */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {slides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => { goTo(dotIdx); resetAutoPlay(); }}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`transition-all duration-400 rounded-full ${
                  heroIdx === dotIdx
                    ? "w-7 h-2 bg-brand-accent shadow-md"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10">
            <span className="text-white text-[11px] font-black">{heroIdx + 1}</span>
            <span className="text-white/40 text-[11px]">/</span>
            <span className="text-white/60 text-[11px] font-bold">{slides.length}</span>
          </div>
        </div>

        <div className="w-[92%] sm:w-auto sm:mx-8 lg:mx-auto lg:max-w-4xl mx-auto -mt-6 sm:-mt-8 rounded-2xl sm:rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.06)] bg-white/95 backdrop-blur-md relative z-10 border border-[#E8E6E1]/50 p-0.5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0.5 overflow-hidden rounded-xl sm:rounded-[1.8rem]">
            {STATS.map((s, idx) => (
              <motion.div 
                key={s.label} 
                whileHover={{ y: -2 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="py-3 sm:py-5 px-2 sm:px-6 bg-white flex flex-col items-center justify-center gap-1.5 hover:bg-brand-bg transition-colors cursor-default group"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 opacity-80 group-hover:scale-110 transition-transform duration-300">
                    {s.icon}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[9px] sm:text-[10px] text-brand-text font-black uppercase tracking-wider leading-none mb-1">{s.label}</p>
                  <p className="text-[7.5px] sm:text-[8px] text-brand-primary/60 font-black uppercase tracking-[0.2em] leading-none">{s.subline}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      {dbNewArrivals.length > 0 && (
        <section className="mt-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-5 h-5 text-[#D4A017]" strokeWidth={2} />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-[#D4A017]/20"
                  />
                </div>
                <div>
                  <p className="text-[9px] font-black text-[#D4A017] uppercase tracking-[0.3em] leading-none mb-0.5">Just Landed</p>
                  <h2 className="text-base font-black text-brand-text uppercase tracking-widest leading-none">New Arrivals</h2>
                </div>
              </div>
              <Link
                href="/products"
                className="text-[11px] font-black text-brand-primary uppercase tracking-widest flex items-center gap-1 hover:underline"
              >
                See All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Scrollable product strip */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4">
              {dbNewArrivals.map((p: any, i: number) => (
                <motion.div
                  key={p._id?.toString() || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="shrink-0 w-[160px] sm:w-[220px]"
                >
                  <ProductCard product={{ ...p, tag: "New" }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ── 3. SHOP BY BRAND ── */}
      <BrandCarousel categories={dbCategories || []} />

      {/* ── 4. FEATURED PRODUCTS ── */}
      {dbProducts.length > 0 && (
        <section className="mt-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-black text-brand-text uppercase tracking-widest">Top Selling Products</h2>
              <Link href="/products" className="text-xs font-black text-brand-primary flex items-center gap-1 hover:underline">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {dbProducts.slice(0, 4).map((p: any, i: number) => (
                <ProductCard key={p._id?.toString() || i} product={{ ...p, tag: i === 0 ? "Bestseller" : i === 1 ? "New" : "Popular" }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. BENEFITS STRIP ── */}
      <section className="mt-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {BENEFITS.map((b) => (
              <div key={b.label} className="bg-white rounded-2xl border border-[#E8E6E1] p-4 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs font-black text-brand-text">{b.label}</p>
                  <p className="text-[10px] text-brand-text-muted font-medium leading-tight">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5b. QUALITY CLAIMS MARQUEE ── */}
      <section className="mt-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#1a3a20] rounded-2xl py-4 px-6 overflow-hidden relative">
            <div className="flex animate-marquee whitespace-nowrap gap-0">
              {[
                "✔ 100% Natural",
                "✔ No Added Sugar*",
                "✔ No Preservatives",
                "✔ No Artificial Colors or Flavours",
                "✔ Farm Direct Sourcing",
                "✔ Hygienically Processed",
                "✔ Clean Label Product",
              ].concat([
                "✔ 100% Natural",
                "✔ No Added Sugar*",
                "✔ No Preservatives",
                "✔ No Artificial Colors or Flavours",
                "✔ Farm Direct Sourcing",
                "✔ Hygienically Processed",
                "✔ Clean Label Product",
              ]).map((claim, i) => (
                <span key={i} className="text-[#a3c96e] text-[11px] font-black uppercase tracking-widest mx-6 shrink-0">
                  {claim}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. MORE PRODUCTS (second row) ── */}
      {dbProducts.length > 4 && (
        <section className="mt-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-black text-brand-text uppercase tracking-widest">Healthy Snacking</h2>
              <Link href="/products" className="text-xs font-black text-brand-primary flex items-center gap-1 hover:underline">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {dbProducts.slice(4, 8).map((p: any, i: number) => (
                <ProductCard key={p._id?.toString() || `h${i}`} product={{ ...p, tag: "Fresh" }} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ── 7. SHOP BY PURPOSE ── */}
      <section className="mt-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-base font-black text-brand-text uppercase tracking-widest mb-2 text-center">Shop By Purpose</h2>
          <p className="text-xs text-brand-text-muted text-center font-medium mb-5">We just made it easy for you to shop on your terms. Let's get started to find your way for passion for healthy nutrition.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            {PURPOSES.map((p, idx) => (
              <Link
                key={p.label}
                href={p.href}
                className="bg-white rounded-[20px] border border-[#E8E6E1] p-6 flex flex-col items-center gap-4 hover:border-brand-primary/50 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_20px_rgba(0,0,0,0.06)] transition-all duration-300 group"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="w-14 h-14 rounded-full bg-[#f8f6f0] flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300 text-brand-primary"
                >
                  <p.Icon className="w-6 h-6" strokeWidth={2} />
                </motion.div>
                <span className="text-[13px] font-black text-brand-text uppercase tracking-widest group-hover:text-brand-primary transition-colors">{p.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. BULK ORDER BANNER ── */}
      <section className="mt-10 mx-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-brand-primary to-[#164a20] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <p className="text-brand-accent text-[10px] font-black uppercase tracking-widest mb-2">Corporate & Wholesale</p>
              <h2 className="text-white text-xl sm:text-2xl font-black font-serif leading-tight">
                Big Savings on<br />Bulk Orders! 🥜
              </h2>
              <p className="text-white/70 text-xs font-medium mt-2">Contact our team for special pricing on bulk dry fruit orders for events, gifting, and retail.</p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 bg-white text-brand-primary text-xs font-black px-6 py-3 rounded-full uppercase tracking-widest hover:bg-brand-bg transition-colors shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEW: WHY PJ BITE ── */}
      <section className="mt-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-[#1a3a20] p-6 sm:p-8 overflow-hidden relative">
            {/* Decorative blob */}
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-5 bottom-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <p className="text-brand-accent text-[10px] font-black uppercase tracking-[0.25em] mb-2">Why Choose Us</p>
              <h2 className="text-white text-xl sm:text-2xl font-black font-serif mb-6 max-w-xs leading-tight">
                Why PJ Bite is Different
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Leaf, t: "No Chemicals Ever", d: "We never use artificial preservatives, colors, or flavor enhancers. What you eat is exactly what nature made." },
                  { icon: Sprout, t: "Farm-to-Door", d: "We partner directly with farmers, cutting out middlemen so you get fresher produce at better prices." },
                  { icon: Sun, t: "Natural Dehydration", d: "Using sun-drying and modern dehydration tech to preserve nutrients, taste, and texture naturally." },
                ].map((f) => (
                  <div key={f.t} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-brand-primary/30 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <f.icon className="w-4 h-4 text-brand-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white mb-1">{f.t}</p>
                      <p className="text-xs text-white/60 font-medium leading-relaxed">{f.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-6 bg-white text-brand-primary text-xs font-black px-5 py-2.5 rounded-full uppercase tracking-widest hover:bg-brand-bg transition-colors shadow-lg"
              >
                Our Story <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW: NATURE'S BENEFITS CAROUSEL ── */}
      <BenefitsCarousel />

      {/* ── QUALITY TRUST SECTION ── */}
      <section className="mt-12 bg-[#E1EFEB] py-14 px-4 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] border-y border-[#D0E0DC]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[#519B98] text-[22px] sm:text-[28px] font-black font-serif text-center mb-10 tracking-tight drop-shadow-sm" id="perfect-cut-label">
            Only Perfect Makes The Cut
          </h2>

          <div className="hidden lg:grid grid-cols-4 gap-6">
            {QUALITY_CARDS.map((card, idx) => (
              <div
                key={card.alt}
                className="bg-[#FAF4E8] rounded-2xl overflow-hidden flex flex-col items-center pt-8 px-5 shadow-sm border border-[#EBE3D3] group transition-all duration-300 hover:shadow-md hover:border-[#D5C9B0]"
              >
                <div className="text-center mb-5">
                  <Sun className="w-6 h-6 text-[#E0D5B5] mx-auto mb-3" />
                  <h3 className="text-[#1A3A20] text-[16px] font-black leading-tight mb-2 drop-shadow-sm">{card.title}</h3>
                  <p className="text-[#4F5E48] text-[11px] font-bold leading-relaxed">{card.desc}</p>
                </div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5 + idx * 0.2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }}
                  className="w-[105%] mt-auto h-52 relative -bottom-2 rounded-t-[20px] overflow-hidden drop-shadow-sm"
                >
                  <Image
                    src={card.img}
                    alt={card.alt}
                    fill
                    sizes="25vw"
                    className="object-cover object-top scale-100 group-hover:scale-110 transition-transform duration-700"
                  />
                </motion.div>
              </div>
            ))}
          </div>

          {/* MOBILE: Vertical Auto-Sliding Carousel */}
          <div className="lg:hidden relative">
             <VerticalQualitySlider />
          </div>
        </div>
      </section>


      {/* ── NEW: HOW IT WORKS ── */}
      <section className="mt-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-base font-black text-brand-text uppercase tracking-widest mb-6 text-center">From Farm to Your Doorstep</h2>
          <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
            {/* Connecting line */}
            <div className="absolute top-7 left-[12.5%] right-[12.5%] h-px bg-dashed border-t-2 border-dashed border-[#E8E6E1] hidden sm:block" />
            {[
              { step: "01", icon: Leaf, label: "Farm Sourcing", desc: "Direct from ethical farmers" },
              { step: "02", icon: Sun, label: "Natural Drying", desc: "Zero chemical processing" },
              { step: "03", icon: CheckCircle, label: "Quality Check", desc: "Premium quality standards" },
              { step: "04", icon: Truck, label: "Doorstep Delivery", desc: "Fresh & sealed arrival" },
            ].map((s, i) => (
              <div key={s.step} className="flex flex-col items-center gap-2 relative">
                <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center shadow-md shadow-brand-primary/20 relative z-10">
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] font-black text-brand-text-muted">{s.step}</span>
                <p className="text-xs font-black text-brand-text text-center leading-tight">{s.label}</p>
                <p className="text-[10px] text-brand-text-muted font-medium text-center leading-tight hidden sm:block">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. FAQ ── */}
      <section className="mt-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-base font-black text-brand-text uppercase tracking-widest mb-5 text-center">FAQs</h2>
          <div className="bg-white rounded-2xl border border-[#E8E6E1] px-5 shadow-sm">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>




      {/* ── TESTIMONIALS (Moved to last) ── */}
      <TestimonialsSection />

    </div>
  );
}
















// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Shield, Leaf, Truck, Award, Plus,
//   ChevronRight, ChevronLeft, ArrowRight, Sprout, Sun, CheckCircle,
//   Gift, Dumbbell, Utensils, Sparkles, Star, ArrowUpRight,
// } from "lucide-react";
// import { useSession } from "next-auth/react";
// import { useCartStore } from "@/store/useCartStore";
// import WishlistButton from "@/components/ui/WishlistButton";
// import { showSuccess, showToast } from "@/lib/swal";

// // ── Types ──────────────────────────────────────────────────────────────────
// interface ProductData {
//   _id?: string;
//   id?: string;
//   name: string;
//   slug: string;
//   price: number;
//   originalPrice?: number;
//   images?: string[];
//   image?: string;
//   vendorId?: string;
//   tag?: string;
// }
// interface CategoryData { _id: string; name: string; slug: string; image?: string; }
// interface BannerData { imageUrl: string; title: string; }
// interface HeroSlide { img: string; title: string; }

// // ── Constants ──────────────────────────────────────────────────────────────
// const HERO_SLIDES: HeroSlide[] = [
//   { img: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=1200&auto=format&fit=crop", title: "Healthy Tasty & Ready When Cravings Strike." },
//   { img: "https://images.unsplash.com/photo-1629824908064-05bf4705ecbd?q=80&w=1200&auto=format&fit=crop", title: "100% Natural Freshly Harvested Almonds." },
//   { img: "https://images.unsplash.com/photo-1596591606975-97e3a9dc1def?q=80&w=1200&auto=format&fit=crop", title: "Premium Walnuts for a Healthy Brain." },
//   { img: "https://images.unsplash.com/photo-1521994191316-ff264fabb9c5?q=80&w=1200&auto=format&fit=crop", title: "Rich, Sweet & Nutritious Dates." },
//   { img: "https://images.unsplash.com/photo-1615486171448-4fb3255dc703?q=80&w=1200&auto=format&fit=crop", title: "Handpicked Cashews for Daily Energy." },
// ];

// const STATS = [
//   { icon: "🌿", label: "No Colour Added",  subline: "100% Raw Nature" },
//   { icon: "🍬", label: "No Added Sugar",   subline: "Natural Sweetness" },
//   { icon: "⚗️", label: "No Chemical",      subline: "Zero Toxins" },
//   { icon: "✨", label: "No Flavour",        subline: "Authentic Taste" },
// ];

// // Border classes for the 2-col (mobile) → 4-col (desktop) stats grid.
// // On mobile:  cols 0 and 2 need right divider; rows 0 (idx<2) need bottom divider.
// // On desktop: cols 0–2 (idx<3) need right divider; no bottom divider.
// const STATS_BORDER: string[] = [
//   "border-r border-b lg:border-b-0",                // idx 0
//   "border-b lg:border-b-0 lg:border-r",             // idx 1
//   "border-r lg:border-r",                            // idx 2
//   "",                                                 // idx 3
// ];

// const BENEFITS = [
//   { icon: Truck,  label: "Free Shipping",    sub: "On Orders Above ₹499",     color: "from-emerald-500/20 to-teal-500/10" },
//   { icon: Shield, label: "100% Natural",     sub: "No Preservatives Added",   color: "from-green-500/20 to-emerald-500/10" },
//   { icon: Leaf,   label: "Farm Direct",      sub: "Sourced From Farmers",     color: "from-lime-500/20 to-green-500/10" },
//   { icon: Award,  label: "Quality Assured",  sub: "FSSAI Licensed Lab Tested",color: "from-amber-500/20 to-yellow-500/10" },
// ];

// const PURPOSES = [
//   { label: "Gifting",   Icon: Gift,     href: "/products?category=gifts",   emoji: "🎁", desc: "Premium gift boxes" },
//   { label: "Snacking",  Icon: Sprout,   href: "/products?category=snacks",  emoji: "🌱", desc: "Healthy everyday bites" },
//   { label: "Cooking",   Icon: Utensils, href: "/products?category=cooking", emoji: "🍳", desc: "Kitchen essentials" },
//   { label: "Fitness",   Icon: Dumbbell, href: "/products?category=fitness", emoji: "💪", desc: "Fuel your training" },
// ];

// const FAQS = [
//   { q: "How long do dry fruits stay fresh?",              a: "When stored in an airtight container in a cool, dry place, our dry fruits stay fresh for 6–12 months. Refrigeration can extend shelf life further." },
//   { q: "Are your products free from preservatives?",      a: "Yes! We use natural dehydration technology to preserve fruits. No artificial preservatives, chemicals, or additives are ever used." },
//   { q: "Which dry fruit is best for daily consumption?",  a: "Almonds, walnuts, and dates are excellent for daily use. They are packed with Omega-3, fiber, and natural energy." },
//   { q: "Do you offer bulk orders for businesses?",        a: "Absolutely! We offer special pricing for bulk orders. Contact us at infopjbite@gmail.com for corporate or wholesale inquiries." },
//   { q: "How are your products sourced?",                  a: "We work directly with farmers across India and abroad, eliminating middlemen to ensure freshness, fair pricing, and quality." },
// ];

// const QUALITY_CARDS = [
//   { img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop", title: "In-House R&D Experts",            desc: "Our in-house R&D team ensures every product meets the highest standards of nutrition and safety.",                alt: "R&D Experts",        tag: "Research" },
//   { img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop", title: "See the Proof. Trust the Science.", desc: "Lab reports for every batch. Because real trust is built on transparency.",                                        alt: "Lab Report",         tag: "Lab Verified" },
//   { img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop", title: "Pesticide Residue Test",           desc: "Every batch is tested for pesticide residue. Zero chemical contamination guaranteed.",                            alt: "Pesticide Test",     tag: "Zero Chemicals" },
//   { img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop", title: "Nutritional Analysis",             desc: "Comprehensive nutrition profiling & shelf-life testing ensures premium quality in every bite.",                  alt: "Nutritional Analysis",tag: "Certified" },
// ];

// const ALL_REVIEWS = [
//   { text: "Absolutely love the quality! The almonds are so fresh and crunchy. Zero artificial taste — just pure goodness in every bite.", name: "Priya S.",   location: "Mumbai",     product: "Almonds Premium",   rating: 5 },
//   { text: "Ordered the Diwali gift box and everyone loved it. The packaging is premium and the dry fruits taste absolutely amazing.",      name: "Rahul M.",   location: "Pune",       product: "Gift Collection",   rating: 5 },
//   { text: "Great quality, fast delivery. The cashews melt in your mouth. Price is very reasonable for this level of premium quality.",    name: "Sneha K.",   location: "Bangalore",  product: "Cashews",           rating: 5 },
//   { text: "The mixed fruit pack is my daily morning snack now. Natural, no sugar coating, and the freshness is unmatched anywhere else.", name: "Arjun V.",   location: "Jaipur",     product: "Mixed Fruit Pack",  rating: 5 },
//   { text: "Tried the walnuts after my doctor recommended them. Best I've had — not bitter at all, perfectly dried and full of flavour.",  name: "Divya R.",   location: "Ahmedabad",  product: "Walnuts",           rating: 5 },
//   { text: "Farm-direct sourcing really shows. You can taste the difference from supermarket stuff. Will always order from PJ Bite.",     name: "Ishita B.",  location: "Kolkata",    product: "Dates Premium",     rating: 5 },
// ];

// const BENEFIT_PRODUCTS = [
//   { name: "Dried Mixed Fruit Pack",   tagline: "Total Health Multiplier",      benefits: ["Boosts Immunity", "High Energy Levels", "Supports Vitality"],                       desc: "A balanced combination of fruits providing multiple vitamins, minerals, fiber & natural fruit sugars.",                              emoji: "🍇", bgFrom: "#FFF3CC", bgTo: "#FFE4E4" },
//   { name: "Mango Dices & Slices",     tagline: "Tropical Immunity Booster",    benefits: ["Rich in Vitamin A & C", "Improves Eye Health", "Promotes Glowing Skin"],            desc: "Rich in antioxidants, supports immunity, improves eye health, promotes glowing skin.",                                                emoji: "🥭", bgFrom: "#FFF3CC", bgTo: "#FFD38C" },
//   { name: "Dried Guava Flakes",       tagline: "Gut Health Specialist",        benefits: ["Excellent Fiber Source", "Aids Digestion", "Regulates Blood Sugar"],                 desc: "Excellent source of fiber, Vitamin C & lycopene. Improves digestion and supports gut health.",                                       emoji: "🍈", bgFrom: "#E8FFE4", bgTo: "#C8F7C5" },
//   { name: "Dried Kiwi Slices",        tagline: "Zesty Heart Defender",         benefits: ["High Vitamin K & C", "Improves Heart Health", "Enhances Digestion"],                 desc: "High in Vitamin C, Vitamin K & fiber. Enhances digestion, supports immunity and promotes healthy skin.",                             emoji: "🥝", bgFrom: "#C8F7C5", bgTo: "#A8EFA5" },
//   { name: "Dried Avocado Flakes",     tagline: "Superfood Heart Fuel",         benefits: ["Rich in Healthy Fats", "Vitamin E Support", "Skin & Hair Vitality"],                 desc: "Rich in healthy fats (MUFA), Vitamin E & potassium. Supports heart health and skin.",                                                emoji: "🥑", bgFrom: "#E8FFE4", bgTo: "#C8F7C5" },
//   { name: "Dried Strawberry Slices",  tagline: "Antioxidant Powerhouse",       benefits: ["Reduces Oxidative Stress", "Polyphenol Rich", "Skin Rejuvenation"],                  desc: "Loaded with Vitamin C, antioxidants & polyphenols. Supports skin health and boosts immunity.",                                       emoji: "🍓", bgFrom: "#FFD3D3", bgTo: "#FFB3B3" },
//   { name: "Dried Pineapple Slices",   tagline: "Digestive Catalyst",           benefits: ["Enzyme Bromelain", "Supports Bone Health", "Aids Digestion"],                        desc: "High in Vitamin C, manganese & bromelain enzyme. Aids digestion and reduces inflammation.",                                          emoji: "🍍", bgFrom: "#FFF3CC", bgTo: "#FFE080" },
//   { name: "Dried Banana Chips",       tagline: "Sustained Energy Snack",       benefits: ["Potassium & Magnesium", "Supports Muscle Function", "Heart Health Support"],         desc: "Packed with potassium, magnesium & dietary fiber. Helps maintain heart health and muscle function.",                                  emoji: "🍌", bgFrom: "#FFF3CC", bgTo: "#FFE4A0" },
// ];

// // ── ProductCard ────────────────────────────────────────────────────────────
// function ProductCard({ product }: { product: ProductData }) {
//   const { addItem, setBuyNowItem, openCheckout, openAuthModal } = useCartStore();
//   const { status } = useSession();
//   const [adding,  setAdding]  = useState(false);
//   const [hovered, setHovered] = useState(false);

//   const productId     = product._id?.toString() || product.id || "";
//   const img           = product.images?.[0] || product.image || "https://placehold.co/400x400/f5f0e8/8b7355?text=Dry+Fruit";
//   const originalPrice = product.originalPrice || Math.round(product.price * 1.2);
//   const discount      = Math.round(((originalPrice - product.price) / originalPrice) * 100);

//   const handleAdd = () => {
//     setAdding(true);
//     addItem({ id: productId, name: product.name, price: product.price, image: img, vendorId: product.vendorId || "" });
//     showSuccess("Added to Cart!", `${product.name} is now in your cart.`);
//     setTimeout(() => setAdding(false), 800);
//   };

//   const handleBuyNow = () => {
//     if (status !== "authenticated") { showToast("Sign in to buy now! 💚", "info"); openAuthModal(); return; }
//     setBuyNowItem({ id: productId, name: product.name, price: product.price, image: img, vendorId: product.vendorId || "", quantity: 1 });
//     openCheckout();
//   };

//   return (
//     <motion.div
//       onHoverStart={() => setHovered(true)}
//       onHoverEnd={() => setHovered(false)}
//       className="group bg-white rounded-3xl overflow-hidden flex flex-col h-full relative"
//       style={{ boxShadow: hovered ? "0 20px 60px rgba(26,58,32,0.12), 0 4px 20px rgba(0,0,0,0.06)" : "0 2px 12px rgba(0,0,0,0.06)" }}
//       transition={{ duration: 0.3 }}
//     >
//       {/* Badges */}
//       <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
//         {discount > 0 && (
//           <span className="bg-gradient-to-r from-red-500 to-rose-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-red-500/30">
//             {discount}% OFF
//           </span>
//         )}
//         {product.tag && (
//           <span className="bg-gradient-to-r from-[#1a3a20] to-[#2d6a3a] text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-green-900/30 flex items-center gap-1">
//             {product.tag === "New" && <Sparkles className="w-2 h-2" />} {product.tag}
//           </span>
//         )}
//       </div>

//       {productId && (
//         <div className="absolute top-3 right-3 z-20">
//           <WishlistButton productId={productId} product={product} size="sm" />
//         </div>
//       )}

//       {/* Image */}
//       <Link href={`/products/${product.slug}`} className="block">
//         <div className="aspect-square bg-gradient-to-br from-[#faf8f3] via-[#f5f0e8] to-[#ede8df] relative overflow-hidden">
//           <motion.div className="absolute inset-0" animate={{ scale: hovered ? 1.08 : 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
//             <Image src={img} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-contain p-5 drop-shadow-md" />
//           </motion.div>
//           <motion.div
//             className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
//             initial={{ x: "-100%" }}
//             animate={{ x: hovered ? "200%" : "-100%" }}
//             transition={{ duration: 0.6 }}
//           />
//         </div>
//       </Link>

//       {/* Info */}
//       <div className="p-4 flex flex-col flex-1">
//         <p className="text-[8px] font-black text-[#1a3a20]/40 uppercase tracking-[0.2em] mb-1">PJ BITE</p>
//         <Link href={`/products/${product.slug}`}>
//           <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug hover:text-[#1a3a20] transition-colors mb-2.5">
//             {product.name}
//           </h3>
//         </Link>
//         <div className="flex items-center gap-1 mb-3">
//           {Array.from({ length: 5 }).map((_, i) => (
//             <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
//           ))}
//           <span className="text-[10px] text-gray-400 font-semibold ml-1">(12)</span>
//         </div>
//         <div className="mt-auto space-y-3">
//           <div className="flex items-baseline gap-2">
//             <span className="text-lg font-black text-[#1a3a20]">₹{product.price}</span>
//             {discount > 0 && <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>}
//           </div>
//           <div className="grid grid-cols-2 gap-1.5">
//             <button
//               onClick={handleAdd}
//               className={`py-2 text-[9px] font-black rounded-xl uppercase tracking-widest transition-all duration-200 border-2 ${
//                 adding
//                   ? "bg-[#D4A017] text-white border-[#D4A017] shadow-lg shadow-amber-400/30"
//                   : "bg-white text-[#1a3a20] border-[#1a3a20]/20 hover:bg-[#1a3a20] hover:text-white hover:border-[#1a3a20]"
//               }`}
//             >
//               {adding ? "✓ Added" : "+ Cart"}
//             </button>
//             <button
//               onClick={handleBuyNow}
//               className="py-2 text-[9px] font-black rounded-xl uppercase tracking-widest bg-gradient-to-r from-[#1a3a20] to-[#2d5a30] text-white hover:from-[#2d5a30] hover:to-[#1a3a20] transition-all duration-200 shadow-md shadow-green-900/20"
//             >
//               Buy Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// // ── BenefitsCarousel ───────────────────────────────────────────────────────
// // FIX 4: overflow-hidden on the section itself prevents horizontal page scroll
// function BenefitsCarousel() {
//   const trackRef    = useRef<HTMLDivElement>(null);
//   const posRef      = useRef(0);
//   const pausedRef   = useRef(false);
//   const rafRef      = useRef<number>(0);
//   const isDraggingRef = useRef(false);
//   const startXRef   = useRef(0);

//   useEffect(() => {
//     const track = trackRef.current;
//     if (!track) return;
//     const halfWidth = track.scrollWidth / 2;
//     const tick = () => {
//       if (!pausedRef.current && !isDraggingRef.current) posRef.current += 0.5;
//       if (halfWidth > 0) {
//         while (posRef.current < 0)            posRef.current += halfWidth;
//         while (posRef.current >= halfWidth)   posRef.current -= halfWidth;
//       }
//       if (track) track.style.transform = `translateX(-${posRef.current}px)`;
//       rafRef.current = requestAnimationFrame(tick);
//     };
//     rafRef.current = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(rafRef.current);
//   }, []);

//   const allItems = [...BENEFIT_PRODUCTS, ...BENEFIT_PRODUCTS, ...BENEFIT_PRODUCTS];

//   return (
//     // FIX 4: overflow-hidden clips the track so it never bleeds outside the section
//     <section className="mt-16 sm:mt-20 lg:mt-28 py-16 bg-[#0f2318] relative overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,160,23,0.08)_0%,transparent_60%)]" />
//       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(26,58,32,0.5)_0%,transparent_60%)]" />

//       <div className="relative px-4 max-w-7xl mx-auto mb-12 text-center">
//         <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
//           <p className="text-[10px] font-black text-[#D4A017]/70 uppercase tracking-[0.5em] mb-3">Immunity & Vitality</p>
//           <h2 className="text-4xl sm:text-5xl font-black text-white font-serif leading-tight">
//             Nature's Pick: <span className="text-[#D4A017]">Health Benefits</span>
//           </h2>
//         </motion.div>
//       </div>

//       <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#0f2318] to-transparent pointer-events-none" />
//       <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#0f2318] to-transparent pointer-events-none" />

//       <div
//         className="cursor-grab active:cursor-grabbing select-none pb-4"
//         style={{ overflow: "hidden" }}
//         onMouseEnter={() => { pausedRef.current = true; }}
//         onMouseLeave={() => { pausedRef.current = false; isDraggingRef.current = false; }}
//         onPointerDown={(e) => { isDraggingRef.current = true; startXRef.current = e.clientX; pausedRef.current = true; }}
//         onPointerMove={(e) => { if (!isDraggingRef.current) return; posRef.current += startXRef.current - e.clientX; startXRef.current = e.clientX; }}
//         onPointerUp={() => { isDraggingRef.current = false; pausedRef.current = false; }}
//         onPointerCancel={() => { isDraggingRef.current = false; pausedRef.current = false; }}
//       >
//         <div ref={trackRef} className="flex gap-5 will-change-transform px-6" style={{ width: "max-content", touchAction: "none" }}>
//           {allItems.map((item, idx) => (
//             <motion.div
//               key={`${item.name}-${idx}`}
//               whileHover={{ y: -6, scale: 1.02 }}
//               transition={{ duration: 0.3 }}
//               className="w-[260px] sm:w-[300px] rounded-3xl p-6 flex flex-col gap-4 border border-white/5 hover:border-white/15 transition-all duration-300 cursor-default"
//               style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}
//             >
//               <div
//                 className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner"
//                 style={{ background: `linear-gradient(135deg, ${item.bgFrom}30, ${item.bgTo}30)`, border: `1px solid ${item.bgFrom}40` }}
//               >
//                 {item.emoji}
//               </div>
//               <div>
//                 <h3 className="text-base font-black text-white mb-0.5">{item.name}</h3>
//                 <p className="text-[10px] font-bold text-[#D4A017] uppercase tracking-widest italic mb-4">"{item.tagline}"</p>
//                 <ul className="space-y-2 mb-4">
//                   {item.benefits.map((benefit, i) => (
//                     <li key={i} className="flex items-center gap-2 text-[11px] font-semibold text-white/60">
//                       <div className="w-3.5 h-3.5 rounded-full bg-[#1a3a20] border border-emerald-500/30 flex items-center justify-center shrink-0">
//                         <CheckCircle className="w-2 h-2 text-emerald-400" />
//                       </div>
//                       {benefit}
//                     </li>
//                   ))}
//                 </ul>
//                 <div className="w-full h-px bg-white/5 mb-3" />
//                 <p className="text-[11px] text-white/40 leading-relaxed font-medium">{item.desc}</p>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ── TestimonialsSection ────────────────────────────────────────────────────
// function TestimonialsSection() {
//   const [activeIdx, setActiveIdx] = useState(0);
//   const [autoplay,  setAutoplay]  = useState(true);

//   useEffect(() => {
//     if (!autoplay) return;
//     const t = setInterval(() => setActiveIdx((i) => (i + 1) % ALL_REVIEWS.length), 4000);
//     return () => clearInterval(t);
//   }, [autoplay]);

//   return (
//     <section className="mt-16 sm:mt-20 px-4 pb-0">
//       <div className="max-w-7xl mx-auto">
//         <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
//           <p className="text-[10px] font-black text-[#1a3a20]/50 uppercase tracking-[0.5em] mb-3">Testimonials</p>
//           <h2 className="text-4xl sm:text-5xl font-black text-[#1a3a20] font-serif">
//             500+ Happy <span className="text-[#D4A017]">Clients</span>
//           </h2>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
//           {/* Left promo panel */}
//           <div className="relative rounded-3xl overflow-hidden h-[280px] sm:h-[320px] lg:h-full lg:min-h-[420px]">
//             <Image src="https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=600&auto=format&fit=crop" alt="Healthy dry fruits" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
//             <div className="absolute inset-0 bg-gradient-to-t from-[#0f2318]/90 via-[#0f2318]/30 to-transparent" />
//             <div className="absolute bottom-0 left-0 right-0 p-6">
//               <p className="text-[10px] font-black text-[#D4A017] uppercase tracking-widest mb-2">Daily Superfood</p>
//               <p className="text-white text-xl font-black font-serif leading-tight mb-4">
//                 Have this daily.<br /><span className="text-[#D4A017]">Double your energy.</span>
//               </p>
//               <Link href="/products" className="inline-flex items-center gap-2 bg-[#D4A017] text-[#0f2318] text-[10px] font-black px-4 py-2.5 rounded-full uppercase tracking-widest hover:bg-[#E8B830] transition-colors shadow-lg">
//                 Shop Now <ArrowRight className="w-3 h-3" />
//               </Link>
//             </div>
//           </div>

//           {/* Reviews grid */}
//           <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {ALL_REVIEWS.map((r, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 16 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.07, duration: 0.5 }}
//                 className={`bg-white rounded-2xl p-5 border transition-all duration-500 cursor-default ${
//                   activeIdx === i
//                     ? "border-[#1a3a20]/30 shadow-xl shadow-[#1a3a20]/8"
//                     : "border-[#F0EDE8] shadow-sm hover:shadow-md hover:border-[#E8E6E1]"
//                 }`}
//                 onMouseEnter={() => { setAutoplay(false); setActiveIdx(i); }}
//                 onMouseLeave={() => setAutoplay(true)}
//               >
//                 <div className="flex items-center gap-0.5 mb-3">
//                   {Array.from({ length: r.rating }).map((_, j) => (
//                     <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />
//                   ))}
//                 </div>
//                 <p className="text-[13px] text-gray-600 leading-relaxed font-medium mb-4">"{r.text}"</p>
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a3a20] to-[#2d6a3a] flex items-center justify-center text-white text-xs font-black shrink-0">
//                     {r.name.charAt(0)}
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-xs font-black text-[#1a3a20] truncate">{r.name}</p>
//                     <p className="text-[10px] text-gray-400 font-medium truncate">{r.location} · {r.product}</p>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ── QualitySection ─────────────────────────────────────────────────────────
// function QualitySection() {
//   const [activeCard, setActiveCard] = useState(0);
//   const [paused,     setPaused]     = useState(false);

//   useEffect(() => {
//     if (paused) return;
//     const t = setInterval(() => setActiveCard((i) => (i + 1) % QUALITY_CARDS.length), 3500);
//     return () => clearInterval(t);
//   }, [paused]);

//   return (
//     <section className="mt-16 sm:mt-20 px-4">
//       <div className="max-w-7xl mx-auto">
//         <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
//           <p className="text-[10px] font-black text-[#1a3a20]/50 uppercase tracking-[0.5em] mb-3">Quality Standards</p>
//           <h2 className="text-4xl sm:text-5xl font-black text-[#1a3a20] font-serif leading-tight">
//             Only Perfect <span className="text-[#D4A017]">Makes The Cut</span>
//           </h2>
//         </motion.div>

//         {/* Desktop: 4-card grid */}
//         <div className="hidden lg:grid grid-cols-4 gap-5 overflow-hidden">
//           {QUALITY_CARDS.map((card, idx) => (
//             <motion.div
//               key={card.alt}
//               onHoverStart={() => { setPaused(true); setActiveCard(idx); }}
//               onHoverEnd={() => setPaused(false)}
//               whileHover={{ y: -8 }}
//               transition={{ duration: 0.3 }}
//               className="relative rounded-3xl overflow-hidden cursor-pointer group h-[420px]"
//             >
//               <Image src={card.img} alt={card.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="25vw" />
//               <div className="absolute inset-0 bg-gradient-to-t from-[#0f2318]/95 via-[#0f2318]/40 to-transparent" />
//               <div className="absolute top-4 left-4">
//                 <span className="text-[9px] font-black text-[#D4A017] bg-[#D4A017]/15 border border-[#D4A017]/30 px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-sm">
//                   {card.tag}
//                 </span>
//               </div>
//               <div className="absolute bottom-0 left-0 right-0 p-5">
//                 <h3 className="text-base font-black text-white mb-2 leading-tight">{card.title}</h3>
//                 <motion.p
//                   animate={{ opacity: activeCard === idx ? 1 : 0.6, height: activeCard === idx ? "auto" : "0px" }}
//                   className="text-[11px] text-white/70 leading-relaxed font-medium overflow-hidden"
//                 >
//                   {card.desc}
//                 </motion.p>
//               </div>
//               <motion.div
//                 animate={{ opacity: activeCard === idx ? 1 : 0 }}
//                 className="absolute inset-0 ring-2 ring-[#D4A017]/50 rounded-3xl pointer-events-none"
//               />
//             </motion.div>
//           ))}
//         </div>

//         {/* Mobile: single card with dots */}
//         <div className="lg:hidden">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeCard}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.4 }}
//               className="relative rounded-3xl overflow-hidden h-[340px] sm:h-[380px]"
//               // FIX 7: passive touch handlers — don't call preventDefault so page scroll is not blocked
//               onTouchStart={() => setPaused(true)}
//               onTouchEnd={() => { setPaused(false); }}
//             >
//               <Image src={QUALITY_CARDS[activeCard].img} alt={QUALITY_CARDS[activeCard].alt} fill className="object-cover" sizes="100vw" />
//               <div className="absolute inset-0 bg-gradient-to-t from-[#0f2318]/95 via-[#0f2318]/40 to-transparent" />
//               <div className="absolute top-4 left-4">
//                 <span className="text-[9px] font-black text-[#D4A017] bg-[#D4A017]/15 border border-[#D4A017]/30 px-3 py-1.5 rounded-full uppercase tracking-widest">
//                   {QUALITY_CARDS[activeCard].tag}
//                 </span>
//               </div>
//               <div className="absolute bottom-0 left-0 right-0 p-6">
//                 <h3 className="text-lg font-black text-white mb-2">{QUALITY_CARDS[activeCard].title}</h3>
//                 <p className="text-sm text-white/70 leading-relaxed">{QUALITY_CARDS[activeCard].desc}</p>
//               </div>
//             </motion.div>
//           </AnimatePresence>
//           <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Quality card navigation">
//             {QUALITY_CARDS.map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setActiveCard(i)}
//                 role="tab"
//                 aria-selected={i === activeCard}
//                 className={`transition-all duration-300 rounded-full ${i === activeCard ? "w-8 h-2 bg-[#1a3a20]" : "w-2 h-2 bg-gray-300"}`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ── FaqItem ────────────────────────────────────────────────────────────────
// function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true }}
//       transition={{ delay: idx * 0.08 }}
//       className={`border-b last:border-0 transition-colors duration-200 ${open ? "border-[#1a3a20]/10" : "border-[#F0EDE8]"}`}
//     >
//       <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 py-5 text-left group">
//         <span className="text-sm font-bold text-[#1a3a20] group-hover:text-[#2d5a30] transition-colors">{q}</span>
//         <motion.div
//           animate={{ rotate: open ? 45 : 0, backgroundColor: open ? "#1a3a20" : "transparent" }}
//           transition={{ duration: 0.2 }}
//           className="w-6 h-6 rounded-full border-2 border-[#1a3a20]/30 flex items-center justify-center shrink-0"
//         >
//           <Plus className={`w-3 h-3 transition-colors ${open ? "text-white" : "text-[#1a3a20]"}`} />
//         </motion.div>
//       </button>
//       <AnimatePresence>
//         {open && (
//           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
//             <p className="text-sm text-gray-500 font-medium pb-5 leading-relaxed pr-10">{a}</p>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

// // ── HomeClient ─────────────────────────────────────────────────────────────
// export default function HomeClient({
//   dbBanners = [], dbProducts = [], dbCategories = [], dbNewArrivals = [],
// }: {
//   dbBanners?: BannerData[];
//   dbProducts: ProductData[];
//   dbCategories?: CategoryData[];
//   dbNewArrivals?: ProductData[];
// }) {
//   const slides: HeroSlide[] = dbBanners.length > 0
//     ? dbBanners.map((b) => ({ img: b.imageUrl, title: b.title }))
//     : HERO_SLIDES;

//   const [[heroIdx, direction], setHeroState] = useState([0, 0]);
//   const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

//   const paginate = useCallback((d: number) => {
//     setHeroState(([prev]) => [(prev + d + slides.length) % slides.length, d]);
//   }, [slides.length]);

//   const goTo = useCallback((idx: number) => {
//     setHeroState(([prev]) => [idx, idx > prev ? 1 : -1]);
//   }, []);

//   const resetAutoPlay = useCallback(() => {
//     if (autoPlayRef.current) clearInterval(autoPlayRef.current);
//     autoPlayRef.current = setInterval(() => paginate(1), 5500);
//   }, [paginate]);

//   useEffect(() => {
//     resetAutoPlay();
//     return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
//   }, [slides.length, resetAutoPlay]);

//   return (
//     /*
//       FIX 1: removed pb-28 lg:pb-12 — the layout's <main pb-16 lg:pb-0> already
//       provides the correct MobileBottomNav clearance. Double-padding was creating
//       a 176px gap on mobile.
//       FIX 4: overflow-x-hidden prevents any carousel track from causing horizontal
//       page scroll. overflow-y stays visible so sticky/fixed elements still work.
//     */
//     <div className="bg-[#FAF7F2] min-h-screen" style={{ overflowX: "hidden" }}>

//       {/* ════════════════════════════════ HERO ════════════════════════════ */}
//       <section className="relative">
//         {/* Hero image carousel */}
//         <div className="relative w-full h-[70vw] min-h-[340px] sm:min-h-[400px] max-h-[620px] bg-[#0f2318] overflow-hidden">
//           <AnimatePresence initial={false} custom={direction} mode="popLayout">
//             <motion.div
//               key={heroIdx}
//               custom={direction}
//               initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0.6 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0.6 }}
//               transition={{ type: "tween", ease: [0.77, 0, 0.18, 1], duration: 0.5 }}
//               drag="x"
//               dragConstraints={{ left: 0, right: 0 }}
//               dragElastic={0.08}
//               onDragEnd={(_, info) => {
//                 if (info.offset.x < -60) { paginate(1); resetAutoPlay(); }
//                 else if (info.offset.x > 60) { paginate(-1); resetAutoPlay(); }
//               }}
//               className="absolute inset-0 cursor-grab active:cursor-grabbing"
//             >
//               <Image
//                 src={slides[heroIdx]?.img}
//                 alt={slides[heroIdx]?.title || "Hero"}
//                 fill
//                 priority={heroIdx === 0}
//                 className="object-cover"
//                 draggable={false}
//               />

//               {/* Depth overlays */}
//               <div className="absolute inset-0 bg-gradient-to-r from-[#0f2318]/85 via-[#0f2318]/40 to-transparent" />
//               <div className="absolute inset-0 bg-gradient-to-t from-[#0f2318]/70 via-transparent to-[#0f2318]/20" />
//               <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />

//               {/* Hero text
//                   FIX 5: tightened padding on small screens so text doesn't clip
//                   p-4 sm:p-10 lg:p-14 with pb-16 sm:pb-20 sm:pb-24 for dots clearance
//               */}
//               <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-10 lg:p-14 pb-16 sm:pb-20 lg:pb-24">
//                 <motion.div
//                   initial={{ opacity: 0, y: 40 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
//                 >
//                   <div className="flex items-center gap-2 mb-3 sm:mb-4">
//                     <div className="w-6 sm:w-8 h-px bg-[#D4A017]" />
//                     <span className="text-[#D4A017] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em]">PJ Bite Premium</span>
//                   </div>

//                   {/* FIX 5: max-w-[calc(100%-2rem)] on mobile prevents overflow on 320px */}
//                   <h1 className="text-white text-2xl sm:text-4xl lg:text-5xl font-black font-serif leading-tight mb-4 sm:mb-6 max-w-[calc(100%-1rem)] sm:max-w-lg drop-shadow-2xl">
//                     {slides[heroIdx]?.title}
//                   </h1>

//                   <div className="flex flex-wrap gap-2 sm:gap-3">
//                     <Link href="/products" className="inline-flex items-center gap-2 bg-[#D4A017] text-[#0f2318] text-[11px] sm:text-xs font-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-full uppercase tracking-widest hover:bg-[#E8B830] transition-all duration-200 shadow-xl shadow-amber-500/30">
//                       Shop Now <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
//                     </Link>
//                     <Link href="/about" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-[11px] sm:text-xs font-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-full uppercase tracking-widest hover:bg-white/20 border border-white/20 transition-all duration-200">
//                       Our Story
//                     </Link>
//                   </div>
//                 </motion.div>
//               </div>
//             </motion.div>
//           </AnimatePresence>

//           {/* Arrow controls */}
//           {[
//             { dir: -1, side: "left-3 sm:left-6",  label: "Previous slide", Icon: ChevronLeft },
//             { dir:  1, side: "right-3 sm:right-6", label: "Next slide",     Icon: ChevronRight },
//           ].map(({ dir, side, label, Icon }) => (
//             <button
//               key={side}
//               onClick={() => { paginate(dir); resetAutoPlay(); }}
//               aria-label={label}
//               className={`absolute ${side} top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xl`}
//             >
//               <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//             </button>
//           ))}

//           {/* Slide dots */}
//           <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
//             {slides.map((_, dotIdx) => (
//               <button
//                 key={dotIdx}
//                 onClick={() => { goTo(dotIdx); resetAutoPlay(); }}
//                 aria-label={`Slide ${dotIdx + 1}`}
//                 className={`transition-all duration-400 rounded-full ${heroIdx === dotIdx ? "w-8 h-2 bg-[#D4A017] shadow-lg shadow-amber-400/50" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`}
//               />
//             ))}
//           </div>

//           {/* Slide counter (desktop) */}
//           <div className="absolute top-4 sm:top-5 right-4 sm:right-5 z-20 hidden sm:flex items-center gap-1.5 bg-white/8 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
//             <span className="text-white text-[11px] font-black">{String(heroIdx + 1).padStart(2, "0")}</span>
//             <span className="text-white/30 text-[11px]">/</span>
//             <span className="text-white/50 text-[11px] font-bold">{String(slides.length).padStart(2, "0")}</span>
//           </div>
//         </div>

//         {/* Stats strip — floating card */}
//         <div className="max-w-4xl mx-auto px-4 sm:px-8 mt-52 sm:-mt-10 relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5, duration: 0.6 }}
//             className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/10 border border-[#E8E6E1]/60 overflow-hidden"
//           >
//             {/*
//               FIX 2: Stats grid border logic for 2-col mobile (grid-cols-2) vs 4-col desktop.
//               Uses per-index border classes from STATS_BORDER lookup to avoid orphaned borders.
//             */}
//             <div className="grid grid-cols-2 lg:grid-cols-4">
//               {STATS.map((s, idx) => (
//                 <motion.div
//                   key={s.label}
//                   whileHover={{ backgroundColor: "#F0FDF4" }}
//                   transition={{ duration: 0.2 }}
//                   className={`flex flex-col items-center justify-center gap-2 py-4 sm:py-5 lg:py-6 px-2 sm:px-4 lg:px-6 cursor-default border-[#F0EDE8] ${STATS_BORDER[idx]}`}
//                 >
//                   <span className="text-2xl">{s.icon}</span>
//                   <div className="text-center">
//                     <p className="text-[9px] sm:text-[10px] lg:text-xs font-black text-[#1a3a20] uppercase tracking-widest leading-none mb-0.5">{s.label}</p>
//                     <p className="text-[8px] sm:text-[9px] text-[#1a3a20]/40 font-bold uppercase tracking-wider">{s.subline}</p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* ═════════════════════════ NEW ARRIVALS ═══════════════════════════ */}
//       {dbNewArrivals.length > 0 && (
//         <section className="mt-16 sm:mt-20 px-4">
//           <div className="max-w-7xl mx-auto">
//             <div className="flex items-end justify-between mb-7 sm:mb-8">
//               <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
//                 <div className="flex items-center gap-2 mb-1">
//                   <motion.div animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
//                     <Sparkles className="w-4 h-4 text-[#D4A017]" />
//                   </motion.div>
//                   <p className="text-[10px] font-black text-[#D4A017] uppercase tracking-[0.3em]">Just Landed</p>
//                 </div>
//                 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a3a20] font-serif">New Arrivals</h2>
//               </motion.div>
//               <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-xs font-black text-[#1a3a20] uppercase tracking-widest hover:text-[#D4A017] transition-colors group shrink-0">
//                 See All <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//               </Link>
//             </div>

//             {/* FIX 6: overflow-hidden on the section container prevents the -mx-4 bleed */}
//             <div className="overflow-hidden -mx-4">
//               <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-4">
//                 {dbNewArrivals.map((p, i) => (
//                   <motion.div
//                     key={p._id || i}
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ delay: i * 0.06 }}
//                     className="shrink-0 w-[160px] sm:w-[200px] lg:w-[220px]"
//                   >
//                     <ProductCard product={{ ...p, tag: "New" }} />
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ═════════════════════════ FEATURED PRODUCTS ══════════════════════ */}
//       {dbProducts.length > 0 && (
//         <section className="mt-16 sm:mt-20 px-4">
//           <div className="max-w-7xl mx-auto">
//             <div className="flex items-end justify-between mb-7 sm:mb-8">
//               <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
//                 <p className="text-[10px] font-black text-[#1a3a20]/50 uppercase tracking-[0.4em] mb-1 sm:mb-2">Best Sellers</p>
//                 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a3a20] font-serif">Top Selling Products</h2>
//               </motion.div>
//               <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-xs font-black text-[#1a3a20] uppercase tracking-widest hover:text-[#D4A017] transition-colors group shrink-0">
//                 View All <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//               </Link>
//             </div>
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
//               {dbProducts.slice(0, 4).map((p, i) => (
//                 <motion.div key={p._id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
//                   <ProductCard product={{ ...p, tag: i === 0 ? "Bestseller" : i === 1 ? "Popular" : undefined }} />
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ═══════════════════════ BENEFITS STRIP ══════════════════════════ */}
//       {/*
//         FIX 3: was mt-28 lg:mt-36 (112px mobile) → now mt-16 sm:mt-20 lg:mt-28
//         for proportionate mobile spacing
//       */}
//       <section className="mt-16 sm:mt-20 lg:mt-28 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//             {BENEFITS.map((b, i) => (
//               <motion.div
//                 key={b.label}
//                 initial={{ opacity: 0, y: 16 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.1 }}
//                 whileHover={{ y: -4 }}
//                 className={`bg-gradient-to-br ${b.color} border border-white rounded-2xl p-4 sm:p-5 flex items-center gap-3 shadow-sm backdrop-blur-sm`}
//               >
//                 <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
//                   <b.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a3a20]" />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-[11px] sm:text-xs font-black text-[#1a3a20] leading-tight">{b.label}</p>
//                   <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium leading-tight mt-0.5 hidden sm:block">{b.sub}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ═══════════════════════════ MARQUEE ═══════════════════════════════ */}
//       <section className="mt-10 sm:mt-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-gradient-to-r from-[#0f2318] via-[#1a3a20] to-[#0f2318] rounded-2xl py-4 overflow-hidden relative">
//             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(212,160,23,0.05)_0%,transparent_70%)]" />
//             <div className="flex animate-marquee whitespace-nowrap gap-0 relative">
//               {["✦ 100% Natural","✦ No Added Sugar","✦ No Preservatives","✦ No Artificial Colors","✦ Farm Direct","✦ Hygienically Processed","✦ Clean Label","✦ 100% Natural","✦ No Added Sugar","✦ No Preservatives","✦ No Artificial Colors","✦ Farm Direct","✦ Hygienically Processed","✦ Clean Label"].map((claim, i) => (
//                 <span key={i} className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest mx-4 sm:mx-5 shrink-0 ${i % 2 === 0 ? "text-white/80" : "text-[#D4A017]/80"}`}>{claim}</span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ═══════════════════════ MORE PRODUCTS ════════════════════════════ */}
//       {/* FIX 3: mt-28 lg:mt-36 → mt-16 sm:mt-20 lg:mt-28 */}
//       {dbProducts.length > 4 && (
//         <section className="mt-16 sm:mt-20 lg:mt-28 px-4">
//           <div className="max-w-7xl mx-auto">
//             <div className="flex items-end justify-between mb-7 sm:mb-8">
//               <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
//                 <p className="text-[10px] font-black text-[#1a3a20]/50 uppercase tracking-[0.4em] mb-1 sm:mb-2">Daily Picks</p>
//                 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a3a20] font-serif">Healthy Snacking</h2>
//               </motion.div>
//               <Link href="/products" className="hidden sm:flex items-center gap-1.5 text-xs font-black text-[#1a3a20] uppercase tracking-widest hover:text-[#D4A017] transition-colors group shrink-0">
//                 View All <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
//               </Link>
//             </div>
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
//               {dbProducts.slice(4, 8).map((p, i) => (
//                 <motion.div key={p._id || `h${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
//                   <ProductCard product={{ ...p, tag: "Fresh" }} />
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ═══════════════════════ SHOP BY PURPOSE ══════════════════════════ */}
//       <section className="mt-16 sm:mt-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-10">
//             <p className="text-[10px] font-black text-[#1a3a20]/50 uppercase tracking-[0.5em] mb-3">Curated For You</p>
//             <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a20] font-serif mb-2">Shop By Purpose</h2>
//             <p className="text-sm text-gray-500 max-w-sm mx-auto">Find exactly what you need, curated for your lifestyle.</p>
//           </motion.div>

//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
//             {PURPOSES.map((p, idx) => (
//               <motion.div key={p.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -6 }}>
//                 <Link href={p.href} className="bg-white rounded-3xl p-5 sm:p-6 flex flex-col items-center gap-3 border border-[#F0EDE8] hover:border-[#1a3a20]/20 shadow-sm hover:shadow-xl hover:shadow-[#1a3a20]/8 transition-all duration-300 group block">
//                   <div className="text-3xl sm:text-4xl">{p.emoji}</div>
//                   <div className="text-center">
//                     <p className="text-xs sm:text-sm font-black text-[#1a3a20] uppercase tracking-widest group-hover:text-[#D4A017] transition-colors">{p.label}</p>
//                     <p className="text-[10px] text-gray-400 font-medium mt-0.5 hidden sm:block">{p.desc}</p>
//                   </div>
//                   <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1a3a20]/5 group-hover:bg-[#1a3a20] flex items-center justify-center transition-all duration-300">
//                     <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#1a3a20] group-hover:text-white transition-colors" />
//                   </div>
//                 </Link>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ═══════════════════════ BULK ORDER BANNER ════════════════════════ */}
//       {/* FIX 3: mt-28 lg:mt-36 → mt-16 sm:mt-20 lg:mt-28 */}
//       <section className="mt-16 sm:mt-20 lg:mt-28 px-4">
//         <div className="max-w-7xl mx-auto">
//           <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-br from-[#0f2318] via-[#1a3a20] to-[#0f2318]" />
//             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,160,23,0.15)_0%,transparent_60%)]" />
//             <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4A017]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
//             <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-8">
//               <div>
//                 <div className="flex items-center gap-2 mb-3">
//                   <div className="w-6 h-px bg-[#D4A017]" />
//                   <span className="text-[#D4A017] text-[10px] font-black uppercase tracking-[0.3em]">Corporate & Wholesale</span>
//                 </div>
//                 <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-black font-serif leading-tight mb-3">
//                   Big Savings on<br />Bulk Orders 🥜
//                 </h2>
//                 <p className="text-white/50 text-sm font-medium max-w-sm">Special pricing for events, gifting, and retail. Contact us for custom bulk packages.</p>
//               </div>
//               <Link href="/contact" className="shrink-0 bg-[#D4A017] text-[#0f2318] text-xs font-black px-6 sm:px-8 py-3 sm:py-4 rounded-full uppercase tracking-widest hover:bg-[#E8B830] transition-all shadow-xl shadow-amber-500/30 flex items-center gap-2">
//                 Contact Us <ArrowRight className="w-4 h-4" />
//               </Link>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* ═══════════════════════ WHY PJ BITE ══════════════════════════════ */}
//       <section className="mt-16 sm:mt-20 lg:mt-28 px-4">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
//             <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
//               <p className="text-[10px] font-black text-[#1a3a20]/50 uppercase tracking-[0.5em] mb-3">Our Promise</p>
//               <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1a3a20] font-serif leading-tight mb-5 sm:mb-6">
//                 Why PJ Bite<br /><span className="text-[#D4A017]">is Different</span>
//               </h2>
//               <p className="text-gray-500 text-sm leading-relaxed mb-6 sm:mb-8">We believe that what you eat defines your health. Every product is a promise — no shortcuts, no compromises, just pure, honest nutrition from farm to table.</p>
//               <Link href="/about" className="inline-flex items-center gap-2 border-2 border-[#1a3a20] text-[#1a3a20] text-xs font-black px-6 py-3 rounded-full uppercase tracking-widest hover:bg-[#1a3a20] hover:text-white transition-all duration-200">
//                 Our Story <ArrowRight className="w-3.5 h-3.5" />
//               </Link>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-3 sm:space-y-4">
//               {[
//                 { icon: Leaf,   t: "No Chemicals Ever",  d: "We never use artificial preservatives, colors, or flavor enhancers. What you eat is exactly what nature made.", num: "01" },
//                 { icon: Sprout, t: "Farm-to-Door",        d: "We partner directly with farmers, cutting out middlemen so you get fresher produce at better prices.", num: "02" },
//                 { icon: Sun,    t: "Natural Dehydration", d: "Using sun-drying and modern dehydration tech to preserve nutrients, taste, and texture naturally.", num: "03" },
//               ].map((f) => (
//                 <motion.div key={f.t} whileHover={{ x: 4 }} className="flex items-start gap-3 sm:gap-4 bg-white rounded-2xl p-4 sm:p-5 border border-[#F0EDE8] shadow-sm hover:shadow-md hover:border-[#1a3a20]/10 transition-all duration-300">
//                   <div className="text-[10px] font-black text-[#1a3a20]/20 font-mono mt-0.5 w-5 sm:w-6 shrink-0">{f.num}</div>
//                   <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#1a3a20]/10 to-[#2d6a3a]/5 rounded-xl flex items-center justify-center shrink-0">
//                     <f.icon className="w-4 h-4 text-[#1a3a20]" />
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-sm font-black text-[#1a3a20] mb-0.5 sm:mb-1">{f.t}</p>
//                     <p className="text-xs text-gray-400 font-medium leading-relaxed">{f.d}</p>
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* ═════════════════════ BENEFITS CAROUSEL (dark) ════════════════════ */}
//       {/* spacing handled inside BenefitsCarousel component */}
//       <BenefitsCarousel />

//       {/* ═══════════════════════ QUALITY SECTION ══════════════════════════ */}
//       <QualitySection />

//       {/* ══════════════════════ HOW IT WORKS ══════════════════════════════ */}
//       <section className="mt-16 sm:mt-20 px-4">
//         <div className="max-w-7xl mx-auto">
//           <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 sm:mb-12">
//             <p className="text-[10px] font-black text-[#1a3a20]/50 uppercase tracking-[0.5em] mb-3">The Process</p>
//             <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1a3a20] font-serif">From Farm to Your Doorstep</h2>
//           </motion.div>

//           <div className="relative">
//             <div className="absolute top-7 sm:top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#1a3a20]/20 to-transparent hidden sm:block" />
//             <div className="grid grid-cols-4 gap-2 sm:gap-4">
//               {[
//                 { step: "01", icon: Leaf,        label: "Farm Sourcing",      desc: "Direct from ethical farmers" },
//                 { step: "02", icon: Sun,         label: "Natural Drying",     desc: "Zero chemical processing" },
//                 { step: "03", icon: CheckCircle, label: "Quality Check",      desc: "Premium standards" },
//                 { step: "04", icon: Truck,       label: "Doorstep Delivery",  desc: "Fresh & sealed" },
//               ].map((s, i) => (
//                 <motion.div
//                   key={s.step}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: i * 0.12 }}
//                   className="flex flex-col items-center gap-2 sm:gap-3 relative"
//                 >
//                   <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-[#1a3a20] to-[#2d5a30] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1a3a20]/20 relative z-10">
//                     <s.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
//                   </div>
//                   <span className="text-[9px] font-black text-[#1a3a20]/30 tracking-widest">{s.step}</span>
//                   <p className="text-[10px] sm:text-xs lg:text-sm font-black text-[#1a3a20] text-center leading-tight">{s.label}</p>
//                   <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium text-center leading-tight hidden sm:block">{s.desc}</p>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ═══════════════════════════ FAQ ══════════════════════════════════ */}
//       <section className="mt-16 sm:mt-20 px-4">
//         <div className="max-w-3xl mx-auto">
//           <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 sm:mb-10">
//             <p className="text-[10px] font-black text-[#1a3a20]/50 uppercase tracking-[0.5em] mb-3">Got Questions?</p>
//             <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a20] font-serif">Frequently Asked</h2>
//           </motion.div>
//           <div className="bg-white rounded-3xl border border-[#F0EDE8] px-5 sm:px-8 shadow-sm">
//             {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} idx={i} />)}
//           </div>
//         </div>
//       </section>

//       {/* ══════════════════════ TESTIMONIALS ═════════════════════════════ */}
//       <TestimonialsSection />

//       {/* ════════════════════════ BOTTOM CTA ══════════════════════════════ */}
//       <section className="mt-16 sm:mt-20 px-4 pb-0">
//         <div className="max-w-4xl mx-auto text-center">
//           <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
//             <p className="text-[10px] font-black text-[#1a3a20]/40 uppercase tracking-[0.5em] mb-4">Start Your Journey</p>
//             <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1a3a20] font-serif leading-tight mb-4">
//               Eat Clean.<br /><span className="text-[#D4A017]">Live Premium.</span>
//             </h2>
//             <p className="text-gray-500 text-sm sm:text-base mb-7 sm:mb-8 max-w-md mx-auto">Join 500+ happy customers who have made PJ Bite their daily nutrition partner.</p>
//             <Link href="/products" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1a3a20] to-[#2d5a30] text-white text-sm font-black px-8 sm:px-10 py-3.5 sm:py-4 rounded-full uppercase tracking-widest hover:shadow-2xl hover:shadow-[#1a3a20]/30 transition-all duration-300 hover:-translate-y-1">
//               Shop the Collection <ArrowRight className="w-4 h-4" />
//             </Link>
//           </motion.div>
//         </div>
//       </section>

//     </div>
//   );
// }
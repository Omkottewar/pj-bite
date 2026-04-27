"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import WishlistButton from "@/components/ui/WishlistButton";
import { showSuccess } from "@/lib/swal";

interface RelatedProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  claims?: string[];
}

export default function RelatedProducts({ products }: { products: RelatedProduct[] }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-0 border-t border-[#E8E6E1] bg-[#FAF7F2] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-1">You Might Also Like</p>
            <h2 className="text-2xl font-serif font-black text-brand-text tracking-tight">Related Products</h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-xs font-black text-brand-primary hover:underline"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <RelatedProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedProductCard({ product }: { product: RelatedProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const [adding, setAdding] = useState(false);

  const img = product.images?.[0] || "https://placehold.co/400x400/f5f0e8/8b7355?text=Product";
  const originalPrice = product.originalPrice || Math.round(product.price * 1.2);
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdding(true);
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: img,
      vendorId: "",
    });
    showSuccess("Added to Cart!", `${product.name} is now in your cart.`);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div className="group bg-white rounded-[1.25rem] border border-gray-100 hover:border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative">
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-red-500/90 backdrop-blur-sm text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
            {discount}% OFF
          </span>
        )}
        <div className="absolute top-2.5 right-2.5 z-10">
          <WishlistButton productId={product._id} size="sm" />
        </div>
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-[4/3] bg-gradient-to-b from-[#fcfpf8] to-[#f5f2ec] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={product.name}
              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out will-change-transform drop-shadow-sm"
            />
          </div>
        </Link>
      </div>

      {/* Info Container */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">PJ BITE</p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 leading-snug hover:text-brand-primary transition-colors mb-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-[9px] text-gray-400 font-bold ml-1">(4.9)</span>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-sm sm:text-base font-black text-gray-900">₹{product.price}</span>
            {discount > 0 && (
              <span className="text-[10px] text-gray-400 line-through">₹{originalPrice}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`w-full py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black rounded-lg uppercase tracking-widest transition-all duration-200 shadow-sm ${
              adding ? "bg-brand-accent text-white" : "bg-brand-primary text-white hover:bg-black hover:shadow-md"
            }`}
          >
            {adding ? "Added! ✓" : "Add To Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

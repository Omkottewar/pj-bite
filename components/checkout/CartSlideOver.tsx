"use client";

import { useCartStore } from "@/store/useCartStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Minus, Plus, ShoppingBag, Tag, XCircle, CheckCircle2,
  Loader2, ArrowRight, Truck, Gift, Sparkles, ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { showToast } from "@/lib/swal";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface FeaturedCoupon {
  _id: string;
  code: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
}

interface StoreSettings {
  freeShippingThreshold?: number;
  shippingCost?: number;
  featuredCouponIds?: FeaturedCoupon[];
}

export default function CartSlideOver() {
  const {
    items, isOpen, closeCart, updateQuantity, removeItem,
    appliedCoupon, setAppliedCoupon, openCheckout, openAuthModal,
  } = useCartStore();

  const [isMounted, setIsMounted] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [featuredCoupons, setFeaturedCoupons] = useState<FeaturedCoupon[]>([]);

  const { status } = useSession();

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data: StoreSettings = await res.json();
      setSettings(data);
      if (data.featuredCouponIds) setFeaturedCoupons(data.featuredCouponIds);
    } catch (err) {
      console.error("[CART_SETTINGS_FETCH_ERROR]", err);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    fetchSettings();
  }, [fetchSettings]);

  if (!isMounted) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const shippingThreshold = settings?.freeShippingThreshold ?? 499;
  const shippingCost = settings?.shippingCost ?? 2;
  const isFreeShipping = subtotal >= shippingThreshold;
  const currentShipping = items.length > 0 ? (isFreeShipping ? 0 : shippingCost) : 0;

  const progress = Math.min((subtotal / shippingThreshold) * 100, 100);
  const remainingForFree = Math.max(shippingThreshold - subtotal, 0);

  let discount = 0;
  if (appliedCoupon) {
    discount = appliedCoupon.discountType === "PERCENTAGE"
      ? (subtotal * appliedCoupon.discountValue) / 100
      : appliedCoupon.discountValue;
  }
  const total = Math.max(subtotal + currentShipping - discount, 0);

  const handleApplyCoupon = async (codeOverride?: string) => {
    const codeToUse = codeOverride || couponCode;
    if (!codeToUse) return;

    setValidating(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeToUse, cartValue: subtotal }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAppliedCoupon(data);
      showToast(`Coupon ${codeToUse} applied!`, "success");
      setCouponCode("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to apply coupon";
      showToast(message, "error");
    } finally {
      setValidating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white z-[101] shadow-2xl flex flex-col overflow-hidden sm:rounded-l-[2.5rem]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0EDE8]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-brand-text font-serif">Your Cart</h2>
                  <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest leading-none mt-0.5">
                    {items.length} {items.length === 1 ? "Product" : "Products"} Selected
                  </p>
                </div>
              </div>
              <button
                aria-label="Close cart"
                onClick={closeCart}
                className="w-10 h-10 flex items-center justify-center hover:bg-brand-bg rounded-full transition-colors text-brand-text-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {items.length > 0 && (
              <div className="px-6 py-4 bg-brand-primary/5 border-b border-[#F0EDE8]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-black text-brand-text flex items-center gap-1.5 uppercase tracking-widest">
                    {isFreeShipping ? (
                      <span className="text-brand-primary flex items-center gap-1.5 animate-pulse">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Free Delivery Unlocked!
                      </span>
                    ) : (
                      <>Add <span className="text-brand-primary">₹{remainingForFree.toFixed(0)}</span> more for FREE Delivery</>
                    )}
                  </p>
                  <Truck className={`w-4 h-4 ${isFreeShipping ? "text-brand-primary" : "text-brand-text-muted/40"}`} />
                </div>
                <div className="h-2 w-full bg-brand-text/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full transition-colors duration-500 ${isFreeShipping ? "bg-brand-primary" : "bg-amber-500"}`}
                  />
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto py-6 px-6 space-y-4 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-20">
                  <div className="w-24 h-24 bg-brand-bg rounded-full flex items-center justify-center border border-[#E8E6E1]">
                    <ShoppingBag className="w-10 h-10 text-brand-primary/20" />
                  </div>
                  <div className="max-w-[200px]">
                    <h3 className="text-lg font-black text-brand-text">Cart is empty</h3>
                    <p className="text-xs text-brand-text-muted font-medium mt-1">
                      Looks like you haven't added anything yet.
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="bg-brand-primary text-white text-xs font-black px-8 py-3.5 rounded-xl uppercase tracking-widest hover:bg-[#164a20] transition-all shadow-md shadow-brand-primary/20"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        layout
                        key={item.id + (item.variantId || "")}
                        className="flex gap-4 p-4 rounded-2xl border border-[#F0EDE8] bg-white hover:border-brand-primary/20 transition-all group"
                      >
                        <div className="w-20 h-20 rounded-xl bg-brand-bg border border-[#F0EDE8] overflow-hidden flex-shrink-0 flex items-center justify-center p-2 relative">
                          <Image
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name}
                            fill
                            className="object-contain p-2 mix-blend-multiply"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-black text-brand-text leading-tight group-hover:text-brand-primary transition-colors truncate">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeItem(item.id, item.variantId)}
                              aria-label="Remove item"
                              className="text-brand-text-muted hover:text-red-500 transition-colors shrink-0"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-widest mt-1">
                            Fresh Choice
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 bg-brand-bg border border-[#F0EDE8] rounded-lg p-1">
                              <button
                                onClick={() => item.quantity <= 1 ? removeItem(item.id, item.variantId) : updateQuantity(item.id, item.quantity - 1, item.variantId)}
                                aria-label="Decrease quantity"
                                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-brand-text-muted hover:text-brand-primary transition-all"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center text-xs font-black text-brand-text">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                                aria-label="Increase quantity"
                                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white text-brand-text-muted hover:text-brand-primary transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="font-black text-brand-text">₹{(item.price * item.quantity).toFixed(0)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Featured Coupons */}
                  {featuredCoupons.length > 0 && !appliedCoupon && (
                    <div className="pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <p className="text-[11px] font-black text-brand-text uppercase tracking-widest leading-none">
                          Best Offers for You
                        </p>
                      </div>
                      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                        {featuredCoupons.map((coupon) => (
                          <button
                            key={coupon._id}
                            onClick={() => handleApplyCoupon(coupon.code)}
                            className="shrink-0 flex flex-col items-start gap-1 p-3 bg-white border-2 border-dashed border-amber-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-all text-left min-w-[140px]"
                          >
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{coupon.code}</span>
                            <span className="text-xs font-bold text-brand-text">
                              Save {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prepaid Upsell */}
                  <div className="bg-brand-primary/5 rounded-2xl p-4 border border-brand-primary/10 flex items-start gap-3 mt-4">
                    <Gift className="w-5 h-5 text-brand-primary mt-0.5" />
                    <div>
                      <p className="text-xs font-black text-brand-text">Extra 5% OFF on Prepaid</p>
                      <p className="text-[10px] text-brand-text-muted font-medium mt-0.5 tracking-tight">
                        Pay online using UPI/Card and save on COD handling fees.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-[#F0EDE8] bg-white">
                <div className="space-y-4 mb-6">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-brand-text-muted">
                      <span>Items Subtotal</span>
                      <span className="text-brand-text">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-brand-text-muted">
                      <span>Shipping Fee</span>
                      <span className={isFreeShipping ? "text-brand-primary" : "text-brand-text"}>
                        {isFreeShipping ? "FREE" : `₹${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-xs font-black text-brand-primary">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" /> Discount ({appliedCoupon.code})
                        </span>
                        <span>- ₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-[#F0EDE8]">
                    <div>
                      <p className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest">Grand Total</p>
                      <p className="text-2xl font-black text-brand-primary leading-none mt-1">₹{total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (status === "authenticated") {
                      openCheckout();
                    } else {
                      openAuthModal();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-brand-primary hover:bg-[#164a20] text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-brand-primary/20 group uppercase tracking-widest text-xs"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-center text-[9px] font-black text-brand-text-muted uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Encrypted & Secure Checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
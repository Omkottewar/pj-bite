"use client";
import { useWishlistSync } from "@/hooks/useWishlistSync";

/** Invisible client component that triggers wishlist server sync on login */
export default function WishlistSyncWrapper() {
  useWishlistSync();
  return null;
}

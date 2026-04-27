import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images?: string[];
}

interface WishlistStore {
  items: WishlistProduct[];
  addItem: (product: WishlistProduct) => void;
  removeItem: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  clearWishlist: () => void;
  syncFromServer: (serverItems: WishlistProduct[]) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          if (state.items.find((i) => i._id === product._id)) return state;
          return { items: [...state.items, product] };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i._id !== id) })),

      isWishlisted: (id) => get().items.some((i) => i._id === id),

      clearWishlist: () => set({ items: [] }),

      // Merges server items, deduplicating by _id
      syncFromServer: (serverItems) =>
        set((state) => {
          const merged = [...serverItems];
          state.items.forEach((localItem) => {
            if (!merged.find((s) => s._id === localItem._id)) {
              merged.push(localItem);
            }
          });
          return { items: merged };
        }),
    }),
    { name: "pj-bite-wishlist" }
  )
);

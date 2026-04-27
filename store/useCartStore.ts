import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // Product ID
  variantId?: string; // Specific Variant ID (if any)
  name: string;
  price: number;
  image: string;
  quantity: number;
  vendorId: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isCheckoutOpen: boolean;
  isAuthModalOpen: boolean;
  appliedCoupon: any | null;
  buyNowItem: CartItem | null;
  setAppliedCoupon: (coupon: any | null) => void;
  addItem: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  setBuyNowItem: (item: CartItem | null) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      isCheckoutOpen: false,
      isAuthModalOpen: false,
      appliedCoupon: null,
      buyNowItem: null,
      
      setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
      setBuyNowItem: (item) => set({ buyNowItem: item }),

      addItem: (product, quantity = 1) => set((state) => {
        const existingItem = state.items.find(item => 
          item.id === product.id && item.variantId === product.variantId
        );
        if (existingItem) {
          return {
            items: state.items.map(item => 
              (item.id === product.id && item.variantId === product.variantId)
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          };
        }
        return { items: [...state.items, { ...product, quantity }] };
      }),
      
      removeItem: (id, variantId) => set((state) => ({
        items: state.items.filter(item => !(item.id === id && item.variantId === variantId))
      })),
      
      updateQuantity: (id, quantity, variantId) => set((state) => ({
        items: state.items.map(item => 
          (item.id === id && item.variantId === variantId) 
            ? { ...item, quantity: Math.max(1, quantity) } 
            : item
        )
      })),
      
      clearCart: () => set({ items: [], appliedCoupon: null }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true, isCheckoutOpen: false }),
      closeCart: () => set({ isOpen: false }),

      openCheckout: () => set({ isCheckoutOpen: true, isOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),
      
      openAuthModal: () => set({ isAuthModalOpen: true }),
      closeAuthModal: () => set({ isAuthModalOpen: false }),
    }),
    {
      name: 'fruit-bite-cart',
    }
  )
);

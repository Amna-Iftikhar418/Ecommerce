"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItemOption = {
  name: string;
  choice: string;
  priceModifier: number;
};

export type CartItem = {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  options: CartItemOption[];
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const id = `${item.menuItemId}-${Date.now()}`;
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.menuItemId === item.menuItemId &&
              JSON.stringify(i.options) === JSON.stringify(item.options)
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, id }] };
        });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce(
          (sum, item) =>
            sum +
            (item.price +
              item.options.reduce((s, o) => s + o.priceModifier, 0)) *
              item.quantity,
          0
        ),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "restaurant-cart" }
  )
);

"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';

export type CartItem = {
  productId: string;
  colorId: number;
  sizeId: number;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: { productId: string; colorId: number; sizeId: number }) => void;
  clearCart: () => void; // Added this line
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      // Check if item with same product/color/size exists
      const idx = prev.findIndex(
        i => i.productId === item.productId && i.colorId === item.colorId && i.sizeId === item.sizeId
      );
      if (idx > -1) {
        // Update quantity
        const updated = [...prev];
        updated[idx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (item: { productId: string; colorId: number; sizeId: number }) => {
    setCart(prev => prev.filter(i =>
      !(i.productId === item.productId && i.colorId === item.colorId && i.sizeId === item.sizeId)
    ));
  };

  // Added this function
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, // Added this line
      cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
'use client';

import type { ReactNode } from 'react';
import { createContext, use, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);

    setCart((prev) => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });

    if (existing) {
      toast.success(
        `Đã cập nhật giỏ hàng ${product.name} (Số lượng: ${existing.quantity + 1})`,
      );
    } else {
      toast.success(
        `Đã thêm vào giỏ hàng ${product.name} - ${product.price.toLocaleString('vi-VN')}₫`,
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // eslint-disable-next-line react/no-unstable-context-value
  return <CartContext value={{ cart, addToCart, removeFromCart, clearCart }}>{children}</CartContext>;
}

export function useCart() {
  const context = use(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

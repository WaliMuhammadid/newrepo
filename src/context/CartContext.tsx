import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';
import type { CartItem, Product } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cartData = await api.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const addToCart = async (product: Product) => {
    try {
      const existing = cart.find((item) => item._id === product._id);
      if (existing) {
        await api.updateCartItem(product._id, existing.quantity + 1);
      } else {
        await api.addToCart(product._id, 1);
      }
      await loadCart(); // Refresh cart from server
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      await api.removeFromCart(productId);
      await loadCart(); // Refresh cart from server
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }
      await api.updateCartItem(productId, quantity);
      await loadCart(); // Refresh cart from server
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart();
      setCart([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

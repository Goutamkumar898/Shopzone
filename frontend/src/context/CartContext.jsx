import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import orderApi from '../api/orderApi';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user }           = useAuth();
  const [items,  setItems] = useState([]);
  const [loading, setLoad] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoad(true);
    try {
      const r = await orderApi.cartGet();
      setItems(r.data.data || []);
    } catch { setItems([]); }
    finally  { setLoad(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    await orderApi.cartAdd(productId, quantity);
    await fetchCart();
  };

  const updateQty = async (itemId, quantity) => {
    await orderApi.cartUpdate(itemId, quantity);
    await fetchCart();
  };

  const removeItem = async (itemId) => {
    await orderApi.cartRemove(itemId);
    await fetchCart();
  };

  const clearCart = async () => {
    await orderApi.cartClear();
    setItems([]);
  };

  const cartTotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, loading, cartTotal, cartCount,
      addToCart, updateQty, removeItem, clearCart, fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

// src/context/CartContext.jsx
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (sweet, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === sweet.id);
      if (existingItem) {
        // If item exists, update its quantity
        return prevItems.map(item =>
          item.id === sweet.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      // If item is new, add it to the cart
      return [...prevItems, { ...sweet, quantity }];
    });
  };

  const removeFromCart = (sweetId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== sweetId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
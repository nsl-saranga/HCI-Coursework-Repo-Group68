import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on initial render
// In CartContext.js
useEffect(() => {
    console.log('Loading cart from localStorage'); // Debug
    const savedCart = localStorage.getItem('cart');
    console.log('Saved cart:', savedCart); // Debug
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
  }, []);
  
  useEffect(() => {
    console.log('Saving cart to localStorage:', cart); // Debug
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  // In CartContext.js
const addToCart = (product) => {
    console.log('Current cart before add:', cart); // Debug log
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedColor === product.selectedColor
      );
      
      const newCart = existing 
        ? prev.map(item =>
            item.id === product.id && item.selectedColor === product.selectedColor
              ? { ...item, quantity: item.quantity + product.quantity }
              : item
          )
        : [...prev, product];
      
      console.log('New cart after add:', newCart); // Debug log
      return newCart;
    });
  };

  const updateQuantity = (id, color, newQuantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id && item.selectedColor === color
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const removeFromCart = (id, color) => {
    setCart(prevCart =>
      prevCart.filter(item => !(item.id === id && item.selectedColor === color))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate total items in cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Calculate total price
  const cartTotal = cart.reduce(
    (total, item) => total + (item.currentPrice * item.quantity),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartItemCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { cartAPI } from "./../services/api";  // <-- use your API wrapper

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });

  // Guest session
  const [sessionId] = useState(() => {
    let id = localStorage.getItem("sessionId");
    if (!id) {
      id = "guest_" + Date.now();
      localStorage.setItem("sessionId", id);
    }
    return id;
  });

  useEffect(() => {
    fetchCart();
  }, [user]);

  const getSession = () => (user ? {} : { sessionId });

  // GET cart
  const fetchCart = async () => {
    try {
      const res = await cartAPI.getCart(getSession());
      setCart(res.data.cart || { items: [] });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  // ADD to cart
  const addToCart = async (productId, size, quantity = 1) => {
    try {
      const res = await cartAPI.addToCart({
        productId,
        size,
        quantity,
        ...getSession(),
      });

      setCart(res.data.cart);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      throw err;
    }
  };

  // UPDATE cart item
  const updateCart = async (productId, size, quantity) => {
    try {
      const res = await cartAPI.updateCart({
        productId,
        size,
        quantity,
        ...getSession(),
      });

      setCart(res.data.cart);
    } catch (err) {
      console.error("Failed to update cart:", err);
      throw err;
    }
  };

  // REMOVE from cart
  const removeFromCart = async (productId, size) => {
    try {
      const res = await cartAPI.removeFromCart({
        productId,
        size,
        ...getSession(),
      });

      setCart(res.data.cart);
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      throw err;
    }
  };

  // CLEAR cart
  const clearCart = async () => {
    try {
      await cartAPI.clearCart(getSession());
      setCart({ items: [] });
    } catch (err) {
      console.error("Failed to clear cart:", err);
      throw err;
    }
  };

  const getTotalPrice = () => {
    return cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCart,
        removeFromCart,
        clearCart,
        getTotalPrice,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

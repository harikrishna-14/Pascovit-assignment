import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

axios.defaults.withCredentials = true; 

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] });

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

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        params: getSession(),
      });
      setCart(res.data.cart || { items: [] });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  const addToCart = async (productId, size, quantity = 1) => {
    try {
      const res = await axios.post("http://localhost:5000/api/cart/add", {
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

  const updateCart = async (productId, size, quantity) => {
    try {
      const res = await axios.put("http://localhost:5000/api/cart/update", {
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

  const removeFromCart = async (productId, size) => {
    try {
      const res = await axios.delete("http://localhost:5000/api/cart/remove", {
        data: {
          productId,
          size,
          ...getSession(),
        },
      });

      setCart(res.data.cart);
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("http://localhost:5000/api/cart/clear", {
        data: {
          ...getSession(),
        },
      });

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

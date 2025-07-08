import { useContext, useEffect, useState, createContext, useMemo } from "react";
import Context from "../context/index";
import SummaryApi from "../common";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { authToken } = useContext(Context);
  const [cart, setCart] = useState([]);

  const fetchCartData = async () => {
    if (!authToken) {
      try {
        const localCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        setCart(localCart);
      } catch (error) {
        console.error("Invalid guest cart in localStorage", error);
        setCart([]);
      }
      return;
    }

    try {
      const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setCart(result.data);
      } else {
        console.warn("Fetch cart failed:", result.message);
      }
    } catch (error) {
      console.error("Cart fetch error:", error);
    }
  };

  // 🔁 Load cart on mount if token is available
  useEffect(() => {
    fetchCartData();
  }, [authToken]);

  const addToCart = async (productId) => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        await fetchCartData();
      } else {
        console.error("Add to cart failed");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const cartProductCount = useMemo(() => {
  if (authToken) {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  } else {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    return guestCart.reduce((acc, item) => acc + item.quantity, 0);
  }
}, [cart, authToken]);


  return (
    <CartContext.Provider
      value={{ cart, addToCart, fetchCartData, cartProductCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

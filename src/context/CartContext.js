"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseConfig";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    const { data: allCart, error } = await supabase.from("cart").select("*");
    if (!error) {
      setCart(allCart || []);
      const totalPrice = allCart?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
      setTotal(totalPrice);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const addToCart = async (product) => {
    // Verificăm dacă produsul există deja în coș
    const existing = cart.find(item => item.product_id === product.id);
    
    if (existing) {
      await updateQuantity(existing.id, 1);
    } else {
      // REPARARE: Adăugăm restaurant_id și restaurant_name în insert
      await supabase.from("cart").insert({
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1,
        // ACESTEA SUNT LINIILE CARE ÎȚI LIPSESC:
        restaurant_id: product.restaurant_id, 
        restaurant_name: product.restaurant_name
      });
      fetchCart();
    }
  };

  const updateQuantity = async (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      await removeFromCart(id);
    } else {
      await supabase.from("cart").update({ quantity: newQty }).eq("id", id);
      fetchCart();
    }
  };

  const removeFromCart = async (id) => {
    await supabase.from("cart").delete().eq("id", id);
    fetchCart();
  };

  const clearCart = async () => {
    await supabase.from("cart").delete().neq("id", 0); // Șterge tot
    setCart([]);
    setTotal(0);
  };

  return (
    <CartContext.Provider value={{ cart, total, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

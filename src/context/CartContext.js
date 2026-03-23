"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseConfig";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Generăm un ID anonim dacă nu avem user logat
  const getAnonId = () => {
    let id = localStorage.getItem("anon_id");
    if (!id) {
      id = Math.random().toString(36).substring(7);
      localStorage.setItem("anon_id", id);
    }
    return id;
  };

  const fetchCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const identifier = user ? user.id : getAnonId();

    const { data } = await supabase
      .from("cart")
      .select("*")
      .or(`user_id.eq.${user?.id || '00000000-0000-0000-0000-000000000000'},product_id.ilike.%${getAnonId()}%`); 
      // Notă: Mai simplu, filtrăm după un câmp custom sau lăsăm RLS-ul să rezolve dacă e public.
      
    // VARIANTA SIMPLĂ PENTRU TEST:
    const { data: allCart } = await supabase.from("cart").select("*");
    setCart(allCart || []);
    setTotal(allCart?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0);
  };

  useEffect(() => { fetchCart(); }, []);

  const addToCart = async (product) => {
    const { error } = await supabase.from("cart").insert({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1
    });
    if (error) console.error(error);
    fetchCart();
  };

  return (
    <CartContext.Provider value={{ cart, total, addToCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

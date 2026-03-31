/** context/CartContext.jsx */
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseConfig";
import { useRouter } from "next/navigation";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  // Funcție helper pentru a lua ID-ul utilizatorului logat
  const getUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  };

  const fetchCart = async () => {
    const userId = await getUserId();
    if (!userId) {
      setCart([]);
      setTotal(0);
      return;
    }

    const { data: allCart, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId);

    if (!error) {
      setCart(allCart || []);
      const totalPrice = allCart?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
      setTotal(totalPrice);
    }
  };

  useEffect(() => {
    fetchCart();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchCart();
    });

    return () => subscription.unsubscribe();
  }, []);

  const addToCart = async (product) => {
    const userId = await getUserId();
    
    if (!userId) {
      console.log("%c Hey! Trebuie să fii logat ca să pui bunătăți în coș. 😉", "color: #ff0000; font-weight: bold; font-size: 14px;");
      router.push("/login"); // Îl trimitem elegant la login
      return;
    }

    const existing = cart.find(item => item.product_id === product.id);
    
    if (existing) {
      await updateQuantity(existing.id, 1);
    } else {
      await supabase.from("cart").insert({
        product_id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1,
        restaurant_id: product.restaurant_id, 
        restaurant_name: product.restaurant_name,
        user_id: userId 
      });
      fetchCart();
    }
  };

  const updateQuantity = async (id, delta) => {
    const userId = await getUserId();
    const item = cart.find(i => i.id === id);
    if (!item || !userId) return;

    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      await removeFromCart(id);
    } else {
      await supabase
        .from("cart")
        .update({ quantity: newQty })
        .eq("id", id)
        .eq("user_id", userId); 
      fetchCart();
    }
  };

  const removeFromCart = async (id) => {
    const userId = await getUserId();
    if (!userId) return;

    await supabase
      .from("cart")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    fetchCart();
  };

  const clearCart = async () => {
    const userId = await getUserId();
    if (!userId) return;

    await supabase
      .from("cart")
      .delete()
      .eq("user_id", userId);
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

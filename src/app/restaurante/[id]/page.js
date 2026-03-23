"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseConfig";
import { CartProvider, useCart } from "../../../context/CartContext"; 
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, ShoppingBag, Loader2, Star, Clock } from "lucide-react";

// --- INTERNAL COMPONENT (UI & LOGIC) ---
function RestaurantContent() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, total, cart } = useCart(); 
  
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      const { data: res } = await supabase.from('restaurants').select('*').eq('id', id).single();
      const { data: items } = await supabase.from('menu_items').select('*').eq('restaurant_id', id);
      setRestaurant(res);
      setMenu(items || []);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const getImageUrl = (path, bucket = "restaurants") => {
    if (!path) return "https://images.unsplash.com";
    if (path.startsWith('http')) return path;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FFF9F9] gap-4">
      <Loader2 className="animate-spin text-red-600" size={48} strokeWidth={3} />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Loading Menu...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF9F9] pb-32 font-sans">
      {/* HEADER BANNER */}
      <div className="relative h-72 w-full">
        <button 
          onClick={() => router.back()} 
          className="absolute top-6 left-6 z-30 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl hover:scale-110 transition-all"
        >
          <ArrowLeft size={20}/>
        </button>
        <img src={getImageUrl(restaurant?.image_url)} className="w-full h-full object-cover" alt="Banner" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF9F9] via-black/20 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-20">
        {/* RESTAURANT INFO CARD */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-red-100 border border-red-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">{restaurant?.name}</h1>
              <p className="text-gray-400 font-bold flex items-center gap-2 text-sm uppercase tracking-wide">
                {restaurant?.category} • {restaurant?.address}
              </p>
            </div>
            <div className="flex gap-4">
               <div className="bg-yellow-50 p-4 rounded-2xl text-center min-w-[80px]">
                  <p className="text-[10px] font-black text-yellow-600 uppercase">Rating</p>
                  <p className="text-xl font-black flex items-center justify-center gap-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400"/> {restaurant?.rating}
                  </p>
               </div>
               <div className="bg-red-50 p-4 rounded-2xl text-center min-w-[80px]">
                  <p className="text-[10px] font-black text-red-600 uppercase">Delivery</p>
                  <p className="text-xl font-black flex items-center justify-center gap-1">
                    <Clock size={16} className="text-red-400"/> {restaurant?.delivery_time}
                  </p>
               </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-black mt-16 mb-8 text-gray-900 tracking-tight uppercase italic">Main Menu</h2>
        
        {/* MENU GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {menu.map((item) => (
            <div key={item.id} className="flex bg-white p-4 rounded-[2rem] shadow-sm border border-red-50 hover:shadow-xl transition-all group">
              <div className="w-28 h-28 shrink-0 rounded-2xl overflow-hidden mr-4 border border-gray-50">
                <img 
                  src={getImageUrl(item.image_url, "menu_items")} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={item.name}
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-black text-lg text-gray-800">{item.name}</h3>
                <p className="text-gray-400 text-xs mt-1 line-clamp-2 font-medium">{item.description}</p>
                <div className="flex items-center justify-between mt-3">
                   <span className="font-black text-red-600">{item.price} RON</span>
                   <button 
                     onClick={() => addToCart(item)}
                     className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-90"
                   >
                     <Plus size={18} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOAT BUTTON CART */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: 100, x: "-50%" }}
            animate={{ y: 0, x: "-50%" }}
            exit={{ y: 100, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 w-[90%] max-w-lg"
          >
            <button 
              onClick={() => router.push("/checkout")}
              className="w-full bg-gray-900 text-white px-8 py-5 rounded-[2.2rem] font-black flex items-center justify-between shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-red-600 p-2.5 rounded-xl">
                  <ShoppingBag size={20} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-red-400 uppercase font-black leading-none mb-1">Your Order</p>
                  <p className="leading-none text-sm">{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase font-black leading-none mb-1">Total</p>
                <p className="text-xl tracking-tighter">{total.toFixed(2)} RON</p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- EXPORT WITH CONTEXT WRAPPER ---
export default function PaginaRestaurantWrapper() {
  return (
    <CartProvider>
      <RestaurantContent />
    </CartProvider>
  );
}

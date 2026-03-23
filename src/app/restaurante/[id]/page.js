"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseConfig";
import { CartProvider, useCart } from "../../../context/CartContext"; 
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Minus, ShoppingBag, Loader2, Star, Clock, Trash2 } from "lucide-react";

// --- INTERNAL COMPONENT (UI & LOGIC) ---
function RestaurantContent() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, updateQuantity, removeFromCart, total, cart } = useCart(); 
  
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      // Fetch Restaurant Details
      const { data: res } = await supabase.from('restaurants').select('*').eq('id', id).single();
      // Fetch Menu Items
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

  // Helper funcție pentru a găsi produsul în coș
  const getItemInCart = (itemId) => cart.find(item => item.product_id === itemId || item.id === itemId);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FFF9F9] gap-4">
      <Loader2 className="animate-spin text-red-600" size={48} strokeWidth={3} />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Loading Menu...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF9F9] pb-40 font-sans">
      {/* HEADER BANNER */}
      <div className="relative h-72 w-full">
        <button 
          onClick={() => router.back()} 
          className="absolute top-6 left-6 z-30 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl hover:scale-110 transition-all active:scale-90"
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
              <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter">{restaurant?.name}</h1>
              <p className="text-gray-400 font-bold flex items-center gap-2 text-xs uppercase tracking-widest">
                {restaurant?.category} • <span className="text-red-500 italic">{restaurant?.address || 'Central Hub'}</span>
              </p>
            </div>
            <div className="flex gap-4">
               <div className="bg-yellow-50 p-4 rounded-[1.8rem] text-center min-w-[85px] border border-yellow-100">
                  <p className="text-[9px] font-black text-yellow-600 uppercase tracking-widest mb-1">Rating</p>
                  <p className="text-xl font-black flex items-center justify-center gap-1 italic">
                    <Star size={16} className="fill-yellow-400 text-yellow-400"/> {restaurant?.rating || '4.5'}
                  </p>
               </div>
               <div className="bg-red-50 p-4 rounded-[1.8rem] text-center min-w-[85px] border border-red-100">
                  <p className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1">Time</p>
                  <p className="text-xl font-black flex items-center justify-center gap-1 italic">
                    <Clock size={16} className="text-red-400"/> {restaurant?.delivery_time || '25 min'}
                  </p>
               </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-black mt-16 mb-8 text-gray-900 tracking-tight uppercase italic flex items-center gap-3">
          <div className="w-8 h-[2px] bg-red-600"></div> Main Menu
        </h2>
        
        {/* MENU GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menu.map((item) => {
            const cartItem = getItemInCart(item.id);
            
            return (
              <motion.div 
                key={item.id} 
                layout
                className="flex bg-white p-5 rounded-[2.5rem] shadow-sm border border-red-50 hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className="w-28 h-28 shrink-0 rounded-[1.8rem] overflow-hidden mr-5 border border-gray-50">
                  <img 
                    src={getImageUrl(item.image_url, "menu_items")} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={item.name}
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-black text-lg text-gray-800 leading-tight uppercase italic">{item.name}</h3>
                  <p className="text-gray-400 text-[10px] mt-1 line-clamp-2 font-bold uppercase tracking-tighter leading-snug">
                    {item.description || 'Delicious freshly prepared dish.'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                     <span className="font-black text-red-600 text-lg italic uppercase">{item.price} <span className="text-xs">RON</span></span>
                     
                     <div className="flex items-center">
                        <AnimatePresence mode="wait">
                          {!cartItem ? (
                            <motion.button 
                              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                              onClick={() => addToCart({ ...item, restaurant_name: restaurant?.name })}
                              className="bg-red-600 text-white p-3 rounded-2xl hover:bg-black shadow-lg shadow-red-100 transition-all active:scale-90"
                            >
                              <Plus size={20} strokeWidth={3} />
                            </motion.button>
                          ) : (
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-3 bg-gray-900 p-1.5 rounded-2xl border border-gray-800 shadow-xl"
                            >
                              <button 
                                onClick={() => updateQuantity(cartItem.id, -1)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-xl hover:text-red-500 transition-colors"
                              >
                                {cartItem.quantity === 1 ? <Trash2 size={14}/> : <Minus size={14}/>}
                              </button>
                              
                              <span className="font-black text-white text-sm min-w-[20px] text-center italic">{cartItem.quantity}</span>
                              
                              <button 
                                onClick={() => updateQuantity(cartItem.id, 1)}
                                className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                              >
                                <Plus size={14} strokeWidth={3}/>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                     </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FLOAT BUTTON CART */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            initial={{ y: 100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 100, x: "-50%", opacity: 0 }}
            className="fixed bottom-10 left-1/2 z-50 w-[92%] max-w-md"
          >
            <button 
              onClick={() => router.push("/checkout")}
              className="w-full bg-gray-950 text-white px-8 py-6 rounded-[2.5rem] font-black flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all border border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className="bg-red-600 p-3 rounded-2xl relative shadow-lg shadow-red-500/20">
                  <ShoppingBag size={22} />
                  <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-950 font-black">
                    {cart.reduce((sum, i) => sum + i.quantity, 0)}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-red-500 uppercase font-black tracking-widest mb-0.5">Go to Checkout</p>
                  <p className="text-xs font-bold text-gray-400 uppercase italic">From {restaurant?.name}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-0.5 italic">Total Pay</p>
                <p className="text-2xl tracking-tighter text-white italic">{total.toFixed(2)} <span className="text-xs">RON</span></p>
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

"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseConfig";
import { CartProvider, useCart } from "../../../context/CartContext"; 
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Minus, ShoppingBag, Loader2, Star, Clock, Trash2, ChevronDown, ChevronUp, Share2  } from "lucide-react";

// --- INTERNAL COMPONENT (UI & LOGIC) ---
function RestaurantContent() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, updateQuantity, removeFromCart, total, cart } = useCart(); 
  
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOGICĂ NOUĂ: State pentru descriere expandabilă
  const [expandedItems, setExpandedItems] = useState({});
  const toggleDescription = (itemId) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

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

/**handler share */
const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: restaurant?.name,
        text: `Uite ce meniu fain au cei de la ${restaurant?.name}!`,
        url: window.location.href,
      });
    } catch (err) {
      console.log("Share cancelled");
    }
  } else {
    // Fallback: Copiază link-ul dacă browserul nu suportă share (ex: pe PC)
    navigator.clipboard.writeText(window.location.href);
    alert("Link copiat în clipboard!");
  }
};



  // Helper funcție pentru a găsi produsul în coș
  const getItemInCart = (itemId) => cart?.find(item => item.product_id === itemId || item.id === itemId);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FFF9F9] gap-4">
      <Loader2 className="animate-spin text-red-600" size={48} strokeWidth={3} />
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Loading Menu...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF9F9] pb-40 font-sans relative">
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
        <button 
  onClick={handleShare} // Aici chemăm funcția de mai sus
  className="absolute top-6 right-6 z-30 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl hover:scale-110 transition-all active:scale-90 text-red-600"
>
  <Share2 size={20}/>
</button>

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
            const isExpanded = expandedItems[item.id];
            const isOutOfStock = item.is_available === false; // LOGICĂ STOC
            
            return (
              <motion.div 
                key={item.id} 
                layout
                className={`flex bg-white p-5 rounded-[2.5rem] shadow-sm border border-red-50 transition-all group relative overflow-hidden ${isOutOfStock ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-xl'}`}
              >
                <div className="w-28 h-28 shrink-0 rounded-[1.8rem] overflow-hidden mr-5 border border-gray-50 relative">
                  <img 
                    src={getImageUrl(item.image_url, "menu_items")} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={item.name}
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">Epuizat</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-lg text-gray-800 leading-tight uppercase italic">{item.name}</h3>
                    {/* LOGICĂ GRAMAJ */}
                    {item.weight && <span className="text-[9px] font-black text-gray-300 italic uppercase">{item.weight}g</span>}
                  </div>
                  
                  {/* LOGICĂ DESCRIERE HIDE/CLOSE */}
                  <div className="relative mt-1">
                    <p className={`text-gray-400 text-[10px] font-bold uppercase tracking-tighter leading-snug ${!isExpanded ? 'line-clamp-2' : ''}`}>
                      {item.description || 'Delicious freshly prepared dish.'}
                    </p>
                    {item.description?.length > 40 && (
                      <button 
                        onClick={() => toggleDescription(item.id)}
                        className="text-red-500 text-[8px] font-black uppercase mt-1 flex items-center gap-1"
                      >
                        {isExpanded ? <>[ Close <ChevronUp size={10}/> ]</> : <>[ More <ChevronDown size={10}/> ]</>}
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                     <span className="font-black text-red-600 text-lg italic uppercase">{item.price} <span className="text-xs">RON</span></span>
                     
                     <div className="flex items-center">
                        <AnimatePresence mode="wait">
                          {isOutOfStock ? (
                            <div className="p-3 bg-gray-100 rounded-2xl text-gray-300"><Plus size={20} /></div>
                          ) : !cartItem ? (
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
                                <Plus size={14}/>
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





      {/* FLOATING CART CU BADGE NR UNITĂȚI */}
      <AnimatePresence>
        {total > 0 && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="fixed bottom-10 left-0 right-0 z-50 px-6 flex justify-center"
          >
            <button 
              onClick={() => router.push('/checkout')}
              className="bg-gray-900 text-white flex items-center gap-6 p-5 rounded-[2.5rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              <div className="flex items-center gap-3 relative">
                <div className="bg-red-600 p-3 rounded-2xl relative">
                  <ShoppingBag size={20} />
                  {/* BADGE NR UNITĂȚI MIC SUS */}
                  <span className="absolute -top-2 -right-2 bg-white text-red-600 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-900">
                    {cart.reduce((acc, curr) => acc + curr.quantity, 0)}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cart</p>
                  <p className="text-sm font-black italic uppercase">{cart.length} Feluri</p>
                </div>
              </div>
              <div className="h-10 w-[1px] bg-gray-800" />
              <div className="text-right">
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Total</p>
                <p className="text-xl font-black italic">{total} RON</p>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ASIGURĂM CONTEXTUL CART PENTRU TOATĂ PAGINA
export default function RestaurantPage() {
  return (
    <CartProvider>
      <RestaurantContent />
    </CartProvider>
  );
}

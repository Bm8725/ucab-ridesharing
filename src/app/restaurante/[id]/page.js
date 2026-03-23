"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseConfig";
import { ArrowLeft, Plus, ShoppingBag, Loader2, Star, Clock } from "lucide-react";

export default function PaginaRestaurant() {
  const { id } = useParams();
  const router = useRouter();
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

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#FFF9F9]"><Loader2 className="animate-spin text-red-500" size={40} /></div>;

  return (
    <div className="min-h-screen bg-[#FFF9F9]">
      {/* HEADER BANNER */}
      <div className="relative h-72 w-full">
        <button onClick={() => router.back()} className="absolute top-6 left-6 z-30 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl hover:scale-110 transition-all"><ArrowLeft size={20}/></button>
        <img src={getImageUrl(restaurant?.image_url)} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF9F9] via-black/20 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-20 relative z-20">
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
                  <p className="text-xl font-black flex items-center justify-center gap-1"><Star size={16} className="fill-yellow-400 text-yellow-400"/> {restaurant?.rating}</p>
               </div>
               <div className="bg-red-50 p-4 rounded-2xl text-center min-w-[80px]">
                  <p className="text-[10px] font-black text-red-600 uppercase">Timp</p>
                  <p className="text-xl font-black flex items-center justify-center gap-1"><Clock size={16} className="text-red-400"/> {restaurant?.delivery_time}</p>
               </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-black mt-16 mb-8 text-gray-900 tracking-tight">Meniu Principal</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {menu.map((item) => (
            <div key={item.id} className="flex bg-white p-4 rounded-[2rem] shadow-sm border border-red-50 hover:shadow-xl transition-all group">
              <div className="w-28 h-28 shrink-0 rounded-2xl overflow-hidden mr-4">
                <img src={getImageUrl(item.image_url, "menu_items")} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-black text-lg text-gray-800">{item.name}</h3>
                <p className="text-gray-400 text-xs mt-1 line-clamp-2 font-medium">{item.description}</p>
                <div className="flex items-center justify-between mt-3">
                   <span className="font-black text-red-600">{item.price} RON</span>
                   <button className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-90">
                     <Plus size={18} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FLOAT BUTTON COȘ */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
         <button className="bg-gray-900 text-white px-8 py-4 rounded-3xl font-black flex items-center gap-3 shadow-2xl hover:scale-105 transition-all">
            <ShoppingBag size={20} className="text-red-500" />
            Vezi Coșul • 0 RON
         </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Star, Clock, MapPin, Flame, 
  UtensilsCrossed, ArrowRight, Heart,
  ShoppingBag, Sparkles, Filter, 
  Bike, ChevronRight, Trophy, 
  Timer, Zap, HeartPulse, Loader2
} from "lucide-react";

export default function Restaurante() {
  const [restaurante, setRestaurante] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Toate");
  
  // LOGICĂ DETECTARE LOCAȚIE
  const [zona, setZona] = useState("Detectare...");
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `nominatim.openstreetmap.org{latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const oras = data.address.city || data.address.town || data.address.village || "Târgoviște";
            const cartier = data.address.suburb || data.address.neighbourhood || "";
            setZona(`${oras}${cartier ? `, ${cartier}` : ""}`);
          } catch (error) {
            setZona("Târgoviște");
          } finally {
            setIsDetecting(false);
          }
        },
        () => {
          setZona("Târgoviște");
          setIsDetecting(false);
        }
      );
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRestaurante([
        {
          id: 1,
          name: "Urban Burger",
          rating: 4.8,
          reviews: "500+",
          time: "20-30 min",
          distance: "1.2 km",
          img: "/burgerucab.png",
          promo: "15% REDUCERE",
          type: "Gourmet Burger",
          isFreeDelivery: true,
          isPopular: true
        },
        {
          id: 2,
          name: "Sushi Master",
          rating: 4.9,
          reviews: "1.2k",
          time: "35-45 min",
          distance: "2.1 km",
          img: "/sushi.png",
          type: "Japanese Sushi",
          isFreeDelivery: false,
          isPopular: true
        },
        {
          id: 3,
          name: "Pasta Casa",
          rating: 4.7,
          reviews: "300+",
          time: "15-25 min",
          distance: "0.9 km",
          img: "/fooddelivery.png",
          promo: "Meniu Zilei",
          type: "Italian Pasta",
          isFreeDelivery: true,
          isPopular: false
        },
      ]);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const categorii = [
    { name: "Toate", icon: <UtensilsCrossed size={16} /> },
    { name: "Promoții", icon: <Flame size={16} className="text-red-500" /> },
    { name: "Burger", emoji: "🍔" },
    { name: "Pizza", emoji: "🍕" },
    { name: "Sushi", emoji: "🍣" },
    { name: "Desert", emoji: "🍰" },
    { name: "Sănătos", emoji: "🥗" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F9] text-[#1D1D1F] pb-24 font-sans selection:bg-red-100">
      
{/* HEADER DINAMIC */}
<header
  className="
    md:sticky md:top-0
    z-40
    bg-white/90 backdrop-blur-2xl
    border-b border-red-50
    px-6 py-4
    md:shadow-sm
  "
>
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">

    {/* LOGO + LOCAȚIE */}
    <div className="flex items-center gap-4 shrink-0">
      <div className="bg-gradient-to-br from-red-600 to-rose-400 p-2.5 rounded-2xl shadow-lg shadow-red-200">
        <ShoppingBag className="text-white" size={22} />
      </div>

      <div>
        <h1 className="text-2xl font-black tracking-tight leading-none text-gray-900">
          UCab <span className="text-red-600">Food</span>
        </h1>

        <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">
          {isDetecting ? (
            <Loader2 size={10} className="animate-spin text-red-500" />
          ) : (
            <MapPin size={10} className="text-red-500" />
          )}
          {zona}
        </div>
      </div>
    </div>

    {/* SEARCH */}
    <div className="relative flex-1 max-w-lg group">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition"
        size={18}
      />
      <input
        type="text"
        placeholder={`Ce vrei să mănânci bun în ${zona.split(",")[0]}?`}
        className="
          w-full
          bg-gray-50
          border-2 border-transparent
          focus:bg-white focus:border-red-100
          rounded-2xl
          py-3.5 pl-12 pr-4
          outline-none
          transition-all
          font-medium text-sm
          shadow-inner
        "
      />
    </div>

    {/* STATUS (desktop only) */}
    <div className="hidden lg:flex items-center gap-6 shrink-0">
      <div className="text-right">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Status Livrări
        </p>
        <p className="text-xs font-bold text-green-500 flex items-center gap-1 justify-end">
          <Zap size={10} fill="currentColor" /> 42 Curieri Activi
        </p>
      </div>

      <div className="w-10 h-10 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-600">
        <HeartPulse size={20} />
      </div>
    </div>

  </div>
</header>



      <main className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* TOP OFFERS CAROUSEL (NEW) */}
        <section className="mb-12">
           <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4">
              {[1, 2].map((i) => (
                <div key={i} className="min-w-[300px] md:min-w-[450px] h-48 bg-gradient-to-r from-red-600 to-rose-500 rounded-[2.5rem] p-8 relative overflow-hidden flex-shrink-0 shadow-xl shadow-red-200">
                   <div className="relative z-10 text-white">
                      <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-80 mb-2">Oferta Săptămânii</p>
                      <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight">Meniu Family <br/> la -30%</h3>
                      <button className="bg-white text-red-600 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">Comandă Acum</button>
                   </div>
                   <Flame className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white opacity-10 rotate-12" />
                </div>
              ))}
           </div>
        </section>
        
        {/* CATEGORII */}
        <div className="flex gap-3 overflow-x-auto scrollbar-none py-2 border-b border-red-50">
          {categorii.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap border-2 mb-4 ${
                activeCategory === cat.name 
                ? "bg-red-600 border-red-600 text-white shadow-xl shadow-red-100 scale-105" 
                : "bg-white border-gray-100 text-gray-500 hover:border-red-200"
              }`}
            >
              {cat.icon ? cat.icon : <span>{cat.emoji}</span>}
              {cat.name}
            </button>
          ))}
        </div>

        {/* SECȚIUNE RESTAURANTE */}
        <div className="mt-16 mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tighter">Top Alegeri în {zona.split(',')[0]}</h2>
            <div className="flex items-center gap-4 mt-2">
               <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">
                  <Trophy size={12} /> Cele mai comandate
               </span>
               <span className="flex items-center gap-1 text-xs font-bold text-gray-400">
                  <Timer size={12} /> Livrare medie: 28 min
               </span>
            </div>
          </div>
          <button className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-red-50 transition shadow-sm group">
            <Filter size={20} className="text-gray-600 group-hover:text-red-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="wait">
            {loading ? (
              Array.from({ length: 6 }).map((_, n) => (
                <div key={n} className="animate-pulse space-y-4">
                  <div className="bg-gray-200 h-64 rounded-[2.8rem]" />
                  <div className="h-8 bg-gray-200 w-2/3 rounded-xl" />
                </div>
              ))
            ) : (
              restaurante.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-[2.8rem] border border-red-50 overflow-hidden hover:shadow-[0_40px_80px_-15px_rgba(220,38,38,0.12)] transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img src={r.img} alt={r.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    
                    <div className="absolute top-5 left-5 flex flex-col gap-2">
                      {r.promo && (
                        <div className="bg-red-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest flex items-center gap-2 shadow-xl">
                          <Flame size={12} fill="white" /> {r.promo}
                        </div>
                      )}
                      {r.isFreeDelivery && (
                        <div className="bg-rose-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 shadow-lg">
                          <Bike size={12} /> GRATUIT
                        </div>
                      )}
                    </div>

                    <button className="absolute top-5 right-5 p-3.5 bg-white/90 backdrop-blur-md rounded-2xl text-gray-300 hover:text-red-500 transition-all shadow-sm">
                      <Heart size={20} />
                    </button>

                    <div className="absolute bottom-5 left-5 right-5">
                       <div className="bg-black/30 backdrop-blur-xl border border-white/20 p-4 rounded-[1.8rem] flex justify-between items-center text-white shadow-2xl">
                          <div className="flex items-center gap-2 font-black text-[11px] uppercase tracking-wider">
                            <Clock size={14} className="text-red-400" /> {r.time}
                          </div>
                          <div className="w-px h-4 bg-white/20" />
                          <div className="flex items-center gap-2 font-black text-[11px] uppercase tracking-wider">
                            <MapPin size={14} className="text-red-400" /> {r.distance}
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black tracking-tight mb-1 group-hover:text-red-600 transition-colors">{r.name}</h3>
                        <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em]">{r.type}</p>
                      </div>
                      <div className="bg-red-50 text-red-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-red-100">
                        <Star size={14} fill="currentColor" />
                        <span className="font-black text-sm">{r.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-red-50">
                      <a href="/partener-restaurant" className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-[10px] tracking-widest hover:bg-red-600 transition-all group">
                        DETALII 
                        <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </a>
                      <div className="flex gap-2">
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all cursor-pointer shadow-sm">
                          <ShoppingBag size={22} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* LOYALTY SECTION (NEW) */}
        <section className="mt-32 grid md:grid-cols-2 gap-10 items-center bg-white p-10 rounded-[3.5rem] border border-red-50 shadow-sm">
           <div className="space-y-6">
              <div className="inline-block p-3 bg-red-100 rounded-2xl text-red-600">
                 <Trophy size={32} />
              </div>
              <h2 className="text-4xl font-black tracking-tight">Ești fidel, <br/> ești premiat.</h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                 Cu programul **UCab Rewards**, fiecare comandă îți aduce puncte pe care le poți folosi pentru livrare gratuită sau reduceri la restaurantele tale preferate.
              </p>
              <button className="flex items-center gap-2 font-black text-red-600 group">
                 Vezi beneficiile mele <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
           <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-50 rounded-3xl border border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                   <Sparkles size={24} />
                </div>
              ))}
           </div>
        </section>

        {/* BANNER PARTENER */}
        <section className="mt-32 relative">
          <div className="bg-gradient-to-br from-red-600 to-rose-500 rounded-[3.5rem] p-12 md:p-20 overflow-hidden text-center md:text-left shadow-2xl shadow-red-200">
            <div className="relative z-10 grid md:grid-cols-2 items-center gap-10">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-red-100 font-black text-xs tracking-[0.3em] uppercase mb-6">
                  <Sparkles size={16} /> Partner Program 2026
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                  Restaurantul tău <br /> merită <span className="text-red-200 underline decoration-white/30">ce-i mai bun.</span>
                </h2>
                <button className="px-10 py-5 bg-white text-red-600 rounded-[2rem] font-black text-xs tracking-widest hover:shadow-2xl transition-all uppercase">
                   Devino Partener UCab
                </button>
              </div>
              <div className="hidden md:flex justify-end opacity-20">
                <UtensilsCrossed size={200} className="text-white -rotate-12" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-40 border-t border-red-50 py-16 text-center">
        <div className="flex justify-center gap-8 mb-10 text-gray-400">
           <Heart size={20} className="hover:text-red-500 cursor-pointer transition" />
           <ShoppingBag size={20} className="hover:text-red-500 cursor-pointer transition" />
           <Star size={20} className="hover:text-red-500 cursor-pointer transition" />
        </div>

      </footer>
    </div>
  );
}

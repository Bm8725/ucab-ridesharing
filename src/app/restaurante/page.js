"use client";

import { useState, useEffect } from "react";
import {supabase} from "../../lib/supabaseConfig";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Star, Clock, MapPin, Flame, 
  UtensilsCrossed, ShoppingBag, Loader2, Zap, Trophy 
} from "lucide-react";

export default function Restaurante() {
  const [restaurante, setRestaurante] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Toate");
  const [searchTerm, setSearchTerm] = useState("");
  const [zona, setZona] = useState("Târgoviște");

  // LOGICĂ FETCH SUPABASE (Legătura cu DB)
  useEffect(() => {
    async function getRestaurante() {
      setLoading(true);
      
      let query = supabase
        .from('restaurants')
        .select('id, name, address, category, rating, delivery_time, is_popular, image_url')
        .eq('is_active', true);

      // Filtrare după categoria selectată
      if (activeCategory !== "Toate" && activeCategory !== "Promoții") {
        query = query.eq('category', activeCategory);
      }

      // Filtrare specială pentru Promoții (cele populare sau cu rating mare)
      if (activeCategory === "Promoții") {
        query = query.eq('is_popular', true);
      }

      // Filtrare după textul din Search
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (!error) {
        setRestaurante(data);
      } else {
        console.error("Eroare Supabase:", error.message);
      }
      setLoading(false);
    }

    getRestaurante();
  }, [activeCategory, searchTerm]);

  const categorii = [
    { name: "Toate", icon: <UtensilsCrossed size={16} /> },
    { name: "Promoții", icon: <Flame size={16} className="text-red-500" /> },
    { name: "Burger", emoji: "🍔" },
    { name: "Pizza", emoji: "🍕" },
    { name: "Sushi", emoji: "🍣" },
    { name: "Italian", emoji: "🍝" },
    { name: "Desert", emoji: "🍰" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F9] text-[#1D1D1F] pb-24 font-sans selection:bg-red-100">
      
      {/* HEADER DINAMIC - DESIGN ORIGINAL */}
      <header className="md:sticky md:top-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-red-50 px-6 py-4 md:shadow-sm">
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
                <MapPin size={10} className="text-red-500" />
                {zona}
              </div>
            </div>
          </div>

          {/* SEARCH FUNCTIONAL */}
          <div className="relative flex-1 max-w-lg group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition" size={18} />
            <input
              type="text"
              placeholder={`Ce vrei să mănânci bun în ${zona}?`}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium text-sm shadow-inner"
            />
          </div>

          {/* STATUS CURIERI */}
          <div className="hidden lg:flex items-center gap-6 shrink-0 text-right">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Livrări</p>
              <p className="text-xs font-bold text-green-500 flex items-center gap-1 justify-end">
                <Zap size={10} fill="currentColor" /> 42 Curieri Activi
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* CAROUSEL PROMO */}
        <section className="mb-12">
           <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4">
              <div className="min-w-[300px] md:min-w-[450px] h-48 bg-gradient-to-r from-red-600 to-rose-500 rounded-[2.5rem] p-8 relative overflow-hidden flex-shrink-0 shadow-xl shadow-red-200">
                   <div className="relative z-10 text-white">
                      <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-80 mb-2">Oferta Săptămânii</p>
                      <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight">Meniu Family <br/> la -30%</h3>
                      <button className="bg-white text-red-600 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">Comandă Acum</button>
                   </div>
                   <Flame className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white opacity-10 rotate-12" />
              </div>
           </div>
        </section>
        
        {/* FILTRE CATEGORII */}
        <div className="flex gap-3 overflow-x-auto scrollbar-none py-2 border-b border-red-50">
          {categorii.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all border-2 mb-4 ${
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

        {/* HEADER RESTAURANTE */}
        <div className="mt-16 mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tighter text-gray-900">
            {activeCategory === "Toate" ? `Top Alegeri în ${zona}` : `${activeCategory} în ${zona}`}
          </h2>
          <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">
            <Trophy size={12} /> {restaurante.length} Locații
          </span>
        </div>

        {/* GRID RESTAURANTE SAU LOADING */}
        {loading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <Loader2 className="animate-spin text-red-500" size={40} />
            <p className="font-black text-gray-400 uppercase tracking-widest text-[10px]">UCab caută aromele tale...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {restaurante.map((res) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={res.id}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-red-50 group hover:shadow-2xl transition-all duration-500"
                >
                  {/* IMAGINE RESTAURANT */}
                  <div className="relative h-52 bg-gray-100 overflow-hidden">
                    {res.is_popular && (
                      <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-red-500/30">
                        <Flame size={10} /> POPULAR
                      </span>
                    )}
                    <img 
                      src={res.image_url || "images.unsplash.com"} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={res.name} 
                    />
                  </div>

                  {/* INFO RESTAURANT */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold tracking-tight text-gray-900">{res.name}</h3>
                      <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-black">
                        <Star size={12} fill="currentColor" /> {Number(res.rating).toFixed(1)}
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 font-medium">{res.category} • {res.address}</p>
                    
                    {/* FOOTER CARD */}
                    <div className="flex items-center justify-between border-t border-red-50 pt-4">
                      <div className="flex items-center gap-4 text-xs font-black text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={14} className="text-red-500" /> {res.delivery_time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase tracking-tighter">
                        <Zap size={12} fill="currentColor" /> Livrare UCab
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && restaurante.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-red-100">
            <UtensilsCrossed size={48} className="mx-auto text-red-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Niciun restaurant găsit</h3>
            <p className="text-gray-400">Încearcă altă categorie sau caută ceva diferit.</p>
          </div>
        )}
      </main>
    </div>
  );
}

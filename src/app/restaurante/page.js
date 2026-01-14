"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseConfig";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Star, Clock, MapPin, Flame, 
  UtensilsCrossed, ShoppingBag, Loader2, Zap, Trophy,
  ChevronDown, Check, Navigation
} from "lucide-react";

export default function Restaurante() {
  const [restaurante, setRestaurante] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Toate");
  const [searchTerm, setSearchTerm] = useState("");
  
  // LOGICĂ LOCAȚIE
  const [zona, setZona] = useState("Târgoviște");
  const [isZonePickerOpen, setIsZonePickerOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const zoneDisponibile = ["Târgoviște", "București", "Cluj-Napoca", "Brașov", "Ploiești"];

  // 1. FUNCȚIE DETECTARE GPS (Reverse Geocoding)
  const detectareGPS = () => {
    setIsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`nominatim.openstreetmap.org{latitude}&lon=${longitude}`);
          const data = await res.json();
          const orasDetectat = data.address.city || data.address.town || data.address.village || "Târgoviște";
          setZona(orasDetectat);
          setIsZonePickerOpen(false);
        } catch (error) {
          console.error("GPS Error:", error);
        } finally {
          setIsDetecting(false);
        }
      }, () => {
        setIsDetecting(false);
        alert("Acces locație refuzat.");
      });
    }
  };

  // 2. FETCH DINAMIC DUPĂ LOCAȚIE (PROFESIONAL)
  useEffect(() => {
    async function getRestaurante() {
      setLoading(true);
      
      // Selectăm restaurantele care sunt active
      let query = supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true);

      // FILTRARE AUTOMATĂ DUPĂ ORAȘ (Legătura cu coloana 'address')
      // Caută numele orașului (zona) în câmpul de adresă din DB
      if (zona) {
        query = query.ilike('address', `%${zona}%`);
      }

      // Filtrare Categorie
      if (activeCategory !== "Toate" && activeCategory !== "Promoții") {
        query = query.eq('category', activeCategory);
      }
      if (activeCategory === "Promoții") {
        query = query.eq('is_popular', true);
      }

      // Filtrare Search
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query.order('rating', { ascending: false });

      if (!error) {
        setRestaurante(data);
      }
      setLoading(false);
    }

    getRestaurante();
  }, [zona, activeCategory, searchTerm]); // Se declanșează la orice schimbare de oraș

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
    <div className="min-h-screen bg-[#FFF9F9] text-[#1D1D1F] pb-24 font-sans selection:bg-red-100 text-gray-900">
      
      {/* HEADER CU SELECTOR DE ORAȘ */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-red-50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-gradient-to-br from-red-600 to-rose-400 p-2.5 rounded-2xl shadow-lg relative w-10 h-10">
              <Image src="/ucabfood1.png" alt="UCab Food Logo" fill className="object-contain" />
            </div>
            <div className="relative">
              <h1 className="text-2xl font-black tracking-tight leading-none">
                UCab <span className="text-red-600">Food</span>
              </h1>
              
              {/* DROPDOWN ORAȘ */}
              <button 
                onClick={() => setIsZonePickerOpen(!isZonePickerOpen)}
                className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1 hover:text-red-600 transition"
              >
                <MapPin size={10} className="text-red-500" />
                <span className="border-b border-dashed border-gray-300">{zona}</span>
                <ChevronDown size={10} className={isZonePickerOpen ? "rotate-180" : ""} />
              </button>

              <AnimatePresence>
                {isZonePickerOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-3 w-64 bg-white border border-red-50 shadow-2xl rounded-[2rem] p-3 z-50"
                  >
                    <button 
                      onClick={detectareGPS}
                      className="w-full mb-3 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
                    >
                      {isDetecting ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
                      Localizare GPS
                    </button>
                    <div className="space-y-1">
                      {zoneDisponibile.map(z => (
                        <button 
                          key={z} onClick={() => { setZona(z); setIsZonePickerOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${zona === z ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-600'}`}
                        >
                          {z} {zona === z && <Check size={14} />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* CĂUTARE */}
          <div className="relative flex-1 max-w-lg group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={`Caută în ${zona}...`}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-100 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium text-sm"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* CAROUSEL PROMO */}
        <section className="mb-12">
           <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4">
              <div className="min-w-[300px] md:min-w-[450px] h-48 bg-gradient-to-r from-red-600 to-rose-500 rounded-[2.5rem] p-8 relative overflow-hidden flex-shrink-0 shadow-xl shadow-red-200">
                   <div className="relative z-10 text-white">
                      <p className="text-[10px] font-black tracking-[0.3em] uppercase opacity-80 mb-2 font-mono">2026 Promo</p>
                      <h3 className="text-2xl md:text-3xl font-black mb-4 leading-tight uppercase italic">Livrare gratuită <br/> la prima comandă</h3>
                      <button className="bg-white text-red-600 px-6 py-2.5 rounded-xl font-black text-xs uppercase shadow-lg">Profită acum</button>
                   </div>
                   <Flame className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white opacity-10 rotate-12" />
              </div>
           </div>
        </section>
        
        {/* CATEGORII */}
        <div className="flex gap-3 overflow-x-auto scrollbar-none py-2 border-b border-red-50">
          {categorii.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all border-2 mb-4 ${
                activeCategory === cat.name 
                ? "bg-red-600 border-red-600 text-white shadow-xl scale-105" 
                : "bg-white border-gray-100 text-gray-500 hover:border-red-200"
              }`}
            >
              {cat.icon ? cat.icon : <span>{cat.emoji}</span>}
              {cat.name}
            </button>
          ))}
        </div>

        {/* LISTĂ RESTAURANTE DINAMICĂ */}
        <div className="mt-16 mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tighter uppercase italic">
            Disponibile în {zona}
          </h2>
          <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">
             {restaurante.length} restaurante
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-24 gap-4">
            <Loader2 className="animate-spin text-red-500" size={40} />
            <p className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Căutăm restaurante în {zona}...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {restaurante.length > 0 ? (
                restaurante.map((res) => (
                  <motion.div
                    layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                    key={res.id}
                    className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-red-50 group hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="relative h-52 bg-gray-100 overflow-hidden">
                      {res.is_popular && (
                        <span className="absolute top-4 left-4 z-10 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-red-500/30 font-mono">
                          <Flame size={10} /> TOP
                        </span>
                      )}
                      <img 
                        src={res.image_url || "images.unsplash.com"} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        alt={res.name} 
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold tracking-tight">{res.name}</h3>
                        <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-black">
                          <Star size={12} fill="currentColor" /> {Number(res.rating).toFixed(1)}
                        </div>
                      </div>
                      <p className="text-gray-500 text-xs mb-4 font-bold uppercase tracking-tight">{res.category} • {res.address}</p>
                      
                      <div className="flex items-center justify-between border-t border-red-50 pt-4">
                        <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono">
                          <span className="flex items-center gap-1"><Clock size={14} className="text-red-500" /> {res.delivery_time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-green-600 uppercase italic">
                          <Zap size={12} fill="currentColor" /> Livrare UCab
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-red-100">
                   <MapPin size={40} className="mx-auto text-red-200 mb-4" />
                   <p className="font-bold text-gray-400 uppercase text-xs">Nu avem restaurante partenere în {zona} momentan.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

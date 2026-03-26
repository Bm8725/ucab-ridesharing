"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseConfig";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, MapPin, Loader2, Flame, Navigation, Zap, Percent, ChevronRight, Clock } from "lucide-react";

export default function Restaurante() {
  const [restaurante, setRestaurante] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  
  // PAGINATION STATES
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 6;

  // FUNCȚIE PROGRAM (FIXATĂ PE COLOANELE TALE SQL: open_time, close_time)
  const checkIfOpen = (openTime, closeTime) => {
    if (!openTime || !closeTime) return true;
    const acum = new Date();
    const oraCurenta = acum.getHours() * 60 + acum.getMinutes();
    
    const [hOpen, mOpen] = openTime.split(':').map(Number);
    const [hClose, mClose] = closeTime.split(':').map(Number);
    
    const minuteOpen = hOpen * 60 + mOpen;
    const minuteClose = hClose * 60 + mClose;
    
    return oraCurenta >= minuteOpen && oraCurenta <= minuteClose;
  };

  // 1. GEOLOCATION LOGIC (URL REPARAT COMPLET)
  const detectareLocatie = () => {
    if (!("geolocation" in navigator)) return;
    
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        // URL CORECTAT PENTRU NOMINATIM
        const res = await fetch(
          `https://nominatim.openstreetmap.org{latitude}&lon=${longitude}&addressdetails=1`
        );
        const data = await res.json();
        const oras = data.address.city || data.address.town || data.address.village;
        const judet = data.address.county || "";
        
        if (oras) {
          const locatieCautare = judet ? `${oras} ${judet}` : oras;
          setSearchTerm(locatieCautare); 
        }
      } catch (e) {
        console.error("Geolocation error:", e);
      } finally {
        setIsDetecting(false);
      }
    }, () => setIsDetecting(false));
  };

  useEffect(() => {
    detectareLocatie();
  }, []);

  // 2. SUPABASE FETCH WITH SEARCH & PAGINATION (STAYED)
  useEffect(() => {
    async function getRestaurante() {
      setLoading(true);
      try {
        let from = page * ITEMS_PER_PAGE;
        let to = from + ITEMS_PER_PAGE - 1;

        let query = supabase
          .from('restaurants')
          .select('*', { count: 'exact' })
          .eq('is_active', true)
          .range(from, to);

        if (searchTerm) {
          query = query.or(`name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
        }
        
        const { data, error, count } = await query.order('rating', { ascending: false });
        
        if (error) throw error;

        setRestaurante(prev => page === 0 ? data : [...prev, ...data]);
        setHasMore(count > (page + 1) * ITEMS_PER_PAGE);
      } catch (e) { 
        console.error(e); 
      } finally { 
        setLoading(false); 
      }
    }

    const timeoutId = setTimeout(() => getRestaurante(), 400);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, page]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 font-sans text-gray-900">
      
      {/* HEADER (STAYED WITH LOGO) */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          
          <Link href="/restaurante" className="flex items-center gap-3 shrink-0 group">
             <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-md border border-red-50">
                <Image 
                  src="/ucabfood1.png" 
                  alt="UCab Food Logo" 
                  fill 
                  className="object-contain p-1"
                />
             </div>
             <h1 className="text-xl font-black italic tracking-tighter uppercase">
                UCAB<span className="text-red-600">FOOD</span>
             </h1>
          </Link>
          
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search city, food or restaurant..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-red-100 rounded-2xl py-3.5 pl-12 pr-12 outline-none text-sm font-bold transition-all shadow-inner" 
            />
            <button 
              onClick={detectareLocatie}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-red-50 transition-colors ${isDetecting ? 'animate-pulse text-red-600' : 'text-gray-400'}`}
            >
              <Navigation size={18} fill={isDetecting ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* PROMOTIONS & ADS SECTION (STAYED) */}
        <section className="mb-12 overflow-x-auto no-scrollbar flex gap-6 pb-4">
          <div className="min-w-[300px] md:min-w-[400px] bg-gradient-to-br from-red-600 to-rose-500 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-red-200 flex-shrink-0">
             <div className="relative z-10">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Limited Offer</span>
                <h3 className="text-2xl font-black mt-4 leading-tight">Free Delivery <br/> on your first order!</h3>
                <p className="text-white/80 text-xs mt-2 font-bold uppercase tracking-tighter">Use code: WELCOMEUCABFOOD</p>
             </div>
             <Zap className="absolute right-[-20px] bottom-[-20px] w-40 h-40 opacity-10 rotate-12" />
          </div>

          <div className="min-w-[300px] md:min-w-[400px] bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl flex-shrink-0">
             <div className="relative z-10">
                <span className="bg-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Flash Sale</span>
                <h3 className="text-2xl font-black mt-4 leading-tight">Up to 50% OFF <br/> on selected burgers</h3>
                <button className="bg-white text-black px-5 py-2 rounded-xl text-[10px] font-black uppercase mt-4">Order Now</button>
             </div>
             <Percent className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-red-600 opacity-20" />
          </div>
        </section>

        {/* RESTAURANT LIST HEADER (STAYED) */}
        <div className="flex items-end justify-between mb-8">
           <div>
              <h2 className="text-4xl font-black tracking-tighter text-gray-900">
                {searchTerm ? `Restaurants in "${searchTerm}"` : "Explore nearby flavors"}
              </h2>
              <p className="text-gray-400 font-bold text-xs mt-2 uppercase tracking-widest">
                {restaurante.length} venues available now
              </p>
           </div>
        </div>

        {/* RESTAURANT GRID */}
        {loading && page === 0 ? (
          <div className="flex flex-col items-center py-32 gap-4">
            <Loader2 className="animate-spin text-red-600" size={48} strokeWidth={3} />
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Loading deliciousness...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {restaurante.map((res) => {
                  const isOpen = checkIfOpen(res.open_time, res.close_time);
                  
                  return (
                    <Link href={`/restaurante/${res.id}`} key={res.id}>
                      <motion.div 
                        layout 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className={`group relative ${!isOpen ? 'grayscale' : ''}`}
                      >
                        <div className="relative h-60 w-full rounded-[2.5rem] overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-500 border border-gray-100">
                          <img 
                            src={res.image_url?.startsWith('http') ? res.image_url : `https://images.unsplash.com`} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            alt={res.name} 
                          />
                          
                          {/* BADGE DESCHIS / INCHIS */}
                          <div className="absolute top-5 left-5 flex gap-2">
                             <div className={`px-4 py-1.5 rounded-2xl backdrop-blur-md flex items-center gap-2 border shadow-lg ${isOpen ? 'bg-emerald-500/90 border-emerald-400 text-white' : 'bg-gray-900/90 border-gray-700 text-white'}`}>
                                <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-white animate-pulse' : 'bg-red-500'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{isOpen ? 'Open' : 'Close'}</span>
                             </div>
                             <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-lg">
                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-black">{res.rating || '4.5'}</span>
                             </div>
                          </div>

                          {!isOpen && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                               <p className="text-white font-black uppercase tracking-[0.2em] border-2 border-white/50 px-6 py-2 rounded-2xl">Open soon</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-6 px-2">
                          <h3 className="text-xl font-black italic uppercase tracking-tighter group-hover:text-red-600 transition-colors">
                            {res.name}
                          </h3>
                          {/* ADRESA AFISATA SUB TITLU */}
                          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1 mb-2 flex items-center gap-1.5">
                             <MapPin size={12} className="text-red-500" /> {res.address || 'Locație Centrală'}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                             <span className="flex items-center gap-1 text-red-500 italic">
                                <Clock size={12}/> {res.delivery_time || '20-30 min'}
                             </span>
                             <span>•</span>
                             <span className="flex items-center gap-1">
                                <Flame size={12} className="text-orange-500" /> {res.category}
                             </span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {hasMore && (
              <div className="flex justify-center mt-16">
                 <button 
                  onClick={() => setPage(prev => prev + 1)}
                  className="bg-white border-2 border-gray-100 px-8 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest hover:border-red-600 hover:text-red-600 transition-all shadow-xl shadow-gray-100"
                 >
                   Load more restaurants
                 </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseConfig";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, MapPin, Loader2, Flame, Navigation, Zap, Percent, ChevronRight } from "lucide-react";

export default function Restaurante() {
  const [restaurante, setRestaurante] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  
  // PAGINATION STATES
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 6;

  // 1. GEOLOCATION LOGIC (STAYED & FIXED)
  const detectareLocatie = () => {
    if (!("geolocation" in navigator)) return;
    
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org{latitude}&lon=${longitude}`
        );
        const data = await res.json();
        const oras = data.address.city || data.address.town || data.address.village;
        
        if (oras) {
          setSearchTerm(oras); 
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

        // If page is 0, reset list. If > 0, append data.
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

  // Reset page when search term changes
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
        
        {/* NEW: PROMOTIONS & ADS SECTION */}
        <section className="mb-12 overflow-x-auto no-scrollbar flex gap-6 pb-4">
          <div className="min-w-[300px] md:min-w-[400px] bg-gradient-to-br from-red-600 to-rose-500 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-red-200 flex-shrink-0">
             <div className="relative z-10">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Limited Offer</span>
                <h3 className="text-2xl font-black mt-4 leading-tight">Free Delivery <br/> on your first order!</h3>
                <p className="text-white/80 text-xs mt-2 font-bold uppercase tracking-tighter">Use code: WELCOME2024</p>
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

        {/* RESTAURANT LIST HEADER */}
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
                {restaurante.map((res) => (
                  <Link href={`/restaurante/${res.id}`} key={res.id}>
                    <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="group">
                      <div className="relative h-60 w-full rounded-[2.5rem] overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-500 border border-gray-100">
                        <img 
                          src={res.image_url?.startsWith('http') ? res.image_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/restaurants/${res.image_url}`} 
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          alt={res.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                        
                        {res.is_popular && (
                          <div className="absolute top-5 left-5 bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-xl flex items-center gap-1.5 uppercase tracking-widest">
                              <Flame size={12} fill="white" /> Popular
                          </div>
                        )}
                        
                        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center text-white">
                          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black uppercase border border-white/20">
                            {res.delivery_time}
                          </div>
                          <div className="flex items-center gap-1 bg-white text-black px-3 py-1.5 rounded-xl text-xs font-black shadow-lg">
                            <Star size={14} className="fill-yellow-400 text-yellow-400" /> {res.rating}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 px-3">
                        <h3 className="font-black text-2xl text-gray-900 group-hover:text-red-600 transition-colors tracking-tight">{res.name}</h3>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-tighter mt-1">{res.category} • {res.address}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </AnimatePresence>
            </div>

            {/* NEW: LOAD MORE PAGINATION */}
            {hasMore && (
              <div className="mt-16 flex justify-center">
                <button 
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={loading}
                  className="bg-white border-2 border-gray-100 px-10 py-4 rounded-3xl font-black text-sm uppercase tracking-widest hover:border-red-500 hover:text-red-600 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Load More Venues"}
                  {!loading && <ChevronRight size={18} />}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

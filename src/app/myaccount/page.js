"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../../lib/supabaseConfig";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Clock, CheckCircle2, Loader2, Search,
  ChevronRight, Edit3, X, Package, 
  ChevronLeft, Phone, MapPin, LogOut, Zap, Save, Mail, ShieldCheck
} from "lucide-react";

export default function MyAccount() {
  const router = useRouter();
  
  // STATE-URI DATE
  const [profile, setProfile] = useState({ name: "", phone: "", address: "" });
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  
  // STATE-URI UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [msg, setMsg] = useState({ text: "", type: "" });

  // 1. FETCH INITIAL DATE (COMPLET)
  const fetchData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }
      
      setUser(session.user);

      const [profRes, ordersRes] = await Promise.all([
        supabase.from("riders").select("*").eq("id", session.user.id).single(),
        supabase.from("orders").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false })
      ]);

      if (profRes.data) {
        setProfile({
          name: profRes.data.name || "",
          phone: profRes.data.phone || "",
          address: profRes.data.address || ""
        });
      }
      
      if (ordersRes.data) {
        setOrders(ordersRes.data);
      }
    } catch (error) {
      console.error("Eroare fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 2. REALTIME SUBSCRIPTION (COMPLET)
  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(order => order.id === payload.new.id ? payload.new : order));
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(order => order.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  // 3. LOGICA EDITARE & SALVARE (COMPLETĂ)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: "", type: "" });

    try {
      const { error } = await supabase
        .from("riders")
        .update({
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
        })
        .eq("id", user.id);

      if (error) throw error;

      setMsg({ text: "Profil actualizat cu succes!", type: "success" });
      setIsEditing(false);
      setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    } catch (error) {
      setMsg({ text: "Eroare la salvare: " + error.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // 4. FILTRARE & PAGINARE (COMPLETĂ)
  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      (o.restaurant_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.delivery_address?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, orders]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [currentPage, filteredOrders]);

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 animate-pulse">myUCab Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-black selection:text-white">
      
      {/* HEADER UBER STYLE */}
      <nav className="bg-black text-white sticky top-0 z-50 px-6 h-20 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-black italic tracking-tighter">myUCab</span>
            <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-8">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">user</p>
                <p className="text-sm font-bold leading-none">{profile.name || "Client"}</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] bg-white/10 px-5 py-3 rounded-full hover:bg-white/20 transition-all border border-white/5"
          >
            Logout <LogOut size={14} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT COLUMN: ACCOUNT DETAILS */}
          <aside className="lg:col-span-4 space-y-10">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">Profile</h2>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isEditing ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                >
                  {isEditing ? <><X size={14}/> Cancel</> : <><Edit3 size={14}/> Edit</>}
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6 bg-white border border-gray-100 p-8 rounded-[2rem] shadow-2xl shadow-black/5">
                <div className="space-y-6">
                  {/* EMAIL - READ ONLY */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Cont</label>
                    <div className="w-full bg-gray-50 border border-transparent px-5 py-4 rounded-2xl text-sm font-bold text-gray-500 flex items-center gap-3">
                      <Mail size={16} /> {user?.email}
                    </div>
                  </div>

                  {/* NUME */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input 
                        readOnly={!isEditing}
                        className={`w-full pl-12 pr-5 py-4 rounded-2xl text-sm font-bold transition-all outline-none ${isEditing ? 'bg-white border-2 border-black shadow-lg ring-4 ring-black/5' : 'bg-gray-50 border border-transparent'}`}
                        value={profile.name}
                        onChange={e => setProfile({...profile, name: e.target.value})}
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  {/* TELEFON */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input 
                        readOnly={!isEditing}
                        type="tel"
                        className={`w-full pl-12 pr-5 py-4 rounded-2xl text-sm font-bold transition-all outline-none ${isEditing ? 'bg-white border-2 border-black shadow-lg ring-4 ring-black/5' : 'bg-gray-50 border border-transparent'}`}
                        value={profile.phone}
                        onChange={e => setProfile({...profile, phone: e.target.value})}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  {/* ADRESA */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Home Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-5 text-gray-300" size={16} />
                      <textarea 
                        readOnly={!isEditing}
                        className={`w-full pl-12 pr-5 py-4 rounded-2xl text-sm font-bold transition-all outline-none h-28 resize-none ${isEditing ? 'bg-white border-2 border-black shadow-lg ring-4 ring-black/5' : 'bg-gray-50 border border-transparent'}`}
                        value={profile.address}
                        onChange={e => setProfile({...profile, address: e.target.value})}
                        placeholder="Default address"
                      />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.button 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      type="submit"
                      disabled={saving}
                      className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/20 hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
                    >
                      {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Changes</>}
                    </motion.button>
                  )}
                </AnimatePresence>
                
                {msg.text && (
                  <p className={`text-center text-[10px] font-black uppercase tracking-widest mt-4 ${msg.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                    {msg.text}
                  </p>
                )}
              </form>
            </div>

            {/* QUICK STATS CARD */}
            <div className="bg-black rounded-3xl p-8 text-white flex items-center justify-between shadow-xl shadow-black/10">
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400" size={20} />
                  <p className="text-xl font-black italic uppercase tracking-tighter">Verified</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Rides</p>
                <p className="text-3xl font-black italic tracking-tighter">{orders.length}</p>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: ORDERS LIST */}
          <section className="lg:col-span-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
              <h2 className="text-xl font-black tracking-tight uppercase italic flex items-center gap-3">
                <div className="w-8 h-[2px] bg-black"></div> Recent Rides
              </h2>
              
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search rides..." 
                  className="bg-gray-100 border-none rounded-full pl-12 pr-8 py-3 text-xs font-bold outline-none w-full md:w-80 focus:ring-4 ring-black/5 focus:bg-white transition-all border border-transparent focus:border-black/10 shadow-sm"
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>

            <div className="space-y-4">
              {currentOrders.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {currentOrders.map((order, idx) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={order.id} 
                        className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl hover:bg-gray-50 transition-all group cursor-default shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${order.status === 'delivered' ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white animate-pulse'}`}>
                            <Zap size={22} fill={order.status === 'delivered' ? 'none' : 'currentColor'} />
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 text-base tracking-tight uppercase italic group-hover:text-blue-600 transition-colors">{order.restaurant_name}</h4>
                            
                            {/* AFISARE ADRESA COMPLETA AICI */}
                            <p className="text-[11px] text-blue-600 font-bold flex items-center gap-1 mt-0.5">
                              <MapPin size={12} /> {order.delivery_address || "Address info available in details"}
                            </p>

                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                              {new Date(order.created_at).toLocaleDateString('ro-RO')} • ID #{order.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                            <p className="font-black text-2xl tracking-tighter leading-none mb-1">{order.total_amount} <span className="text-xs text-gray-300 font-medium uppercase tracking-normal">Ron</span></p>
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${order.status === 'delivered' ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-600'}`}>
                              {order.status === 'delivered' ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                          <ChevronRight size={20} className="text-gray-200 group-hover:text-black transition-transform group-hover:translate-x-1" />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* PAGINATION CONTROLS */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:text-blue-600 transition-all group"
                      >
                        <ChevronLeft className="group-hover:-translate-x-1 transition-transform" size={18} /> Back
                      </button>
                      
                      <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-10 h-10 rounded-full text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-black text-white shadow-xl shadow-black/20' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:text-blue-600 transition-all group"
                      >
                        Next <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-24 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                  <Package className="mx-auto text-gray-200 mb-4" size={48} />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">No activity found</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

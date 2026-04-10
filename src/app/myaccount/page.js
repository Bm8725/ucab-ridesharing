"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../../lib/supabaseConfig";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Clock, CheckCircle2, Loader2, Search,
  ChevronRight, Edit3, X, Package, 
  ChevronLeft, Phone, MapPin, LogOut, Zap, Save, Mail, ShieldCheck,
  CreditCard, Truck, Star, MapPinCheck, DollarSign, AlertCircle,
  Calendar, Users, Car, Utensils, RotateCcw, MessageSquare
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
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const itemsPerPage = 6;
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [debugInfo, setDebugInfo] = useState({ userId: "", ordersCount: 0, error: "" });

  // 1. FETCH INITIAL DATE
  const fetchData = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/login");
        return;
      }
      
      setUser(session.user);
      console.log("Current user ID:", session.user.id);

      // Fetch profile
      const { data: profData, error: profError } = await supabase
        .from("riders")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profError) {
        console.error("Profile error:", profError);
      } else if (profData) {
        setProfile({
          name: profData.name || "",
          phone: profData.phone || "",
          address: profData.address || ""
        });
      }

      // Fetch orders - simplified
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Orders error:", ordersError);
        setDebugInfo(prev => ({ ...prev, error: JSON.stringify(ordersError) }));
      } else if (ordersData) {
        console.log("Orders fetched:", ordersData.length);
        setDebugInfo(prev => ({ ...prev, ordersCount: ordersData.length, userId: session.user.id }));
        setOrders(ordersData);
      }
    } catch (error) {
      console.error("Eroare fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // 2. REALTIME SUBSCRIPTION
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

  // 3. LOGICA EDITARE & SALVARE
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

  // 4. FILTRARE & PAGINARE
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = 
        (o.restaurant_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (o.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (o.delivery_address?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = filterStatus === "all" || o.status === filterStatus;
      
      let matchesType = filterType === "all";
      if (filterType === "delivery") {
        matchesType = ['delivery', 'pickup'].includes(o.type);
      } else if (filterType === "ride") {
        matchesType = ['ride', 'ride_share'].includes(o.type);
      }

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, orders, filterStatus, filterType]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [currentPage, filteredOrders]);

  // HELPER FUNCTIONS
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-50 text-yellow-600',
      'confirmed': 'bg-blue-50 text-blue-600',
      'preparing': 'bg-orange-50 text-orange-600',
      'ready': 'bg-emerald-50 text-emerald-600',
      'picked_up': 'bg-purple-50 text-purple-600',
      'assigned': 'bg-indigo-50 text-indigo-600',
      'in_transit': 'bg-cyan-50 text-cyan-600',
      'delivered': 'bg-green-50 text-green-600',
      'cancelled': 'bg-red-50 text-red-600',
      'failed': 'bg-red-50 text-red-600'
    };
    return colors[status] || 'bg-gray-50 text-gray-600';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': <Clock size={16} />,
      'confirmed': <CheckCircle2 size={16} />,
      'preparing': <Utensils size={16} />,
      'ready': <Package size={16} />,
      'picked_up': <Truck size={16} />,
      'delivered': <MapPinCheck size={16} />,
      'cancelled': <X size={16} />,
    };
    return icons[status] || <Zap size={16} />;
  };

  const getTypeLabel = (type) => {
    const labels = {
      'delivery': 'Livrare',
      'pickup': 'Ridicare',
      'ride': 'Curse',
      'ride_share': 'Curse Partajate'
    };
    return labels[type] || type;
  };

  const getVehicleIcon = (vehicleType) => {
    const icons = {
      'standard': '🚗',
      'comfort': '🚙',
      'van': '🚐',
      'moto': '🏍️'
    };
    return icons[vehicleType] || '🚗';
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON'
    }).format(amount || 0);
  };

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // CANCEL ORDER
  const handleCancelOrder = async (orderId, reason) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason
        })
        .eq("id", orderId);

      if (error) throw error;
      setMsg({ text: "Comandă anulată cu succes!", type: "success" });
      setSelectedOrder(null);
      setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    } catch (error) {
      setMsg({ text: "Eroare la anulare: " + error.message, type: "error" });
    }
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
      
      {/* HEADER */}
      <nav className="bg-black text-white sticky top-0 z-50 px-6 h-20 flex items-center justify-between border-b border-white/10">
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
            <div className="space-y-4">
              <div className="bg-black rounded-3xl p-8 text-white flex items-center justify-between shadow-xl shadow-black/10">
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="text-emerald-400" size={20} />
                    <p className="text-xl font-black italic uppercase tracking-tighter">Verified</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Orders</p>
                  <p className="text-3xl font-black italic tracking-tighter">{orders.length}</p>
                </div>
              </div>

              {/* STATS GRID */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2">Delivered</p>
                  <p className="text-2xl font-black text-emerald-700">{orders.filter(o => o.status === 'delivered').length}</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2">In Progress</p>
                  <p className="text-2xl font-black text-blue-700">{orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'assigned'].includes(o.status)).length}</p>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: ORDERS LIST */}
          <section className="lg:col-span-8 space-y-8">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <h2 className="text-xl font-black tracking-tight uppercase italic flex items-center gap-3">
                  <div className="w-8 h-[2px] bg-black"></div> Recent orders
                </h2>
                
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search orders..." 
                    className="bg-gray-100 border-none rounded-full pl-12 pr-8 py-3 text-xs font-bold outline-none w-full md:w-80 focus:ring-4 ring-black/5 focus:bg-white transition-all border border-transparent focus:border-black/10 shadow-sm"
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                </div>
              </div>

              {/* FILTERS */}
              <div className="flex flex-col md:flex-row gap-4 px-2">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => { setFilterStatus("all"); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === "all" ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => { setFilterStatus("delivered"); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === "delivered" ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                  >
                    ✓ Delivered
                  </button>
                  <button
                    onClick={() => { setFilterStatus("pending"); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === "pending" ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => { setFilterStatus("cancelled"); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === "cancelled" ? 'bg-red-600 text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                  >
                    Cancelled
                  </button>
                </div>

                {/* TYPE FILTER */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => { setFilterType("all"); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filterType === "all" ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                  >
                    All Types
                  </button>
                  <button
                    onClick={() => { setFilterType("delivery"); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${filterType === "delivery" ? 'bg-red-600 text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                  >
                    🍽️ Mâncare
                  </button>
                  <button
                    onClick={() => { setFilterType("ride"); setCurrentPage(1); }}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${filterType === "ride" ? 'bg-blue-600 text-white' : 'bg-gray-100 text-black hover:bg-gray-200'}`}
                  >
                    🚗 Transport
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {currentOrders.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {currentOrders.map((order, idx) => {
                      const isRide = ['ride', 'ride_share'].includes(order.type);
                      const isDelivery = ['delivery', 'pickup'].includes(order.type);
                      
                      return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className={`flex items-center justify-between p-6 rounded-3xl hover:border-gray-300 transition-all group cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 border-2 ${
                          isRide 
                            ? 'bg-gradient-to-r from-sky-50 to-blue-50 border-blue-200 hover:bg-gradient-to-r hover:from-sky-100 hover:to-blue-100' 
                            : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 hover:bg-gradient-to-r hover:from-red-100 hover:to-rose-100'
                        }`}
                      >
                        <div className="flex items-center gap-6 flex-1 min-w-0">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner flex-shrink-0 ${
                            order.status === 'delivered' || order.status === 'cancelled'
                              ? 'bg-gray-100 text-gray-400' 
                              : isRide
                              ? 'bg-blue-600 text-white animate-pulse'
                              : 'bg-red-600 text-white animate-pulse'
                          }`}>
                            {getStatusIcon(order.status)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {isRide && (
                                <span className="px-2 py-1 bg-blue-600 text-white text-[9px] font-black rounded-full uppercase tracking-tight">🚗 Transport</span>
                              )}
                              {isDelivery && (
                                <span className="px-2 py-1 bg-red-600 text-white text-[9px] font-black rounded-full uppercase tracking-tight">🍽️ Mâncare</span>
                              )}
                              <h4 className="font-black text-slate-900 text-base tracking-tight uppercase italic group-hover:text-blue-600 transition-colors truncate">
                                {isRide ? `Transport ${order.passenger_count || 1} pers.` : order.restaurant_name || order.customer_name}
                              </h4>
                              <span className="text-xl">{getVehicleIcon(order.vehicle_type)}</span>
                            </div>
                            
                            <p className={`text-[11px] font-bold flex items-center gap-1 mb-1 truncate ${isRide ? 'text-blue-600' : 'text-red-600'}`}>
                              <MapPin size={12} /> {order.delivery_address || order.customer_name || "N/A"}
                            </p>

                            <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold">
                              <span>{formatDate(order.created_at).split(' ')[0]}</span>
                              <span>•</span>
                              <span className={`px-2 py-0.5 rounded-full font-black uppercase tracking-tighter flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)} {order.status}
                              </span>
                              {isRide && order.shared && <span className="ml-auto text-blue-600">👥 Partajat</span>}
                              {order.distance_km && <span className="text-gray-600">📍 {order.distance_km} km</span>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-8 flex-shrink-0">
                          <div className="text-right">
                            <p className={`font-black text-2xl tracking-tighter leading-none mb-1 ${isRide ? 'text-blue-600' : 'text-red-600'}`}>
                              {formatCurrency(order.total_amount)}
                            </p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase">{order.payment_method}</p>
                          </div>
                          <ChevronRight size={20} className="text-gray-200 group-hover:text-black transition-transform group-hover:translate-x-1" />
                        </div>
                      </motion.div>
                    );
                    })}
                  </div>

                  {/* PAGINATION */}
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

      {/* MODAL DETALII COMANDĂ */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, y: '100%', scale: 1 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: '100%', scale: 1 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-t-3xl md:rounded-3xl max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto shadow-2xl md:rounded-3xl"
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 p-4 md:p-6 flex justify-between items-center rounded-t-3xl md:rounded-t-3xl">
                <h3 className="text-xl md:text-2xl font-black uppercase italic truncate">Order #{selectedOrder.id.slice(0, 8)}</h3>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all flex-shrink-0 ml-2"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 md:p-8 space-y-6 md:space-y-8 pb-12">
                
                {/* BADGE TIP COMANDĂ */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                    {['ride', 'ride_share'].includes(selectedOrder.type) ? (
                      <div className="px-2 md:px-4 py-1 md:py-2 bg-gradient-to-r from-sky-100 to-blue-100 border border-blue-300 md:border-2 rounded-full flex-shrink-0">
                        <p className="text-[10px] md:text-[12px] font-black text-blue-700 uppercase tracking-widest">🚗 TRANSPORT</p>
                      </div>
                    ) : (
                      <div className="px-2 md:px-4 py-1 md:py-2 bg-gradient-to-r from-red-100 to-rose-100 border border-red-300 md:border-2 rounded-full flex-shrink-0">
                        <p className="text-[10px] md:text-[12px] font-black text-red-700 uppercase tracking-widest">🍽️ MÂNCARE</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* HEADER INFO */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                  <div className="min-w-0">
                    <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-2">Status</p>
                    <div className={`inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[9px] md:text-[11px] font-black uppercase ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)} <span className="hidden md:inline">{selectedOrder.status}</span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-2">Type</p>
                    <p className="text-xs md:text-sm font-bold truncate">{getTypeLabel(selectedOrder.type)}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-2">Payment</p>
                    <p className="text-xs md:text-sm font-bold capitalize truncate">{selectedOrder.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-2">Vehicle</p>
                    <p className="text-lg md:text-lg">{getVehicleIcon(selectedOrder.vehicle_type)}</p>
                  </div>
                </div>

                {/* RESTAURANT/CUSTOMER */}
                {selectedOrder.restaurant_name && (
                  <div className="border-l-4 border-blue-600 pl-4 py-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Restaurant</p>
                    <p className="text-lg font-black">{selectedOrder.restaurant_name}</p>
                  </div>
                )}

                {/* RIDE SPECIFIC INFO */}
                {['ride', 'ride_share'].includes(selectedOrder.type) && (
                  <div className="space-y-3 md:space-y-4 bg-gradient-to-r from-sky-50 to-blue-50 border border-blue-200 md:border-2 rounded-lg md:rounded-2xl p-3 md:p-6">
                    <h4 className="font-black text-base md:text-lg uppercase tracking-tight text-blue-900">Detalii Transport</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
                      {selectedOrder.passenger_count && (
                        <div>
                          <p className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 md:mb-2">Pasageri</p>
                          <p className="text-lg md:text-xl font-black">👥 {selectedOrder.passenger_count}</p>
                        </div>
                      )}
                      {selectedOrder.distance_km && (
                        <div>
                          <p className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 md:mb-2">Distanță</p>
                          <p className="text-lg md:text-xl font-black">{selectedOrder.distance_km} km</p>
                        </div>
                      )}
                      {selectedOrder.duration_minutes && (
                        <div>
                          <p className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 md:mb-2">Durată</p>
                          <p className="text-lg md:text-xl font-black">⏱️ {selectedOrder.duration_minutes} min</p>
                        </div>
                      )}
                      {selectedOrder.shared && (
                        <div>
                          <p className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 md:mb-2">Tip</p>
                          <p className="text-lg md:text-xl font-black">👥 Partajat</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* DELIVERY INFO */}
                <div className="space-y-3 md:space-y-4">
                  <h4 className="font-black text-base md:text-lg uppercase tracking-tight">Delivery Details</h4>
                  <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-6 space-y-3 md:space-y-4">
                    <div className="flex gap-2 md:gap-4">
                      <MapPin className="text-blue-600 flex-shrink-0 mt-0.5 md:mt-1 w-4 h-4 md:w-5 md:h-5" />
                      <div className="min-w-0">
                        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">Delivery Address</p>
                        <p className="text-xs md:text-sm font-bold break-words">{selectedOrder.delivery_address || "N/A"}</p>
                      </div>
                    </div>
                    {selectedOrder.customer_name && (
                      <div className="flex gap-2 md:gap-4">
                        <User className="text-blue-600 flex-shrink-0 mt-0.5 md:mt-1 w-4 h-4 md:w-5 md:h-5" />
                        <div className="min-w-0">
                          <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">Recipient Name</p>
                          <p className="text-xs md:text-sm font-bold">{selectedOrder.customer_name}</p>
                        </div>
                      </div>
                    )}
                    {selectedOrder.customer_phone && (
                      <div className="flex gap-2 md:gap-4">
                        <Phone className="text-blue-600 flex-shrink-0 mt-0.5 md:mt-1 w-4 h-4 md:w-5 md:h-5" />
                        <div className="min-w-0">
                          <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">Phone</p>
                          <p className="text-xs md:text-sm font-bold">{selectedOrder.customer_phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ITEMS */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div className="space-y-3 md:space-y-4">
                    <h4 className="font-black text-base md:text-lg uppercase tracking-tight">Items</h4>
                    <div className="space-y-1 md:space-y-2">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start p-2 md:p-3 bg-gray-50 rounded-lg md:rounded-xl gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-xs md:text-sm">{item.name || item.title || 'Item'}</p>
                            {item.quantity && <p className="text-[10px] md:text-[11px] text-gray-500">Qty: {item.quantity}</p>}
                          </div>
                          <p className="font-bold text-xs md:text-sm flex-shrink-0">{item.price ? formatCurrency(item.price * (item.quantity || 1)) : '-'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TIMELINE */}
                <div className="space-y-3 md:space-y-4">
                  <h4 className="font-black text-base md:text-lg uppercase tracking-tight">Timeline</h4>
                  <div className="space-y-2 md:space-y-3">
                    {[
                      { label: 'Confirmed', time: selectedOrder.confirmed_at, icon: CheckCircle2, show: true },
                      { label: 'Preparing', time: selectedOrder.preparing_at, icon: Utensils, show: !['ride', 'ride_share'].includes(selectedOrder.type) },
                      { label: 'Ready', time: selectedOrder.ready_at, icon: Package, show: !['ride', 'ride_share'].includes(selectedOrder.type) },
                      { label: 'Picked Up', time: selectedOrder.picked_up_at, icon: Truck, show: true },
                      { label: 'Delivered', time: selectedOrder.delivered_at, icon: MapPinCheck, show: true },
                    ].map((stage, idx) => {
                      if (!stage.show) return null;
                      
                      const IconComponent = stage.icon;
                      return (
                        <div key={idx} className={`flex gap-2 md:gap-4 pb-2 md:pb-4 border-l-2 pl-2 md:pl-4 ${stage.time ? 'border-emerald-500' : 'border-gray-200'}`}>
                          <div className={`mt-0.5 flex-shrink-0 ${stage.time ? 'text-emerald-500' : 'text-gray-300'}`}>
                            <IconComponent size={16} className="md:w-5 md:h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs md:text-sm">{stage.label}</p>
                            <p className="text-[9px] md:text-[10px] text-gray-500">{stage.time ? formatDate(stage.time) : 'Pending'}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PRICING BREAKDOWN */}
                <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-6 space-y-2 md:space-y-3">
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <p className="font-bold text-gray-600">Subtotal</p>
                    <p className="font-black text-xs md:text-sm">{formatCurrency(selectedOrder.total_amount - (selectedOrder.delivery_fee || 0) - (selectedOrder.tip_amount || 0))}</p>
                  </div>
                  {selectedOrder.delivery_fee > 0 && (
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <p className="font-bold text-gray-600">Delivery Fee</p>
                      <p className="font-black text-xs md:text-sm">+{formatCurrency(selectedOrder.delivery_fee)}</p>
                    </div>
                  )}
                  {selectedOrder.packaging_fee > 0 && (
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <p className="font-bold text-gray-600">Packaging</p>
                      <p className="font-black text-xs md:text-sm">+{formatCurrency(selectedOrder.packaging_fee)}</p>
                    </div>
                  )}
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between items-center text-xs md:text-sm text-emerald-600">
                      <p className="font-bold">Discount</p>
                      <p className="font-black text-xs md:text-sm">-{formatCurrency(selectedOrder.discount_amount)}</p>
                    </div>
                  )}
                  {selectedOrder.tip_amount > 0 && (
                    <div className="flex justify-between items-center text-xs md:text-sm">
                      <p className="font-bold text-gray-600">Tip</p>
                      <p className="font-black text-xs md:text-sm">+{formatCurrency(selectedOrder.tip_amount)}</p>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 md:pt-3 flex justify-between items-center">
                    <p className="font-black text-xs md:text-base">TOTAL</p>
                    <p className="text-xl md:text-2xl font-black text-blue-600">{formatCurrency(selectedOrder.total_amount)}</p>
                  </div>
                </div>

                {/* NOTES */}
                {selectedOrder.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg md:rounded-2xl p-3 md:p-4 flex gap-2 md:gap-3">
                    <MessageSquare className="text-yellow-600 flex-shrink-0 mt-0.5 w-4 h-4 md:w-5 md:h-5" />
                    <div className="min-w-0">
                      <p className="text-[9px] md:text-[10px] font-black text-yellow-700 uppercase tracking-widest mb-0.5 md:mb-1">Notes</p>
                      <p className="text-xs md:text-sm text-yellow-900">{selectedOrder.notes}</p>
                    </div>
                  </div>
                )}

                {/* DRIVER INFO */}
                {selectedOrder.driver && (
                  <div className="bg-blue-50 rounded-lg md:rounded-2xl p-3 md:p-6 border border-blue-100">
                    <p className="text-[9px] md:text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 md:mb-4">Driver Information</p>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs md:text-sm font-bold text-gray-600 truncate">{selectedOrder.driver.name}</span>
                        <span className="text-lg md:text-xl flex-shrink-0">⭐ {selectedOrder.driver.rating || 'N/A'}</span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 font-bold break-words">{selectedOrder.driver.phone}</p>
                    </div>
                  </div>
                )}

                {/* REFUND INFO */}
                {selectedOrder.refund_amount > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg md:rounded-2xl p-3 md:p-4 flex gap-2 md:gap-3">
                    <RotateCcw className="text-orange-600 flex-shrink-0 mt-0.5 w-4 h-4 md:w-5 md:h-5" />
                    <div className="min-w-0">
                      <p className="text-[9px] md:text-[10px] font-black text-orange-700 uppercase tracking-widest mb-0.5 md:mb-1">Refund</p>
                      <p className="text-xs md:text-sm font-bold text-orange-900 mb-0.5">{formatCurrency(selectedOrder.refund_amount)}</p>
                      <p className="text-[11px] md:text-xs text-orange-800">{selectedOrder.refund_reason}</p>
                    </div>
                  </div>
                )}

                {/* CANCEL BUTTON */}
                {['pending', 'confirmed'].includes(selectedOrder.status) && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.id, "User cancelled")}
                    className="w-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all px-3 md:px-6 py-3 md:py-4 rounded-lg md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <AlertCircle size={16} /> Cancel Order
                  </button>
                )}

                {/* CANNOT CANCEL MESSAGE */}
                {!['pending', 'confirmed'].includes(selectedOrder.status) && selectedOrder.status !== 'cancelled' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg md:rounded-2xl p-3 md:p-4 text-center">
                    <p className="text-[10px] md:text-[11px] font-black text-gray-500 uppercase tracking-widest">
                      ✓ Nu se mai poate anula - comanda {selectedOrder.status === 'preparing' ? 'se prepară' : selectedOrder.status === 'ready' ? 'este gata' : selectedOrder.status === 'picked_up' ? 'a fost ridicată' : 'este în livrare'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
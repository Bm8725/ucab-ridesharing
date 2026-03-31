"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseConfig";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Package, MapPin, Phone, LogOut, 
  ShoppingBag, Clock, CheckCircle2, Loader2, Save
} from "lucide-react";

export default function MyAccount() {
  const router = useRouter();
  const [profile, setProfile] = useState({ name: "", phone: "", address: "" });
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchData = useCallback(async () => {
    // 1. Verificăm sesiunea
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    setUser(session.user);

    // 2. Luăm datele în paralel
    const [profRes, ordersRes] = await Promise.all([
      supabase.from("riders").select("*").eq("id", session.user.id).single(),
      supabase.from("orders").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false })
    ]);

    if (profRes.data) setProfile(profRes.data);
    setOrders(ordersRes.data || []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("riders")
      .update({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      })
      .eq("id", user.id);

    if (!error) {
      setMsg("DATE SALVATE!");
      setTimeout(() => setMsg(""), 3000);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login"; 
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFDFD]">
      <Loader2 className="animate-spin text-red-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20 font-sans text-gray-900">
      {/* HEADER */}
      <div className="bg-white p-8 rounded-b-[3rem] shadow-sm border-b border-gray-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-red-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl rotate-3">
            <User size={40} strokeWidth={2.5} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">
              {profile?.name || "Rider Profile"}
            </h1>
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1 italic">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="bg-black text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2">
            <LogOut size={16} /> Exit
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* SECȚIUNE CONFIGURARE PROFIL */}
        <section className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-black uppercase italic flex items-center gap-3">
            <div className="w-6 h-[3px] bg-red-600"></div> My Profile
          </h2>
          <form onSubmit={handleUpdateProfile} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-50 space-y-6">
            <div>
              <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-2">Full Name</label>
              <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl font-black italic outline-none focus:ring-2 ring-red-100" value={profile.name || ""} onChange={e => setProfile({...profile, name: e.target.value})} />
            </div>
            <div>
              <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-2">Phone</label>
              <input type="tel" className="w-full p-4 bg-gray-50 rounded-2xl font-black italic outline-none focus:ring-2 ring-red-100" value={profile.phone || ""} onChange={e => setProfile({...profile, phone: e.target.value})} />
            </div>
            <div>
              <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-2">Address</label>
              <textarea className="w-full p-4 bg-gray-50 rounded-2xl font-black italic outline-none h-24 resize-none" value={profile.address || ""} onChange={e => setProfile({...profile, address: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-red-600 text-white p-5 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-2">
              {saving ? <Loader2 className="animate-spin" size={20}/> : <><Save size={18}/> Save Data</>}
            </button>
            {msg && <p className="text-center text-[10px] font-black text-green-600 animate-bounce">{msg}</p>}
          </form>
        </section>

        {/* SECȚIUNE ISTORIC COMENZI */}
        <section className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black uppercase italic flex items-center gap-3">
            <div className="w-6 h-[3px] bg-red-600"></div> Order Status & History
          </h2>
          
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white p-16 rounded-[3rem] text-center border border-dashed border-gray-100 text-gray-300 font-black uppercase text-[10px] italic">No orders found</div>
            ) : (
              orders.map((order) => (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={order.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center justify-between group hover:border-red-100 transition-all">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-colors ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                      order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {order.status === 'delivered' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                      <h4 className="font-black text-lg uppercase italic leading-none mb-1">{order.restaurant_name}</h4>
                      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-2">{new Date(order.created_at).toLocaleString('ro-RO')}</p>
                      <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border italic ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' : 
                        order.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black italic text-red-600 tracking-tighter mb-1">{order.total_amount} RON</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase italic">ID: #{order.id.slice(0, 5)}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

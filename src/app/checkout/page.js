"use client";
import { useRouter } from "next/navigation";
import { useCart, CartProvider } from "../../context/CartContext";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, Trash2, Plus, Minus, MapPin, 
  ShoppingBag, Loader2, Clock, ShieldCheck, Navigation 
} from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // AUTO-DETECTION LOGIC
  const detectLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported by your browser.");
    
    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        // Using OpenStreetMap Nominatim (Free Reverse Geocoding)
        const res = await fetch(
          `https://nominatim.openstreetmap.org{latitude}&lon=${longitude}`
        );
        const data = await res.json();
        if (data.display_name) {
          setForm(prev => ({ ...prev, address: data.display_name }));
        }
      } catch (err) {
        alert("Could not detect address. Please type it manually.");
      } finally {
        setLocating(false);
      }
    }, () => {
      setLocating(false);
      alert("Location access denied.");
    });
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0 || loading) return;
    setLoading(true);

    try {
      const { error } = await supabase.from("orders").insert([{
        items: cart,
        total_amount: total,
        customer_name: form.name,
        customer_phone: form.phone,
        delivery_address: form.address,
        notes: form.notes,
        status: "pending",
        created_at: new Date(),
      }]);

      if (error) throw error;
      alert("Order placed successfully! 🚀");
      clearCart();
      router.push("/restaurante");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) return null;

  if (cart.length === 0) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FDFDFD] p-6 text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-red-50 p-6 rounded-full mb-6">
        <ShoppingBag size={48} className="text-red-500" />
      </motion.div>
      <h1 className="text-3xl font-black mb-2 italic uppercase">Your basket is empty</h1>
      <button onClick={() => router.push("/restaurante")} className="mt-6 bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-red-600 transition-colors">
        Go Back to Shops
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 font-sans text-gray-900">
      <header className="px-6 py-8 max-w-5xl mx-auto flex items-center justify-between">
        <button onClick={() => router.back()} className="p-3 bg-white shadow-sm border border-gray-100 rounded-2xl hover:scale-110">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-black uppercase italic leading-none">Checkout</h1>
          <p className="text-[10px] font-bold text-red-500 mt-1 uppercase tracking-widest">Secure Payment</p>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section>
          <h2 className="text-2xl font-black uppercase italic tracking-tight mb-8">Review <span className="text-red-600">Order</span></h2>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div layout key={item.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                  <img src={item.image_url} className="w-16 h-16 rounded-2xl object-cover bg-gray-50" alt={item.name} />
                  <div className="flex-1">
                    <h3 className="font-black text-md leading-tight">{item.name}</h3>
                    <p className="text-red-600 font-black text-sm">{item.price} RON</p>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl">
                    <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-red-600"><Minus size={14}/></button>
                    <span className="font-black text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-red-600"><Plus size={14}/></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-600"><Trash2 size={18} /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-8 uppercase italic tracking-tight lg:text-right">Contact <span className="text-red-600">Details</span></h2>
          <form onSubmit={handleOrder} className="space-y-4">
            <input type="text" placeholder="Full Name" required className="w-full p-5 bg-white border border-gray-100 rounded-3xl font-bold outline-none focus:ring-2 ring-red-50 shadow-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input type="tel" placeholder="Phone Number" required className="w-full p-5 bg-white border border-gray-100 rounded-3xl font-bold outline-none focus:ring-2 ring-red-50 shadow-sm" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            
            <div className="relative">
              <textarea placeholder="Delivery Address" required className="w-full p-5 bg-white border border-gray-100 rounded-3xl font-bold outline-none focus:ring-2 ring-red-50 shadow-sm h-32 pr-16" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              <button type="button" onClick={detectLocation} className="absolute right-4 top-4 p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Detect Location">
                {locating ? <Loader2 className="animate-spin" size={20} /> : <Navigation size={20} />}
              </button>
            </div>

            <input type="text" placeholder="Additional Notes (Optional)" className="w-full p-5 bg-white border border-gray-100 rounded-3xl font-bold outline-none focus:ring-2 ring-red-50 shadow-sm" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />

            <div className="bg-gray-900 rounded-[3rem] p-10 text-white shadow-2xl mt-10">
              <div className="flex justify-between items-center mb-6 text-2xl font-black italic uppercase">
                <span>Total</span>
                <span className="text-red-500">{total.toFixed(2)} RON</span>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 py-6 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg">
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Place Order Now"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutContent />
    </CartProvider>
  );
}

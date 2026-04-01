/* checkout/page.jsx */
"use client";
import { useRouter } from "next/navigation";
import { useCart, CartProvider } from "../../context/CartContext";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseConfig";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Trash2, Plus, Minus, Store,
  ShoppingBag, Loader2, MapPin, CheckCircle2,
  Banknote, CreditCard
} from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const [status, setStatus] = useState("idle");
  const [locating, setLocating] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
    paymentMethod: "cash", // DEFAULT: cash
  });

  useEffect(() => {
    setIsHydrated(true);
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/account");
        return;
      }

      const { data: profile } = await supabase
        .from("riders")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setForm(prev => ({
          ...prev,
          name: profile.name || "",
          phone: profile.phone || "",
          address: profile.address || "",
        }));
      }
    };
    checkUser();
  }, [router]);

  const restaurantName =
    cart?.length > 0 ? cart[0].restaurant_name || "Official Partner" : "Restaurant";

  const detectLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data && data.display_name) {
            const cleanAddr = data.display_name.split(",").slice(0, 5).join(",");
            setForm(prev => ({ ...prev, address: cleanAddr }));
          }
        } catch (e) {
          console.error("Location Error:", e);
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
      { enableHighAccuracy: true }
    );
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0 || status === "loading") return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/account");

    setStatus("loading");
    const resId = cart[0]?.restaurant_id || cart[0]?.id_restaurant;

    const orderPayload = {
      user_id: user.id,
      restaurant_id: resId,
      items: cart,
      total_amount: parseFloat(total),
      restaurant_name: restaurantName,
      customer_name: form.name,
      customer_phone: form.phone,
      delivery_address: form.address,
      notes: form.notes,
      payment_method: form.paymentMethod, // ← ADĂUGAT
      status: "pending",
      created_at: new Date(),
    };

    const { error } = await supabase.from("orders").insert([orderPayload]);

    if (error) {
      console.error("SUPABASE ERROR:", error.message);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("success");
      await clearCart();
      setTimeout(() => router.push("/restaurante"), 4000);
    }
  };

  if (!isHydrated) return null;

  if (status === "success")
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-green-500 mb-8"
        >
          <CheckCircle2 size={120} strokeWidth={3} />
        </motion.div>
        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
          Order Sent!
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2 italic">
          Cooking at {restaurantName}
        </p>
        <p className="mt-8 text-gray-300 animate-pulse text-[10px] uppercase font-black">
          Redirecting you home...
        </p>
      </div>
    );

  if (cart.length === 0)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-6 bg-[#FDFDFD]">
        <ShoppingBag size={64} className="text-red-500 mb-6 opacity-20" />
        <h1 className="text-3xl font-black uppercase italic">Basket is empty</h1>
        <button
          onClick={() => router.push("/restaurante")}
          className="mt-8 bg-black text-white px-12 py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl"
        >
          Browse Restaurants
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-24 font-sans text-gray-900">
      <header className="px-6 py-10 max-w-6xl mx-auto flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-4 bg-white shadow-xl border border-gray-50 rounded-3xl hover:scale-110 active:scale-90 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">
            Checkout
          </h1>
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em] mt-1 italic">
            Live Order
          </p>
        </div>
        <div className="w-14"></div>
      </header>

      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* COLOANA STÂNGA - Coș */}
        <section>
          <div className="mb-8 p-6 bg-white rounded-[2.5rem] border shadow-sm flex items-center gap-4 border-gray-100">
            <div className="bg-red-600 p-4 rounded-3xl text-white shadow-lg">
              <Store size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                Store
              </p>
              <h4 className="font-black text-xl uppercase italic leading-none">
                {restaurantName}
              </h4>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-white p-5 rounded-[2.5rem] border shadow-sm flex items-center gap-5 border-gray-100"
                >
                  <img
                    src={item.image_url}
                    className="w-20 h-20 rounded-[2rem] object-cover bg-gray-50"
                  />
                  <div className="flex-1">
                    <h3 className="font-black text-md uppercase italic leading-tight mb-1">
                      {item.name}
                    </h3>
                    <p className="text-red-600 font-black text-sm">{item.price} RON</p>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-black text-sm w-4 text-center italic">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="hover:text-red-600 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-200 hover:text-red-600 p-2 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* COLOANA DREAPTA - Formular */}
        <section>
          <h2 className="text-2xl font-black mb-8 uppercase italic lg:text-right text-red-600 tracking-tight">
            Delivery Details
          </h2>
          <form onSubmit={handleOrder} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full p-6 border rounded-[2rem] font-bold outline-none focus:ring-4 ring-red-50 border-gray-100 shadow-sm"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              className="w-full p-6 border rounded-[2rem] font-bold outline-none focus:ring-4 ring-red-50 border-gray-100 shadow-sm"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />
            <div className="relative">
              <textarea
                placeholder="Exact Delivery Address"
                required
                className="w-full p-6 border rounded-[2.5rem] font-bold h-40 pr-20 outline-none focus:ring-4 ring-red-50 border-gray-100 shadow-sm resize-none"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
              />
              <button
                type="button"
                onClick={detectLocation}
                className="absolute right-4 top-4 p-4 bg-red-600 text-white rounded-3xl shadow-xl"
              >
                {locating ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <MapPin size={20} />
                )}
              </button>
            </div>

            <textarea
              placeholder="Order notes (optional)"
              className="w-full p-6 border rounded-[2rem] font-bold h-24 outline-none focus:ring-4 ring-red-50 border-gray-100 shadow-sm resize-none"
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />

            {/* ─── SECȚIUNEA METODĂ DE PLATĂ ─── */}
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-2">
                Metodă de plată
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "cash", label: "Cash", icon: <Banknote size={20} />, badge: "Recomandat" },
                  { value: "card", label: "Card", icon: <CreditCard size={20} />, badge: null },
                ].map(({ value, label, icon, badge }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, paymentMethod: value })}
                    className={`relative p-5 rounded-[2rem] border-2 font-black uppercase italic tracking-widest transition-all shadow-sm flex items-center gap-3 justify-center
                      ${form.paymentMethod === value
                        ? "border-red-600 bg-red-50 text-red-600 scale-[1.02] shadow-lg"
                        : "border-gray-100 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600"
                      }`}
                  >
                    {badge && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {/* ─────────────────────────────── */}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-black text-white p-8 rounded-[2.5rem] font-black uppercase italic tracking-widest shadow-2xl flex items-center justify-center gap-4 hover:bg-red-600 transition-colors disabled:bg-gray-200 mt-8"
            >
              {status === "loading" ? (
                <Loader2 className="animate-spin" />
              ) : (
                `Place Order • ${total} RON`
              )}
            </button>
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
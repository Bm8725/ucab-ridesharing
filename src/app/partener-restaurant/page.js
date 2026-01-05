"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUtensils, FaStore, FaEnvelope, FaCheckCircle, 
  FaHandshake, FaMapMarkerAlt, FaLocationArrow, 
  FaArrowRight, FaArrowLeft, FaShieldAlt 
} from "react-icons/fa";

export default function RestaurantPartnerForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    restaurantName: "",
    cuisineType: "",
    licenseNumber: "",
    region: "",
    city: "",
    acceptedPolicy: false,
  });
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const steps = [
    { id: 1, label: "Confirmare", icon: <FaHandshake /> },
    { id: 2, label: "Detalii Business", icon: <FaStore /> },
    { id: 3, label: "Contact & Final", icon: <FaEnvelope /> },
    { id: 4, label: "Status", icon: <FaCheckCircle /> },
  ];

  // Auto-detecție locație prin IP (Tehnologie 2026)
  const detectLocation = async () => {
    setLocLoading(true);
    try {
      const res = await fetch("ipapi.co");
      const data = await res.json();
      if (data) {
        setFormData(prev => ({ 
          ...prev, 
          city: data.city || "", 
          region: data.region || "" 
        }));
      }
    } catch (e) {
      console.error("Locație indisponibilă");
    } finally {
      setLocLoading(false);
    }
  };

  const handleNext = () => setStep(Math.min(step + 1, steps.length));
  const handlePrev = () => setStep(Math.max(step - 1, 1));

  const handleSubmit = async () => {
    if (!formData.acceptedPolicy) {
      setMessage("Trebuie să accepți politica de confidențialitate.");
      setIsError(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://api.doxer.ro/api/partner_restaurant.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Cererea a fost trimisă cu succes!");
        setIsError(false);
        setFormData({ name: "", email: "", restaurantName: "", cuisineType: "", licenseNumber: "", region: "", city: "", acceptedPolicy: false });
        setStep(1);
      } else {
        setMessage(data.error || "A apărut o eroare la server (500).");
        setIsError(true);
      }
    } catch (err) {
      setMessage("Eroare de server. Verificați conexiunea.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-500 focus:border-red-600 focus:ring-4 focus:ring-red-600/20 transition-all outline-none backdrop-blur-md shadow-inner";

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#0a0a0a] overflow-hidden selection:bg-red-500/30">
      {/* Background Cinematic 2026 */}
      <div className="absolute inset-0 z-0">
        <img src="/burgerucab.png" alt="BG" className="w-full h-full object-cover opacity-30 scale-110 blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/80 to-red-950/20" />
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[120px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-zinc-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Sidebar Informativ (Impunător) */}
        <div className="hidden lg:flex lg:col-span-4 bg-gradient-to-b from-red-600 to-red-800 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="relative z-10">
            <img src="/ucabfood.png" alt="Logo" className="h-12 brightness-0 invert mb-10" />
            <h2 className="text-4xl font-black text-white leading-none uppercase italic tracking-tighter">
              Devino restaurant  <br /> partener <br /> <span className="text-black/40"></span>
            </h2>
            <div className="mt-12 space-y-6">
              {steps.map((s, i) => (
                <div key={s.id} className={`flex items-center gap-4 transition-all duration-500 ${step === i + 1 ? "opacity-100 translate-x-2" : "opacity-30"}`}>
                  <div className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center text-white font-bold">
                    {s.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-white/60 text-[10px] font-bold uppercase tracking-[0.3em]">
            <FaShieldAlt /> UCab food
          </div>
        </div>

        {/* Zona Formularului */}
        <div className="col-span-1 lg:col-span-8 p-8 md:p-16">
          <div className="lg:hidden flex justify-center mb-8">
            <img src="/ucabfood.png" alt="Logo" className="h-8" />
          </div>

          <AnimatePresence mode="wait">
            {message && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className={`mb-10 p-5 rounded-2xl border-2 flex items-center gap-4 text-xs font-black uppercase tracking-widest ${isError ? "bg-red-500/10 border-red-500/50 text-red-500" : "bg-green-500/10 border-green-500/50 text-green-500"}`}>
                {isError ? "⚠️" : "✅"} {message}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="st1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 text-center lg:text-left">
                  <h3 className="text-4xl font-black text-white tracking-tighter uppercase">Ești pregătit de ascensiune?</h3>
                  <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">Alătură-te celei mai rapide rețele de delivery din România. Transformăm restaurantul tău într-un punct de referință digital in comunitatea locala.</p>
                  <button onClick={handleNext} className="group relative px-12 py-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black tracking-[0.2em] text-xs flex items-center gap-4 transition-all shadow-2xl shadow-red-600/30 active:scale-95">
                    INIȚIAZĂ PROCESUL <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="st2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2"><label className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-3 block ml-2">Manager / Reprezentant</label>
                    <input className={inputClass} placeholder="Nume Complet" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div><label className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-3 block ml-2">Brand Restaurant</label>
                    <input className={inputClass} placeholder="Ex: Pizza Mania" value={formData.restaurantName} onChange={(e) => setFormData({...formData, restaurantName: e.target.value})} />
                  </div>
                  <div><label className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-3 block ml-2">Tip Bucătărie</label>
                    <input className={inputClass} placeholder="Ex: Italian / Urban" value={formData.cuisineType} onChange={(e) => setFormData({...formData, cuisineType: e.target.value})} />
                  </div>
                  <div className="md:col-span-2">
                    <button onClick={detectLocation} disabled={locLoading} className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all border border-white/5">
                      <FaLocationArrow className={locLoading ? "animate-spin text-red-500" : "text-red-500"} />
                      {locLoading ? "Sincronizare GPS..." : "Detectează Locația Automat"}
                    </button>
                  </div>
                  <input className={inputClass} placeholder="Oraș" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  <input className={inputClass} placeholder="Județ" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="st3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div><label className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-3 block ml-2">CUI / Licență Business</label>
                    <input className={inputClass} placeholder="Cod Unic Înregistrare" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} />
                  </div>
                  <div><label className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-3 block ml-2">Email Oficial</label>
                    <input className={inputClass} type="email" placeholder="contact@restaurant.ro" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div 
                    onClick={() => setFormData({...formData, acceptedPolicy: !formData.acceptedPolicy})}
                    className={`p-6 rounded-3xl border-2 flex items-center gap-5 cursor-pointer transition-all ${formData.acceptedPolicy ? "border-red-600 bg-red-600/10" : "border-white/5 bg-white/5 hover:border-white/20"}`}
                  >
                    <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${formData.acceptedPolicy ? "bg-red-600 border-red-600" : "border-white/20"}`}>
                      {formData.acceptedPolicy && <FaCheckCircle className="text-white" />}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 leading-tight">
                      Confirm autenticitatea datelor și accept <span className="text-white underline">Politica de Parteneriat UCab</span>.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigație Butoane */}
          {step > 1 && (
            <div className="mt-12 flex items-center justify-between">
              <button onClick={handlePrev} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-white transition-colors flex items-center gap-2 group">
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Înapoi
              </button>
              <button 
                onClick={step === 3 ? handleSubmit : handleNext}
                disabled={loading}
                className="px-12 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-red-600 hover:text-white transition-all disabled:opacity-30 active:scale-95"
              >
                {loading ? "Se trimite..." : step === 3 ? "Finalizează" : "Înainte"}
              </button>
            </div>
          )}
        </div>
      </motion.div>


    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCar, FaBicycle, FaUser, FaEnvelope, FaCheckCircle, 
  FaMotorcycle, FaArrowRight, FaArrowLeft, FaShieldAlt, 
  FaChevronRight, FaIdCard 
} from "react-icons/fa";

export default function RequestFormPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("driver");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    carBrand: "",
    carModel: "",
    carType: "",
    carYear: "",
    plateNumber: "",
    vehicle: "",
    acceptedPolicy: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const vehicleOptions = ["Bicicletă", "Trotinetă Electrică", "Scuter", "Motocicletă"];
  const carBrands = ["Toyota", "BMW", "Mercedes", "Audi", "Ford"];
  const carModels = {
    Toyota: ["Corolla", "Yaris", "RAV4"],
    BMW: ["X3", "X5", "3 Series"],
    Mercedes: ["C Class", "E Class", "GLA"],
    Audi: ["A3", "A4", "Q5"],
    Ford: ["Focus", "Fiesta", "Kuga"],
  };
  const carTypes = ["Sedan", "Hatchback", "SUV", "Pickup", "Coupe"];
  const carYears = Array.from({ length: 30 }, (_, i) => `${2026 - i}`);

  const handleNext = () => setStep(Math.min(step + 1, 5));
  const handlePrev = () => setStep(Math.max(step - 1, 1));

  const handleSubmit = async () => {
    if (!formData.acceptedPolicy) {
      setMessage("Trebuie să accepți politica de confidențialitate.");
      setIsError(true);
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("https://api.doxer.ro/api/request_driver.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          name: formData.name,
          email: formData.email,
          carBrand: role === "driver" ? formData.carBrand : "",
          carModel: role === "driver" ? formData.carModel : "",
          carType: role === "driver" ? formData.carType : "",
          carYear: role === "driver" ? formData.carYear : "",
          plateNumber: role === "driver" ? formData.plateNumber : "",
          vehicle: role === "courier" ? formData.vehicle : "",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Eroare la trimitere.");
        setIsError(true);
      } else {
        setMessage(data.message || "Cererea a fost trimisă cu succes!");
        setIsError(false);
        setFormData({ name: "", email: "", carBrand: "", carModel: "", carType: "", carYear: "", plateNumber: "", vehicle: "", acceptedPolicy: false });
        setStep(1);
      }
    } catch (err) {
      setMessage("Eroare de conexiune cu serverul.");
      setIsError(true);
    }
    setLoading(false);
  };

  const inputClass = "w-full bg-blue-500/5 border border-blue-500/20 rounded-2xl px-6 py-4 text-white placeholder:text-blue-300/30 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10 transition-all outline-none backdrop-blur-md";
  const selectClass = "w-full bg-slate-900 border border-blue-500/20 rounded-2xl px-6 py-4 text-white focus:border-cyan-400 outline-none appearance-none cursor-pointer";

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-0 md:p-10 bg-[#020617] overflow-x-hidden font-sans text-slate-100">
      
      {/* Background Cyber-Blue 2026 */}
      <div className="absolute inset-0 z-0">
        <img src="/ucab2.png" alt="BG" className="w-full h-full object-cover opacity-15 scale-110 blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-blue-900/20" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-6xl min-h-screen md:min-h-0 grid grid-cols-1 lg:grid-cols-12 bg-slate-900/40 backdrop-blur-3xl md:rounded-[3.5rem] md:border md:border-blue-500/20 md:shadow-[0_0_80px_rgba(30,58,138,0.3)] overflow-hidden"
      >
        {/* Sidebar - Doar pe Desktop */}
        <div className="hidden lg:flex lg:col-span-4 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 p-12 flex-col justify-between relative">
          <div className="relative z-10">
            <img src="/ucabapp.png" alt="Logo" className="h-10 brightness-0 invert mb-14" />
            <h2 className="text-4xl font-black text-white leading-tight uppercase tracking-tighter italic">
              Formular cere  <br />  <br /> <span className="text-cyan-400 text-2xl tracking-widest not-italic">UCAB </span>
            </h2>
            <div className="mt-16 space-y-6">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className={`flex items-center gap-4 transition-all duration-500 ${step === s ? "opacity-100 translate-x-3" : "opacity-30"}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${step === s ? "border-cyan-400 bg-cyan-400 text-blue-950" : "border-white/40 text-white"}`}>{s}</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Pasul {s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-3 text-cyan-400/60 text-[10px] font-black uppercase tracking-[0.4em]">
            <FaShieldAlt /> UCab rideshare
          </div>
        </div>

        {/* Content Side */}
        <div className="col-span-1 lg:col-span-8 p-6 md:p-20 flex flex-col h-full justify-center">
          
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-10 pt-4">
            <img src="/ucabapp.png" alt="Logo" className="h-7" />
            <div className="px-4 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
              Pas {step} / 5
            </div>
          </div>

          <AnimatePresence mode="wait">
            {message && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className={`mb-8 p-5 rounded-2xl border-2 flex items-center gap-4 text-xs font-black uppercase tracking-widest ${isError ? "bg-red-500/10 border-red-500/50 text-red-400" : "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)]"}`}>
                {isError ? "⚠️" : "✅"} {message}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="min-h-[350px] md:min-h-[420px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {/* Pas 1: Rol */}
              {step === 1 && (
                <motion.div key="st1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Identificare Rol</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                    <button onClick={() => {setRole("driver"); handleNext();}} className={`group p-8 rounded-3xl border-2 transition-all flex flex-col items-center md:items-start gap-4 ${role === "driver" ? "border-cyan-400 bg-blue-600/10 shadow-lg shadow-cyan-400/10" : "border-white/5 bg-white/5 hover:border-blue-500/30"}`}>
                      <FaCar className={`text-5xl ${role === "driver" ? "text-cyan-400" : "text-slate-600"}`} />
                      <span className="text-xl font-black text-white uppercase italic tracking-tighter">Șofer</span>
                    </button>
                    <button onClick={() => {setRole("courier"); handleNext();}} className={`group p-8 rounded-3xl border-2 transition-all flex flex-col items-center md:items-start gap-4 ${role === "courier" ? "border-cyan-400 bg-blue-600/10 shadow-lg shadow-cyan-400/10" : "border-white/5 bg-white/5 hover:border-blue-500/30"}`}>
                      <FaMotorcycle className={`text-5xl ${role === "courier" ? "text-cyan-400" : "text-slate-600"}`} />
                      <span className="text-xl font-black text-white uppercase italic tracking-tighter">Livrator</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Pas 2 & 3: Personal Info */}
              {(step === 2 || step === 3) && (
                <motion.div key={`st${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">{step === 2 ? "Date Identitate" : "Canal Contact"}</h3>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-6 flex items-center text-cyan-500">{step === 2 ? <FaUser /> : <FaEnvelope />}</div>
                    <input 
                      className={`${inputClass} pl-16`} 
                      type={step === 3 ? "email" : "text"}
                      placeholder={step === 2 ? "Nume Prenume" : "adresa@email.ro"} 
                      value={step === 2 ? formData.name : formData.email} 
                      onChange={(e) => setFormData({...formData, [step === 2 ? "name" : "email"]: e.target.value})} 
                    />
                  </div>
                </motion.div>
              )}

              {/* Pas 4: Vehicul */}
              {step === 4 && (
                <motion.div key="st4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Specificații {role === "driver" ? "Auto" : "Flotă"}</h3>
                  {role === "driver" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <select className={selectClass} value={formData.carBrand} onChange={(e) => setFormData({...formData, carBrand: e.target.value})}><option value="">Marcă</option>{carBrands.map(b => <option key={b} value={b} className="bg-slate-900">{b}</option>)}</select>
                      <select className={selectClass} value={formData.carModel} onChange={(e) => setFormData({...formData, carModel: e.target.value})} disabled={!formData.carBrand}><option value="">Model</option>{formData.carBrand && carModels[formData.carBrand].map(m => <option key={m} value={m} className="bg-slate-900">{m}</option>)}</select>
                      <input className={inputClass} placeholder="Nr. Înmatriculare" value={formData.plateNumber} onChange={(e) => setFormData({...formData, plateNumber: e.target.value})} />
                      <select className={selectClass} value={formData.carYear} onChange={(e) => setFormData({...formData, carYear: e.target.value})}><option value="">An Fabricație</option>{carYears.map(y => <option key={y} value={y} className="bg-slate-900">{y}</option>)}</select>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {vehicleOptions.map(v => (
                        <button key={v} onClick={() => setFormData({...formData, vehicle: v})} className={`p-5 rounded-2xl border-2 text-left font-bold uppercase tracking-widest text-xs transition-all ${formData.vehicle === v ? "border-cyan-400 bg-cyan-400/20 text-white" : "border-white/5 bg-white/5 text-slate-500"}`}>
                          {v}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Pas 5: Final */}
              {step === 5 && (
                <motion.div key="st5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Validare Protocol</h3>
                  <div 
                    onClick={() => setFormData({...formData, acceptedPolicy: !formData.acceptedPolicy})}
                    className={`p-8 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center gap-6 ${formData.acceptedPolicy ? "border-cyan-400 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.1)]" : "border-white/5 bg-white/5 hover:border-blue-500/30"}`}
                  >
                    <div className={`w-10 h-10 rounded-2xl border-2 flex-shrink-0 flex items-center justify-center transition-all ${formData.acceptedPolicy ? "bg-cyan-400 border-cyan-400" : "border-white/20"}`}>
                      {formData.acceptedPolicy && <FaCheckCircle className="text-blue-950 text-xl" />}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-100/60 leading-relaxed">
                      Confirm autenticitatea datelor și accept <span className="text-cyan-400 underline decoration-cyan-400/30">Politica de Date UCab Fleet</span>.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {step > 1 && (
            <div className="mt-12 flex items-center justify-between gap-4">
              <button onClick={handlePrev} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 hover:text-cyan-400 transition-colors flex items-center gap-3 group">
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Înapoi
              </button>
              <button 
                onClick={step === 5 ? handleSubmit : handleNext}
                disabled={loading}
                className="px-10 md:px-14 py-5 bg-cyan-500 text-blue-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(34,211,238,0.3)] hover:bg-white hover:scale-105 transition-all disabled:opacity-30 active:scale-95 flex items-center gap-3"
              >
                {loading ? "Transmisie..." : step === 5 ? "Lansează Cererea" : "Autorizează Pasul"}
                {step < 5 && <FaChevronRight />}
              </button>
            </div>
          )}
        </div>
      </motion.div>


    </div>
  );
}


"use client";

import { motion } from "framer-motion";
import { 
  Gift, 
  Percent, 
  Users, 
  Clock, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  Zap
} from "lucide-react";

export default function Promotions() {
  const promotions = [
    {
      icon: <Gift size={32} />,
      title: "Bonus de bun venit",
      subtitle: "DRIVER START",
      description: "Primești bonus financiar după primele curse finalizate cu succes.",
      details: ["Fără contestații", "Activare instant", "Plată directă"],
      color: "from-blue-500/20 to-transparent",
      border: "hover:border-blue-500/50"
    },
    {
      icon: <Percent size={32} />,
      title: "Comision redus",
      subtitle: "30 DAYS FREE",
      description: "Lucrezi cu comision promoțional redus la început de colaborare.",
      details: ["0% în prima săptămână", "Fără taxe fixe", "Transparență totală"],
      color: "from-green-500/20 to-transparent",
      border: "hover:border-green-500/50"
    },
    {
      icon: <Users size={32} />,
      title: "Invită un prieten",
      subtitle: "REWARD PROGRAM",
      description: "Recomandă UCab altor șoferi și primiți recompense duble.",
      details: ["Credit nelimitat", "Bonus dublu", "Validare rapidă"],
      color: "from-purple-500/20 to-transparent",
      border: "hover:border-purple-500/50"
    },
    {
      icon: <Clock size={32} />,
      title: "Ore de vârf",
      subtitle: "SURGE PRICING",
      description: "Tarife dinamice și multiplicatori în perioadele cu cerere ridicată.",
      details: ["Multiplicator x2.5", "Harta live cerere", "Notificări push"],
      color: "from-orange-500/20 to-transparent",
      border: "hover:border-orange-500/50"
    }
  ];

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-green-500/30">
      
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8"
          >
            <Sparkles size={16} className="text-green-500" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Oferte Exclusive in curand</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none"
          >
            Maximizează-ți <br />
            <span className="bg-gradient-to-r from-blue-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Veniturile UCab
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed"
          >
            Sistem premium de bonusare creat pentru cei mai buni șoferi din ecosistemul nostru local.
          </motion.p>
        </div>
      </section>

      {/* BENTO GRID PROMOTIONS */}
      <section className="py-12 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {promotions.map((promo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`group relative bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-10 overflow-hidden transition-all duration-500 ${promo.border}`}
            >
              {/* Gradient Inner Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${promo.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-12">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 group-hover:text-green-400 transition-all duration-500">
                    {promo.icon}
                  </div>
                  <span className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase mt-2">
                    {promo.subtitle}
                  </span>
                </div>

                <h3 className="text-3xl font-bold mb-4 group-hover:translate-x-1 transition-transform">
                  {promo.title}
                </h3>
                
                <p className="text-gray-400 mb-8 font-light text-lg">
                  {promo.description}
                </p>

                <div className="mt-auto space-y-4">
                  {promo.details.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle size={12} className="text-green-500" />
                      </div>
                      <span className="text-sm text-gray-300 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* REASSURANCE SECTION */}
      <section className="py-32 px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-4xl mx-auto bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-[3rem] p-12 text-center"
        >
          <Zap className="mx-auto text-yellow-400 mb-6 animate-pulse" size={48} />
          <h3 className="text-3xl font-bold mb-6">Transparență Algoritmică</h3>
          <p className="text-gray-400 text-lg leading-relaxed mb-0 font-light">
            Toate promoțiile sunt calculate în timp real. Vezi statusul bonusurilor tale direct în dashboard-ul aplicației de șofer, fără întârzieri sau procesări manuale.
          </p>
        </motion.div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 text-center relative px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
            Ești gata să treci la <br /> nivelul următor?
          </h2>
          <p className="text-gray-400 text-lg mb-12">
            Alătură-te celei mai moderne flote și profită de avantajele de lansare.
          </p>
          
          <motion.a
            href="/account"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-full shadow-[0_20px_50px_rgba(34,197,94,0.3)] transition-all group"
          >
            CREEAZĂ CONT 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>
      </section>


    </div>
  );
}

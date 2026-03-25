"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle2, Euro, Truck, Package, Search, Percent, 
  ArrowRight, ShieldCheck, Zap, BarChart3 
} from "lucide-react";

export default function FoodDeliveryTerms() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const conditions = [
    {
      title: "Comision Restaurante",
      description: "Sistem de comisionare fix, fără surprize. Reținem maxim **16%** din valoare.",
      icon: <Percent className="w-6 h-6" />,
      tag: "Cel mai mic din piață"
    },
    {
      title: "Licență Platformă",
      description: "Acces full la ecosistemul UCab (App, Dashboard, Suport) pentru **19€/lună**.",
      icon: <Euro className="w-6 h-6" />,
      tag: "Cost Fix"
    },
    {
      title: "Logistică Livrare",
      description: "Flotă dedicată de curieri. Taxa de livrare cade în sarcina clientului final.",
      icon: <Truck className="w-6 h-6" />,
    },
    {
      title: "Packaging & Extras",
      description: "Libertate totală în configurarea costurilor de ambalare și meniuri promoționale.",
      icon: <Package className="w-6 h-6" />,
    },
    {
      title: "Audit & Transparență",
      description: "Raportare în timp real. Vezi exact unde merge fiecare leu din tranzacție.",
      icon: <Search className="w-6 h-6" />,
    },
    {
      title: "Decontare Rapidă",
      description: "Flux de numerar optimizat cu plăți săptămânale direct în contul firmei.",
      icon: <CheckCircle2 className="w-6 h-6" />,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white text-slate-900 py-24 px-6 relative overflow-hidden">
      
      {/* Linii decorative de fundal - Stil Arhitectural */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-slate-50 -z-10" />
      <div className="absolute top-0 left-2/4 w-px h-full bg-slate-50 -z-10" />
      <div className="absolute top-0 left-3/4 w-px h-full bg-slate-50 -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-12 bg-red-600" />
              <span className="text-red-600 font-bold uppercase tracking-widest text-xs">Business UCab Food</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
              PARTENERIAT <br /> 
              <span className="text-transparent" style={{ WebkitTextStroke: "1px #e11d48" }}>FOOD DELIVERY</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed border-l-4 border-slate-100 pl-6">
              Am eliminat barierele financiare. UCab Food Delivery oferă infrastructura necesară pentru ca afacerea ta să crească sustenabil, păstrând profitul acolo unde îi este locul: la tine.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden lg:block p-8 bg-slate-50 rounded-2xl border border-slate-100"
          >

          </motion.div>
        </div>

        {/* Grid-ul de condiții */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-slate-200"
        >
          {conditions.map((c, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="p-12 border border-slate-100 group hover:bg-slate-50 transition-all duration-500 relative"
            >
              <div className="mb-8 text-slate-300 group-hover:text-red-600 transition-colors duration-500">
                {c.icon}
              </div>
              
              {c.tag && (
                <span className="absolute top-8 right-8 text-[10px] font-bold uppercase bg-red-50 text-red-600 px-2 py-1">
                  {c.tag}
                </span>
              )}

              <h3 className="text-xl font-bold mb-4 group-hover:translate-x-2 transition-transform duration-300">
                {c.title}
              </h3>
              
              <p className="text-slate-500 leading-relaxed group-hover:text-slate-900 transition-colors">
                {c.description.split('**').map((part, index) => 
                  index % 2 === 1 ? <span key={index} className="text-red-600 font-bold">{part}</span> : part
                )}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Secțiune Extra - Value Proposition */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex gap-4">
            <Zap className="text-red-600 shrink-0" />
            <div>
              <h4 className="font-bold mb-2">Activare rapidă</h4>
              <p className="text-sm text-slate-500">Ești online în mai puțin de 48 de ore de la semnarea contractului.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <ShieldCheck className="text-red-600 shrink-0" />
            <div>
              <h4 className="font-bold mb-2">Fără clauze ascunse</h4>
              <p className="text-sm text-slate-500">Contracte simple, pe înțelesul tuturor. Poți renunța oricând.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <BarChart3 className="text-red-600 shrink-0" />
            <div>
              <h4 className="font-bold mb-2">Marketing Inclus</h4>
              <p className="text-sm text-slate-500">Promovăm activ restaurantele partenere în aplicația UCab.</p>
            </div>
          </div>
        </div>

        {/* Final CTA Box */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 bg-slate-900 p-12 md:p-20 text-center relative overflow-hidden"
        >
          {/* Accent roșu în interiorul cutiei negre */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 translate-x-16 -translate-y-16 rotate-45" />
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
            Pregătit să îți crești profitul?
          </h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a
              href="/partener-restaurant"
              className="w-full md:w-auto bg-red-600 hover:bg-white hover:text-red-600 text-white px-10 py-5 font-black uppercase tracking-tighter transition-all duration-300 flex items-center justify-center gap-3"
            >
              Aplică acum <ArrowRight className="w-5 h-5" />
            </a>

          </div>
        </motion.div>

      </div>
    </div>
  );
}

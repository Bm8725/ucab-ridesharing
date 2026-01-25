"use client";
import { useEffect, useState } from "react";
import Link from "next/link"; // 
import { motion } from "framer-motion";
import { 
  Trees, 
  Wind, 
  Zap, 
  Orbit, 
  Cpu, 
  Database,
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  FastForward
} from "lucide-react";



export default function SustainableWow() {

    const [arch, setArch] = useState("loading");

  const cards = [
    {
      title: "Reforestare Activă",
      tag: "IMPACT REAL",
      description: "Fiecare kilometru parcurs cu UCab insemna mai prietenos cu mediul inconjurator.",
      icon: <Trees size={40} strokeWidth={1.5} />,
      className: "md:col-span-2 md:row-span-2 bg-emerald-50/50",
      accent: "text-emerald-600"
    },
    {
      title: " WEB APP Vercel running ",
      tag: "ULTRA-EFFICIENCY",
      description: `Rulează pe arhitectură: ${arch?.toUpperCase?.() || "UNKNOWN"}`,
      icon: <Cpu size={28} />,
      className: "md:col-span-1 bg-slate-900 text-white",
      accent: "text-blue-400"
    },
    {
      title: "Real-time Stack",
      tag: "POWERED BY SUPABASE  ARM Instance",
      description: "Latență de sub 10ms pentru dispatching mulțumită ecosistemului Supabase Edge cloud ",
      icon: <Database size={28} />,
      className: "md:col-span-1 bg-blue-50/50",
      accent: "text-blue-600"
    },
    {
      title: "Algoritm Opti-Route",
      tag: "AI VERDE",
      description: "Reducem emisiile de CO2 cu 40% prin sistemul nostru de predicție a traficului cu GIS",
      icon: <Orbit size={28} />,
      className: "md:col-span-2 bg-emerald-50/20",
      accent: "text-emerald-500"
    },



  ];
  useEffect(() => {
    fetch("/api/cpu")
      .then(res => res.json())
      .then(data => setArch(data.arch))
      .catch(() => setArch("unknown"));
  }, []);


  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans overflow-x-hidden">
      
      {/* GRID BACKGROUND PATTERN */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" 
           style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
      />

      {/* FLOATING ORBS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-200/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-blue-200/20 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        
        {/* HEADER AREA */}
        <header className="max-w-3xl mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-emerald-600 font-bold tracking-widest text-xs uppercase mb-6"
          >
            <span className="w-12 h-[2px] bg-emerald-600"></span>
            Eco-Revolution cu UCAB Technologies
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tight text-slate-950 leading-[0.9]"
          >
            Eficiență <br />
            <span className="text-emerald-500 italic">fără compromis.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-xl text-slate-500 font-light leading-relaxed max-w-xl"
          >
            Am construit stack-ul tehnologic de la zero. Folosim arhitectură <strong>ARM </strong> și <strong>Supabase</strong> cloud pentru un impact minim asupra mediului și viteză maximă pentru tine.
          </motion.p>
        </header>

        {/* BENTO MASONRY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 0.98 }}
              className={`${card.className} relative border border-slate-100 rounded-[2.5rem] p-8 overflow-hidden group flex flex-col justify-between shadow-sm`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl bg-white/10 backdrop-blur-md shadow-sm transition-transform duration-500 group-hover:rotate-12 ${card.accent}`}>
                    {card.icon}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">{card.tag}</span>
                    <ArrowUpRight size={18} className="text-slate-300 group-hover:text-emerald-500 transition-all" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-2 leading-tight">{card.title}</h3>
                <p className="opacity-70 text-sm font-medium leading-snug max-w-[250px]">{card.description}</p>
              </div>

              {card.className.includes("md:row-span-2") && (
                <div className="relative z-10 pt-6 mt-auto border-t border-slate-200/50 flex gap-4">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                          +{i}k
                        </div>
                      ))}
                   </div>
                   <span className="text-[10px] text-slate-400 font-bold self-center uppercase tracking-tighter">Plan de regenerare urbană</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* TECH STACK EXPLAINER */}
        <section className="mt-32 py-16 border-l-2 border-emerald-500 pl-8 md:pl-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6">Arhitectura UCab Zero</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-emerald-100 p-2 rounded-lg h-fit text-emerald-700"><ShieldCheck size={20}/></div>
                  <div>
                    <h4 className="font-bold">ARM-Based Computing</h4>
                    <p className="text-slate-500 text-sm">Serverele noastre rulează pe procesoare ARM Cortex , reducând amprenta de carbon a fiecărei tranzacții cu 60%.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg h-fit text-blue-700"><FastForward size={20}/></div>
                  <div>
                    <h4 className="font-bold">PostgreSQL & Edge Functions</h4>
                    <p className="text-slate-500 text-sm">Folosind Supabase, datele tale sunt stocate geo-distribuit, eliminând timpul mort și consumul inutil de energie în rețea.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 rounded-[3rem] p-8 border border-slate-100 flex items-center justify-center italic text-slate-400 text-center">
              "Ingineria noastră nu caută doar viteză, ci armonie între cod și natură."
            </div>
          </div>
        </section>

        {/* FLOATING STATS BAR */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="mt-20 flex flex-wrap justify-center gap-12 py-12 border-y border-slate-100"
        >
          {[
            { label: "Latență Medie", val: "8ms" },
            { label: "Consum Server", val: "-60%" },
            { label: "Uptime Tehnologic", val: "99.99%" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl font-black text-slate-900">{stat.val}</p>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* FINAL SECTION */}
        <section className="mt-32 rounded-[4rem] bg-slate-950 p-12 md:p-24 relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" 
                 style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px'}} />
            
            <h2 className="text-white text-4xl md:text-6xl font-black mb-8 relative z-10">
              Tehnologie de ultimă oră <br /> 
              <span className="text-emerald-400">pentru o lume curată.</span>
            </h2>
            
<Link href="/implementare/" passHref legacyBehavior>
  <motion.a
    whileHover={{ scale: 1.05 }}
    className="inline-block bg-white text-slate-950 px-10 py-5 rounded-full font-black text-lg hover:bg-emerald-400 transition-colors relative z-10"
  >
    ÎNCEPE ACUM
  </motion.a>
</Link>

        </section>
      </div>
    </div>
  );
}

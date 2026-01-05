"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Calendar, Flag, Rocket, MapPin, Github, ArrowRight } from "lucide-react";

export default function About() {
  const roadmapSteps = [
    {
      icon: <Calendar size={24} />,
      title: "Planificare",
      date: "Septembrie 2025",
      description: "Stabilirea echipei, obiectivelor și conceptului UCab.",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: <Flag size={24} />,
      title: "Dezvoltare Aplicații",
      date: "Noiembrie 2025 - Mai 2026",
      description: "Crearea ecosistemului UCab: App, Food, Web & Dashboard Business.",
      color: "from-indigo-400 to-indigo-600"
    },
    {
      icon: <Rocket size={24} />,
      title: "Pilot Test & Atestare",
      date: "Iunie 2026",
      description: "Lansare beta în Târgoviște și București. Obținere avize oficiale.",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: <MapPin size={24} />,
      title: "Lansare Oficială",
      date: "1 Decembrie 2026",
      description: "Disponibilitate publică și extindere strategică la nivel național.",
      color: "from-cyan-400 to-cyan-600"
    },
  ];

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 90%"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="bg-white text-slate-900 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative py-24 md:py-40 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold tracking-wide uppercase mb-6 inline-block border border-blue-100">
              Viitorul Mobilității
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
              Despre <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">UCab</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-10">
              Suntem un start-up românesc ce redefinește transportul prin transparență și inovație. 
              Construim o platformă integrată pentru comunități vibrante.
            </p>
            
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 inline-block">
              <p className="text-amber-800 font-medium text-sm md:text-base flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                Platforma este în curs de dezvoltare. Momentan nu este operabilă.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROADMAP SECTION */}
      <section className="py-24 bg-slate-50/50 relative" ref={containerRef}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-bold mb-4">Drumul nostru spre succes</h2>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="relative">
            {/* Desktop Center Line / Mobile Left Line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-slate-200 rounded-full" />
            
            {/* Animated Progress Line */}
            <motion.div
              style={{ scaleY }}
              className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 origin-top rounded-full z-10"
            />

            <div className="space-y-24">
              {roadmapSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-start md:items-center relative ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Step Marker */}
                  <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 z-20">
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${step.color} shadow-lg shadow-blue-200 flex items-center justify-center text-white border-4 border-white`}
                    >
                      {step.icon}
                    </motion.div>
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${index % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                    <motion.div
                      whileHover={{ y: -10 }}
                      className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-blue-200 transition-all group"
                    >
                      <span className="text-blue-600 font-bold text-sm uppercase tracking-widest block mb-2 group-hover:scale-105 transition-transform origin-left">
                        {step.date}
                      </span>
                      <h3 className="text-2xl font-bold mb-3 text-slate-800">{step.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{step.description}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GITHUB SECTION */}
      <section className="py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto bg-slate-900 rounded-[2.5rem] p-8 md:p-16 text-center text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Github size={120} />
          </div>
          <h3 className="text-3xl font-bold mb-6 relative z-10">Suntem Open-Source</h3>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto relative z-10">
            Credem în transparență totală. Urmărește progresul tehnic al aplicației direct pe repository-ul nostru oficial.
          </p>
          <a
            href="https://github.com/Bm8725/ucab-ridesharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-50 transition-colors relative z-10 group"
          >
            <Github size={20} />
            Explorează Codul Sursă
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 text-center px-6 border-t border-slate-100">
        <h2 className="text-4xl font-bold mb-8">Ești gata să faci parte din echipă?</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/driver/"
            className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            Devino Partener UCab
            <Rocket size={20} />
          </motion.a>
        </div>
      </section>
    </div>
  );
}

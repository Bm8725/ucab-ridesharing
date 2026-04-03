"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { FaServer, FaFileContract, FaMoneyCheckAlt, FaArrowDown, FaMobileAlt, FaDownload } from "react-icons/fa";
import { useRef } from "react";

export default function UcabTimelinePro() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const opacityLine = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  const costSections = [
    {
      id: 1,
      title: "Setup Server & Aplicație",
      cost: "9 – 19 €",
      period: "[o singură dată]",
      desc: "Infrastructură backend dedicată și aplicații mobile personalizate pentru flota ta.",
      icon: <FaServer />,
      color: "#10b981",
    },
    {
      id: 2,
      title: "Licențe Software/API",
      cost: "30 – 49 €",
      period: "/an/vehicul",
      desc: "Acces complet la ecosistemul UCab, actualizări automate și suport tehnic B2B.",
      icon: <FaFileContract />,
      color: "#3b82f6",
    },
    {
      id: 3,
      title: "Comisioane Soferi",
      cost: "9.99%",
      period: "per tranzacție",
      desc: "Cel mai competitiv comision din piață pentru a maximiza profitabilitatea partenerilor.",
      icon: <FaMoneyCheckAlt />,
      color: "#8b5cf6",
    },
    // NOUA SECȚIUNE PENTRU ADMIN APP
    {
      id: 4,
      title: "UCab Admin App",
      cost: "FREE",
      period: "pentru parteneri",
      desc: "Control total asupra flotei tale direct de pe mobil. Monitorizează cursele in timp real pe platforma ANDROID",
      icon: <FaMobileAlt />,
      color: "#f59e0b",
      downloadUrl: "https://github.com/Bm8725/ucab-ridesharing/releases/download/V/ucab_admin.apk.apk", // 
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030712] text-white py-16 px-4 md:px-12 relative overflow-hidden font-sans">
      
      {/* Glow de fundal */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-green-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      {/* Titlu principal */}
      <div className="max-w-4xl mx-auto text-center relative z-10 mb-20 md:mb-32">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 mb-8"
        >
          <img src="/ucabro.png" alt="UCab Logo" className="h-12 md:h-16 w-auto brightness-0 invert" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase mb-10 bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent"
        >
          Business Model <br /> & Costuri ucab app
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="p-8 md:p-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] text-zinc-400 leading-relaxed text-lg shadow-inner text-left md:text-center"
        >
          <p className="mb-6">
            UCab funcționează pe un model <span className="text-white font-bold tracking-widest uppercase">SAAS (Software as a Service)</span> orientat către <span className="text-white font-bold">B2B</span>, oferind infrastructură și aplicații companiilor de transport și livrare.
          </p>
          <p>
            Companiile licențiază software-ul și folosesc aplicațiile pentru gestionarea flotei, monitorizarea comenzilor și raportare detaliată.
          </p>
          <div className="flex justify-center items-center gap-2 text-green-400 font-bold uppercase text-xs tracking-[0.3em] mt-8">
            <span>Scroll pentru detalii costuri</span>
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity }}><FaArrowDown /></motion.div>
          </div>
        </motion.div>
      </div>

      {/* Timeline Container */}
      <div className="max-w-5xl mx-auto relative">
        
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-white/5 overflow-hidden">
          <motion.div 
            style={{ scaleY: pathLength, opacity: opacityLine }}
            className="w-full h-full bg-gradient-to-b from-green-500 via-blue-500 to-purple-500 origin-top"
          />
        </div>

        {costSections.map((section, index) => (
          <div key={section.id} className={`relative flex items-center mb-24 md:mb-40 pl-12 md:pl-0 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
            
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full z-20 flex items-center justify-center border-4 border-[#030712] shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
               <div className="w-full h-full bg-green-500 rounded-full animate-pulse" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
              className="w-full md:w-[45%] group"
            >
              <div className="relative p-[1px] rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent group-hover:from-white/20 transition-all duration-500">
                <div className="bg-[#0f172a]/90 backdrop-blur-3xl p-6 md:p-10 rounded-[2.4rem] border border-white/5 relative overflow-hidden">
                  
                  <div className="mb-6 relative inline-block">
                    <div 
                      className="absolute inset-0 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"
                      style={{ backgroundColor: section.color }}
                    />
                    <div className="relative text-3xl text-white">
                      {section.icon}
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-3 leading-tight">
                    {section.title}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl md:text-4xl font-black text-white">{section.cost}</span>
                    <span className="text-zinc-500 font-bold uppercase text-[9px] tracking-widest">{section.period}</span>
                  </div>

                  <p className="text-zinc-400 font-medium text-sm md:text-base leading-relaxed mb-6">
                    {section.desc}
                  </p>
{/* AFOREȘE BUTON DOWNLOAD DACĂ EXISTĂ URL */}
{section.downloadUrl && (
  <motion.a
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    href={section.downloadUrl}
    // download forțează descărcarea și sugerează numele fișierului
    download="ucab_admin_v.0.13.020426.apk" 
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-4 rounded-2xl font-bold uppercase text-[10px] md:text-xs tracking-widest shadow-xl shadow-blue-900/20 hover:shadow-blue-500/40 transition-all cursor-pointer border border-white/10"
  >
    <FaDownload className="text-sm" /> 
    <span>Download v.0.13.020426.apk</span>
  </motion.a>
)}


                  <span className="absolute top-6 right-8 text-white/5 text-7xl font-black italic -z-10 select-none">
                    0{section.id}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Footer / Action */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-center mt-20 relative z-10"
      >
        <a 
          href="/driver" 
          className="inline-block bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all duration-300 shadow-xl"
        >
          Solicită Parteneriat
        </a>
      </motion.div>
    </div>
  );
}

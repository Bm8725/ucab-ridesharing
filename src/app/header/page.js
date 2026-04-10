"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Home, Car, LogIn, Pizza, Badge, ChevronDown, X, Menu, 
  ArrowRight, Bell, Zap, Star, ShieldCheck 
} from "lucide-react"; // Am adăugat ShieldCheck aici
import Link from "next/link";
import { FaCoins, FaHamburger } from "react-icons/fa";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 20);
      if (current > lastScrollY && current > 100) setIsVisible(false);
      else setIsVisible(true);
      setLastScrollY(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const services = [
    { label: "Cere o cursă", desc: "Șoferi verificați la orice oră. Calatoreste cu UCab", icon: <Car size={24} />, href: "/cursa/", color: "text-blue-500" },
    { label: "Comanda Mâncare", desc: "Comanda mancare de la restaurantele tale preferate.", icon: <Pizza size={24} />, href: "/restaurante/", color: "text-orange-500" },
    { label: "Partener Restaurant", desc: "Crește-ți afacerea cu UCab.", icon: <FaHamburger size={24} />, href: "/partener-restaurant/", color: "text-red-500" },
    { label: "Devino șofer", desc: "Câștigă bani în timpul tău.", icon: <Car size={24} />, href: "/driver/", color: "text-green-500" },
    { label: "Promoții", desc: "Oferte exclusive UCab.", icon: <Badge size={24} />, href: "/resource/promotii/", color: "text-purple-500" },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
          scrolled || isOpen ? "bg-black/80 backdrop-blur-2xl border-b border-white/5 py-3" : "bg-black py-5"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"} text-white`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="shrink-0 group relative" onClick={() => setIsOpen(false)}>
            <h1 className="text-2xl font-bold flex items-center gap-2 relative">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg shadow-[0_0_15px_rgba(37,99,235,0.5)] font-black italic"
              >
                U.
              </motion.div>
              <span className="tracking-tighter  font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">UCab</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <div 
              className="relative px-2 py-4"
              onMouseEnter={() => setSubmenuOpen(true)}
              onMouseLeave={() => setSubmenuOpen(false)}
            >
              <button className="px-5 py-2 rounded-full text-[13px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 hover:bg-white/5 transition-all">
                Servicii <ChevronDown size={14} className={`transition-transform duration-500 ${submenuOpen ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {submenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] bg-black/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 grid grid-cols-2 gap-4 mt-2"
                  >
                    {services.map((s, idx) => (
                      <motion.div key={s.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                        <Link href={s.href} className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-[1.5rem] transition-all group relative overflow-hidden">
                          <div className={`${s.color} bg-white/5 p-3 rounded-2xl group-hover:scale-110 transition-all duration-500 shadow-xl`}>
                            {s.icon}
                          </div>
                          <div>
                            <div className="text-sm font-black text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight">{s.label}</div>
                            <p className="text-[11px] text-gray-500 mt-1 leading-tight font-medium">{s.desc}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/" className="px-5 py-2 rounded-full text-[13px] font-black uppercase tracking-[0.15em] hover:bg-white/5 transition-all">Acasă</Link>
            <Link href="/investors/" className="px-5 py-2 rounded-full text-[13px] font-black uppercase tracking-[0.15em] flex items-center gap-2 hover:bg-amber-500/10 hover:text-amber-500 transition-all group">
              <FaCoins className="text-amber-500 group-hover:animate-bounce" /> Investors
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            <button className="hidden sm:flex p-2.5 bg-white/5 rounded-full text-gray-400 hover:text-blue-500 transition-all relative active:scale-90">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-black animate-pulse" />
            </button>
            <Link href="/myaccount/" className="relative px-8 py-3.5 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.2em] overflow-hidden group active:scale-95 transition-transform">
              <span className="relative z-10">my Account</span>
            </Link>
            <button 
              className="lg:hidden p-3 bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-all" 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 90% 10%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 90% 10%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 90% 10%)" }}
            transition={{ type: "spring", damping: 35, stiffness: 200 }}
            className="fixed inset-0 bg-black text-white z-[90] lg:hidden flex flex-col pt-28"
          >
            <div className="flex-1 overflow-y-auto px-8 space-y-12 relative z-10">
              <div className="space-y-6">
                <h3 className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] ml-2">Servicii UCab</h3>
                <div className="grid grid-cols-1 gap-4">
                  {services.map((s, idx) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                      <Link href={s.href} onClick={() => setIsOpen(false)} className="group flex items-center justify-between p-6 bg-white/[0.03] backdrop-blur-md rounded-[2.5rem] border border-white/5 active:bg-white/10 transition-all shadow-xl">
                        <div className="flex items-center gap-5">
                          <div className={`${s.color} p-4 bg-white/5 rounded-2xl shadow-lg`}>{s.icon}</div>
                          <div>
                            <div className="font-black text-xl leading-none uppercase tracking-tight">{s.label}</div>
                            <div className="text-[11px] text-gray-500 mt-2 font-medium">{s.desc}</div>
                          </div>
                        </div>
                        <ArrowRight size={20} className="text-white/20 group-active:text-blue-500" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-8 pb-20">
                <div className="h-px bg-white/10 w-full" />
                <Link href="/" onClick={() => setIsOpen(false)} className="text-5xl font-black uppercase tracking-tighter hover:text-blue-500 flex items-center justify-between">
                  Acasă <Home size={32} className="opacity-20" />
                </Link>
                <Link href="/investors/" onClick={() => setIsOpen(false)} className="text-5xl font-black uppercase tracking-tighter flex items-center justify-between hover:text-amber-500">
                  Investors <FaCoins size={32} className="text-amber-500/20" />
                </Link>
              </div>
            </div>

            <div className="p-8 bg-black">
              <Link 
                href="/myaccount/" 
                onClick={() => setIsOpen(false)} 
                className="w-full flex items-center justify-center gap-4 py-6 bg-blue-600 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-lg shadow-[0_15px_40px_rgba(37,99,235,0.4)] active:scale-95 transition-all"
              >
                <LogIn size={26} /> my Account
              </Link>
              <div className="flex justify-center gap-6 mt-8 text-white/20">

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  Home, Car, LogIn, Pizza, Badge, ChevronDown, X, Menu, 
  ArrowRight, Bell, Zap, Star, ShieldCheck, User, Sparkles 
} from "lucide-react"; 
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
      setScrolled(current >5);
      if (current > lastScrollY && current > 10) setIsVisible(false);
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
    { label: "Cere o cursă", desc: "Șoferi verificați la orice oră. Călătorește cu UCab", icon: <Car size={24} />, href: "/cursa/", color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { label: "Comandă Mâncare", desc: "Mâncare caldă de la restaurantele tale preferate.", icon: <Pizza size={24} />, href: "/restaurante/", color: "text-orange-500", bgColor: "bg-orange-500/10" },
    { label: "Partener Restaurant", desc: "Crește-ți afacerea și profitul cu UCab.", icon: <FaHamburger size={24} />, href: "/partener-restaurant/", color: "text-red-500", bgColor: "bg-red-500/10" },
    { label: "Devino șofer", desc: "Câștigă bani în timpul tău liber.", icon: <Car size={24} />, href: "/driver/", color: "text-green-500", bgColor: "bg-green-500/10" },
    { label: "Promoții", desc: "Oferte exclusive și vouchere UCab.", icon: <Badge size={24} />, href: "/resource/promotii/", color: "text-purple-500", bgColor: "bg-purple-500/10" },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${isOpen ? "text-black bg-[#FDFCFB]" : "text-white bg-black"} ${
          scrolled && !isOpen ? "lg:bg-black/80 lg:backdrop-blur-2xl py-3 border-b border-white/5" : "py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="shrink-0 group relative" onClick={() => setIsOpen(false)}>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg shadow-[0_0_20px_rgba(37,99,235,0.6)] font-black italic"
              >
                U.
              </motion.div>
              <span className={`tracking-tighter font-black text-2xl  ${isOpen ? "text-black" : "bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50"}`}>UCab</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            <div 
              className="relative px-2 py-4"
              onMouseEnter={() => setSubmenuOpen(true)}
              onMouseLeave={() => setSubmenuOpen(false)}
            >
              <button className="px-5 py-2 rounded-full text-[13px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 hover:bg-white/5 transition-all outline-none">
                Servicii <ChevronDown size={14} className={`transition-transform duration-500 ${submenuOpen ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {submenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.98 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    className="absolute top-[85%] left-1/2 -translate-x-1/2 w-[750px] bg-black/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.7)] p-8 grid grid-cols-12 gap-8 mt-4 overflow-hidden"
                  >
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[100px] pointer-events-none" />

                    <div className="col-span-8 grid grid-cols-1 gap-2 relative z-10">
                      {services.slice(0, 4).map((s, idx) => (
                        <Link key={idx} href={s.href} className="flex items-center gap-5 p-4 hover:bg-white/[0.03] rounded-[2rem] transition-all group border border-transparent hover:border-white/5">
                          <div className={`${s.color} ${s.bgColor} p-4 rounded-[1.2rem] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl`}>
                            {s.icon}
                          </div>
                          <div>
                            <div className="text-sm font-black text-white group-hover:text-blue-500 transition-colors uppercase tracking-widest">{s.label}</div>
                            <p className="text-[11px] text-gray-500 mt-1 leading-tight font-medium max-w-[200px]">{s.desc}</p>
                          </div>
                          <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-blue-500" />
                        </Link>
                      ))}
                    </div>

                    <div className="col-span-4 bg-gradient-to-br from-blue-600 to-blue-900 rounded-[2.5rem] p-6 flex flex-col justify-between relative overflow-hidden group/featured">
                       <Sparkles className="absolute top-4 right-4 text-white/20 group-hover/featured:rotate-90 transition-transform duration-700" />
                       <div className="relative z-10">
                          <h4 className="text-xl font-black uppercase leading-tight italic">Descoperă<br/>UCab Prime</h4>
                          <p className="text-[10px] text-white/70 mt-3 font-bold uppercase tracking-widest">Beneficii exclusive la fiecare cursă.</p>
                       </div>
                       <Link href="/resource/promotii/" className="mt-8 bg-white text-black py-3 px-6 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform text-center shadow-lg">
                          Vezi Promoții
                       </Link>
                    </div>
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
          <div className="flex items-center gap-4">
            <button className={`hidden sm:flex p-2.5 rounded-full transition-all relative active:scale-90 ${isOpen ? "bg-black/5 text-black" : "bg-white/5 text-gray-400"}`}>
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-black" />
            </button>
            
            <Link href="/myaccount/" className="hidden lg:flex relative px-8 py-3.5 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-[0.2em] transition-transform active:scale-95">
              <span>my Account</span>
            </Link>

            <button 
              className={`lg:hidden p-3 rounded-2xl border active:scale-90 transition-all ${isOpen ? "bg-black text-white border-black" : "bg-white/5 border-white/10 text-white"}`} 
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU - PREMIUM WHITE APP STYLE */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#FDFCFB] text-black z-[90] lg:hidden flex flex-col pt-28"
          >
            <div className="flex-1 overflow-y-auto px-6 space-y-10 pb-32">
              
 

              {/* Services Grid (App Style) */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/20 ml-2">UCab services</h3>
                <div className="grid grid-cols-1 gap-3">
                  {services.map((s, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                      <Link href={s.href} onClick={() => setIsOpen(false)} className="flex items-center justify-between p-5 bg-white border border-black/[0.03] rounded-[2rem] shadow-sm active:bg-gray-50 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`${s.bgColor} ${s.color} p-3 rounded-2xl`}>{s.icon}</div>
                          <div className="flex flex-col">
                            <span className="font-black uppercase text-[13px] tracking-widest leading-none">{s.label}</span>
                            <span className="text-[10px] text-black/40 font-bold mt-1 uppercase tracking-tight">Vezi detalii</span>
                          </div>
                        </div>
                        <ArrowRight size={18} className="text-black/10" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Investors/Home Links */}
              <div className="grid grid-cols-2 gap-3">
                 <Link href="/" onClick={() => setIsOpen(false)} className="p-5 bg-black/5 rounded-[2rem] text-center font-black uppercase text-[11px] tracking-widest border border-black/5">Acasă</Link>
                 <Link href="/investors/" onClick={() => setIsOpen(false)} className="p-5 bg-amber-500/10 rounded-[2rem] text-center font-black uppercase text-[11px] tracking-widest text-amber-600 border border-amber-500/10">Investors</Link>
              </div>
            </div>

            {/* MY ACCOUNT - STICKY BOTTOM */}
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#FDFCFB] via-[#FDFCFB] to-transparent pt-10">
              <Link 
                href="/myaccount/" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between bg-black p-6 rounded-[2.5rem] shadow-2xl active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-inner">
                    <ShieldCheck size={26} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/50 font-black uppercase leading-none tracking-tighter">Setări profil</span>
                    <span className="font-black uppercase text-base tracking-tight">My Account</span>
                  </div>
                </div>
                <div className="bg-white/10 p-2.5 rounded-full text-white">
                  <ArrowRight size={22} />
                </div>
              </Link>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Car, LogIn, Pizza, Badge, ChevronDown, X, Menu } from "lucide-react";
import Link from "next/link";
import { FaCoins, FaHamburger } from "react-icons/fa";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detectăm scroll-ul pentru efectul de transparență
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Blocăm scroll-ul paginii principale când meniul este deschis
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const menuItems = [
    { label: "Acasă", href: "/", icon: <Home size={20} /> },
  ];

  const services = [
    {
      label: "Cere o cursă",
      desc: "Rezervă rapid o călătorie cu șofer verificat.",
      icon: <Car size={24} />,
      href: "/cursa/",
    },
    {
      label: "Comanda mancare",
      desc: "Comanda mâncarea ta preferată de la restaurante locale.",
      icon: <Pizza size={24} />,
      href: "/restaurante/",
    },
    {
      label: "Devino restaurant partener",
      desc: "Devino partener pe livrari de mancare la comisioane sub 10%.",
      icon: <FaHamburger size={24} />,
      href: "/partener-restaurant/",
    },
    {
      label: "Devino șofer sau livrator",
      desc: "Alătură-te flotei UCab și începe să câștigi.",
      icon: <Car size={24} />,
      href: "/driver/",
    },
    {
      label: "Promoții",
      desc: "Descoperă ofertele și reducerile curente.",
      icon: <Badge size={24} />,
      href: "/resource/promotii/",
    },
  ];

  return (
    <>
      <header className={`sticky top-0 w-full z-[100] transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-lg shadow-xl" : "bg-black"
      } text-white`}>
        <div className="container mx-auto flex justify-between items-center p-4 relative z-[101]">
          
          {/* Logo */}
          <Link href="/" className="inline-block" onClick={() => setIsOpen(false)}>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-1 cursor-pointer">
              <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md text-sm">U.</span>
              <span className="text-white font-bold">UCab</span>
            </h1>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 font-medium items-center">
            {menuItems.map((item) => (
              <a key={item.label} href={item.href} className="flex items-center gap-1 hover:text-blue-500 transition">
                {item.icon} {item.label}
              </a>
            ))}

            <div 
              onMouseEnter={() => setSubmenuOpen(true)} 
              onMouseLeave={() => setSubmenuOpen(false)} 
              className="relative"
            >
              <button className="flex items-center gap-1 hover:text-blue-500 transition py-2">
                <Car size={20} /> Servicii
              </button>
              <AnimatePresence>
                {submenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-1 w-96 bg-white text-black rounded-xl shadow-2xl p-6 grid grid-cols-1 gap-4 z-[110]"
                  >
                    {services.map((s) => (
                      <a key={s.label} href={s.href} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-100 transition">
                        <div className="text-blue-500">{s.icon}</div>
                        <div>
                          <h4 className="font-semibold text-black">{s.label}</h4>
                          <p className="text-gray-600 text-sm">{s.desc}</p>
                        </div>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a href="/investors/" className="flex items-center gap-1 hover:text-blue-500 transition">
              <FaCoins size={20} /> investors
            </a>

            <a href="/login/" className="px-4 py-2 border border-white rounded-full hover:bg-white hover:text-black transition flex items-center gap-1 font-bold">
              <LogIn size={18} /> Sign In
            </a>
          </nav>

          {/* Mobile Toggle Button */}
          <button 
            className="md:hidden p-2 text-white z-[110]" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU FULL SCREEN OVERLAY */}
      <AnimatePresence shadow-sm>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-black text-white z-[90] md:hidden flex flex-col"
          >
            <div className="flex flex-col h-full pt-24 pb-10 px-8 overflow-y-auto">
              <div className="flex flex-col space-y-8">
                
                {menuItems.map((item) => (
                  <a 
                    key={item.label} 
                    href={item.href} 
                    className="text-4xl font-bold flex items-center gap-4 border-b border-white/10 pb-4"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon} {item.label}
                  </a>
                ))}

                {/* Submenu Servicii pe Mobile */}
                <div className="flex flex-col">
                  <button 
                    onClick={() => setSubmenuOpen(!submenuOpen)}
                    className="text-4xl font-bold flex items-center justify-between w-full border-b border-white/10 pb-4"
                  >
                    <span className="flex items-center gap-4"><Car size={32} /> Servicii</span>
                    <ChevronDown size={32} className={`transition-transform duration-300 ${submenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  <AnimatePresence>
                    {submenuOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden flex flex-col space-y-6 mt-6 ml-4"
                      >
                        {services.map((s) => (
                          <a key={s.label} href={s.href} onClick={() => setIsOpen(false)} className="flex flex-col group">
                            <div className="flex items-center gap-3 text-blue-500 font-bold text-xl">
                              {s.icon} <span>{s.label}</span>
                            </div>
                            <p className="text-gray-400 text-base mt-1 pl-9 leading-snug">{s.desc}</p>
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <a 
                  href="/investors/" 
                  className="text-4xl font-bold flex items-center gap-4 border-b border-white/10 pb-4"
                  onClick={() => setIsOpen(false)}
                >
                  <FaCoins size={32} /> Investors
                </a>
              </div>

              {/* Sign In la baza meniului */}
              <div className="mt-auto pt-10">
                <a 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-5 bg-blue-600 rounded-2xl text-white text-center font-bold text-2xl flex items-center justify-center gap-3 shadow-xl"
                >
                  <LogIn size={28} /> Sign In
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

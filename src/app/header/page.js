"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home, Users, Car, UserCircle, LogIn, ListRestart, Info, Pizza, Badge } from "lucide-react";
import Link from "next/link";
import { FaCoins, FaHamburger, FaHandHolding, FaInvision, FaMotorcycle } from "react-icons/fa";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);

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
      href: "#",
    },
  ];

  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4 relative z-50">

        {/* Logo */}
        <Link href="/" className="inline-block">
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-1 cursor-pointer">
            <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md text-sm">U.</span>
            <span className="text-white font-bold">UCab</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-8 font-medium items-center relative">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 hover:text-blue-500 transition"
            >
              {item.icon} {item.label}
            </a>
          ))}

          {/* Mega Menu */}
          <div
            onMouseEnter={() => setSubmenuOpen(true)}
            onMouseLeave={() => setSubmenuOpen(false)}
            className="relative"
          >
            <button className="flex items-center gap-1 hover:text-blue-500 transition">
              <Car size={20} /> Servicii
            </button>

            <AnimatePresence>
              {submenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-96 bg-white text-black rounded shadow-lg p-6 grid grid-cols-1 gap-4 z-50"
                >
                  {services.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-100 transition"
                    >
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

          <a
            href="/investors/"
            className="flex items-center gap-1 hover:text-blue-500 transition"
          >
            <FaCoins size={20} /> investors
          </a>

          <a
            href="/login/"
            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition flex items-center gap-1"
          >
            <LogIn size={18} /> Sign In
          </a>
        </nav>

        {/* Mobile button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-800 transition relative z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <motion.path
                initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 45, scale: 1, opacity: 1 }}
                exit={{ rotate: 0, scale: 0.8, opacity: 0 }}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <motion.path
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-95 z-40 flex flex-col items-center justify-center space-y-8 text-2xl md:hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white hover:text-blue-500 transition flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                {item.icon} {item.label}
              </a>
            ))}

            {/* mobile submenu */}
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => setSubmenuOpen(!submenuOpen)}
                className="text-white flex items-center gap-2 text-xl"
              >
                <Car size={20} /> Servicii
              </button>

              <AnimatePresence>
                {submenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-start space-y-2 mt-2"
                  >
                    {services.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        className="text-white hover:text-blue-500 flex items-start gap-2 p-2 rounded-lg transition w-full"
                        onClick={() => setIsOpen(false)}
                      >
                        {s.icon} <span>{s.label}</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="/investors/"
              className="text-white hover:text-blue-500 transition flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <FaCoins size={20} /> Investors
            </a>

            <a
              href="/login"
              className="px-6 py-3 border border-white rounded hover:bg-white hover:text-black transition flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <LogIn size={18} /> Sign In
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

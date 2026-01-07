"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Facebook, Instagram, MapPin, ArrowRight, ShieldCheck, Car, Smartphone, Globe, Sparkles } from "lucide-react";

export default function Footer() {
  const [location, setLocation] = useState("București, România");

  useEffect(() => {
    const fetchIPLocation = async () => {
      try {
        const res = await fetch("ipapi.co");
        const data = await res.json();
        if (data.city && data.country_name) {
          setLocation(`${data.city}, ${data.country_name}`);
        }
      } catch {}
    };
    fetchIPLocation();
  }, []);

  const handlePreciseLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `nominatim.openstreetmap.org{latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.county;
            const country = data.address.country;
            setLocation(`${city}, ${country}`);
          } catch {}
        },
        () => {}
      );
    }
  };

  return (
    <footer className="relative bg-[#020202] text-white pt-24 pb-12 overflow-hidden border-t border-white/10">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* DOWNLOAD SECTION - THE "WOW" ELEMENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <a
            href="play.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center p-8 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/20 hover:border-blue-500/50 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500">
                <img src="/ucabapp.png" alt="UCab" className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-2xl font-black italic tracking-tight">UCab Ride</h4>
                <p className="text-blue-400 text-sm font-bold flex items-center gap-1 uppercase tracking-tighter">
                  Descarcă aplicația <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </p>
              </div>
            </div>
            {/* Glossy Overlay */}
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] group-hover:left-full transition-all duration-1000" />
          </a>

          <a
            href="play.google.comfood"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center p-8 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/20 hover:border-red-500/50 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <img src="/ucabfood.png" alt="Food" className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-2xl font-black italic tracking-tight">UCab Food</h4>
                <p className="text-red-400 text-sm font-bold flex items-center gap-1 uppercase tracking-tighter">
                  Comandă acum <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </p>
              </div>
            </div>
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] group-hover:left-full transition-all duration-1000" />
          </a>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 space-y-8">
            <div>
              <h3 className="text-4xl font-black italic tracking-tighter mb-4">UCAB<span className="text-blue-600">.</span>RO</h3>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                Platforma care unește orașul. Tehnologie românească pentru standarde internaționale de transport.
              </p>
            </div>
            <div 
              onClick={handlePreciseLocation}
              className="group flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-all"
            >
              <div className="p-2 bg-blue-600 rounded-xl">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold leading-none mb-1">Locația Ta</p>
                <p className="text-sm font-bold text-white tracking-tight">{location}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="text-xs font-black uppercase tracking-widest text-blue-500">Companie</h5>
            <ul className="space-y-3 text-sm font-semibold text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Acasă</Link></li>
              <li><Link href="/about/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Despre noi</Link></li>
              <li><Link href="/404/" className="hover:text-white transition-colors hover:translate-x-1 inline-block flex items-center gap-2">Cariere <Sparkles className="w-3 h-3 text-yellow-500" /></Link></li>
              <li><Link href="/404/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Știri & Blog</Link></li>
              <li><Link href="/investors/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Investitori</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-xs font-black uppercase tracking-widest text-blue-500">Șoferi</h5>
            <ul className="space-y-3 text-sm font-semibold text-gray-400">
              <li><Link href="/driver/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Înregistrează-te</Link></li>
              <li><Link href="/cerinte_auto/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Cerințe auto</Link></li>
              <li><Link href="/implementare/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Implementare</Link></li>
              <li><Link href="/404/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Dezvoltare</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h5 className="text-xs font-black uppercase tracking-widest text-blue-500">Resurse</h5>
            <ul className="space-y-3 text-sm font-semibold text-gray-400">
              <li><Link href="/resource/terms/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Termeni & Condiții</Link></li>
              <li><Link href="/resource/policy/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Confidențialitate</Link></li>
              <li><Link href="/resource/safe/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Siguranță</Link></li>
              <li><Link href="/resource/cadru-legal/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Cadru legal</Link></li>
              <li><Link href="/resource/contract/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Contract UCab</Link></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <a href="/404/" className="text-gray-400 hover:text-white transition-transform hover:scale-125"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-transform hover:scale-125"><Instagram className="w-5 h-5" /></a>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex gap-4">
               <img src="/anpc.png" alt="ANPC" className="h-5 grayscale brightness-200 opacity-50 hover:opacity-100 transition-all cursor-pointer" />
               <img src="/litigii.png" alt="Litigii" className="h-5 grayscale brightness-200 opacity-50 hover:opacity-100 transition-all cursor-pointer" />
            </div>
          </div>

          <p className="text-[10px] font-bold tracking-[0.4em] text-gray-600 uppercase">
            © {new Date().getFullYear()} UCab.ro • Toate drepturile rezervate
          </p>
        </div>
      </div>
    </footer>
  );
}

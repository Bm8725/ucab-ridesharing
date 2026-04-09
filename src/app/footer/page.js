"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import packageJson from '../../../package.json';

import { 
  Facebook, 
  Instagram, 
  MapPin, 
  Navigation2, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Globe 
} from "lucide-react";

export default function Footer() {
  const [location, setLocation] = useState("București, România");
 const version = require('../../../package.json').version;
  useEffect(() => {
    const fetchIPLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
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
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
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
    <footer className="bg-[#050505] text-[#999] border-t border-white/5 pt-24 pb-12 font-sans tracking-tight">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Top Header: Brand & App Dock */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-20">
          <div className="space-y-6">
            <h3 className="text-white text-4xl font-black italic tracking-tighter">
              UCab<span className="text-blue-600 font-normal"></span>
            </h3>
            
            {/* Widget Locație - Corporate UI */}
            <button 
              onClick={handlePreciseLocation}
              className="group flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/50 hover:bg-white/[0.06] transition-all active:scale-95"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-40"></span>
                <Navigation2 className="relative inline-flex h-2 w-2 text-blue-500 fill-blue-500 rotate-45" />
              </div>
              <span className="text-xs font-bold text-gray-200 uppercase tracking-widest">
                 <span className="text-blue-500">{location}</span>
              </span>
            </button>
          </div>


        </div>

        {/* Links Grid: 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-16 mb-20">
          <div className="space-y-6">
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Zap className="w-3 h-3 fill-blue-600 text-blue-600" /> Companie
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/" className="hover:text-white transition-colors">Acasă</Link></li>
              <li><Link href="/myaccount/" className="hover:text-white transition-colors">My account</Link></li>
              <li><Link href="/about/" className="hover:text-white transition-colors">Despre noi</Link></li>
              <li><Link href="/blog/" className="hover:text-white transition-colors flex items-center gap-2">myBlog<span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[9px] font-bold tracking-normal uppercase">Hiring</span></Link></li>
              <li><Link href="/resource/promotii/" className="hover:text-white transition-colors">Promotii</Link></li>
              <li><Link href="/investors/" className="hover:text-white transition-colors">Investitori</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 fill-blue-600 text-blue-600" /> Servicii
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/cursa/" className=" hover:text-blue-400 transition-colors font-bold text-blue-500">Cere o cursa </Link></li>
              <li><Link href="/restaurante/" className="hover:text-red-400 transition-colors font-bold text-red-500">Comanda Mancare </Link></li>
              <li><Link href="/account/" className="hover:text-white transition-colors">Înregistrează-te</Link></li>
              <li><Link href="/cerinte_auto/" className="hover:text-white transition-colors">Cerințe auto</Link></li>
              <li><Link href="/implementare/" className="hover:text-white transition-colors">Implementare</Link></li>
              <li><Link href="/resource/dezvoltare_durabila/" className="hover:text-white transition-colors">Dezvoltare durabilă</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.3em]">Legal</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/resource/terms/" className="hover:text-white transition-colors">Termeni și Condiții</Link></li>
              <li><Link href="/resource/policy/" className="hover:text-white transition-colors">Confidențialitate</Link></li>
              <li><Link href="/resource/safe/" className="hover:text-white transition-colors">Siguranță & Protecție</Link></li>
              <li><Link href="/resource/cadru-legal/" className="hover:text-white transition-colors">Cadru legal</Link></li>
              <li><Link href="/resource/contract/" className="hover:text-white transition-colors font-bold text-gray-300">Contract UCab</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white text-[11px] font-black uppercase tracking-[0.3em]">Misiune</h4>
            <p className="text-xs leading-relaxed opacity-60">
              Platformă modernă de ride-sharing pentru transport rapid și sigur în România. Creat pentru companii locale de încredere.
            </p>
            <div className="flex gap-4 border-t border-white/5 pt-6">
              <a href="/404/" className="p-2 rounded-full bg-white/5 hover:bg-blue-600 hover:text-white transition-all"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-pink-600 hover:text-white transition-all"><Instagram className="w-4 h-4" /></a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Badges & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-white/5">
          <div className="flex items-center gap-8 order-2 md:order-1">
            <img src="/anpc.png" alt="ANPC" className="h-5 grayscale opacity-30 hover:opacity-100 transition-opacity cursor-pointer" />
            <img src="/litigii.png" alt="Litigii" className="h-5 grayscale opacity-30 hover:opacity-100 transition-opacity cursor-pointer" />
          </div>
          
          <div className="flex flex-col md:items-end gap-1 order-1 md:order-2">
            <p className="text-[10px] font-black tracking-[0.3em] text-white/70 uppercase">
              © {new Date().getFullYear()} UCab Romania • Tehnologies 
                    <span className="ml-2 opacity-73 lowercase tracking-normal text-[8px]">
                    V {version}
                  </span>
            </p>

          </div>
        </div>
      </div>
    </footer>
  );
}

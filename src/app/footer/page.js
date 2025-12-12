"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const [location, setLocation] = useState("București, România");

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
    <footer className="bg-black text-gray-300 border-t border-gray-800 pt-16 pb-10">

      {/* Secțiuni Brand / Companie / Servicii / Legal */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 gap-y-8">
        {/* Brand */}
        <div>
          <h3 className="text-white text-2xl font-bold tracking-tight mb-3">UCab.ro</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Platformă modernă de ride-sharing pentru transport rapid, sigur și eficient în orașele din România. Creat pentru companii locale de incredere. 
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-green-500" /> +40 700 x23 456</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-green-500" /> support@ucab.ro</div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500" />
              <span onClick={handlePreciseLocation} className="cursor-pointer hover:text-green-400 transition">{location}</span>
            </div>
          </div>
        </div>

        {/* Companie */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Companie</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-green-500 transition">Acasă</Link></li>
            <li><Link href="/about/" className="hover:text-green-500 transition">Despre noi</Link></li>
            <li><Link href="/404/" className="hover:text-green-500 transition">Cariere</Link></li>
            <li><Link href="/404/" className="hover:text-green-500 transition">Știri & Blog</Link></li>
            <li><Link href="/investors/" className="hover:text-green-500 transition">Investitori</Link></li>
          </ul>
        </div>

        {/* Servicii */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Servicii</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/driver/" className="hover:text-green-500 transition">Înregistrează-te</Link></li>
            <li><Link href="/cerinte_auto/" className="hover:text-green-500 transition">Cerințe auto</Link></li>
            <li><Link href="/implementare/" className="hover:text-green-500 transition">Implementare</Link></li>
            <li><Link href="/404/" className="hover:text-green-500 transition">Dezvoltare durabila</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Legal</h4>
          <ul className="mt-6 space-y-2 text-sm">
            <li><Link href="/resource/terms/" className="hover:text-green-500 transition">Termeni și Condiții</Link></li>
            <li><Link href="/resource/policy/" className="hover:text-green-500 transition">Politica de Confidențialitate</Link></li>
            <li><Link href="/resource/safe/" className="hover:text-green-500 transition">Siguranță & Protecție</Link></li>
            <li><Link href="/resource/cadru-legal/" className="hover:text-green-500 transition">Cadru legal</Link></li>
            <li><Link href="/resource/contract/" className="hover:text-green-500 transition">Contract ucab</Link></li>
          </ul>
        </div>
      </div>

     {/* Butoane UCab App + UCab Food jos */}
<div className="max-w-7xl mx-auto px-6 mt-10 flex flex-col items-center gap-6">
  
  {/* Butoane App */}
  <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto flex-wrap">
    <a
      href="https://play.google.com/store/apps/details?id=com.ucab"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-white/70 via-blue-400 to-blue-700 text-white rounded-2xl shadow-xl border-2 border-blue-300 transform transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-400/50 font-semibold text-sm sm:text-base"
    >
      <img src="/ucabapp.png" alt="UCab App Icon" className="w-9 h-9 sm:w-7 sm:h-7" />
      UCab App
    </a>

    <a
      href="https://play.google.com/store/apps/details?id=com.ucabfood"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-white/70 via-red-400 to-red-700 text-white rounded-2xl shadow-xl border-2 border-red-300 transform transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-400/50 font-semibold text-sm sm:text-base"
    >
      <img src="/ucabfood.png" alt="UCab Food Icon" className="w-9 h-9 sm:w-7 sm:h-7" />
      UCab Food
    </a>
  </div>

  {/* Badge-uri ANPC / Rezolvarea reclamațiilor */}
  <div className="flex justify-center gap-6 mt-4 flex-wrap">
    <a href="#" target="_blank" rel="noopener noreferrer">
      <img src="/anpc.png" alt="ANPC" className="h-6 sm:h-8 object-contain" />
    </a>
    <a href="#" target="_blank" rel="noopener noreferrer">
      <img src="/litigii.png" alt="Rezolvarea reclamațiilor" className="h-6 sm:h-8 object-contain" />
    </a>
  </div>

  {/* Social + Copyright */}
  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 mt-6 w-full">
    <div className="flex items-center gap-5">
      <a href="#" aria-label="Facebook UCab" className="hover:text-green-500 transition"><Facebook className="w-5 h-5" /></a>
      <a href="#" aria-label="Instagram UCab" className="hover:text-green-500 transition"><Instagram className="w-5 h-5" /></a>
    </div>
    <p className="text-sm text-gray-400 text-center sm:text-right">
      © {new Date().getFullYear()} UCab.ro — Toate drepturile rezervate.
    </p>
  </div>
</div>


    </footer>
  );
}

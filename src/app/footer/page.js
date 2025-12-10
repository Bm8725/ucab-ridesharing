"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const [location, setLocation] = useState("București, România");

  // 1️⃣ Detectare locație aproximativă după IP
  useEffect(() => {
    const fetchIPLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.city && data.country_name) {
          setLocation(`${data.city}, ${data.country_name}`);
        }
      } catch {
        // fallback: București, România
      }
    };
    fetchIPLocation();
  }, []);

  // 2️⃣ Funcție pentru locație precisă dacă utilizatorul permite
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
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 gap-y-8">

        {/* Brand */}
        <div>
          <h3 className="text-white text-2xl font-bold tracking-tight mb-3">UCab.ro</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Platformă modernă de ride-sharing pentru transport rapid, sigur și eficient în orașele din România. Creat pentru companii locale de incredere.
          </p>

          {/* Contact + Locație */}
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-500" />
              <span>+40 700 123 456</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-500" />
              <span>support@ucab.ro</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500" />
              <span
                onClick={handlePreciseLocation}
                className="cursor-pointer hover:text-green-400 transition"
                title="Actualizează locația precisă"
              >
                {location}
              </span>
            </div>
          </div>
        </div>

        {/* Companie */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Companie</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-green-500 transition">Acasă</Link></li>
            <li><Link href="/about/" className="hover:text-green-500 transition">Despre noi</Link></li>
            <li><Link href="/404" className="hover:text-green-500 transition">Cariere</Link></li>
            <li><Link href="/404/" className="hover:text-green-500 transition">Știri & Blog</Link></li>
            <li><Link href="/investors" className="hover:text-green-500 transition">Investitori</Link></li>
          </ul>
        </div>

        {/* Servicii */}
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Servicii</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/driver/" className="hover:text-green-500 transition">Înregistrează-te</Link></li>
            <li><Link href="/cerinte_auto/" className="hover:text-green-500 transition">Cerințe auto</Link></li>
            <li><Link href="/implementare/" className="hover:text-green-500 transition">Implementare</Link></li>
            <li><Link href="/404" className="hover:text-green-500 transition">Plateste sigur</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
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

      {/* Social + Copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-14 flex flex-col items-center sm:flex-row sm:justify-between gap-4">
        <div className="flex items-center gap-5">
          <a href="#" aria-label="Facebook UCab" className="hover:text-green-500 transition">
            <Facebook className="w-5 h-5" />
          </a>
       
          <a href="#" aria-label="Instagram UCab" className="hover:text-green-500 transition">
            <Instagram className="w-5 h-5" />
          </a>
        </div>
  <p className="text-sm text-gray-600 text-center sm:text-right">
  © {new Date().getFullYear()} UCab.ro — All rights reserved.
</p>

      </div>
    </footer>
  );
}

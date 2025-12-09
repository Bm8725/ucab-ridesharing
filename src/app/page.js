"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";


export default function LandingPage() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(""); // <-- stare pentru afișarea erorii

  const handleSearch = async () => {
    if (!pickup || !destination) return;

    try {
      setResults([]);
      setError(""); // resetăm eroarea la fiecare căutare
      const res = await fetch(
        `https://pai.ucab.ro/drivers?pickup=${encodeURIComponent(
          pickup
        )}&destination=${encodeURIComponent(destination)}`
      );
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError("Eroare la încărcarea șoferilor. Verifică serverul."); // <-- afișăm eroarea pe pagină
    }
  };

  const sections = [
    {
      title: "Beneficii UCab",
      desc: "Rapiditate, siguranță și confort. Fiecare călătorie este verificată și optimizată pentru tine. Transport local la un click distanță. Comisioane mici, business axat pe companii locale dar cu viziune nationala",
      img: "./ucab1.png",
      reverse: false,
    },
    {
      title: "Tehnologie Modernă",
      desc: "Platforma UCab folosește algoritmi de rutare bazat pe AI, GPS live și plăți digitale securizate pentru o experiență completă. Folosim servere de ultimă generație pentru a asigura performanță și fiabilitate de tipul ARM Cortex, consum redus de energie si prieteni cu natura",
      img: "./ucab2.png",
      reverse: true,
    },
    {
      title: "Flota Variată",
      desc: "De la mașini compacte la premium, alegi vehiculul potrivit nevoilor tale. Totul pentru confortul tău.",
      img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      reverse: false,
    },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* BACKGROUND */}
<div className="fixed inset-0 -z-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
  <div className="absolute inset-0 bg-[url('/abstract-bg.svg')] bg-cover bg-center opacity-20"></div>
</div>


      <div className="relative z-10 w-full px-6 py-20 flex flex-col items-center">

        {/* HERO */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold text-white mb-4 text-center drop-shadow-lg"
        >
          Bine ai venit la <span className="text-green-400">UCab</span> Rideshare
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl text-center drop-shadow-lg"
        >
          Creează-ți călătoria rapid și sigur. Alege punctul de plecare și destinația și găsește șoferul potrivit. O aplicatie gandita pentru companii locale.
        </motion.p>

        {/* SEARCH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-3xl bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col sm:flex-row gap-4 items-center border border-white/20"
        >
          {/* Pickup */}
          <div className="relative flex-1 w-full sm:w-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 text-xl">📍</span>
            <input
              type="text"
              placeholder="Punct de plecare"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-md hover:shadow-lg transition"
            />
          </div>

          {/* Destination */}
          <div className="relative flex-1 w-full sm:w-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 text-xl">🏁</span>
            <input
              type="text"
              placeholder="Destinație"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/90 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-md hover:shadow-lg transition"
            />
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(34,197,94,0.7)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSearch}
            className="w-full sm:w-auto px-8 py-3 bg-green-500 text-white rounded-2xl font-bold shadow-xl hover:bg-green-600 transition"
          >
            Caută
          </motion.button>
        </motion.div>

        {/* ERROR MESSAGE */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-500 text-white rounded-xl max-w-3xl text-center shadow-md"
          >
            {error}
          </motion.div>
        )}

        {/* RESULTS */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-4 space-y-4 my-12"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2">Șoferi disponibili</h2>
              {results.map((r, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center p-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-medium text-gray-900">{r.driver}</p>
                    <p className="text-gray-600">{r.car}</p>
                  </div>
                  <span className="text-gray-500">{r.time}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

 

{/* SECTIONS */}
<div className="flex flex-col gap-20 w-full max-w-6xl mt-12">
  {sections.map((section, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.2 }}
      className={`flex flex-col ${section.reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-12`}
    >
      <img
        src={section.img}
        alt={section.title}
        className="w-full md:w-1/2 rounded-2xl shadow-2xl object-cover"
      />
      <div className="md:w-1/2 text-center md:text-left">
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">{section.title}</h3>
        <p className="text-gray-300 text-lg">{section.desc}</p>
      </div>
    </motion.div>
  ))}

  {/* Spectacular Partner Button using Next.js Link */}
  <div className="w-full flex justify-center mt-12">
    <Link href="/driver/" className="relative inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-xl overflow-hidden group">
      <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white opacity-10 group-hover:w-56 group-hover:h-56 rounded-full"></span>
      <span className="relative flex items-center gap-3">
       
        Devino șofer u.Cab
        <span className="ml-2 text-2xl">→</span>
      </span>
    </Link>
  </div>
</div>


        {/* SECȚIUNE PLĂȚI SAFE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mt-24 py-20 px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-green-700/10 -skew-y-3"></div>
          <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

            {/* Text */}
            <div className="md:w-1/2 space-y-6 text-center md:text-left z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white">
                Plată <span className="text-green-400">rapidă și sigură</span>
              </h2>
              <p className="text-gray-300 text-lg md:text-xl">
                Plătești cum vrei: cu cardul, portofel digital sau cash. Totul este securizat și monitorizat pentru confortul și siguranța ta.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                {/* Card */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="flex flex-col items-center p-8 bg-gradient-to-r from-green-500/30 to-green-400/30 backdrop-blur-md rounded-3xl shadow-2xl border border-green-400/30 cursor-pointer transition-all hover:shadow-2xl hover:border-green-400"
                >
                  <div className="bg-white/20 rounded-full p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="2" y="5" width="20" height="14" rx="2" ry="2" strokeWidth="2" />
                      <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2" />
                    </svg>
                  </div>
                  <h4 className="text-white font-bold text-xl mb-2">Card bancar</h4>
                  <p className="text-gray-200 text-center text-sm">
                    Plătești instant, securizat și fără bătăi de cap.
                  </p>
                </motion.div>

                {/* Cash */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="flex flex-col items-center p-8 bg-gradient-to-r from-red-500/30 to-red-400/30 backdrop-blur-md rounded-3xl shadow-2xl border border-red-400/30 cursor-pointer transition-all hover:shadow-2xl hover:border-red-400"
                >
                  <div className="bg-white/20 rounded-full p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <rect x="3" y="7" width="18" height="10" rx="2" ry="2" strokeWidth="2" />
                      <circle cx="12" cy="12" r="2" strokeWidth="2" />
                    </svg>
                  </div>
                  <h4 className="text-white font-bold text-xl mb-2">Cash</h4>
                  <p className="text-gray-200 text-center text-sm">
                    Plătești șoferul direct, rapid și simplu.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Imagine generală */}
            <div className="md:w-1/2 z-10 flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="rounded-3xl overflow-hidden shadow-2xl"
              >
                <img src="/ucabpay.jpg" alt="Plata UCab sigura" className="w-full h-full object-cover" />
              </motion.div>
            </div>

          </div>
        </motion.div>


{/* FOOD DELIVERY SECTION */}
<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  className="w-full py-16 md:py-24 bg-gradient-to-b from-gray-900 via-black to-gray-900"
>
  {/* Title */}
  <div className="text-center mb-12 md:mb-14 px-4">
    <h2 className="text-white font-extrabold text-balance text-[clamp(2rem,5vw,3.2rem)] flex justify-center items-center gap-3">
      🍔 UCab Food Delivery
    </h2>
    <p className="text-gray-300 mt-4 text-[clamp(1rem,2.5vw,1.25rem)] max-w-2xl mx-auto text-balance px-2">
      Livrare rapidă de la restaurante locale, direct prin platforma UCab la comisioane mici.
      Integrat pentru orașe mici și businessuri locale.
    </p>
  </div>

  {/* Cards */}
  <div className="grid w-full max-w-6xl mx-auto px-4 sm:px-6 gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    {[
      {
        name: "Pizza Napoli",
        img: "/fooddelivery.png",
        rating: "4.8",
        time: "20-30 min",
      },
      {
        name: "Sushi Point",
        img: "/sushi.png",
        rating: "4.9",
        time: "30-40 min",
      },
      {
        name: "Burger House",
        img: "/burgerucab.png",
        rating: "4.7",
        time: "15-20 min",
      },
    ].map((r, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-green-500/30 transition cursor-pointer"
      >
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={r.img}
            className="w-full h-full object-cover hover:scale-105 transition duration-500"
            alt={r.name}
          />
        </div>
        <div className="p-5 md:p-6">
          <h3 className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-bold text-white">
            {r.name}
          </h3>

          <div className="flex items-center gap-4 mt-3 text-gray-300 text-sm md:text-base">
            <span className="flex items-center gap-1">
              ⭐ {r.rating}
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-xl">
              {r.time}
            </span>
          </div>
        </div>
      </motion.div>
    ))}
  </div>

  {/* CTA */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="text-center mt-12 md:mt-16"
  >
<Link
  href="/food-ucab/"
  className="px-8 md:px-10 py-3 md:py-4 bg-blue-500 hover:bg-blue-800 text-black text-lg font-bold rounded-2xl shadow-xl transition inline-block"
>
  🍕 Mai multe detalii
</Link>

  </motion.div>
</motion.section>


{/* ENUMERARE SECTION */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  className="relative w-full py-24 flex flex-col items-center justify-center bg-gray-900"
>
  <div className="max-w-4xl w-full px-6">
    <h2 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-12">
      De ce să alegi UCab.ro
    </h2>

    <ul className="space-y-6 text-lg md:text-xl text-gray-200">
      <li className="flex items-start gap-4">
        <span className="text-green-400 text-2xl font-bold">1.</span>
        <span>Comisioane ultra-low – doar până la % pe cursă.</span>
      </li>
      <li className="flex items-start gap-4">
        <span className="text-green-400 text-2xl font-bold">2.</span>
        <span>Licență anuală avantajoasă – doar 499 €.</span>
      </li>
      <li className="flex items-start gap-4">
        <span className="text-green-400 text-2xl font-bold">3.</span>
        <span>Platformă sigură și monitorizată, cu plăți flexibile.</span>
      </li>
      <li className="flex items-start gap-4">
        <span className="text-green-400 text-2xl font-bold">4.</span>
        <span>Flotă variată – mașini compacte, premium și SUV-uri.</span>
      </li>
          <li className="flex items-start gap-4">
        <span className="text-green-400 text-2xl font-bold">5.</span>
        <span>Costuri mici – costuri adaptate pietei locale.</span>
      </li>
    </ul>
  </div>

  {/* Optional: Layer subtil de background */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-black/0 pointer-events-none"></div>
</motion.div>


      </div>


    </div>
  );
}

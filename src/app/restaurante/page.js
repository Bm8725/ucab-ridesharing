"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Star, Clock, MapPin, Flame, UtensilsCrossed, ArrowRight } from "lucide-react";

export default function Restaurante() {
  const [restaurante, setRestaurante] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- API placeholder ---
    fetch("/api/restaurante")
      .then((res) => res.json())
      .then((data) => {
        setRestaurante(data);
        setLoading(false);
      })
      .catch(() => {
        setRestaurante([
          {
            id: 1,
            name: "Urban Burger",
            rating: 4.8,
            time: "25-35 min",
            distance: "1.2 km",
            img: "/burgerucab.png",
            promo: "15% OFF",
          },
          {
            id: 2,
            name: "Sushi Master",
            rating: 4.9,
            time: "30-40 min",
            distance: "2.1 km",
            img: "/sushi.png",
          },
          {
            id: 3,
            name: "Pasta Casa",
            rating: 4.7,
            time: "20-30 min",
            distance: "0.9 km",
            img: "/fooddelivery.png",
          },
        ]);
        setLoading(false);
      });
  }, []);

  const categorii = [
    { name: "Toate", icon: <UtensilsCrossed className="w-5 h-5" /> },
    { name: "Promoții", icon: <Flame className="w-5 h-5 text-red-500" /> },
    { name: "Burger" },
    { name: "Pizza" },
    { name: "Sushi" },
    { name: "Desert" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8ff] px-6 py-10">

      {/* HEADER */}
      <h1 className="text-4xl font-bold text-gray-900">Restaurante</h1>
      <p className="text-gray-600 mt-1">Comandă mâncare rapidă și sigură.</p>

      {/* SEARCH BAR */}
      <div className="mt-6 flex items-center bg-white rounded-2xl shadow-sm border border-gray-200 px-4 py-3 max-w-xl">
        <Search className="text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Caută restaurante sau preparate..."
          className="w-full bg-transparent outline-none ml-3 text-gray-700"
        />
      </div>

      {/* CATEGORIES */}
      <div className="flex gap-3 mt-6 overflow-x-auto scrollbar-none pb-2">
        {categorii.map((cat, i) => (
          <div
            key={i}
            className="px-5 py-2 bg-white rounded-full shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-100 flex items-center gap-2 transition whitespace-nowrap"
          >
            {cat.icon && cat.icon}
            <span>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* GRID RESTAURANTE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 max-w-7xl mx-auto">
        {restaurante.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer border border-gray-100 overflow-hidden"
          >
            {/* IMAGINE */}
            <div className="relative w-full h-48">
              <img
                src={r.img}
                alt={r.name}
                className="w-full h-full object-cover"
              />
              {/* PROMO */}
              {r.promo && (
                <span className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  {r.promo}
                </span>
              )}
            </div>

            {/* INFO */}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">{r.name}</h2>

              <div className="flex flex-wrap items-center space-x-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" /> {r.rating}
                </span>

                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" /> {r.time}
                </span>

                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" /> {r.distance}
                </span>
              </div>

              {/* BUTON DEVINO PARTENER CU SAGEATA */}
              <a
                href="/partener-restaurant/"
                className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition transform hover:scale-105 group"
              >
                Devino partener
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </motion.div>
        ))}

        {/* PLACEHOLDER CÂND NU SUNT DATE */}
        {loading && (
          <div className="text-center text-gray-500 mt-20 col-span-full">
            Încarc restaurantele...
          </div>
        )}
      </div>
    </div>
  );
}

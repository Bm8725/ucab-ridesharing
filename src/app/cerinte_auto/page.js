"use client";

import { motion } from "framer-motion";
import { Car, Gauge, Settings, ShieldCheck, Fuel, CheckCircle, Info } from "lucide-react";
import { useState } from "react";

export default function Requirements() {

  const [carType, setCarType] = useState("standard");

  const carData = {
    standard: {
      title: "UCab Standard",
      description: "Cerințe minime pentru mașinile acceptate în categoria Standard.",
      requirements: [
        "Mașină fabricată după anul 2013",
        "4+ uși, stare tehnică excelentă",
        "Aer condiționat funcțional",
        "ITP valid + RCA activ",
        "Curată interior & exterior",
        "Fără avarii vizibile majore"
      ],
      image: "https://images.unsplash.com/photo-1493238792000-8113da705763"
    },

    comfort: {
      title: "UCab Comfort",
      description: "Mașini confortabile, spațioase, cu dotări peste medie.",
      requirements: [
        "Fabricată după 2017",
        "Interior premium / confort superior",
        "Spațiu mare pentru pasageri",
        "Senzori parcare obligatoriu",
        "Climatizare automată",
        "Nivel fonic scăzut"
      ],
      image: "https://images.unsplash.com/photo-1502877338535-766e1452684a"
    },

    electric: {
      title: "UCab Electric",
      description: "Categoria eco dedicată mașinilor full electrice.",
      requirements: [
        "Autonomie minim 200 km",
        "Încărcător rapid (DC) alternativ",
        "Vehicul full electric (nu hybrid)",
        "Condiție tehnică excelentă",
        "Fără avarii baterie",
        "Încărcare la domiciliu recomandată"
      ],
      image: "https://images.unsplash.com/photo-1502877338535-766e1452684a"
    }
  };

  const current = carData[carType];

  return (
    <div className="bg-black text-white">

      {/* HERO */}
      <section className="py-24 md:py-32 px-6 text-center bg-gradient-to-b from-black to-gray-900">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Cerințe <span className="text-green-500">Mașină UCab</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed"
        >
          Selectează categoria de mai jos pentru a vedea condițiile și echipările necesare pentru colaborare.
        </motion.p>
      </section>

      {/* SELECTOR TIPURI DE MAȘINI */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">

          {[
            { id: "standard", label: "Standard", icon: Car },
            { id: "comfort", label: "Comfort", icon: Gauge },
            { id: "electric", label: "Electric", icon: Fuel }
          ].map((item) => {

            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                onClick={() => setCarType(item.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={`
                  p-6 rounded-2xl border transition text-center
                  ${carType === item.id ? "border-green-500 bg-green-500/10" : "border-gray-800 hover:border-gray-700"}
                `}
              >
                <Icon size={40} className="mx-auto mb-3 text-green-500" />
                <p className="text-xl font-semibold">{item.label}</p>
              </motion.button>
            );
          })}

        </div>
      </section>

      {/* DETALII CATEGORIE SELECTATĂ */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{current.title}</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {current.description}
            </p>

            <div className="space-y-3">
              {current.requirements.map((req, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="text-green-500" size={22} />
                  <p className="text-gray-300 text-base">{req}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* IMAGINE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={current.image}
              alt={current.title}
              className="rounded-2xl shadow-xl border border-gray-800 w-full object-cover"
            />
          </motion.div>

        </div>
      </section>

      {/* INFO EXTRA */}
      <section className="py-20 bg-gray-900 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <Info className="mx-auto text-green-500 mb-4" size={40} />

          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Verificarea tehnică UCab
          </h3>

          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Înainte de activarea contului, mașina trece printr-o verificare rapidă UCab pentru siguranță, confort și conformitate.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6">
        <h3 className="text-3xl md:text-4xl font-bold mb-6">
          Pregătit să devii șofer UCab?
        </h3>

        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Înregistrează-te și pornește la drum cu platforma noastră.
        </p>

        <a
          href="/account"
          className="px-10 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-semibold transition"
        >
          Începe acum
        </a>
      </section>

    </div>
  );
}

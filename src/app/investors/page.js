"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Globe, PieChart, ShieldCheck, ArrowRight, Building2 } from "lucide-react";

export default function Investors() {
  return (
    <div className="bg-gray-50 text-gray-900">

      {/* HERO */}
      <section className="py-28 px-6 text-center bg-gradient-to-b from-white to-gray-100">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold mb-6 text-black"
        >
          UCab <span className="text-blue-600">Investors</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
        >
          O platformă de mobilitate pregătită pentru expansiune globală.  
          Fii parte din următoarea generație de transport urban inteligent.
        </motion.p>
      </section>

      {/* 3 PILLARS */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

          {[
            {
              icon: TrendingUp,
              title: "Scalabilitate Masivă",
              desc: "Model de business pregătit pentru peste 20 de orașe în următoarele 18 luni."
            },
            {
              icon: Users,
              title: "Cerere în Creștere",
              desc: "Peste 60% dintre utilizatorii urbani aleg servicii ride-sharing."
            },
            {
              icon: Globe,
              title: "Expansiune națională",
              desc: "Plan strategic de extindere în UE, cu parteneriate locale."
            }
          ].map((item, i) => {

            const Icon = item.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-200"
              >
                <Icon size={50} className="text-blue-600 mb-6" />
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}

        </div>
      </section>

      {/* VISION SECTION */}
      <section className="py-28 px-6 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              O viziune clară pentru <span className="text-blue-600">viitorul mobilității</span>.
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              UCab construiește un ecosistem complet pentru transport urban:  
              ride-sharing, flotă electrică, micro-mobilitate și soluții corporate.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed">
              Într-o lume în continuă mișcare, investitorii noștri devin parte dintr-un model sustenabil și scalabil.
            </p>
          </motion.div>

          {/* IMAGE */}
          <motion.img
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl shadow-xl w-full"
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
            alt="Investors"
          />
        </div>
      </section>

      {/* KEY METRICS */}
      <section className="py-24 px-6 bg-gray-100 border-y border-gray-300">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">Indicatori Cheie</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Transparență completă pentru investitori. Model de business solid bazat pe date reale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          {[
            { value: "1.2M+", label: "Călătorii procesate" },
            { value: "48,000+", label: "Șoferi activi" },
            { value: "97%", label: "Rată de satisfacție" }
          ].map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-center p-10 bg-white rounded-xl shadow-md border border-gray-200"
            >
              <h3 className="text-5xl font-bold text-blue-600 mb-3">{m.value}</h3>
              <p className="text-gray-600 text-lg">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SAFETY & GOVERNANCE */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <ShieldCheck className="mx-auto text-blue-600" size={50} />
          <h2 className="text-4xl font-bold mt-4">Siguranță & Guvernanță</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
            Un cadru operațional solid, auditat și orientat spre protecția capitalului investitorilor.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="p-6 bg-gray-50 shadow rounded-xl border border-gray-200">
              <h4 className="text-xl font-bold mb-2">Raportare Transparentă</h4>
              <p className="text-gray-600">Toate datele sunt auditate trimestrial pentru acuratețe.</p>
            </div>

            <div className="p-6 bg-gray-50 shadow rounded-xl border border-gray-200">
              <h4 className="text-xl font-bold mb-2">Management cu experiență</h4>
              <p className="text-gray-600">Echipa executivă are peste 15 ani experiență în mobilitate & tech.</p>
            </div>
          </motion.div>

          {/* right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="p-6 bg-gray-50 shadow rounded-xl border border-gray-200">
              <h4 className="text-xl font-bold mb-2">Infrastructură Legală</h4>
              <p className="text-gray-600">Conformitate totală cu normele europene de siguranță și transport.</p>
            </div>

            <div className="p-6 bg-gray-50 shadow rounded-xl border border-gray-200">
              <h4 className="text-xl font-bold mb-2">Protecția Investitorilor</h4>
              <p className="text-gray-600">Portofoliu securizat, risc operațional minimizat.</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center bg-gradient-to-b from-gray-100 to-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Interesat să investești în UCab?
        </motion.h2>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
          Discută direct cu echipa noastră de dezvoltare și strategie pentru detalii financiare și oportunități.
        </p>

        <a
          href="/investors/investors-founder"
          className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white text-xl rounded-xl font-semibold transition flex items-center gap-2 mx-auto w-fit"
        >
          Devino co-fondator <ArrowRight size={24} />
        </a>
      </section>

    </div>
  );
}

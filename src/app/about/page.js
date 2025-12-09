"use client";

import { motion } from "framer-motion";
import { Users, Car, ShieldCheck, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="bg-black text-white">

      {/* HERO */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-black to-gray-900 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Despre <span className="text-green-500">UCab</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
           u.Cab inseamna profesionalism, respect, transparenta si inovatie. Suntem dedicati sa oferim servicii de transport de cea mai inalta calitate, punand intotdeauna clientul pe primul loc.
          </motion.p>
        </div>
      </section>

      {/* SECTION – CINE SUNTEM */}
      <section className="py-20 md:py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Cine suntem
            </h2>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
             Suntem o companie de tehnologie din Targoviste  dedicată transformării modului în care oamenii se deplasează în orașe. Fondată în 2025, UCab a crescut rapid pentru a deveni unul dintre principalii jucători din industria de ride-sharing, oferind o alternativă sigură, eficientă și prietenoasă cu mediul înconjurător la transportul tradițional la preturi si comisioane avantajoase. Ne adresam in mod special companiilor locale din mediile urbane dar si zonelor rurale.
            </p>

            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              Totul a inceput cu o viziune simplă: să facem transportul urban mai accesibil și mai convenabil pentru toată lumea. Astăzi, cu o echipă dedicată de profesioniști și o rețea extinsă de șoferi parteneri, UCab continuă să inoveze și să redefinească experiența de ride-sharing. Totul a inceput la o cafea si mult curaj.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-900 shadow-lg rounded-2xl p-4 md:p-10 border border-gray-800">
              <img
                src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf"
                alt="UCab Corporate"
                className="rounded-xl shadow-md w-full h-auto object-cover"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* VALORI */}
      <section className="py-20 md:py-24 bg-gray-900 border-t border-gray-800 px-6">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Valorile Noastre
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
             siguranță, profesionalism, încredere, tehnologie și focus pe utilizator.
          </motion.p>
        </div>

        {/* GRID RESPONSIVE */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {[
            { icon: <Car size={40} />, title: "Mobilitate Modernă" },
            { icon: <Users size={40} />, title: "Experiență Umană" },
            { icon: <ShieldCheck size={40} />, title: "Siguranță Totală" },
            { icon: <Globe size={40} />, title: "Viziune Globală" }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-black bg-opacity-40 border border-gray-800 rounded-xl p-8 
                         text-center hover:border-green-500 transition"
            >
              <div className="text-green-500 mx-auto mb-4">
                {item.icon}
              </div>

              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>

              <p className="text-gray-400 text-sm leading-relaxed">
                Mobilitate excelenta prin tehnologie de ultima generatie si o retea extinsa de soferi parteneri.
              </p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24 text-center px-6">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Construim mobilitatea viitorului.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Text final inspirant, profesional, despre ambiția UCab.
        </motion.p>

        <a
          href="/driver/"
          className="px-8 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-semibold transition"
        >
          Începe cu UCab
        </a>
      </section>

    </div>
  );
}

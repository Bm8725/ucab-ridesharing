"use client";

import { motion } from "framer-motion";
import { Gift, Percent, Users, Clock, CheckCircle, Sparkles } from "lucide-react";

export default function Promotions() {

  const promotions = [
    {
      icon: <Gift size={36} className="text-green-500" />,
      title: "Bonus de bun venit",
      subtitle: "Pentru șoferi noi",
      description: "Primești bonus financiar după primele curse finalizate cu succes.",
      details: [
        "Valabil pentru conturi noi",
        "Activare automată",
        "Bonus acordat după prag minim de curse"
      ]
    },
    {
      icon: <Percent size={36} className="text-green-500" />,
      title: "Comision redus",
      subtitle: "Primele 30 de zile",
      description: "Lucrezi cu comision promoțional redus la început de colaborare.",
      details: [
        "Comision preferențial",
        "Fără taxe ascunse",
        "Vizibil direct în aplicație"
      ]
    },
    {
      icon: <Users size={36} className="text-green-500" />,
      title: "Invită un prieten",
      subtitle: "Câștigați amândoi",
      description: "Recomandă UCab altor șoferi și primiți recompense.",
      details: [
        "Link personal de invitație",
        "Bonus dublu",
        "Activare după validare cont"
      ]
    },
    {
      icon: <Clock size={36} className="text-green-500" />,
      title: "Ore de vârf",
      subtitle: "Câștiguri mai mari",
      description: "Tarife dinamice în perioadele cu cerere ridicată.",
      details: [
        "Aplicare automată",
        "Vizibil înainte de cursă",
        "Fără acțiuni suplimentare"
      ]
    }
  ];

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
          Promoții <span className="text-green-500">UCab</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed"
        >
          Beneficii speciale pentru șoferi și parteneri UCab. Lucrezi mai mult, câștigi mai bine.
        </motion.p>
      </section>

      {/* LISTĂ PROMOȚII */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

          {promotions.map((promo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 hover:border-green-500/50 transition"
            >
              <div className="flex items-center gap-4 mb-4">
                {promo.icon}
                <div>
                  <h3 className="text-2xl font-bold">{promo.title}</h3>
                  <p className="text-green-500 text-sm">{promo.subtitle}</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                {promo.description}
              </p>

              <div className="space-y-2">
                {promo.details.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

        </div>
      </section>

      {/* INFO */}
      <section className="py-20 bg-gray-900 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="mx-auto text-green-500 mb-4" size={42} />
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Promoții transparente
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Toate promoțiile sunt vizibile direct în contul tău UCab. Nu există taxe ascunse sau condiții neclare.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6">
        <h3 className="text-3xl md:text-4xl font-bold mb-6">
          Profită de avantajele UCab
        </h3>

        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          Creează cont și începe să beneficiezi de promoțiile disponibile.
        </p>

        <a
          href="/account"
          className="px-10 py-4 bg-green-600 hover:bg-green-500 rounded-xl font-semibold transition"
        >
          Creează cont
        </a>
      </section>

    </div>
  );
}

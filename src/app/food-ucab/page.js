"use client";

import { motion } from "framer-motion";

export default function FoodDeliveryTerms() {
  const conditions = [
    {
      title: "Comision pentru restaurante",
      description:
        "Pentru fiecare comandă procesată prin UCab Food Delivery, restaurantul va plăti un comision de **maxim 10%** din valoarea comenzii.",
      icon: "💰",
    },
    {
      title: "Licență lunară",
      description:
        "Cost fix de licențiere pentru folosirea platformei: **19€/lună**.",
      icon: "📄",
    },
    {
      title: "Taxă de livrare",
      description:
        "Taxa de livrare este plătită de client și acoperă costul curieratului. Aceasta nu influențează comisionul restaurantului.",
      icon: "🚚",
    },
    {
      title: "Costuri suplimentare",
      description:
        "Restaurantul poate include costuri pentru ambalaje și alte cheltuieli operaționale. Totul este transparent și afișat în aplicație.",
      icon: "📦",
    },
    {
      title: "Flexibilitate și transparență",
      description:
        "Prețurile sunt afișate clar pentru client: ce parte merge la restaurant, ce parte reprezintă comisionul și costul livrării.",
      icon: "🔍",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-white text-gray-900 py-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
          Condiții & Comisioane UCab Food Delivery
        </h1>
        <p className="text-lg md:text-xl text-gray-700">
          Descoperă cum funcționează comisionul, costurile de licențiere și livrare pentru restaurantele partenere.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {conditions.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="bg-white shadow-lg rounded-2xl p-6 flex items-start gap-4 hover:scale-105 transition-transform duration-300 relative overflow-hidden"
          >
            <div className="text-3xl">{c.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">{c.title}</h3>
              <p className="text-gray-700">{c.description}</p>
            </div>

            {/* Floating icon in background */}
            <div className="absolute -top-5 -right-5 text-6xl text-blue-100 opacity-20 select-none pointer-events-none">
              {c.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="text-center mt-20"
      >
        <a
          href="/partener-restaurant"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-3xl shadow-xl transition-all text-lg"
        >
          Devino restaurant partener
        </a>
      </motion.div>
    </div>
  );
}

"use client";

import { motion, useViewportScroll, useTransform } from "framer-motion";
import { FaServer, FaWallet, FaFileContract, FaMoneyCheckAlt } from "react-icons/fa";

export default function UcabTimelinePro() {
  const costSections = [
    {
      id: 1,
      title: "Setup Server & Aplicație",
      cost: "99 – 199 € [o singură dată]",
      desc: "Include backend și aplicație mobilă pentru firma client.",
      icon: <FaServer size={36} className="text-green-500" />,
    },
    {
      id: 2,
      title: "Licențe Software/API",
      cost: "300 – 499 €/an/vehicul",
      desc: "În funcție de numărul de vehicule gestionate și pachetul ales.",
      icon: <FaFileContract size={36} className="text-green-500" />,
    },
    {
      id: 3,
      title: "Comisioane Soferi",
      cost: "1.2 – 3.3%",
      desc: "Procent pe tranzacție, foarte mic pentru a susține modelul B2B SaaS.",
      icon: <FaMoneyCheckAlt size={36} className="text-green-500" />,
    },
  ];

  const { scrollYProgress } = useViewportScroll();
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="min-h-screen bg-white py-16 px-4 md:px-20 relative">
      {/* Logo */}
      <div className="flex justify-center mb-12">
        <img src="/ucabro.png" alt="UCab Logo" className="h-24 md:h-32 w-auto object-contain" />
      </div>

      {/* Titlu */}
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center mb-8 text-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Model Business & Costuri UCab
      </motion.h1>

      {/* Descriere model SaaS B2B */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto mb-16 p-6 bg-gray-50 rounded-3xl shadow-lg text-gray-700 text-base md:text-lg"
      >
        <p className="mb-4">
          UCab funcționează pe un model <strong>SAAS (Software as a Service)</strong> orientat către <strong>B2B</strong>, oferind infrastructură și aplicații companiilor de transport și livrare. Spre deosebire de Uber sau Bolt, UCab nu intermediază direct clienții finali, dar ne rezervam dreptul de sugera solutia optima.
        </p>
        <p>
          Companiile licențiază software-ul și folosesc aplicațiile pentru gestionarea flotei, monitorizarea comenzilor și raportare detaliată, plătind costuri inițiale, abonamente și comisioane mici per tranzacție.
        </p>
      </motion.div>

      {/* Timeline Vertical */}
      <div className="relative max-w-3xl mx-auto">
        {/* Linie curbată */}
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-200 rounded-full origin-top"
          style={{ scaleY }}
        ></motion.div>

        {/* Card-uri */}
        {costSections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: index * 0.2 }}
            whileHover={{ scale: 1.03, y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
            className={`relative mb-20 flex flex-col md:flex-row items-center w-full`}
          >
            {/* Punct animat pe linie */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full z-10"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            ></motion.div>

            {/* Card */}
            <div
              className={`bg-gradient-to-r from-green-50 to-white shadow-lg rounded-3xl p-6 w-full md:w-5/12 flex flex-col items-center text-center ${
                index % 2 === 0 ? "md:ml-auto text-right" : "md:mr-auto text-left"
              }`}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="mb-4"
              >
                {section.icon}
              </motion.div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900">{section.title}</h3>
              <p className="text-green-600 font-bold mb-2">{section.cost}</p>
              <p className="text-gray-700 text-sm md:text-base">{section.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

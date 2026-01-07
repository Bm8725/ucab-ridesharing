"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaShieldAlt, FaPrint, FaClock, FaChevronRight, FaUserShield, FaTruck, FaUsers } from "react-icons/fa";

export default function SafetyProtectionComponent() {
  const data = useMemo(() => ({
    safety: {
      title: "Siguranță și protecție",
      icon: <FaShieldAlt />,
      sections: [
        { 
            id: "s1", 
            heading: "1. Siguranța livratorului", 
            icon: <FaTruck className="text-blue-500" />,
            body: "Livratorii trebuie să poarte echipament de protecție: casca, veste reflectorizante, genunchiere și cotiere, să fie instruiți corespunzător privind manipularea vehiculului și a coletelor și să respecte strict normele de circulație." 
        },
        { 
            id: "s2", 
            heading: "2. Siguranța șoferului", 
            icon: <FaUserShield className="text-emerald-500" />,
            body: "Vehiculul trebuie să fie întreținut regulat: frâne, lumini, stare baterie și alte componente critice. Șoferul trebuie să respecte timpii legali de odihnă și să nu opereze sub influența oboselii." 
        },
        { 
            id: "s3", 
            heading: "3. Siguranța clientului", 
            icon: <FaUsers className="text-purple-500" />,
            body: "Protecția datelor personale se face conform GDPR. Clientul trebuie informat clar asupra utilizării corecte a serviciului pentru prevenirea oricăror incidente nedorite." 
        },
        { 
            id: "s4", 
            heading: "4. Reguli generale", 
            icon: <FaShieldAlt className="text-amber-500" />,
            body: "Proceduri de urgență: în caz de accident, se contactează autoritățile și se raportează imediat operatorului. Limitarea vitezei trebuie respectată conform regulilor locale." 
        }
      ]
    }
  }), []);

  const [active, setActive] = useState("safety");
  const activeDoc = data[active];

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center gap-3">
              <span className="p-3 bg-black text-white rounded-2xl shadow-lg inline-block">
                {activeDoc.icon}
              </span>
              {activeDoc.title}
            </h1>
            <p className="text-gray-500 mt-2 flex items-center gap-2">
              <FaClock className="text-blue-500" /> Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
            </p>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-2xl shadow-sm font-bold text-gray-700 hover:bg-gray-50 transition-all print:hidden"
          >
            <FaPrint /> Printează Document
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* MOBILE TABS (Scrollable) / DESKTOP SIDEBAR */}
          <aside className="lg:col-span-3">
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 sticky lg:top-10 no-scrollbar">
              {Object.keys(data).map((key) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`whitespace-nowrap flex items-center justify-between px-5 py-4 rounded-2xl transition-all text-sm font-bold ${
                    active === key 
                    ? "bg-black text-white shadow-xl translate-x-1" 
                    : "bg-white text-gray-500 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {data[key].icon} {data[key].title}
                  </span>
                  <FaChevronRight className={`hidden lg:block transition-transform ${active === key ? "rotate-0" : "opacity-0"}`} />
                </button>
              ))}
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {activeDoc.sections.map((sec, index) => (
                  <motion.section 
                    key={sec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-5">
                      <div className="p-4 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">
                        {sec.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">{sec.heading}</h2>
                        <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                          {sec.body}
                        </p>
                      </div>
                    </div>
                  </motion.section>
                ))}

                {/* FOOTER NOTICE */}
                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl overflow-hidden relative">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-wider">Notă Importanță</h3>
                    <p className="opacity-90">Nerespectarea acestor norme poate duce la suspendarea imediată a contului de livrator sau utilizator.</p>
                  </div>
                  <FaShieldAlt className="absolute -right-10 -bottom-10 text-[12rem] opacity-10 rotate-12" />
                </div>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .print\:hidden { display: none !important; }
          body { background: white; }
          main { width: 100% !important; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

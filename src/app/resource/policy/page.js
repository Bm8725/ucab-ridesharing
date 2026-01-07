"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUserLock, FaDatabase, FaUserCheck, FaCookie, 
  FaEnvelopeOpenText, FaPrint, FaHistory, FaShieldAlt 
} from "react-icons/fa";

export default function PrivacyComponent() {
  const data = useMemo(() => ({
    privacy: {
      title: "Politica de Confidențialitate",
      icon: <FaUserLock />,
      sections: [
        { 
          id: "p1", 
          heading: "1. Colectarea datelor", 
          icon: <FaDatabase className="text-blue-500" />,
          body: "Colectăm date personale precum numele, adresa de email și datele de localizare în conformitate cu regulamentul GDPR, exclusiv pentru furnizarea serviciului de rideshare." 
        },
        { 
          id: "p2", 
          heading: "2. Utilizarea datelor", 
          icon: <FaShieldAlt className="text-emerald-500" />,
          body: "Datele sunt folosite pentru procesarea comenzilor, îmbunătățirea algoritmilor de rutare și comunicarea actualizărilor importante privind contul dumneavoastră." 
        },
        { 
          id: "p3", 
          heading: "3. Drepturile utilizatorului", 
          icon: <FaUserCheck className="text-purple-500" />,
          body: "Conform legii, aveți dreptul de acces, rectificare și portabilitate a datelor, precum și dreptul de a solicita ștergerea definitivă a acestora ('dreptul de a fi uitat')." 
        },
        { 
          id: "p4", 
          heading: "4. Cookies și Tehnologii", 
          icon: <FaCookie className="text-amber-500" />,
          body: "Site-ul folosește cookies esențiale pentru autentificare și cookies de analiză pentru a înțelege cum interacționați cu platforma noastră." 
        },
        { 
          id: "p5", 
          heading: "5. Contact Protecția Datelor", 
          icon: <FaEnvelopeOpenText className="text-rose-500" />,
          body: "Pentru orice solicitare legată de datele dumneavoastră, ofițerul nostru pentru protecția datelor (DPO) poate fi contactat la: privacy@ucab.ro" 
        }
      ]
    }
  }), []);

  const [active, setActive] = useState("privacy");
  const activeDoc = data[active];

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-16 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER ELEGANT */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-600 text-white p-2 rounded-lg text-sm font-bold">GDPR COMPLIANT</span>
              <span className="text-gray-400 text-sm font-medium flex items-center gap-1">
                <FaHistory /> Revizia: 2026.01
              </span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              {activeDoc.title}
            </h1>
          </motion.div>

          <button 
            onClick={() => window.print()}
            className="print:hidden flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-gray-200"
          >
            <FaPrint /> Printează Acordul
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* SIDEBAR MINI */}
          <aside className="lg:col-span-3 print:hidden">
            <div className="sticky top-10 space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Documente</h3>
              {Object.keys(data).map(key => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm ${
                    active === key 
                    ? "bg-white shadow-xl shadow-gray-100 text-blue-600 border border-blue-50" 
                    : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{data[key].icon}</span>
                  {data[key].title}
                </button>
              ))}
              
              <div className="p-5 bg-blue-50 rounded-2xl mt-8">
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  Confidențialitatea dumneavoastră este prioritatea noastră. Acest document explică clar modul în care vă protejăm identitatea.
                </p>
              </div>
            </div>
          </aside>

          {/* CONTENT AREA */}
          <main className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {activeDoc.sections.map((sec, index) => (
                  <motion.section 
                    key={sec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="shrink-0">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                          {sec.icon}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-gray-900 mb-3">{sec.heading}</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                          {sec.body}
                        </p>
                      </div>
                    </div>
                  </motion.section>
                ))}

                {/* FOOTER INFO */}
                <footer className="mt-12 p-8 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                  <p className="text-sm text-gray-500 text-center italic">
                    Continuarea utilizării serviciilor noastre reprezintă acceptarea modului în care procesăm datele conform acestei politici.
                  </p>
                </footer>
              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>

      <style jsx global>{`
        @media print {
          .print\:hidden { display: none !important; }
          body { background: white; }
          .max-w-5xl { max-width: 100% !important; }
          .lg\:col-span-9 { width: 100% !important; }
          .rounded-\[2rem\] { border-radius: 0 !important; border: none !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}

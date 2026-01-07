"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaBalanceScale, FaRoad, FaFileContract, FaUserShield, 
  FaUniversity, FaPrint, FaChevronRight, FaExclamationTriangle 
} from "react-icons/fa";

export default function TransportLegalComponent() {
  const data = useMemo(() => ({
    transport: {
      title: "Cadrul Legal - Transport Alternativ",
      subtitle: "Reglementări privind serviciile de ridesharing și micromobilitate",
      icon: <FaBalanceScale />,
      sections: [
        { 
          id: "l1", 
          heading: "1. Legislație Generală", 
          icon: <FaFileContract className="text-indigo-600" />,
          body: "Activitatea este guvernată de OUG nr. 49/2019 (aprobată prin Legea nr. 204/2019) pentru transport alternativ și de OUG nr. 195/2002 (Codul Rutier) cu modificările recente privind trotinetele electrice și vehiculele ușoare." 
        },
        { 
          id: "l2", 
          heading: "2. Reguli de Circulație & Micromobilitate", 
          icon: <FaRoad className="text-slate-700" />,
          body: "Conform legislației actualizate în 2026, utilizatorii de trotinete electrice trebuie să utilizeze pistele de biciclete sau sectoarele de drum unde viteza maximă admisă este de 50 km/h. Este obligatorie respectarea semnalizării rutiere și a regulilor de prioritate." 
        },
        { 
          id: "l3", 
          heading: "3. Răspunderea Operatorului & Asigurări", 
          icon: <FaUserShield className="text-blue-600" />,
          body: "UCab deține autorizația tehnică de operator de platformă digitală. Toate cursele sunt acoperite de asigurări pentru pasageri și bagaje, conform cerințelor Autorității Rutiere Române (ARR)." 
        },
        { 
          id: "l4", 
          heading: "4. Monitorizare și Siguranță (GDPR)", 
          icon: <FaUserShield className="text-emerald-600" />,
          body: "Sistemele de monitorizare GPS sunt utilizate exclusiv pentru siguranța traficului și calculul corect al tarifelor, respectând normele europene de protecție a datelor personale." 
        },
        { 
          id: "l5", 
          heading: "5. Instituții și Contact Legal", 
          icon: <FaUniversity className="text-amber-600" />,
          body: "Pentru sesizări oficiale, utilizatorii se pot adresa ARR, ISCTR sau Poliției Rutiere. Pentru asistență juridică internă: legal@ucab.ro." 
        }
      ]
    }
  }), []);

  const [active, setActive] = useState("transport");
  const activeDoc = data[active];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* TOP STATUS BAR */}
        <div className="flex justify-between items-center mb-8 px-4 print:hidden">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 
            Document Oficial UCab 2026
          </div>
          <button 
            onClick={() => window.print()}
            className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-bold flex items-center gap-2"
          >
            <FaPrint /> Printează
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* NAVIGATION SIDEBAR */}
          <aside className="lg:w-1/4 print:hidden">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 sticky top-8">
              <h3 className="text-xs font-black text-slate-400 px-4 mb-4 uppercase tracking-tighter">Documentație</h3>
              <nav className="space-y-1">
                {Object.keys(data).map(key => (
                  <button
                    key={key}
                    onClick={() => setActive(key)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm font-bold transition-all ${
                      active === key 
                      ? "bg-slate-900 text-white shadow-lg" 
                      : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {data[key].icon} {data[key].title.split(' - ')[0]}
                    </span>
                    <FaChevronRight className={active === key ? "opacity-100" : "opacity-0"} />
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* CONTENT SECTION */}
          <main className="lg:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* HERO HEADER */}
                <header className="bg-slate-900 p-8 sm:p-12 text-white relative">
                  <div className="relative z-10">
                    <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
                      {activeDoc.title}
                    </h1>
                    <p className="text-slate-400 font-medium max-w-md">
                      {activeDoc.subtitle}
                    </p>
                  </div>
                  <FaBalanceScale className="absolute right-[-20px] bottom-[-20px] text-[15rem] opacity-5 -rotate-12" />
                </header>

                <div className="p-8 sm:p-12 space-y-10">
                  {activeDoc.sections.map((sec, index) => (
                    <motion.section 
                      key={sec.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="flex items-start gap-6">
                        <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center text-xl shrink-0 group-hover:bg-slate-100 transition-colors">
                          {sec.icon}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900 mb-3">{sec.heading}</h2>
                          <p className="text-slate-600 leading-relaxed text-lg italic sm:not-italic">
                            {sec.body}
                          </p>
                        </div>
                      </div>
                    </motion.section>
                  ))}

                  {/* LEGAL WARNING BOX */}
                  <div className="mt-12 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4 items-center">
                    <FaExclamationTriangle className="text-amber-500 text-2xl shrink-0" />
                    <p className="text-sm text-amber-900 font-medium leading-tight">
                      Atenție: 
                    </p>
                  </div>

                  <footer className="pt-10 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-xs font-bold text-slate-400">
                      ULTIMA REVIZIE: {new Date().toLocaleDateString('ro-RO')}
                    </div>
                    <div className="flex gap-4">
                       <span className="text-[10px] font-black text-slate-300">ARR LICENSED</span>
                       <span className="text-[10px] font-black text-slate-300">GDPR SECURE</span>
                    </div>
                  </footer>
                </div>
              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>

      <style jsx global>{`
        @media print {
          .print\:hidden { display: none !important; }
          body { background: white !important; }
          .max-w-5xl { max-width: 100% !important; margin: 0 !important; }
          .lg\:w-3\/4 { width: 100% !important; }
          .rounded-\[2\.5rem\] { border-radius: 0 !important; border: none !important; }
          header { background: #0f172a !important; color: white !important; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}

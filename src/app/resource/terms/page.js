"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaGavel, FaCookieBite, FaUndoAlt, FaEnvelope, 
  FaPrint, FaChevronRight, FaFileAlt 
} from "react-icons/fa";

export default function LegalComponent() {
  const data = useMemo(() => ({
    terms: {
      title: "Termeni și condiții",
      icon: <FaGavel />,
      sections: [
        { id: "intro", heading: "1. Introducere", body: "Acești termeni guvernează utilizarea site-ului și a serviciilor noastre de rideshare." },
        { id: "use", heading: "2. Utilizarea site-ului", body: "Este interzisă folosirea site-ului în scop ilegal sau fraudulos sub sancțiunea suspendării contului." }
      ]
    },
    cookies: {
      title: "Politica Cookies",
      icon: <FaCookieBite />,
      sections: [
        { id: "c1", heading: "Ce sunt cookies", body: "Cookies sunt fișiere salvate pentru îmbunătățirea experienței de navigare și personalizarea ofertelor." }
      ]
    },
    refunds: {
      title: "Politica de rambursări",
      icon: <FaUndoAlt />,
      sections: [
        { id: "r1", heading: "Rambursări", body: "Returnările pentru serviciile preplătite sunt acceptate în termen de 14 zile conform legislației în vigoare." }
      ]
    },
    contact: {
      title: "Contact",
      icon: <FaEnvelope />,
      sections: [
        { id: "ct1", heading: "Informații", body: "Ne puteți contacta la email: contact@ucab.ro sau la sediul nostru central." }
      ]
    }
  }), []);

  const [active, setActive] = useState("terms");
  const activeDoc = data[active];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Centru Legal</h1>
            <p className="text-slate-500 mt-2 font-medium">Documentație oficială și politici UCab</p>
          </div>
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-all font-bold text-sm print:hidden"
          >
            <FaPrint className="text-slate-400" /> Printează Documentul
          </button>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="w-full lg:w-1/3">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-4 shadow-sm sticky top-8 print:hidden">
              <h3 className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Documente disponibile</h3>
              <nav className="mt-4 space-y-2">
                {Object.keys(data).map(key => (
                  <button
                    key={key}
                    onClick={() => setActive(key)}
                    className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${
                      active === key 
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                      : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${active === key ? "text-blue-400" : "text-slate-400"}`}>
                        {data[key].icon}
                      </span>
                      <span className="font-bold text-sm">{data[key].title}</span>
                    </div>
                    <FaChevronRight className={`text-xs transition-transform ${active === key ? "rotate-90 lg:rotate-0" : "opacity-0"}`} />
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-slate-100 px-4">
                <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
                  <FaFileAlt /> Version 2026.1.1
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-white border border-slate-200 rounded-[2.5rem] p-8 sm:p-12 shadow-sm"
              >
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-100">
                  <h2 className="text-3xl font-bold text-slate-900">{activeDoc.title}</h2>
                  <div className="text-right">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Ultima actualizare</span>
                    <span className="text-sm font-bold text-slate-600">{new Date().toLocaleDateString('ro-RO')}</span>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  {activeDoc.sections.map(sec => (
                    <section key={sec.id} className="mb-10 last:mb-0">
                      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                        {sec.heading}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-lg">
                        {sec.body}
                      </p>
                    </section>
                  ))}
                </div>

                {/* DECORATIVE ELEMENT */}
                <div className="mt-16 pt-10 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-xs text-slate-400 italic">Prezentul document are valoare juridică și produce efecte de la data publicării.</p>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        UC
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>

      <style jsx global>{`
        @media print {
          .print\:hidden { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          .max-w-6xl { max-width: 100% !important; margin: 0 !important; }
          main { width: 100% !important; }
          .rounded-[2.5rem] { border-radius: 0 !important; border: none !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

export default function CookiesBanner() {
  const [show, setShow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const accepted = localStorage.getItem("ucab_cookies_preferences");
    if (!accepted) setShow(true);
  }, []);

  const savePreferences = (customPrefs = null) => {
    const prefs = customPrefs || preferences;
    localStorage.setItem("ucab_cookies_preferences", JSON.stringify(prefs));
    setShow(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    savePreferences({ necessary: true, analytics: true, marketing: true });
  };

  const rejectAll = () => {
    savePreferences({ necessary: true, analytics: false, marketing: false });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setShow(!show)}
        className="
          fixed bottom-6 left-6 z-50 
          bg-black text-white flex items-center justify-center 
          w-14 h-14 rounded-full shadow-xl 
          hover:bg-gray-800 transition
        "
        aria-label="Toggle Cookies Banner"
      >
        <Cookie className="w-6 h-6" />
      </button>

      {/* BANNER */}
      <AnimatePresence>
        {show && !showSettings && (
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="
              fixed bottom-24 left-1/2 transform -translate-x-1/2 
              z-50 
              w-[95%] sm:w-[90%] md:w-[600px] lg:w-[700px] 
              bg-white text-black 
              rounded-2xl shadow-2xl 
              p-4 sm:p-6 md:p-8 border border-gray-200
              flex flex-col gap-4
            "
          >
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-center md:text-left">
              UCab utilizează cookies pentru performanță și personalizare 🍪
            </h3>

            <p className="text-gray-700 text-sm sm:text-base text-center md:text-left">
              Folosim module cookies și tehnologii similare pentru a asigura
              funcționarea corectă a platformei, pentru a optimiza performanța,
              analiza traficul și comportamentul utilizatorilor, precum și pentru a
              oferi o experiență personalizată și sigură. Ne angajăm să protejăm
              confidențialitatea datelor tale și îți oferim control complet asupra
              tipurilor de cookies utilizate.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 justify-center md:justify-end">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 rounded-lg border border-gray-500 text-black hover:bg-gray-100 transition text-sm flex-1 sm:flex-none"
              >
                Gestionare preferințe
              </button>

              <button
                onClick={rejectAll}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-black transition text-sm flex-1 sm:flex-none"
              >
                Refuz toate modulele opționale
              </button>

              <button
                onClick={acceptAll}
                className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 transition text-sm flex-1 sm:flex-none"
              >
                Accept toate modulele cookie
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-500 text-center sm:text-left">
              <a
                href="/politica-de-cookies"
                className="underline hover:text-gray-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                Citește politica de cookies
              </a>{" "}
              | UCab.ro © {new Date().getFullYear()} — Toate drepturile rezervate.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SETTINGS PANEL */}
      <AnimatePresence>
        {show && showSettings && (
          <motion.div
            initial={{ y: 150, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 150, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="
              fixed bottom-24 left-1/2 transform -translate-x-1/2 
              z-50 
              w-[95%] sm:w-[90%] md:w-[600px] lg:w-[700px] 
              bg-white text-black 
              rounded-2xl shadow-2xl 
              p-4 sm:p-6 md:p-8 border border-gray-200
              flex flex-col gap-4
            "
          >
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-center md:text-left">
              Gestionare preferințe cookies 🍪
            </h3>

            <div className="space-y-4">

              {/* Necessary */}
              <div className="p-3 rounded-lg border border-gray-300 bg-gray-100">
                <strong>Necesare</strong>
                <p className="text-sm text-gray-600 mt-1">
                  Aceste module sunt esențiale pentru funcționarea corectă,
                  siguranța sesiunilor, autentificare și navigare. Ele nu pot
                  fi dezactivate, deoarece permit operarea serviciilor de bază
                  ale platformei.
                </p>
              </div>

              {/* Analytics */}
              <div className="p-3 rounded-lg border border-gray-300 flex justify-between items-center">
                <div>
                  <strong>Analytics</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    Ne permit să colectăm date anonime despre utilizarea website-ului
                    pentru a îmbunătăți performanța și a optimiza experiența.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="scale-125 accent-black ml-2"
                />
              </div>

              {/* Marketing */}
              <div className="p-3 rounded-lg border border-gray-300 flex justify-between items-center">
                <div>
                  <strong>Marketing</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    Aceste cookies pot fi folosite pentru personalizarea conținutului,
                    publicitate relevantă și analizarea eficienței campaniilor.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences({ ...preferences, marketing: e.target.checked })
                  }
                  className="scale-125 accent-black ml-2"
                />
              </div>

            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 rounded-lg border border-gray-500 text-black hover:bg-gray-100 transition text-sm flex-1 sm:flex-none"
              >
                Înapoi la banner
              </button>

              <button
                onClick={() => savePreferences()}
                className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 transition text-sm flex-1 sm:flex-none"
              >
                Salvează setările
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-500 text-center sm:text-left">
              <a
                href="/resource/policy/"
                className="underline hover:text-gray-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                Politica de cookies
              </a>{" "}
              | UCab.ro © {new Date().getFullYear()} — Confidențialitate & Cookies
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

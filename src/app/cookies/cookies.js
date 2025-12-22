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
              w-[90%] sm:max-w-lg md:max-w-xl
              bg-white text-black 
              rounded-2xl shadow-2xl 
              p-6 border border-gray-200
            "
          >
            <h3 className="text-xl font-bold mb-2">
              UCab utilizează cookies pentru performanță și personalizare 🍪
            </h3>

            <p className="text-gray-700 text-sm mb-4">
              Folosim module cookies și tehnologii similare pentru a asigura
              funcționarea corectă a platformei, pentru a optimiza performanța,
              analiza traficul și comportamentul utilizatorilor, precum și pentru a
              oferi o experiență personalizată și sigură. Ne angajăm să protejăm
              confidențialitatea datelor tale și îți oferim control complet asupra
              tipurilor de cookies utilizate.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 rounded-lg border border-gray-500 text-black hover:bg-gray-100 transition text-sm"
              >
                Gestionare preferințe
              </button>

              <button
                onClick={rejectAll}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-black transition text-sm"
              >
                Refuz toate modulele opționale
              </button>

              <button
                onClick={acceptAll}
                className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 transition text-sm"
              >
                Accept toate modulele cookie
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-500 text-center">
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
              w-[90%] sm:max-w-lg md:max-w-xl
              bg-white text-black 
              rounded-2xl shadow-2xl 
              p-6 border border-gray-200
            "
          >
            <h3 className="text-xl font-bold mb-4">Gestionare preferințe cookies 🍪</h3>

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
              <div className="p-3 rounded-lg border border-gray-300">
                <div className="flex justify-between items-center">
                  <strong>Analytics</strong>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences({ ...preferences, analytics: e.target.checked })
                    }
                    className="scale-125 accent-black"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Ne permit să colectăm date anonime despre utilizarea website-ului
                  pentru a îmbunătăți performanța și a optimiza experiența.
                </p>
              </div>

              {/* Marketing */}
              <div className="p-3 rounded-lg border border-gray-300">
                <div className="flex justify-between items-center">
                  <strong>Marketing</strong>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) =>
                      setPreferences({ ...preferences, marketing: e.target.checked })
                    }
                    className="scale-125 accent-black"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Aceste cookies pot fi folosite pentru personalizarea conținutului,
                  publicitate relevantă și analizarea eficienței campaniilor.
                </p>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 rounded-lg border border-gray-500 text-black hover:bg-gray-100 transition text-sm"
              >
                Înapoi la banner
              </button>

              <button
                onClick={() => savePreferences()}
                className="px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-900 transition text-sm"
              >
                Salvează setările
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-500 text-center">
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

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react"; // icon cookie

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
      >
        <Cookie className="w-6 h-6" />
      </button>

      {/* BANNER */}
      <AnimatePresence>
        {show && !showSettings && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="
              fixed bottom-24 left-6 
              z-50 
              max-w-md w-[90%]
              bg-white text-black 
              rounded-2xl shadow-2xl 
              p-6 border border-gray-200
            "
          >
            <h3 className="text-xl font-bold mb-2">UCab folosește cookies 🍪</h3>
            <p className="text-gray-700 text-sm mb-4">
              Folosim cookies pentru funcționare, analiză și îmbunătățirea experienței.
              Poți accepta tot sau alege preferințele tale.
            </p>

            <div className="flex flex-col md:flex-row gap-2 justify-end">
              <button
                onClick={() => setShowSettings(true)}
                className="px-3 py-2 rounded-lg border border-gray-500 text-black hover:bg-gray-100 transition text-sm"
              >
                Setări
              </button>

              <button
                onClick={rejectAll}
                className="px-3 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-black transition text-sm"
              >
                Refuză tot
              </button>

              <button
                onClick={acceptAll}
                className="px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-900 transition text-sm"
              >
                Acceptă tot
              </button>
            </div>

            {/* Copyright */}
            <p className="mt-4 text-xs text-gray-500 text-center">
              UCab.ro © {new Date().getFullYear()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SETTINGS PANEL */}
      <AnimatePresence>
        {show && showSettings && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="
              fixed bottom-24 left-6 
              z-50 
              max-w-md w-[90%]
              bg-white text-black 
              rounded-2xl shadow-2xl 
              p-6 border border-gray-200
            "
          >
            <h3 className="text-xl font-bold mb-4">Setări cookies 🍪</h3>
            <div className="space-y-4">

              {/* Necessary */}
              <div className="flex justify-between items-center p-3 rounded-lg border border-gray-300 bg-gray-100">
                <span>Necesare</span>
                <span className="text-green-600 font-semibold text-sm">Activ</span>
              </div>

              {/* Analytics */}
              <div className="flex justify-between items-center p-3 rounded-lg border border-gray-300">
                <span>Analytics</span>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="scale-125 accent-black"
                />
              </div>

              {/* Marketing */}
              <div className="flex justify-between items-center p-3 rounded-lg border border-gray-300">
                <span>Marketing</span>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences({ ...preferences, marketing: e.target.checked })
                  }
                  className="scale-125 accent-black"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowSettings(false)}
                className="px-3 py-2 rounded-lg border border-gray-500 text-black hover:bg-gray-100 transition text-sm"
              >
                Înapoi
              </button>

              <button
                onClick={() => savePreferences()}
                className="px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-900 transition text-sm"
              >
                Salvează
              </button>
            </div>

            {/* Copyright */}
            <p className="mt-4 text-xs text-gray-500 text-center">
              UCab.ro © {new Date().getFullYear()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

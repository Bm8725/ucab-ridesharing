"use client";

import { useState, useEffect, useRef } from "react";
import { FaComments, FaPhoneAlt, FaEnvelope, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function CorporateContactCenter() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null); // 'chat', 'contact', 'form'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // 'success', 'error'

  const primary = "#0A4EC4";

  // Handle chat message
  const handleSend = () => {
    if (!input.trim()) return;
    const user = input;
    setInput("");
    setMessages((p) => [...p, { type: "user", text: user }]);
    setTimeout(() => {
      setMessages((p) => [...p, { type: "bot", text: "Mulțumim! Echipa va reveni curând." }]);
    }, 500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Submit form
  const submitForm = async () => {
    setLoading(true);
    setFormStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else setFormStatus("error");
    } catch (e) {
      setFormStatus("error");
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed top-1/2 right-3 -translate-y-1/2 bg-white/80 backdrop-blur-xl text-blue-700 px-3 py-3 shadow-xl rounded-xl cursor-pointer flex flex-col items-center z-[9999] hover:bg-white/90 transition border border-white/40"
      >
        <FaComments size={20} />
      </motion.div>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: open ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 80, damping: 22 }}
        className="fixed top-0 right-0 h-screen w-full max-w-[420px] bg-white/90 backdrop-blur-2xl shadow-2xl z-[10000] flex flex-col border-l border-white/40"
      >
        {/* Header */}
        <div
          className="w-full px-5 py-4 text-white font-semibold flex justify-between items-center"
          style={{ background: `linear-gradient(90deg, ${primary}, #6aa8ff)` }}
        >
          <div className="text-lg flex items-center gap-2">
            <img src="/ucabro.png" className="h-7" /> Contact
          </div>
          <button onClick={() => setOpen(false)} className="text-2xl">×</button>
        </div>

        {/* Menu */}
        {!view && (
          <motion.div className="p-5 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView("chat")}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-blue-50 text-blue-700 font-semibold shadow hover:bg-blue-100 transition"
            >
              <FaComments /> Chat rapid
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView("contact")}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-blue-50 text-blue-700 font-semibold shadow hover:bg-blue-100 transition"
            >
              <FaPhoneAlt /> Sună-ne
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView("form")}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-blue-50 text-blue-700 font-semibold shadow hover:bg-blue-100 transition"
            >
              <FaEnvelope /> Lasă-ne un mesaj
            </motion.button>
          </motion.div>
        )}

        {/* Contact Info */}
        {view === "contact" && (
          <motion.div className="p-5 space-y-4 text-blue-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-xl font-bold">Contact direct</div>
            <div className="font-medium">Comercial: +40 700 111 222</div>
            <div className="font-medium">Tehnic: +40 700 555 666</div>
            <button onClick={() => setView(null)} className="text-blue-600 underline mt-3">← Înapoi</button>
          </motion.div>
        )}

        {/* Chat */}
        {view === "chat" && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[80%] p-3 rounded-xl text-sm shadow backdrop-blur-xl ${
                    m.type === "user" ? "ml-auto bg-blue-100/80" : "mr-auto bg-gray-100/70"
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Input */}
            <div className="p-3 flex gap-2 border-t bg-white/70 backdrop-blur-xl">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Scrie un mesaj..."
                className="flex-1 p-2 rounded-lg border border-blue-400 bg-white/60 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Trimite
              </motion.button>
            </div>

            <button onClick={() => setView(null)} className="text-blue-600 underline p-3">← Înapoi</button>
          </div>
        )}

        {/* Form */}
        {view === "form" && (
          <motion.div className="p-5 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-xl font-bold text-blue-700">Lasă-ne un mesaj</div>

            <div className="flex flex-col gap-3">
              <input
                className="w-full p-3 border rounded-lg bg-white/60 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nume"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                className="w-full p-3 border rounded-lg bg-white/60 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <textarea
                className="w-full p-3 border rounded-lg h-32 bg-white/60 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mesajul tău..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>

            <AnimatePresence>
              {formStatus === "success" && (
                <motion.div
                  className="flex items-center gap-2 text-green-600 font-semibold"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <FaCheckCircle /> Mesaj trimis cu succes!
                </motion.div>
              )}
              {formStatus === "error" && (
                <motion.div
                  className="flex items-center gap-2 text-red-600 font-semibold"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                >
                  <FaTimesCircle /> Eroare la trimitere!
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              onClick={submitForm}
              className="w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition"
            >
              {loading ? "Se trimite..." : "Trimite mesajul"}
            </motion.button>

            <button onClick={() => setView(null)} className="text-blue-600 underline">← Înapoi</button>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}

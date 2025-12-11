"use client";

import { useState, useEffect, useRef } from "react";
import { FaComments, FaPhoneAlt, FaEnvelope, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null); // "chat", "contact", "form"
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [botTyping, setBotTyping] = useState(false);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  const [unread, setUnread] = useState(0); // counter for unread messages

  const primary = "#0A4EC4";

  const handleSend = () => {
    if (!input.trim()) return;
    const user = input;
    setInput("");
    setMessages((p) => [...p, { type: "user", text: user }]);
    setBotTyping(true);

    setTimeout(() => {
      setMessages((p) => [...p, { type: "bot", text: "Mulțumim! Echipa va reveni curând." }]);
      setBotTyping(false);
      if (!open) setUnread((u) => u + 1); // increase unread if panel closed
    }, 800);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, botTyping]);

  const submitForm = async () => {
    setLoading(true);
    setFormStatus(null);
    try {
      const res = await fetch("https://api.doxer.ro/api/contact_request.php", {
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

  const togglePanel = () => {
    setOpen((o) => !o);
    if (!open) setUnread(0); // reset unread when opening
  };

  return (
    <>
      {/* Floating Button Bottom Right */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePanel}
        className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-4 shadow-2xl rounded-full cursor-pointer flex items-center justify-center z-[9999] hover:bg-blue-700 transition"
      >
        <FaComments size={22} />
        {/* Unread badge */}
        {unread > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full shadow"
          >
            {unread}
          </motion.div>
        )}
      </motion.div>

      {/* Floating Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-20 right-5 w-[350px] bg-white/95 backdrop-blur-2xl shadow-2xl rounded-xl z-[10000] flex flex-col border border-white/30 overflow-hidden"
          >
            {/* Menu */}
            {!view && (
              <motion.div className="p-4 space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {[
                  { label: "Chat rapid", icon: <FaComments />, v: "chat" },
               
                  { label: "Lasă-ne un mesaj", icon: <FaEnvelope />, v: "form" }
                ].map((btn, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setView(btn.v)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-700 font-semibold shadow hover:bg-blue-100 transition"
                  >
                    {btn.icon} {btn.label}
                  </motion.button>
                ))}
              </motion.div>
            )}


            {/* Chat */}
            {view === "chat" && (
              <motion.div className="flex flex-col h-[300px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`max-w-[80%] p-2 rounded-xl text-sm shadow-lg backdrop-blur-xl ${
                        m.type === "user" ? "ml-auto bg-blue-100/80" : "mr-auto bg-gray-100/70"
                      }`}
                    >
                      {m.text}
                    </motion.div>
                  ))}
                  {botTyping && (
                    <motion.div className="flex items-center gap-1 p-2 bg-gray-200/70 rounded-xl ml-2 text-gray-600 text-sm animate-pulse">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300" />
                      Bot tastează...
                    </motion.div>
                  )}
                  <div ref={messagesEndRef}></div>
                </div>

                <div className="p-2 flex gap-2 border-t bg-white/70 backdrop-blur-xl">
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

                <button onClick={() => setView(null)} className="text-blue-600 underline p-2">← Înapoi</button>
              </motion.div>
            )}

            {/* Form */}
            {view === "form" && (
              <motion.div className="p-4 space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-lg font-bold text-blue-700">Lasă-ne un mesaj</div>

                <input
                  type="text"
                  placeholder="Nume"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-white/60 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border rounded-lg bg-white/60 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Mesajul tău..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-2 border rounded-lg h-24 bg-white/60 backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>

                <AnimatePresence>
                  {formStatus === "success" && (
                    <motion.div className="flex items-center gap-2 text-green-600 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <FaCheckCircle /> Mesaj trimis cu succes!
                    </motion.div>
                  )}
                  {formStatus === "error" && (
                    <motion.div className="flex items-center gap-2 text-red-600 font-semibold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <FaTimesCircle /> Eroare la trimitere!
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  onClick={submitForm}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition"
                >
                  {loading ? "Se trimite..." : "Trimite mesajul"}
                </motion.button>

                <button onClick={() => setView(null)} className="text-blue-600 underline">← Înapoi</button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

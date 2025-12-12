"use client";

import { useState, useEffect, useRef } from "react";
import { FaComments, FaEnvelope, FaCheckCircle, FaTimesCircle, FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = {
  primary: "#0A4EC4",
  gradient: "linear-gradient(135deg, #6a0dad, #9b30ff)",
  panelBg: "rgba(255,255,255,0.95)",
  glass: "rgba(255,255,255,0.6)",
  border: "rgba(0,0,0,0.1)",
};

const TEXT = {
  ro: { chat: "Chat rapid", messageUs: "Lasă-ne un mesaj", send: "Trimite", placeholder: "Scrie un mesaj...", sending: "Se trimite...", success: "Mesaj trimis cu succes!", error: "Eroare la trimitere!" },
  en: { chat: "Quick Chat", messageUs: "Send us a message", send: "Send", placeholder: "Type a message...", sending: "Sending...", success: "Message sent successfully!", error: "Error sending message!" },
};

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null); // chat | form | null
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [language, setLanguage] = useState("ro");
  const t = TEXT[language];
  const messagesEndRef = useRef(null);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, botTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages((p) => [...p, { type: "user", text: userMsg }]);
    setBotTyping(true);
    setTimeout(() => {
      setMessages((p) => [...p, { type: "bot", text: language === "ro" ? "Mulțumim! Echipa va reveni curând." : "Thank you! We will get back soon." }]);
      setBotTyping(false);
      if (!open) setUnread((u) => u + 1);
    }, 800);
  };

  const submitForm = async () => {
    setLoading(true);
    setFormStatus(null);
    try {
      const res = await fetch("https://api.doxer.ro/api/contact_request.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormStatus(res.ok ? "success" : "error");
      if (res.ok) setFormData({ name: "", email: "", message: "" });
    } catch {
      setFormStatus("error");
    }
    setLoading(false);
  };

  const togglePanel = () => { setOpen((o) => !o); if (!open) setUnread(0); };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(10,78,196,0.5)" }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePanel}
        className="fixed bottom-6 right-6 z-[9999] p-4 rounded-full flex items-center justify-center cursor-pointer"
        style={{ background: COLORS.gradient, color: "white" }}
      >
        <FaComments size={22} />
        {unread > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white bg-red-500 shadow-lg">
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
            className="fixed bottom-24 right-4 w-[90%] max-w-[360px] sm:w-[360px] rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden z-[10000]"
            style={{ background: COLORS.panelBg }}
          >
            {/* Header */}
            {view && (
              <div className="flex justify-between items-center p-4 rounded-t-3xl text-white font-semibold" style={{ background: COLORS.gradient }}>
                <div className="flex items-center gap-3">
                  <FaUserCircle size={24} />
                  <span className="text-lg font-semibold">{view === "chat" ? t.chat : t.messageUs}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setLanguage(language === "ro" ? "en" : "ro")} className="px-3 py-1 rounded-xl bg-white/30 text-white font-medium shadow">{language === "ro" ? "EN" : "RO"}</button>
                  <button onClick={() => setView(null)} className="px-2 py-1 rounded-xl bg-white/30 text-white font-medium shadow">X</button>
                </div>
              </div>
            )}

            {/* Menu */}
            {!view && (
              <motion.div className="p-6 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {[{ label: t.chat, icon: <FaComments />, v: "chat" }, { label: t.messageUs, icon: <FaEnvelope />, v: "form" }].map((b, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setView(b.v)}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl font-medium shadow-sm backdrop-blur-xl"
                    style={{ background: COLORS.glass, color: COLORS.primary }}
                  >
                    {b.icon} {b.label}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Chat View */}
            {view === "chat" && (
              <div className="flex flex-col h-[60vh] sm:h-[380px]">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((m, i) => (
                    <div key={i} className={`max-w-[80%] p-3 rounded-2xl ${m.type === "user" ? "ml-auto bg-[#e8f0fe]" : "mr-auto bg-white/70 border border-gray-200"}`}>{m.text}</div>
                  ))}
                  {botTyping && (
                    <div className="flex items-center gap-2 p-2 bg-white/70 rounded-2xl border text-gray-600 text-sm ml-1 animate-pulse">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150" />
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-300" />
                      {language === "ro" ? "Bot tastează..." : "Bot is typing..."}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-3 flex gap-2 border-t backdrop-blur-xl rounded-b-2xl">
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder={t.placeholder} className="flex-1 p-3 rounded-2xl border focus:outline-none focus:ring-2 bg-white/70" />
                  <button onClick={handleSend} className="px-4 py-2 rounded-2xl text-white font-semibold shadow-lg" style={{ background: COLORS.primary }}>{t.send}</button>
                </div>
              </div>
            )}

            {/* Form View */}
            {view === "form" && (
              <div className="p-6 space-y-4">
                <div className="text-xl font-bold" style={{ color: COLORS.primary }}>{t.messageUs}</div>
                <input type="text" placeholder="Nume" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 rounded-2xl border bg-white/70 backdrop-blur-md focus:outline-none focus:ring-2 shadow-sm" />
                <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 rounded-2xl border bg-white/70 backdrop-blur-md focus:outline-none focus:ring-2 shadow-sm" />
                <textarea placeholder={language === "ro" ? "Mesajul tău" : "Your message"} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full p-3 rounded-2xl border bg-white/70 backdrop-blur-md focus:outline-none focus:ring-2 shadow-sm h-28 resize-none" />
                <button onClick={submitForm} disabled={loading} className="w-full py-3 rounded-2xl text-white font-semibold shadow-lg bg-gradient-to-r from-purple-500 to-pink-500">{loading ? t.sending : t.send}</button>
                {formStatus === "success" && <div className="flex items-center gap-2 text-green-600 text-sm animate-pulse"><FaCheckCircle /> {t.success}</div>}
                {formStatus === "error" && <div className="flex items-center gap-2 text-red-600 text-sm animate-pulse"><FaTimesCircle /> {t.error}</div>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

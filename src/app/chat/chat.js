"use client";

import { useState, useEffect, useRef } from "react";
import { FaComments, FaEnvelope, FaCheckCircle, FaTimesCircle, FaUserCircle, FaGlobe } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = {
  primary: "#0A4EC4",
  gradient: "linear-gradient(135deg, #6a0dad, #9b30ff)",
  panelBg: "rgba(255,255,255,0.95)",
  glass: "rgba(255,255,255,0.6)",
  border: "rgba(0,0,0,0.1)",
};

const TEXT = {
  ro: { chat: "Chat rapid", messageUs: "Lasă-ne un mesaj", placeholder: "Scrie un mesaj...", send: "Trimite", formTitle: "Lasă-ne un mesaj", name: "Nume", email: "Email", message: "Mesajul tău", sending: "Se trimite...", sendMessage: "Trimite mesajul", success: "Mesaj trimis cu succes!", error: "Eroare la trimitere!", botReply: "Mulțumim! Echipa va reveni curând."},
  en: { chat: "Quick Chat", messageUs: "Send us a message", placeholder: "Type a message...", send: "Send", formTitle: "Send us a message", name: "Name", email: "Email", message: "Your message", sending: "Sending...", sendMessage: "Send message", success: "Message sent successfully!", error: "Error sending message!", botReply: "Thank you! We'll get back soon." },
};

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null);
  const [language, setLanguage] = useState("ro");
  const t = TEXT[language];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, botTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { type: "user", text: input }]);
    setInput("");
    setBotTyping(true);
    setTimeout(() => {
      setMessages(p => [...p, { type: "bot", text: t.botReply }]);
      setBotTyping(false);
      if (!open) setUnread(u => u + 1);
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

  const togglePanel = () => { setOpen(o => !o); if (!open) { setUnread(0); setView(null); } };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePanel}
        className="fixed bottom-6 right-6 z-[9999] p-4 rounded-full shadow-xl flex items-center justify-center cursor-pointer"
        style={{ background: COLORS.primary, color: "white" }}
      >
        <FaComments size={22} />
        {unread > 0 && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white bg-red-500 shadow">
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
            className="fixed bottom-24 right-4 w-[90%] max-w-[380px] sm:w-[380px] sm:bottom-24 sm:right-2 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden z-[10000] border"
            style={{ background: COLORS.panelBg, borderColor: COLORS.border }}
          >
            {/* Header */}
            {view && (
              <div className="flex justify-between items-center p-4 rounded-t-3xl text-white font-light" style={{ background: COLORS.gradient, minHeight: '70px' }}>
                <div className="flex items-center gap-2 text-sm sm:text-lg">
                  <FaUserCircle size={20} /> <span className="truncate">{view === "chat" ? t.chat : t.messageUs}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setLanguage(language === "ro" ? "en" : "ro")} className="px-2 py-1 rounded-xl bg-white/30 text-white font-medium flex items-center gap-1 text-xs sm:text-sm">
                    <FaGlobe /> {language === "ro" ? "EN" : "RO"}
                  </button>
                  <button onClick={() => setView(null)} className="px-2 py-1 rounded-xl bg-white/30 text-white font-medium text-xs sm:text-sm">X</button>
                </div>
              </div>
            )}

            {/* Menu */}
            {!view && (
              <motion.div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {[{ label: t.chat, icon: <FaComments />, v: "chat" }, { label: t.messageUs, icon: <FaEnvelope />, v: "form" }].map((b, i) => (
                  <motion.button key={i} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setView(b.v)} className="w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl font-medium shadow-sm backdrop-blur-xl border text-sm sm:text-base" style={{ background: COLORS.glass, borderColor: COLORS.border, color: COLORS.primary }}>
                    {b.icon} {b.label}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Chat View */}
            {view === "chat" && (
              <div className="flex flex-col h-[50vh] sm:h-[380px]">
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
                  {messages.map((m, i) => (
                    <div key={i} className={`max-w-[80%] p-2 sm:p-3 rounded-2xl ${m.type === "user" ? "ml-auto bg-[#e8f0fe]" : "mr-auto bg-white/70 border border-gray-200"} text-sm sm:text-base`}>{m.text}</div>
                  ))}
                  {botTyping && (
                    <div className="flex items-center gap-1 sm:gap-2 p-2 bg-white/70 rounded-2xl border text-gray-600 text-xs sm:text-sm ml-1 animate-pulse">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150" />
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-300" />
                      Bot tastează...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-2 sm:p-3 flex gap-2 border-t backdrop-blur-xl" style={{ borderColor: COLORS.border }}>
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder={t.placeholder} className="flex-1 p-2 sm:p-3 rounded-xl border focus:outline-none focus:ring-2 bg-white/70 text-xs sm:text-sm" style={{ borderColor: COLORS.border }} />
                  <button onClick={handleSend} className="px-3 sm:px-4 py-2 rounded-xl text-white text-xs sm:text-sm" style={{ background: COLORS.primary }}>{t.send}</button>
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 p-1 sm:p-2 text-center">© 2025 UCAB.ro</div>
              </div>
            )}

            {/* Form View */}
            {view === "form" && (
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 h-full sm:h-[380px] overflow-auto">
                <div className="text-base sm:text-xl font-light" style={{ color: COLORS.primary }}>{t.formTitle}</div>
                <input type="text" placeholder={t.name} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 sm:p-3 rounded-xl border bg-white/70 focus:outline-none focus:ring-2 text-xs sm:text-sm" style={{ borderColor: COLORS.border }} />
                <input type="email" placeholder={t.email} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 sm:p-3 rounded-xl border bg-white/70 focus:outline-none focus:ring-2 text-xs sm:text-sm" style={{ borderColor: COLORS.border }} />
                <textarea placeholder={t.message} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full p-2 sm:p-3 rounded-xl border bg-white/70 focus:outline-none focus:ring-2 h-20 sm:h-28 resize-none text-xs sm:text-sm" style={{ borderColor: COLORS.border }} />
                <button onClick={submitForm} disabled={loading} className="w-full py-2 sm:py-3 rounded-xl text-white font-medium shadow text-sm sm:text-base" style={{ backgroundColor: COLORS.primary, opacity: loading ? 0.6 : 1 }}>{loading ? t.sending : t.sendMessage}</button>
                {formStatus === "success" && <div className="flex items-center gap-1 sm:gap-2 text-green-600 text-xs sm:text-sm p-1 sm:p-2"> <FaCheckCircle /> {t.success}</div>}
                {formStatus === "error" && <div className="flex items-center gap-1 sm:gap-2 text-red-600 text-xs sm:text-sm p-1 sm:p-2"> <FaTimesCircle /> {t.error}</div>}
                <div className="text-[10px] sm:text-xs text-gray-400 text-center">© 2025 UCAB.ro</div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
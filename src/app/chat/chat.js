"use client";

import { useState, useEffect, useRef } from "react";
import { FaComments, FaEnvelope, FaUser, FaGlobe, FaCheck, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const TEXT = {
  ro: { chat: "Chat rapid", messageUs: "Lasă-ne un mesaj", placeholder: "Scrie un mesaj...", send: "Trimite", formTitle: "Lasă-ne un mesaj", name: "Nume", email: "Email", message: "Mesajul tău", sending: "Se trimite...", sendMessage: "Trimite mesajul", success: "Mesaj trimis cu succes!", error: "Eroare la trimitere!", botReply: "Mulțumim! Echipa va reveni curând.", selectOperator: "Selectează operatorul"},
  en: { chat: "Quick Chat", messageUs: "Send us a message", placeholder: "Type a message...", send: "Send", formTitle: "Send us a message", name: "Name", email: "Email", message: "Your message", sending: "Sending...", sendMessage: "Send message", success: "Message sent successfully!", error: "Error sending message!", botReply: "Thank you! We'll get back soon.", selectOperator: "Select operator" },
};

const OPERATORS = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" }
];

export default function CorporateChat() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null);
  const [language, setLanguage] = useState("ro");
  const t = TEXT[language];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, botTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { type: "user", text: input, operator: selectedOperator?.name || null }]);
    setInput("");
    setBotTyping(true);
    setTimeout(() => {
      setMessages(p => [...p, { type: "bot", text: t.botReply }]);
      setBotTyping(false);
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

  const closeView = () => {
    if (view) {
      setView(null);
    } else {
      setOpen(false);
      setSelectedOperator(null);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[9999] p-4 rounded-full shadow-xl bg-black text-white cursor-pointer flex items-center justify-center"
      >
        <FaComments size={22} />
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-0 right-0 w-full h-full sm:bottom-6 sm:right-6 sm:w-[400px] sm:h-[600px] bg-white border border-black shadow-2xl z-[10000] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-black">
              <div className="flex items-center gap-2 font-bold text-lg">
                <FaUser /> {view === 'form' ? t.messageUs : t.chat}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setLanguage(language === "ro" ? "en" : "ro")} className="px-2 py-1 border border-black rounded">
                  <FaGlobe /> {language === "ro" ? "EN" : "RO"}
                </button>
                <button onClick={closeView} className="px-2 py-1 border border-black rounded">
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Operator selection */}
            {!view && (
              <div className="p-4 flex flex-col gap-3">
                <div className="font-semibold">{t.selectOperator}:</div>
                {OPERATORS.map(op => (
                  <button key={op.id} onClick={() => { setSelectedOperator(op); setView('chat'); }} className="p-2 border border-black rounded hover:bg-black hover:text-white">
                    {op.name}
                  </button>
                ))}
                <button onClick={() => setView('form')} className="p-2 border border-black rounded hover:bg-black hover:text-white flex items-center gap-2">
                  <FaEnvelope /> {t.messageUs}
                </button>
              </div>
            )}

            {/* Chat View */}
            {view === 'chat' && (
              <div className="flex-1 flex flex-col p-4 gap-2 overflow-y-auto">
                {messages.map((m, i) => (
                  <div key={i} className={`p-3 border ${m.type === 'user' ? 'self-end bg-black text-white' : 'self-start bg-white border-black'}`}>{m.text}</div>
                ))}
                {botTyping && <div className="italic text-gray-600">Bot tastează...</div>}
                <div ref={messagesEndRef} />
                <div className="flex gap-2 mt-auto">
                  <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder={t.placeholder} className="flex-1 border border-black p-2" />
                  <button onClick={handleSend} className="px-4 py-2 border border-black bg-black text-white">{t.send}</button>
                </div>
              </div>
            )}

            {/* Form View */}
            {view === 'form' && (
              <div className="flex-1 flex flex-col p-4 gap-3 overflow-auto">
                <div className="font-bold text-lg">{t.formTitle}</div>
                <input type="text" placeholder={t.name} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="border border-black p-2" />
                <input type="email" placeholder={t.email} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="border border-black p-2" />
                <textarea placeholder={t.message} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="border border-black p-2 h-32 resize-none" />
                <button onClick={submitForm} disabled={loading} className="p-3 border border-black bg-black text-white mt-2">{loading ? t.sending : t.sendMessage}</button>
                {formStatus === 'success' && <div className="text-green-600 flex items-center gap-2"><FaCheck /> {t.success}</div>}
                {formStatus === 'error' && <div className="text-red-600 flex items-center gap-2"><FaTimes /> {t.error}</div>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

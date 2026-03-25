"use client";

import { useState, useEffect, useRef } from "react";
import { FaComments, FaEnvelope, FaUser, FaGlobe, FaCheck, FaTimes, FaQuestion, FaPaperPlane } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const TEXT = {
  ro: { chat: "Suport UCab.ro", messageUs: "Lasă-ne un mesaj", placeholder: "Scrie un mesaj...", send: "Trimite", formTitle: "Contactează-ne", name: "Nume", email: "Email", message: "Mesajul tău", sending: "Se trimite...", sendMessage: "Trimite mesaj", success: "Trimis cu succes!", error: "Eroare la trimitere!", botReply: "Mulțumim! 😘 Te rugăm să lași un mesaj la secțiunea 'Lasă-ne un mesaj'. Acesta este un mesaj generat automat. www.ucab.ro", selectOperator: "Alege un operator"},
  en: { chat: "UCab Support", messageUs: "Message us", placeholder: "Type here...", send: "Send", formTitle: "Contact us", name: "Name", email: "Email", message: "Your message", sending: "Sending...", sendMessage: "Send message", success: "Sent successfully!", error: "Error sending!", botReply: "Thank you! 😘 Please leave a message in the 'Message us' section. This is an automated message. www.ucab.ro", selectOperator: "Select operator" }
};

const OPERATORS = [
  { id: 1, name: "Alice", online: false },
  { id: 2, name: "Bob", online: false },
  { id: 3, name: "Michael", online: false }
];

export default function CorporateChat() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null);
  const [language, setLanguage] = useState("ro");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [operatorStatus, setOperatorStatus] = useState(OPERATORS);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  const t = TEXT[language];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, botTyping]);

  useEffect(() => {
    wsRef.current = new WebSocket("wss://chat.doxer.ro/ws");
    wsRef.current.onopen = () => console.log("WebSocket connected");
    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.operatorStatus) {
          setOperatorStatus(prev =>
            prev.map(op => ({
              ...op,
              online: data.operatorStatus.find(s => s.id === op.id)?.online ?? op.online
            }))
          );
        }
        if (data.message) {
          setMessages(prev => [...prev, { type: 'operator', text: data.message }]);
        }
      } catch (err) { console.error("WS message error:", err); }
    };
    return () => wsRef.current?.close();
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const payload = { type: "user", message: input, operatorId: selectedOperator?.id || null };
      wsRef.current.send(JSON.stringify(payload));
    }
    setMessages(p => [...p, { type: "user", text: input }]);
    setInput("");
    setBotTyping(true);
    setTimeout(() => {
      setMessages(p => [...p, { type: "bot", text: t.botReply }]);
      setBotTyping(false);
    }, 1000);
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
    } catch { setFormStatus("error"); }
    setLoading(false);
  };

  const closeView = () => {
    if (view) setView(null);
    else { setOpen(false); setSelectedOperator(null); }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[9999] p-4 rounded-full shadow-2xl bg-black text-white cursor-pointer flex items-center justify-center border border-white/10"
      >
        <FaComments size={22} />
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50, x: 20 }}
            className="fixed bottom-0 right-0 w-full h-[100dvh] sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[600px] bg-white border border-black/10 shadow-2xl z-[10000] flex flex-col sm:rounded-[2.5rem] overflow-hidden font-sans"
          >
            {/* Header Profil */}
            <div className="bg-black p-6 text-white flex justify-between items-center italic uppercase">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                  <FaUser size={18} />
                </div>
                <div>
                  <h3 className="font-black text-xs tracking-tight leading-none mb-1">{view === 'form' ? t.messageUs : t.chat}</h3>
                  <p className="text-[10px] opacity-40 uppercase tracking-[0.2em]">{selectedOperator?.name || "Support"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setLanguage(l => l === "ro" ? "en" : "ro")} className="text-[10px] font-black border border-white/20 px-2 py-1 rounded-lg uppercase">
                  {language}
                </button>
                <button onClick={closeView} className="p-1 opacity-50 hover:opacity-100">
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-5 space-y-4">
              {!view && (
                <div className="space-y-3 italic uppercase font-black">
                  <p className="text-[10px] text-slate-400 tracking-widest mb-4">{t.selectOperator}:</p>
                  {operatorStatus.map(op => (
                    <button key={op.id} onClick={() => { setSelectedOperator(op); setView('chat'); }} className="w-full p-4 bg-white border border-black rounded-2xl hover:bg-black hover:text-white transition-all flex items-center justify-between shadow-sm">
                      <span className="text-xs">{op.name}</span>
                      <span className={`w-3 h-3 rounded-full ${op.online ? 'bg-green-500' : 'bg-yellow-400 flex items-center justify-center text-black text-[8px]'}`}>
                        {!op.online && <FaQuestion />}
                      </span>
                    </button>
                  ))}
                  <button onClick={() => setView('form')} className="w-full p-4 mt-2 bg-slate-200 border border-black rounded-2xl flex items-center justify-center gap-2 text-xs hover:bg-black hover:text-white transition-all">
                    <FaEnvelope /> {t.messageUs}
                  </button>
                </div>
              )}

              {view === 'chat' && (
                <div className="flex flex-col space-y-3">
                  <button onClick={() => setView(null)} className="text-[10px] font-black text-slate-400 hover:text-black uppercase tracking-widest mb-2 italic">← Înapoi</button>
                  {messages.map((m, i) => (
                    <div key={i} className={`max-w-[85%] p-3 text-xs shadow-sm font-bold ${m.type === 'user' ? 'self-end bg-black text-white rounded-2xl rounded-tr-none italic uppercase' : 'self-start bg-white border border-black text-black rounded-2xl rounded-tl-none'}`}>
                      {m.text}
                    </div>
                  ))}
                  {botTyping && (
                    <div className="self-start bg-white p-4 rounded-2xl border border-black flex gap-1 animate-pulse italic text-[10px]">
                      BOT TYPING...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {view === 'form' && (
                <div className="flex flex-col gap-3 italic uppercase font-black">
                  <button onClick={() => setView(null)} className="text-[10px] text-slate-400 mb-2">← Înapoi</button>
                  {formStatus === "success" ? (
                    <div className="text-center p-10 bg-white rounded-[2rem] border border-green-100 shadow-xl italic uppercase font-black text-green-600 text-xs">
                       <FaCheck className="mx-auto mb-2" size={32}/> {t.success}
                    </div>
                  ) : (
                    <>
                      <input type="text" placeholder={t.name} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="p-4 bg-white border border-black rounded-2xl outline-none text-[10px] font-black italic uppercase" />
                      <input type="email" placeholder={t.email} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="p-4 bg-white border border-black rounded-2xl outline-none text-[10px] font-black italic uppercase" />
                      <textarea rows={4} placeholder={t.message} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="p-4 bg-white border border-black rounded-2xl outline-none text-[10px] font-black italic uppercase resize-none" />
                      <button onClick={submitForm} disabled={loading} className="p-5 bg-black text-white rounded-2xl text-[10px] hover:bg-slate-800 disabled:opacity-50 transition-all font-black italic uppercase tracking-widest">
                        {loading ? t.sending : t.sendMessage}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Input Area */}
            {view === 'chat' && (
              <div className="p-5 bg-white border-t border-black/5 flex gap-2">
                <input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.placeholder} 
                  className="flex-1 p-4 bg-slate-100 rounded-2xl outline-none text-[10px] font-black italic uppercase" 
                />
                <button onClick={handleSend} className="p-4 bg-black text-white rounded-2xl hover:bg-slate-800 active:scale-90 transition-all shadow-lg">
                  <FaPaperPlane size={14} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

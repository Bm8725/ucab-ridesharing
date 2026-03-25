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
    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.operatorStatus) {
          setOperatorStatus(prev => prev.map(op => ({
            ...op,
            online: data.operatorStatus.find(s => s.id === op.id)?.online ?? op.online
          })));
        }
        if (data.message) {
          setMessages(prev => [...prev, { type: 'operator', text: data.message }]);
        }
      } catch (err) { console.error(err); }
    };
    return () => wsRef.current?.close();
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    wsRef.current?.send(JSON.stringify({ type: "user", message: input, operatorId: selectedOperator?.id || null }));
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
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[9999] p-4 rounded-full shadow-2xl bg-black text-white cursor-pointer"
      >
        <FaComments size={24} />
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-0 right-0 w-full h-[100dvh] sm:bottom-24 sm:right-6 sm:w-[380px] sm:h-[600px] bg-white sm:rounded-[2.5rem] shadow-2xl z-[10000] flex flex-col overflow-hidden border border-black/5"
          >
            {/* Header Profil */}
            <div className="bg-black p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 italic">
                  <FaUser size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight leading-none mb-1 uppercase italic">{view === 'form' ? t.formTitle : t.chat}</h3>
                  <p className="text-[10px] opacity-50 uppercase tracking-[0.2em]">{selectedOperator?.name || "Support"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setLanguage(l => l === "ro" ? "en" : "ro")} className="text-[10px] font-black border border-white/20 px-2 py-1 rounded-lg hover:bg-white/10 uppercase italic">
                  {language}
                </button>
                <button onClick={closeView} className="opacity-50 hover:opacity-100 transition-opacity">
                  <FaTimes size={20} />
                </button>
              </div>
            </div>

            {/* Zona de continut */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-5 space-y-4">
              {!view && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 italic uppercase font-black">
                  <p className="text-[10px] text-slate-400 tracking-widest mb-4">{t.selectOperator}</p>
                  {operatorStatus.map(op => (
                    <button key={op.id} onClick={() => { setSelectedOperator(op); setView('chat'); }} className="w-full p-4 bg-white border border-slate-200 rounded-[1.2rem] hover:border-black transition-all flex items-center justify-between group shadow-sm">
                      <span className="text-slate-800">{op.name}</span>
                      <div className={`w-3 h-3 rounded-full relative ${op.online ? 'bg-green-500' : 'bg-amber-400'}`}>
                        {op.online && <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />}
                        {!op.online && <FaQuestion size={6} className="absolute inset-0 m-auto text-white" />}
                      </div>
                    </button>
                  ))}
                  <button onClick={() => setView('form')} className="w-full p-4 bg-black text-white rounded-[1.2rem] flex items-center justify-center gap-3 text-xs tracking-widest hover:bg-slate-800 mt-2 transition-all">
                    <FaEnvelope /> {t.messageUs}
                  </button>
                </div>
              )}

              {view === 'chat' && (
                <div className="flex flex-col space-y-3">
                  <button onClick={() => setView(null)} className="text-[10px] font-black text-slate-400 hover:text-black uppercase tracking-widest mb-2 italic">← ÎNAPOI</button>
                  {messages.map((m, i) => (
                    <div key={i} className={`max-w-[85%] p-3 text-sm shadow-sm font-bold ${m.type === 'user' ? 'self-end bg-black text-white rounded-2xl rounded-tr-none italic uppercase' : 'self-start bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none'}`}>
                      {m.text}
                    </div>
                  ))}
                  {botTyping && (
                    <div className="self-start bg-white p-4 rounded-2xl border border-slate-200 flex gap-1">
                      {[0, 0.2, 0.4].map(d => <motion.span key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />)}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {view === 'form' && (
                <div className="space-y-4 animate-in fade-in duration-500 italic uppercase font-black">
                  <button onClick={() => setView(null)} className="text-[10px] font-black text-slate-400 hover:text-black tracking-widest">← ÎNAPOI</button>
                  {formStatus === "success" ? (
                    <div className="text-center p-10 bg-white rounded-[2rem] border border-green-100 shadow-xl italic uppercase">
                      <FaCheck className="mx-auto mb-4 text-green-500" size={40} />
                      <p className="font-black text-slate-800 text-sm">{t.success}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input type="text" placeholder={t.name} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-black text-xs" />
                      <input type="email" placeholder={t.email} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-black text-xs" />
                      <textarea rows={4} placeholder={t.message} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-black text-xs resize-none" />
                      <button onClick={submitForm} disabled={loading} className="w-full py-5 bg-black text-white rounded-2xl text-xs tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50">
                        {loading ? t.sending : t.sendMessage}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Chat */}
            {view === 'chat' && (
              <div className="p-5 bg-white border-t border-slate-100 flex gap-3 items-center">
                <input
                  value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.placeholder} className="flex-1 p-4 bg-slate-100 rounded-2xl outline-none text-xs font-bold focus:bg-slate-200 transition-all italic uppercase"
                />
                <button onClick={handleSend} className="p-4 bg-black text-white rounded-2xl hover:bg-slate-800 active:scale-90 transition-all shadow-lg shadow-black/20">
                  <FaPaperPlane size={16} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


"use client";

import { useState, useEffect, useRef } from "react";
import { FaComments, FaEnvelope, FaPhoneAlt, FaCheckCircle, FaTimesCircle, FaCarSide, FaRoute } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function CorporateChat() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(null); // null, chat, form, quick
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [botTyping, setBotTyping] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("RO");

  const togglePanel = () => setOpen(o => !o);

  // Quick reply options
  const quickReplies = lang === "RO" 
    ? ["Status cursă", "Raportează o problemă", "Contact suport"] 
    : ["Ride Status", "Report Issue", "Contact Support"];

  const handleSend = (text = null) => {
    const message = text || input;
    if (!message.trim()) return;
    setMessages(p => [...p, { type: "user", text: message }]);
    setInput("");
    setBotTyping(true);

    setTimeout(() => {
      const botText = lang==="RO" 
        ? `Echipa noastră va răspunde la: "${message}" în curând!` 
        : `Our team will reply to: "${message}" shortly!`;
      setMessages(p => [...p, { type: "bot", text: botText }]);
      setBotTyping(false);
    }, 1000);
  };

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, botTyping]);

  const submitForm = async () => {
    setLoading(true);
    setFormStatus(null);
    try {
      const res = await fetch("https://api.doxer.ro/api/contact_request.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else setFormStatus("error");
    } catch {
      setFormStatus("error");
    }
    setLoading(false);
  };

  const Avatar = ({ type }) => (
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 border p-1">
      {type === "bot" ? <FaCarSide /> : <FaComments />}
    </div>
  );

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePanel}
        className="fixed bottom-5 right-5 z-[9999] w-16 h-16 rounded-full bg-blue-700 text-white shadow-xl flex items-center justify-center"
      >
        <FaComments size={24} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-20 right-2 md:right-5 z-[10000] w-[95vw] md:w-[450px] h-[85vh] md:h-[680px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-700 text-white p-5 flex justify-between items-center shadow-lg">
              <h2 className="text-2xl font-bold">
                {view === "chat" ? (lang==="RO"?"Chat Support":"Chat Support") :
                 view==="form" ? (lang==="RO"?"Trimite Feedback":"Send Feedback") :
                 (lang==="RO"?"Cum te putem ajuta?":"How can we help?")}
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={()=>setLang(lang==="RO"?"EN":"RO")} className="text-sm font-semibold border border-white px-2 py-1 rounded">{lang}</button>
                <button onClick={togglePanel} className="font-bold text-2xl">&times;</button>
              </div>
            </div>

            {/* Menu */}
            {!view && (
              <div className="p-4 flex flex-col gap-3">
                <button onClick={()=>setView("chat")} className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-700 font-semibold shadow hover:bg-blue-100">
                  <FaComments /> {lang==="RO"?"Chat Support":"Chat Support"}
                </button>
                <button onClick={()=>setView("form")} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 text-gray-700 font-semibold shadow hover:bg-gray-100">
                  <FaEnvelope /> {lang==="RO"?"Trimite Feedback":"Send Feedback"}
                </button>
                <button onClick={()=>setView("quick")} className="w-full flex items-center gap-3 p-3 rounded-xl bg-green-50 text-green-700 font-semibold shadow hover:bg-green-100">
                  <FaRoute /> {lang==="RO"?"Opțiuni rapide":"Quick Actions"}
                </button>
              </div>
            )}

            {/* Quick Actions */}
            {view==="quick" && (
              <div className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto">
                {quickReplies.map((q,i) => (
                  <button key={i} onClick={()=>handleSend(q)} className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl hover:bg-gray-200">
                    <FaComments /> {q}
                  </button>
                ))}
                <button onClick={()=>setView(null)} className="text-sm text-gray-600 mt-4 underline">{lang==="RO"?"← Înapoi":"← Back"}</button>
              </div>
            )}

            {/* Chat */}
            {view==="chat" && (
              <div className="flex-1 flex flex-col p-3 overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-3">
                  {messages.map((m,i)=>(
                    <div key={i} className={`flex ${m.type==="user"?"justify-end":"justify-start"}`}>
                      <div className="flex gap-2 items-end max-w-[75%]">
                        {m.type==="bot" && <Avatar type="bot"/>}
                        <motion.div initial={{opacity:0,y:5}} animate={{opacity:1,y:0}}
                          className={`p-2 rounded-2xl text-sm ${m.type==="user"?"bg-blue-100 text-blue-900":"bg-gray-100 text-gray-800"} shadow`}>
                          {m.text}
                        </motion.div>
                        {m.type==="user" && <Avatar type="user"/>}
                      </div>
                    </div>
                  ))}
                  {botTyping && <div className="flex items-center gap-2 text-gray-600 text-sm animate-pulse"><Avatar type="bot"/><span>{lang==="RO"?"Bot tastează...":"Bot is typing..."}</span></div>}
                  <div ref={messagesEndRef}></div>
                </div>

                {/* Quick reply buttons */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickReplies.map((q,i) => (
                    <button key={i} onClick={()=>handleSend(q)} className="bg-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-300">{q}</button>
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSend()}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={lang==="RO"?"Scrie un mesaj...":"Type your message..."}/>
                  <button onClick={()=>handleSend()} className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:opacity-90">Send</button>
                </div>
                <button onClick={()=>setView(null)} className="text-sm text-blue-700 mt-2 underline">{lang==="RO"?"← Înapoi":"← Back"}</button>
              </div>
            )}

            {/* Form */}
            {view==="form" && (
              <div className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto">
                <input placeholder={lang==="RO"?"Nume":"Name"} value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"/>
                <input placeholder={lang==="RO"?"Email":"Email"} value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})} className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"/>
                <textarea placeholder={lang==="RO"?"Mesajul tău...":"Your message..."} value={formData.message} onChange={e=>setFormData({...formData,message:e.target.value})} className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 h-28"/>
                {formStatus==="success" && <div className="text-green-600 flex items-center gap-2"><FaCheckCircle />{lang==="RO"?"Mesaj trimis cu succes!":"Message sent!"}</div>}
                {formStatus==="error" && <div className="text-red-600 flex items-center gap-2"><FaTimesCircle />{lang==="RO"?"Eroare la trimitere!":"Error sending message!"}</div>}
                <button onClick={submitForm} disabled={loading} className="bg-gray-700 text-white py-2 rounded-lg hover:opacity-90">{loading?(lang==="RO"?"Se trimite...":"Sending..."):(lang==="RO"?"Trimite":"Send")}</button>
                <button onClick={()=>setView(null)} className="text-sm text-gray-700 underline">{lang==="RO"?"← Înapoi":"← Back"}</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

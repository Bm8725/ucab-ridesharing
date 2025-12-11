"use client";

import { useState, useEffect, useRef } from "react";
import { FaPhoneAlt, FaComments, FaCarSide, FaRegUserCircle } from "react-icons/fa";

export default function OracleChatBlueRoBot() {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [activeChat, setActiveChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const contactTypes = [
    { id: "comercial", label: "Comercial", icon: <FaCarSide /> },
    { id: "tehnic", label: "Tehnic", icon: <FaRegUserCircle /> },
  ];

  const contactOptions = {
    comercial: [
      { id: "call", label: "Sună-ne", detail: "+40 700 111 x22", icon: <FaPhoneAlt /> },
      { id: "chat", label: "Chat Comercial", detail: "Începe o conversație cu echipa Comercială", icon: <FaComments /> },
    ],
    tehnic: [
      { id: "call", label: "Sună-ne", detail: "+40 700 555 x66", icon: <FaPhoneAlt /> },
      { id: "chat", label: "Chat Tehnic", detail: "Începe o conversație cu echipa Tehnică", icon: <FaComments /> },
    ],
  };

  // FAQ + răspunsuri automate
  const faq = {
    comercial: [
      { question: "Care este prețul?", answer: "Pentru detalii despre preț, vă rugăm să ne trimiteți detaliile produsului." },
      { question: "Cât durează livrarea?", answer: "Livrările se procesează în 24-48h." },
      { question: "Cum verific comanda?", answer: "Puteți verifica starea comenzilor în contul dumneavoastră." },
    ],
    tehnic: [
      { question: "Am o eroare", answer: "Vă rugăm să descrieți eroarea și pașii pentru reproducere." },
      { question: "Cum configurez?", answer: "Ghidul de configurare este disponibil aici: [link]." },
      { question: "Ultimul update?", answer: "Ultimul update a fost lansat recent, verificați aplicația." },
    ],
  };

  const colors = { primary: "#0b61c3", userMsg: "#e6f0ff", botMsg: "#f0f0f0" };
  const { primary, userMsg, botMsg } = colors;

  // Placeholder Socket/API
  const socket = useRef(null);
  const onSocketMessage = (msg) => setMessages((prev) => [...prev, { type: "bot", text: msg }]);
  const sendMessageSocket = (text) => console.log("Mesaj trimis prin socket/API:", text);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setInput("");

    setBotTyping(true);

    // Trimite prin socket când e live
    // sendMessageSocket(userMessage);

    setTimeout(() => {
      const lower = userMessage.toLowerCase();
      const responses = faq[selectedType] || [];
      const found = responses.find((r) => lower.includes(r.question.toLowerCase()));
      const botReply = found ? found.answer : "Mulțumim! Vă vom răspunde în curând.";
      setMessages((prev) => [...prev, { type: "bot", text: botReply }]);
      setBotTyping(false);
    }, 800);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, botTyping]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (activeChat && messages.length === 0 && selectedType) {
      const welcome =
        selectedType === "comercial"
          ? "Bun venit la chat-ul Comercial! Cum te putem ajuta?"
          : "Bun venit la chat-ul Tehnic! Cum te putem ajuta?";
      setBotTyping(true);
      setTimeout(() => {
        setMessages([{ type: "bot", text: welcome }]);
        setBotTyping(false);
      }, 500);
    }
  }, [activeChat, selectedType]);

  const handleFaqClick = (text) => setInput(text);

  return (
    <>
      {/* Label lateral fix */}
      <div onClick={() => setOpen(true)} style={{ position: "fixed", top: "50%", right: 0, transform: "translateY(-50%)", backgroundColor: "white", color: primary, padding: "12px 16px", borderTopLeftRadius: "12px", borderBottomLeftRadius: "12px", cursor: "pointer", writingMode: "vertical-rl", zIndex: 9999, fontWeight: "bold", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
        <FaComments /> Contact
      </div>

      {/* Backdrop */}
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)", zIndex: 9998 }} />}

      {/* Panel */}
      <div style={{ position: "fixed", top: 0, right: 0, width: isMobile ? "100%" : "400px", height: isMobile ? "100vh" : "80vh", backgroundColor: "white", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 10000, display: "flex", flexDirection: "column", borderRadius: isMobile ? "0" : "12px", color: primary, transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform 0.3s ease", overflow: "hidden" }}>
        {/* Background professional */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.05)), url('/rideshare-food-bg.png') no-repeat center bottom", backgroundSize: "cover", opacity: 0.15, zIndex: 0, backdropFilter: "blur(2px)" }} />

        {/* Header */}
        <div style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: `linear-gradient(90deg, ${primary} 0%, #5a9cf7 100%)`, color: "white", borderTopLeftRadius: isMobile ? "0" : "12px", borderTopRightRadius: isMobile ? "0" : "12px", fontWeight: "bold", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src="/ucabro.png" alt="UCab Logo" style={{ height: "32px" }} />
            <span>Contactează-ne</span>
          </div>
          <button onClick={() => setOpen(false)} style={{ fontSize: "24px", background: "none", border: "none", color: "white", cursor: "pointer" }}>×</button>
        </div>

        {/* Select tip contact */}
        <div style={{ flex: "none", padding: "16px", borderBottom: `1px solid ${primary}`, zIndex: 1 }}>
          <strong style={{ display: "block", marginBottom: "8px" }}>Selectează tipul de contact:</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {contactTypes.map((type) => (
              <button key={type.id} onClick={() => { setSelectedType(type.id); setActiveChat(false); setMessages([]); setInput(""); }} style={{ padding: "8px 12px", borderRadius: "6px", border: selectedType === type.id ? `2px solid ${primary}` : `1px solid ${primary}`, backgroundColor: selectedType === type.id ? "#e6f0ff" : "white", color: primary, cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: "6px" }}>{type.icon} {type.label}</button>
            ))}
          </div>
        </div>

        {/* Chat + FAQ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
          {/* FAQ only when chat is active */}
          {activeChat && selectedType && (
            <div style={{ flex: "none", padding: "8px", display: "flex", flexWrap: "wrap", gap: "6px", zIndex: 1 }}>
              {faq[selectedType].map((f, idx) => (
                <button key={idx} onClick={() => handleFaqClick(f.question)} style={{ padding: "6px 10px", borderRadius: "6px", border: `1px solid ${primary}`, backgroundColor: "white", cursor: "pointer", fontSize: "12px", color: primary }}>
                  {f.question}
                </button>
              ))}
            </div>
          )}

          {/* Mesaje */}
          {activeChat && (
            <>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                {messages.map((msg, idx) => (
                  <div key={idx} style={{ backgroundColor: msg.type === "user" ? userMsg : botMsg, alignSelf: msg.type === "user" ? "flex-end" : "flex-start", padding: "8px", borderRadius: "6px", marginBottom: "4px", maxWidth: "80%", color: "#000" }}>{msg.text}</div>
                ))}
                {botTyping && <div style={{ fontSize: "12px", color: "#555", marginBottom: "4px" }}>Bot tastează...</div>}
                <div ref={messagesEndRef} />
              </div>

              <div style={{ flex: "none", display: "flex", gap: "4px", padding: "8px" }}>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key === "Enter") handleSendMessage(); }} placeholder={selectedType === "comercial" ? "Scrie mesajul Comercial..." : "Scrie mesajul Tehnic..."} style={{ flex: 1, padding: "8px", borderRadius: "6px", border: `1px solid ${primary}`, background: "white", color: "#000" }} />
                <button onClick={handleSendMessage} style={{ padding: "8px 12px", backgroundColor: "white", color: primary, borderRadius: "6px", border: `1px solid ${primary}` }}>Trimite</button>
              </div>
            </>
          )}

          {!activeChat && selectedType && contactOptions[selectedType].map(option => (
            <div key={option.id} onClick={() => { if(option.id === "chat") setActiveChat(true); }} style={{ marginBottom: "12px", padding: "12px", borderRadius: "8px", cursor: "pointer", color: primary, backgroundColor: "white", border: `1px solid ${primary}`, display: "flex", alignItems: "center", gap: "8px" }} onMouseEnter={e => e.currentTarget.style.backgroundColor = "#e6f0ff"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}>
              {option.icon}<div><strong>{option.label}</strong><div style={{ fontSize: "14px", color: "#000" }}>{option.detail}</div></div>
            </div>
          ))}

          {selectedType === null && <div style={{ color: primary, padding: "16px" }}>Te rugăm să selectezi tipul de contact pentru a vedea opțiunile.</div>}
        </div>
      </div>
    </>
  );
  
}

'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Headset, Zap, X, MessageSquareText, ShieldCheck, Check, Lock, Sparkles, User } from 'lucide-react'

// CLIENT INITIALIZATION - DIRECT IN FILE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function UcabChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasAcceptedGdpr, setHasAcceptedGdpr] = useState(false)
  const [userName, setUserName] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState<string>('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // 1. SESSION & GDPR LOGIC
  useEffect(() => {
    if (typeof window === 'undefined') return
    const sId = localStorage.getItem('ucab_session') || uuidv4()
    const gdpr = localStorage.getItem('ucab_gdpr') === 'true'
    const savedName = localStorage.getItem('ucab_user_name') || ''
    
    if (!localStorage.getItem('ucab_session')) localStorage.setItem('ucab_session', sId)
    
    setSessionId(sId)
    setHasAcceptedGdpr(gdpr)
    setUserName(savedName)

    if (gdpr) {
      setupChat(sId)
    }
  }, [])

  // 2. REALTIME & FETCH LOGIC
  const setupChat = async (sId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_id', sId)
      .order('created_at', { ascending: true })
    
    if (data) setMessages(data)

    const channel = supabase.channel(`chat_${sId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages', 
        filter: `sender_id=eq.${sId}` 
      }, 
      (p) => setMessages(prev => {
        const exists = prev.find(m => m.id === p.new.id)
        return exists ? prev : [...prev, p.new]
      }))
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }

  // 3. HANDLERS
  const handleGdprSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim()) return
    localStorage.setItem('ucab_gdpr', 'true')
    localStorage.setItem('ucab_user_name', userName)
    setHasAcceptedGdpr(true)
    setupChat(sessionId)
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const content = input
    setInput('')
    await supabase.from('messages').insert([{ 
      content, 
      sender_id: sessionId, 
      user_name: userName, 
      is_admin: false 
    }])
  }

  useEffect(() => {
    if (isOpen) scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  return (
    <>
      {/* --- ICON NEGRU SIMPLU (TRIGGER) --- */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-[9999]"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="bg-black text-white p-5 rounded-full shadow-2xl border border-white/10 flex items-center justify-center"
            >
              <MessageSquareText size={28} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FEREASTRA DE CHAT ALL-BLACK --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed z-[9999] flex flex-col bg-[#020617] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden
              inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[400px] md:h-[650px] md:max-h-[85vh] md:rounded-[2rem]`}
          >
            {/* Header Minimalist */}
            <div className="bg-[#0f172a] p-6 flex items-center justify-between border-b border-white/5 relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center border border-white/5">
                    <Headset size={20} className="text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#020617] rounded-full" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xs uppercase tracking-[0.1em]">Chat Suport UCAB.ro</h3>
                  <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mt-0.5">online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 transition-all">
                <X size={20} />
              </button>
            </div>

            {!hasAcceptedGdpr ? (
              /* FORMULAR GDPR ALL-BLACK */
              <div className="flex-1 flex flex-col p-10 items-center justify-center text-center bg-black">
                <div className="w-16 h-16 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center text-zinc-400 mb-6">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Bun venit pe UCAB.</h4>
                <p className="text-zinc-500 text-sm mb-8">Te rugăm să introduci un nume pentru a începe.</p>
                
                <form onSubmit={handleGdprSubmit} className="w-full space-y-4">
                  <div className="relative">
                    <input
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Numele tău"
                      className="w-full bg-zinc-900 border border-white/5 rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-white/20 transition-all"
                    />
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                  </div>
                  <div className="flex items-start gap-3 text-left p-4 bg-zinc-900/50 rounded-xl border border-white/5 opacity-60">
                    <Lock size={12} className="text-zinc-500 mt-1 flex-shrink-0" />
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                      Ești de acord cu prelucrarea datelor în scopul asistenței tehnice conform politicii ucab.ro.
                    </p>
                  </div>
                  <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest">
                    Începe Chat-ul <Check size={18} />
                  </button>
                </form>
              </div>
            ) : (
              /* ZONA DE CHAT ALL-BLACK */
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black custom-scrollbar">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full opacity-10">
                      <Zap size={32} className="text-white mb-2" />
                      <p className="text-[9px] text-white font-black uppercase tracking-[0.2em]">Conexiune Live</p>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div
                      key={m.id || i}
                      className={`flex ${m.is_admin ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                        m.is_admin 
                        ? 'bg-zinc-900 text-zinc-100 border border-white/5 rounded-tl-none' 
                        : 'bg-white text-black font-medium rounded-tr-none'
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </div>

                {/* Input Area Minimalist */}
                <div className="p-6 bg-[#0f172a] border-t border-white/5">
                  <form onSubmit={handleSend} className="flex gap-3">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Write a message..."
                      className="flex-1 bg-zinc-900 border border-white/5 rounded-xl px-5 py-3.5 text-sm text-white outline-none focus:border-white/10 transition-all"
                    />
                    <button
                      type="submit"
                      className="bg-white text-black p-3.5 rounded-xl hover:bg-zinc-200 active:scale-95 transition-all flex-shrink-0"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                  <p className="text-[9px] text-zinc-600 text-center mt-4 font-bold uppercase tracking-widest opacity-40">Designed by UCAB.ro</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

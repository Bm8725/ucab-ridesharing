'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseConfig";
import { 
  ArrowRight, Car, Utensils, Send, Lock, Loader2, ChevronRight, Share2, X, 
  MessageCircle, Facebook, Link as LinkIcon, Heart, MessageSquare, BadgeCheck, Bell
} from "lucide-react";

export default function UcabBlog() {
  const router = useRouter();
  
  // --- STATE ---
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [category, setCategory] = useState("ride");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [activeShareId, setActiveShareId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      fetchMessages();
    };
    init();

    const channel = supabase.channel('ucab-news-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_messages' }, () => fetchMessages())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase.from('blog_messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    setSending(true);
    const { error } = await supabase.from('blog_messages').insert([
      { content: newMessage, category, user_id: user.id, user_email: user.email }
    ]);
    if (!error) setNewMessage("");
    setSending(false);
  };

  const handleShareAction = async (msg, type) => {
    const url = `${window.location.origin}/blog?id=${msg.id}`;
    if (type === 'copy') {
      await navigator.clipboard.writeText(url);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      window.open(type === 'whatsapp' ? `https://whatsapp.com{encodeURIComponent(url)}` : `https://facebook.com{encodeURIComponent(url)}`, '_blank');
    }
    setActiveShareId(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-slate-900" size={30} /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      
      {/* HEADER CORPORATE */}
      <header className="border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-md z-40 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight cursor-pointer" onClick={() => router.push('/')}>
            UCAB.ro <span className="font-normal text-slate-400">Business Administration</span>
          </h1>
          {user ? (
             <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[11px] font-bold uppercase">{user.email.split('@')[0]}</span>
                <BadgeCheck size={14} className="text-blue-600" />
             </div>
          ) : (
            <button onClick={() => router.push('/login')} className="text-xs font-bold bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-black transition-all uppercase tracking-wider">Log In Account</button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* SIDEBAR: POSTARE */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-32 bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                <Bell size={14} /> Comunicat Nou
              </h2>
              {user ? (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                     {['ride', 'food'].map(cat => (
                       <button key={cat} type="button" onClick={() => setCategory(cat)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${category === cat ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>{cat}</button>
                     ))}
                  </div>
                  <textarea 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Introdu conținutul articolului..." 
                    className="w-full bg-slate-50 border border-slate-200 p-5 rounded-2xl outline-none text-sm min-h-[200px] focus:border-slate-400 focus:bg-white transition-all" 
                  />
                  <button type="submit" disabled={sending || !newMessage.trim()} className="w-full py-4 bg-slate-900 text-white font-bold text-xs rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
                    {sending ? <Loader2 className="animate-spin" size={16} /> : "PUBLICĂ ARTICOL"}
                  </button>
                </form>
              ) : (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100 text-slate-300">
                    <Lock size={24} />
                  </div>
                  <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-wider">Autentificare necesară pentru <br/> administrare conținut</p>
                  <button onClick={() => router.push('/login')} className="w-full py-4 border border-slate-900 text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-900 hover:text-white transition-all uppercase">Sign In</button>
                </div>
              )}
            </div>
          </div>

          {/* FEED: LISTĂ ARTICOLE */}
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-12">
            {messages.map((msg, idx) => (
              <article key={msg.id} className="bg-white border border-slate-200 p-8 md:p-12 rounded-[2.5rem] shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                        <span className={msg.category === 'ride' ? 'text-blue-600' : 'text-orange-600'}>{msg.category}</span>
                        <span className="opacity-30">/</span>
                        <span>{new Date(msg.created_at).toLocaleDateString('ro-RO')}</span>
                    </div>
                </div>

                {/* TITLU AUTOMAT (PRIMA LINIE) */}
                <h3 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-[1.1] text-slate-900 group-hover:text-slate-700 transition-colors">
                    {msg.content.split('\n')[0]}
                </h3>
                <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">
                    {msg.content.split('\n').slice(1).join('\n') || msg.content}
                </p>
                
                <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs uppercase">{msg.user_email?.charAt(0)}</div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1 uppercase">{msg.user_email?.split('@')[0]} <BadgeCheck size={12} className="text-blue-600" /></span>
                        <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">Contributor Verificat</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <button onClick={() => setSelectedMsg(msg)} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-all uppercase">
                        <MessageSquare size={14}/> Comentarii
                    </button>

                    <div className="relative">
                        <button onClick={() => setActiveShareId(activeShareId === msg.id ? null : msg.id)} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-all uppercase">
                            <Share2 size={14}/> Share
                        </button>
                        {activeShareId === msg.id && (
                            <div className="absolute bottom-full right-0 mb-4 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 flex gap-1 z-50">
                                <button onClick={() => handleShareAction(msg, 'whatsapp')} className="p-3 hover:bg-slate-50 text-emerald-600 rounded-xl"><MessageCircle size={18}/></button>
                                <button onClick={() => handleShareAction(msg, 'copy')} className="p-3 hover:bg-slate-50 text-slate-600 rounded-xl">
                                    {copiedId === msg.id ? <div className="text-[9px] font-bold text-emerald-500">OK</div> : <LinkIcon size={18}/>}
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <button onClick={() => setSelectedMsg(msg)} className="hidden md:flex items-center gap-2 text-[11px] font-bold text-slate-900 hover:gap-4 transition-all uppercase tracking-widest">
                        Citește Tot <ArrowRight size={16} className="text-blue-600" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* MODAL CITIRE COMPLETĂ */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" onClick={() => setSelectedMsg(null)}></div>
          <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-8 md:p-16 animate-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedMsg(null)} className="absolute top-10 right-10 p-3 hover:bg-slate-50 rounded-full transition-all text-slate-400"><X size={30} /></button>
            <div className="text-[11px] font-bold text-slate-400 mb-8 tracking-[0.3em] uppercase border-l-2 border-slate-900 pl-4">{selectedMsg.category} // RAPORT OFICIAL</div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-10 tracking-tight leading-tight text-slate-900">{selectedMsg.content.split('\n')[0]}</h2>
            
            <div className="text-lg md:text-xl text-slate-600 space-y-8 leading-relaxed font-medium italic border-b border-slate-100 pb-16">
              {selectedMsg.content.split('\n').slice(1).map((p, i) => <p key={i}>{p}</p>)}
            </div>

            <div className="mt-16 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl">{selectedMsg.user_email?.charAt(0)}</div>
                    <div>
                        <p className="text-sm font-bold uppercase text-slate-900">{selectedMsg.user_email?.split('@')[0]}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">Autorizat Business Administration</p>
                    </div>
                </div>
                <button onClick={() => handleShareAction(selectedMsg, 'whatsapp')} className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-[11px] tracking-widest hover:bg-blue-600 transition-all uppercase">Trimite pe WhatsApp</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

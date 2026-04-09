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
    const shareUrl = `${window.location.origin}/blog?id=${msg.id}`;
    const firstLine = msg.content.split('\n')[0];
    const shareText = `Articol UCAB: ${firstLine}`;

    try {
      if (type === 'whatsapp') {
        const waUrl = `https://whatsapp.com{encodeURIComponent(shareText + " " + shareUrl)}`;
        window.open(waUrl, '_blank');
      } else if (type === 'copy') {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedId(msg.id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch (err) {
      console.error("Share error:", err);
    }
    setActiveShareId(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-slate-900" size={30} /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      
      {/* HEADER - RESPONSIVE */}
      <header className="border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-md z-40 px-4 md:px-6 py-4 md:py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold tracking-tight cursor-pointer" onClick={() => router.push('/')}>
            UCAB.ro <span className="hidden sm:inline font-normal text-slate-400">Business Admin</span>
          </h1>
          {user ? (
             <div className="flex items-center gap-2 md:gap-3 bg-slate-100 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-slate-200">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[10px] md:text-[11px] font-bold uppercase truncate max-w-[80px] md:max-w-none">{user.email.split('@')[0]}</span>
                <BadgeCheck size={14} className="text-blue-600 shrink-0" />
             </div>
          ) : (
            <button onClick={() => router.push('/login')} className="text-[10px] md:text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-black transition-all uppercase">Login</button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* SIDEBAR - STAYS TOP ON MOBILE */}
          <div className="lg:col-span-4 order-1 lg:order-1">
            <div className="lg:sticky lg:top-32 bg-white border border-slate-200 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm">
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
                    placeholder="Ce noutăți avem astăzi?" 
                    className="w-full bg-slate-50 border border-slate-200 p-4 md:p-5 rounded-xl md:rounded-2xl outline-none text-sm min-h-[150px] lg:min-h-[200px] focus:border-slate-400 focus:bg-white transition-all" 
                  />
                  <button type="submit" disabled={sending || !newMessage.trim()} className="w-full py-4 bg-slate-900 text-white font-bold text-xs rounded-xl md:rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg">
                    {sending ? <Loader2 className="animate-spin" size={16} /> : "PUBLICĂ ACUM"}
                  </button>
                </form>
              ) : (
                <div className="py-6 md:py-10 text-center space-y-4">
                  <Lock size={24} className="mx-auto text-slate-300" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Acces restricționat pentru vizitatori</p>
                  <button onClick={() => router.push('/login')} className="w-full py-3 border-2 border-slate-900 text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-900 hover:text-white transition-all uppercase">Sign In</button>
                </div>
              )}
            </div>
          </div>

          {/* FEED - RESPONSIVE TEXT SIZES */}
          <div className="lg:col-span-8 order-2 lg:order-2 space-y-8 md:space-y-12">
            {messages.map((msg) => (
              <article key={msg.id} className="bg-white border border-slate-200 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                        <span className={msg.category === 'ride' ? 'text-blue-600' : 'text-orange-600'}>{msg.category}</span>
                        <span className="opacity-30">/</span>
                        <span>{new Date(msg.created_at).toLocaleDateString('ro-RO')}</span>
                    </div>
                </div>

                <h3 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 tracking-tight leading-[1.2] text-slate-900 group-hover:text-slate-700 transition-colors">
                    {msg.content.split('\n')[0]}
                </h3>
                <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed mb-6 md:mb-8 line-clamp-3">
                    {msg.content.split('\n').slice(1).join('\n') || msg.content}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 border-t border-slate-100 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs uppercase">{msg.user_email?.charAt(0)}</div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-[10px] md:text-[11px] font-bold text-slate-900 flex items-center gap-1 uppercase">{msg.user_email?.split('@')[0]} <BadgeCheck size={12} className="text-blue-600" /></span>
                        <span className="text-[8px] md:text-[9px] font-medium text-slate-400 uppercase">Verificat</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-6 ml-auto sm:ml-0">
                    <button onClick={() => setSelectedMsg(msg)} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-all uppercase">
                        <MessageSquare size={14}/>
                    </button>

                    <div className="relative">
                        <button onClick={() => setActiveShareId(activeShareId === msg.id ? null : msg.id)} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 flex items-center gap-2 transition-all uppercase">
                            <Share2 size={14}/> Share
                        </button>
                        {activeShareId === msg.id && (
                            <div className="absolute bottom-full right-0 mb-3 bg-white border border-slate-200 shadow-2xl rounded-2xl p-2 flex gap-1 z-50 animate-in fade-in zoom-in-95">
                                <button onClick={() => handleShareAction(msg, 'whatsapp')} className="p-3 hover:bg-slate-50 text-emerald-600 rounded-xl transition-all"><MessageCircle size={18}/></button>
                                <button onClick={() => handleShareAction(msg, 'copy')} className="p-3 hover:bg-slate-50 text-slate-600 rounded-xl transition-all">
                                    {copiedId === msg.id ? <div className="text-[9px] font-bold text-emerald-500">OK</div> : <LinkIcon size={18}/>}
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <button onClick={() => setSelectedMsg(msg)} className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold text-slate-900 hover:gap-3 transition-all uppercase tracking-widest">
                        Detalii <ArrowRight size={16} className="text-blue-600" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* MODAL - FULL SCREEN ON MOBILE */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" onClick={() => setSelectedMsg(null)}></div>
          <div className="relative bg-white w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] sm:rounded-[2.5rem] overflow-y-auto shadow-2xl p-6 md:p-16 animate-in slide-in-from-bottom-5 duration-300">
            <button onClick={() => setSelectedMsg(null)} className="absolute top-6 right-6 p-2 bg-slate-50 sm:p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400"><X size={24} /></button>
            <div className="text-[10px] font-bold text-slate-400 mb-6 md:mb-8 tracking-[0.2em] uppercase border-l-2 border-slate-900 pl-4">{selectedMsg.category} // RAPORT</div>
            
            <h2 className="text-2xl md:text-5xl font-bold mb-6 md:mb-10 tracking-tight leading-tight text-slate-900">{selectedMsg.content.split('\n')[0]}</h2>
            
            <div className="text-base md:text-lg text-slate-600 space-y-6 md:space-y-8 leading-relaxed font-medium italic border-b border-slate-100 pb-12 md:pb-16">
              {selectedMsg.content.split('\n').slice(1).map((p, i) => <p key={i}>{p}</p>)}
            </div>

            <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4 self-start">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg">{selectedMsg.user_email?.charAt(0)}</div>
                    <div>
                        <p className="text-sm font-bold uppercase text-slate-900">{selectedMsg.user_email?.split('@')[0]}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase">Operator UCAB</p>
                    </div>
                </div>
                <button onClick={() => handleShareAction(selectedMsg, 'whatsapp')} className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-full font-bold text-[10px] tracking-widest uppercase shadow-lg">WhatsApp Share</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

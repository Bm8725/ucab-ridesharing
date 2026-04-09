'use client';

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseConfig";
import { 
  ArrowRight, Car, Utensils, Send, Lock, Loader2, ChevronRight, Share2, X, 
  MessageCircle, Facebook, Link as LinkIcon, Heart, MessageSquare, BadgeCheck, Bell, ChevronLeft
} from "lucide-react";

export default function UcabBlogComplete() {
  const router = useRouter();
  
  // --- STATE-URI ---
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [category, setCategory] = useState("ride");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [activeShareId, setActiveShareId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // --- STATE PAGINATIE ---
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // --- SINCRONIZARE SI AUTH ---
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

  // --- LOGICA PAGINATIE ---
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = messages.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(messages.length / postsPerPage);

  // --- ENGINE SHARE ---
  const handleShare = async (msg, platform) => {
    const shareUrl = `${window.location.origin}/blog?id=${msg.id}`;
    const shareText = msg.content.split('\n')[0];

    if (platform === 'whatsapp') {
      window.open(`https://whatsapp.com{encodeURIComponent(shareText + " " + shareUrl)}`, '_blank');
    } else if (platform === 'copy') {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
    setActiveShareId(null);
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin text-slate-900" size={30} /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
      
      <header className="border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-md z-40 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div onClick={() => router.push('/')} className="cursor-pointer">
            <h1 className="text-xl font-bold tracking-tight uppercase italic">UCAB<span className="text-slate-400">.ro</span></h1>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-600 leading-none">News Console</p>
          </div>
          {user ? (
             <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase truncate max-w-[100px]">{user.email.split('@')[0]}</span>
                <BadgeCheck size={14} className="text-blue-600" />
             </div>
          ) : (
            <button onClick={() => router.push('/login')} className="text-[10px] font-bold bg-slate-900 text-white px-5 py-2 rounded-lg uppercase tracking-wider">Login</button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 order-1">
            <section className="lg:sticky lg:top-28 bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><Bell size={14} /> Comunicat Nou</h2>
              {user ? (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="flex gap-2 p-1 bg-slate-50 rounded-xl">
                     {['ride', 'food'].map(cat => (
                       <button key={cat} type="button" onClick={() => setCategory(cat)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${category === cat ? 'bg-black text-white shadow-lg' : 'text-slate-400'}`}>{cat}</button>
                     ))}
                  </div>
                  <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Scrie aici respectand politica UCAB..." className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none text-sm min-h-[150px] focus:bg-white transition-all" />
                  <button type="submit" disabled={sending || !newMessage.trim()} className="w-full py-4 bg-slate-900 text-white font-black text-[10px] rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-all">
                    {sending ? <Loader2 className="animate-spin" size={16}/> : "PUBLICĂ ARTICOL"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <Lock size={20} className="mx-auto mb-2 text-slate-300" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Login pentru a posta</p>
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-8 space-y-6 order-2">
            {currentPosts.map((msg) => (
              <article key={msg.id} className="bg-white border border-slate-200 p-6 md:p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all group">
                <header className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <span className={msg.category === 'ride' ? 'text-blue-600' : 'text-orange-600'}>{msg.category}</span>
                    <span className="opacity-20">/</span>
                    <time>{new Date(msg.created_at).toLocaleDateString('ro-RO')}</time>
                </header>

                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 leading-tight">
                  {msg.content.split('\n')[0]}
                </h2>
                
                <div className="text-sm md:text-base text-slate-500 line-clamp-2 mb-8 font-medium italic">
                  {msg.content.split('\n').slice(1).join(' ') || msg.content}
                </div>
                
                <footer className="flex flex-wrap items-center justify-between pt-6 border-t border-slate-100 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">{msg.user_email?.charAt(0)}</div>
                    <span className="text-[11px] font-bold text-slate-900 uppercase">{msg.user_email?.split('@')[0]}</span>
                  </div>

                  <div className="flex items-center gap-4 md:gap-6">
                    <button onClick={() => setSelectedMsg(msg)} className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase">
                        <MessageSquare size={14}/> Comentează
                    </button>
                    <div className="relative">
                        <button onClick={() => setActiveShareId(activeShareId === msg.id ? null : msg.id)} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase"><Share2 size={14}/></button>
                        {activeShareId === msg.id && (
                            <div className="absolute bottom-full right-0 mb-3 bg-white border border-slate-200 shadow-2xl rounded-2xl p-2 flex gap-1 z-50">
                                <button onClick={() => handleShare(msg, 'whatsapp')} className="p-3 hover:bg-emerald-50 text-emerald-600 rounded-xl"><MessageCircle size={18}/></button>
                                <button onClick={() => handleShare(msg, 'copy')} className="p-3 hover:bg-slate-50 text-slate-600 rounded-xl">{copiedId === msg.id ? "OK" : <LinkIcon size={18}/>}</button>
                            </div>
                        )}
                    </div>
                    <button onClick={() => setSelectedMsg(msg)} className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold text-slate-900 hover:gap-3 transition-all uppercase tracking-widest">
                        Detalii <ArrowRight size={16} className="text-blue-600" />
                    </button>
                  </div>
                </footer>
              </article>
            ))}

            {/* --- COMPONENTA PAGINATIE --- */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 py-10">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-xs font-black uppercase tracking-widest">
                  Pagina {currentPage} / {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- MODAL SI COMENTARII LIMITATE --- */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" onClick={() => setSelectedMsg(null)}></div>
          <div className="relative bg-white w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] sm:rounded-[3rem] overflow-y-auto shadow-2xl p-6 md:p-16 animate-in slide-in-from-bottom-5">
            <button onClick={() => setSelectedMsg(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full"><X size={24} /></button>
            
            <h2 className="text-2xl md:text-5xl font-bold mb-6 text-slate-900">{selectedMsg.content.split('\n')[0]}</h2>
            <div className="text-base md:text-lg text-slate-600 space-y-6 italic border-b border-slate-100 pb-12 mb-8">
              {selectedMsg.content.split('\n').slice(1).map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {/* SECTIUNE COMENTARII */}
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <MessageSquare size={16}/> Comentarii Community
              </h3>
              
              {user ? (
                <div className="flex gap-3">
                  <input placeholder="Adauga un comentariu verificat..." className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none text-xs" />
                  <button className="bg-slate-900 text-white p-4 rounded-2xl"><Send size={18}/></button>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-[2rem] text-center">
                  <Lock size={16} className="mx-auto mb-2 text-slate-400" />
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Doar membrii UCAB pot scrie comentarii.</p>
                </div>
              )}

              <div className="space-y-4 opacity-50">
                 <div className="p-4 bg-slate-50 rounded-2xl italic text-[11px]">"Foarte util acest update pentru sectorul 1." - Mihai A.</div>
                 <div className="p-4 bg-slate-50 rounded-2xl italic text-[11px]">"Speram la o integrare similara si pentru Ilfov." - Operator 02</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

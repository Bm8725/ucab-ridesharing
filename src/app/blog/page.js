'use client';

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseConfig";
import { 
  ArrowRight, Car, Utensils, Send, Lock, Loader2, ChevronRight, Share2, X, 
  MessageCircle, Link as LinkIcon, Heart, MessageSquare, BadgeCheck, 
  Bell, ChevronLeft, CornerDownRight 
} from "lucide-react";

export default function UcabBlogFinal() {
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
  const [postComments, setPostComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      fetchMessages();
    };
    init();
    const msgChannel = supabase.channel('ucab-msgs').on('postgres_changes', { event: '*', schema: 'public', table: 'blog_messages' }, () => fetchMessages()).subscribe();
    return () => supabase.removeChannel(msgChannel);
  }, []);

  useEffect(() => {
    if (selectedMsg) {
      fetchComments(selectedMsg.id);
      const comChannel = supabase.channel(`comments-${selectedMsg.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'blog_comments', filter: `post_id=eq.${selectedMsg.id}` }, 
        (p) => setPostComments(prev => [p.new, ...prev]))
        .subscribe();
      return () => supabase.removeChannel(comChannel);
    }
  }, [selectedMsg]);

  const fetchMessages = async () => {
    const { data } = await supabase.from('blog_messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  const fetchComments = async (postId) => {
    const { data } = await supabase.from('blog_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
    if (data) setPostComments(data);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    setSending(true);
    await supabase.from('blog_messages').insert([{ content: newMessage, category, user_id: user.id, user_email: user.email }]);
    setNewMessage("");
    setSending(false);
  };

  const handleSendComment = async (parentId = null) => {
    if (!commentText.trim() || !user || !selectedMsg) return;
    await supabase.from('blog_comments').insert([{
      post_id: selectedMsg.id,
      user_id: user.id,
      user_email: user.email,
      content: commentText,
      parent_id: parentId
    }]);
    setCommentText("");
    setReplyToId(null);
  };

  const currentPosts = useMemo(() => {
    const last = currentPage * postsPerPage;
    return messages.slice(last - postsPerPage, last);
  }, [messages, currentPage]);

  const totalPages = Math.ceil(messages.length / postsPerPage);

  const handleShare = async (msg, platform) => {
    const shareUrl = `${window.location.origin}/blog?id=${msg.id}`;
    if (platform === 'whatsapp') {
      window.open(`https://whatsapp.com{encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'copy') {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
    setActiveShareId(null);
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-800 font-sans selection:bg-blue-100">
      
      {/* Header modern cu stil minimalist */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-xl z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div onClick={() => router.push('/')} className="cursor-pointer group">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">ucab<span className="text-blue-600">.ro</span></h1>
            <p className="text-[10px] font-medium text-slate-400 group-hover:text-blue-500 transition-colors">News & Updates</p>
          </div>
          {user ? (
             <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <span className="text-xs font-semibold text-slate-600 lowercase">{user.email.split('@')[0]}</span>
                <BadgeCheck size={16} className="text-blue-500" />
             </div>
          ) : (
            <button onClick={() => router.push('/login')} className="text-xs font-bold bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-black transition-all">Login</button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sectiune publicare (Sidebar) */}
          <div className="lg:col-span-4">
            <section className="lg:sticky lg:top-32 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Bell size={16} /></div>
                <h2 className="text-sm font-bold text-slate-900">Postează un comunicat</h2>
              </div>
              {user ? (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                     {['ride', 'food', 'general'].map(cat => (
                       <button key={cat} type="button" onClick={() => setCategory(cat)} className={`flex-1 py-2 rounded-lg text-[11px] font-bold capitalize transition-all ${category === cat ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>{cat}</button>
                     ))}
                  </div>
                  <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Despre ce dorești să scrii?" className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl outline-none text-[13px] min-h-[160px] focus:bg-white focus:border-blue-300 transition-all placeholder:text-slate-400" />
                  <button type="submit" disabled={sending || !newMessage.trim()} className="w-full py-4 bg-blue-600 text-white font-bold text-sm rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                    {sending ? <Loader2 className="animate-spin" size={18}/> : "Publică articolul"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 px-4 border-2 border-dashed border-slate-100 rounded-3xl">
                  <Lock size={24} className="mx-auto mb-3 text-slate-200" />
                  <p className="text-xs font-medium text-slate-400 mb-6 leading-relaxed">Autentifică-te pentru a scrie pe blogul ucab.ro</p>
                  <button onClick={() => router.push('/login')} className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-black transition-all">Sign In</button>
                </div>
              )}
            </section>
          </div>

          {/* Feed articole */}
          <div className="lg:col-span-8 space-y-8">
            {currentPosts.map((msg) => (
              <article key={msg.id} className="bg-white border border-slate-200 p-8 md:p-10 rounded-[2rem] shadow-sm hover:border-blue-200 transition-all group">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 mb-4">
                    <span className={`px-2 py-0.5 rounded-md ${msg.category === 'ride' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'} capitalize`}>{msg.category}</span>
                    <span className="opacity-30">•</span>
                    <span>{new Date(msg.created_at).toLocaleDateString('ro-RO')}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 leading-tight group-hover:text-blue-600 transition-colors tracking-tight">{msg.content.split('\n')[0]}</h2>
                <p className="text-slate-500 leading-relaxed text-[15px] mb-8 line-clamp-2">{msg.content.split('\n').slice(1).join(' ') || msg.content}</p>
                
                <div className="flex flex-wrap items-center justify-between pt-6 border-t border-slate-50 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm">{msg.user_email?.charAt(0).toUpperCase()}</div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 lowercase">{msg.user_email?.split('@')[0]}</span>
                        <span className="text-[10px] font-medium text-slate-400">Verified Author</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-6">
                    <button onClick={() => setSelectedMsg(msg)} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">
                        <MessageSquare size={16}/> Comentarii
                    </button>
                    <div className="relative">
                        <button onClick={() => setActiveShareId(activeShareId === msg.id ? null : msg.id)} className="text-xs font-bold text-slate-400 hover:text-slate-900"><Share2 size={16}/></button>
                        {activeShareId === msg.id && (
                            <div className="absolute bottom-full right-0 mb-3 bg-white border border-slate-200 shadow-2xl rounded-2xl p-2 flex gap-1 z-50 animate-in fade-in zoom-in-95">
                                <button onClick={() => handleShare(msg, 'whatsapp')} className="p-3 hover:bg-green-50 text-green-600 rounded-xl"><MessageCircle size={20}/></button>
                                <button onClick={() => handleShare(msg, 'copy')} className="p-3 hover:bg-slate-50 text-slate-600 rounded-xl">{copiedId === msg.id ? <span className="text-[10px] font-bold text-blue-500">OK</span> : <LinkIcon size={20}/>}</button>
                            </div>
                        )}
                    </div>
                    <button onClick={() => setSelectedMsg(msg)} className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:gap-3 transition-all">Citește tot <ArrowRight size={18} /></button>
                  </div>
                </div>
              </article>
            ))}

            {/* Paginatie modernă */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 py-12">
                <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="p-2.5 rounded-full border border-slate-200 disabled:opacity-20 hover:bg-slate-50"><ChevronLeft size={20}/></button>
                <span className="text-sm font-bold text-slate-500">Pagina {currentPage} din {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="p-2.5 rounded-full border border-slate-200 disabled:opacity-20 hover:bg-slate-50"><ChevronRight size={20}/></button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Citire + Discuții */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-md" onClick={() => setSelectedMsg(null)}></div>
          <div className="relative bg-white w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] sm:rounded-[2.5rem] overflow-y-auto shadow-2xl p-8 md:p-16 animate-in slide-in-from-bottom-5">
            <button onClick={() => setSelectedMsg(null)} className="absolute top-6 right-6 p-2.5 bg-slate-50 rounded-full hover:bg-slate-100 transition-all"><X size={24}/></button>
            <div className="text-xs font-bold text-blue-600 mb-8 uppercase tracking-widest px-3 py-1 bg-blue-50 w-fit rounded-md">Ucab News // {selectedMsg.category}</div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-[1.1] mb-12 tracking-tight">{selectedMsg.content.split('\n')[0]}</h2>
            
            <div className="text-[17px] text-slate-600 space-y-6 leading-relaxed mb-16">
              {selectedMsg.content.split('\n').slice(1).map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {/* Hub Discuții */}
            <div className="border-t border-slate-100 pt-12">
              <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2"><MessageSquare size={20} className="text-blue-500"/> Discuții comunitate</h3>
              
              {user ? (
                <div className="mb-10 group">
                  <div className="flex gap-4">
                    <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder={replyToId ? "Scrie un răspuns..." : "Adaugă un comentariu..."} className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none text-sm focus:border-blue-400 focus:bg-white transition-all" />
                    <button onClick={() => handleSendComment(replyToId)} className="bg-blue-600 text-white px-6 py-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"><Send size={20}/></button>
                  </div>
                  {replyToId && <button onClick={() => setReplyToId(null)} className="text-xs font-bold text-red-500 mt-2 ml-2 hover:underline">Anulează răspunsul</button>}
                </div>
              ) : <div className="p-8 bg-slate-50 rounded-3xl text-center text-sm font-semibold text-slate-400 mb-10 border border-slate-100">Trebuie să fii autentificat pentru a lăsa un comentariu.</div>}

              <div className="space-y-8">
                {postComments.filter(c => !c.parent_id).map(c => (
                  <div key={c.id} className="group">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-600">{c.user_email?.charAt(0).toUpperCase()}</div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900 lowercase">{c.user_email?.split('@')[0]} <span className="text-[10px] text-slate-300 ml-2 font-normal">{new Date(c.created_at).toLocaleDateString()}</span></p>
                            <p className="text-[14px] text-slate-500 mt-1.5 leading-relaxed">{c.content}</p>
                            <button onClick={() => setReplyToId(c.id)} className="text-xs font-bold text-blue-500 mt-3 hover:underline opacity-0 group-hover:opacity-100 transition-all">Răspunde</button>
                        </div>
                    </div>
                    {/* Sub-reply-uri */}
                    {postComments.filter(r => r.parent_id === c.id).map(r => (
                        <div key={r.id} className="ml-14 mt-4 flex gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <CornerDownRight size={14} className="text-slate-300 shrink-0" />
                            <div className="flex-1">
                                <p className="text-xs font-bold text-slate-700 lowercase">{r.user_email?.split('@')[0]}</p>
                                <p className="text-sm text-slate-500 mt-1">{r.content}</p>
                            </div>
                        </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

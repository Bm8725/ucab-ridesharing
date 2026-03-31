"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseConfig"; // ASIGURĂ-TE CĂ ACEASTĂ CALE E CORECTĂ

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !pass) {
      setError("Toate câmpurile sunt obligatorii.");
      setLoading(false);
      return;
    }

    try {
      // LOGARE DIRECTĂ CU SUPABASE - Aceasta rezolvă problema persistenței
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: pass,
      });

      if (authError) {
        setError("Email sau parolă incorectă.");
      } else if (data.user) {
        setSuccess("Autentificare reușită. Se încarcă profilul...");
        
        // Redirecționare către myaccount
        setTimeout(() => {
          window.location.href = "/myaccount";
        }, 1000);
      }
    } catch (err) {
      setError("Eroare de conexiune cu serverul de autentificare.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "w-full bg-transparent border-b-2 py-4 outline-none transition-all text-lg placeholder:text-zinc-300 font-light";
  const errorInput = "border-red-600 dark:border-red-500 focus:border-red-700";
  const normalInput = "border-zinc-100 dark:border-zinc-800 focus:border-black dark:focus:border-white";

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans antialiased flex flex-col items-center justify-center p-6">
      
      <header className="mb-16 text-center">
        <h1 className="text-2xl font-black tracking-tighter uppercase">
          UCab<span className="text-zinc-400">.ro</span>
        </h1>
        <p className="text-[9px] font-bold uppercase tracking-[0.6em] text-zinc-400 mt-2">
          Autentificare Client / Authentification client
        </p>
      </header>

      <main className="w-full max-w-sm">
        <div className="mb-12">
          <h2 className="text-4xl font-light tracking-tighter uppercase italic">
            Autentificare
          </h2>
          <div className="h-[2px] w-12 bg-black dark:bg-white mt-3" />
        </div>

        {error && (
          <div className="mb-8 p-4 border-l-4 border-red-600 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
            ERR // {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Identificator Email
            </label>
            <input
              type="email"
              disabled={loading || !!success}
              className={`${inputBase} ${error && !email ? errorInput : normalInput}`}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Parola acces
            </label>
            <div className="relative group">
              <input
                type={showPass ? "text" : "password"}
                disabled={loading || !!success}
                className={`${inputBase} ${error && !pass ? errorInput : normalInput} pr-10`}
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-0 bottom-4 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              >
                {showPass ? "HID" : "SHW"}
              </button>
            </div>
          </div>

          <Link href="/reset-password/" className="text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-all italic underline underline-offset-4">
            Recuperare Parolă / Recover Password
          </Link>

          <div className="pt-6">
            {success ? (
              <div className="p-5 border-l-4 border-green-600 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                AUTH OK // {success}
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-6 px-8 font-black uppercase text-[11px] tracking-[0.4em] hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-30 shadow-2xl"
              >
                {loading ? "VERIFICARE..." : "ACCES CONT"}
              </button>
            )}
          </div>
        </form>

        <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-900 text-center">
          <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest italic">
            Nu ai cont? 
            <Link href="/account/" className="text-red-600 font-black ml-2 hover:underline">
              Creează cont rider
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

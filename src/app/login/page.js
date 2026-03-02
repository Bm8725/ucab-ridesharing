"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false); // State pentru vizibilitate parola
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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Email sau parolă incorectă.");
      } else {
        setSuccess("Autentificare reușită. Redirecționare...");
        setTimeout(() => {
          window.location.href = "/cursa/";
        }, 1200);
      }
    } catch (err) {
      setError("Eroare de conexiune cu serverul.");
    } finally {
      setLoading(false);
    }
  };

  // Stiluri dinamice
  const inputBase =
    "w-full bg-transparent border-b-2 py-4 outline-none transition-all text-lg placeholder:text-zinc-300 font-light";
  const errorInput =
    "border-red-600 dark:border-red-500 focus:border-red-700";
  const normalInput =
    "border-zinc-100 dark:border-zinc-800 focus:border-black dark:focus:border-white";

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans antialiased flex flex-col items-center justify-center p-6">
      
      {/* Branding */}
      <header className="mb-16 text-center">
        <h1 className="text-2xl font-black tracking-tighter uppercase">
          UCab<span className="text-zinc-400">.ro</span>
        </h1>
        <p className="text-[9px] font-bold uppercase tracking-[0.6em] text-zinc-400 mt-2">
          Autentificare Client / Authentification client
        </p>
      </header>

      <main className="w-full max-w-sm">

        {/* Titlu */}
        <div className="mb-12">
          <h2 className="text-4xl font-light tracking-tighter uppercase italic">
            Autentificare
          </h2>
          <div className="h-[2px] w-12 bg-black dark:bg-white mt-3" />
        </div>

        {/* MESAJ EROARE */}
        {error && (
          <div className="mb-8 p-4 border-l-4 border-red-600 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
            ERR  // {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-10">

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Identificator Email
            </label>
            <input
              type="email"
              disabled={loading || success}
              className={`${inputBase} ${error && !email ? errorInput : normalInput}`}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PAROLĂ */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Parola acces
              </label>
    
            </div>
            <div className="relative group">
              <input
                type={showPass ? "text" : "password"}
                disabled={loading || success}
                className={`${inputBase} ${error && !pass ? errorInput : normalInput} pr-10`}
                placeholder="••••••••"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-0 bottom-4 text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPass ? (
                  <svg xmlns="www.w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="www.w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12.a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

      <Link
  href="/reset-password/"
  className="text-[13px] font-bold uppercase tracking-widest text-zinc-600 hover:text-red-600 transition-colors flex items-center gap-1"
>
  Recuperare / recover <span className="text-sm">↗</span>
</Link>

 
          {/* BUTON / SUCCESS */}
          <div className="pt-6">
            {success ? (
              <div className="p-5 border-l-4 border-green-600 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                APP server // {success}
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-5 px-8 font-black uppercase text-[11px] tracking-[0.4em] hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-30 shadow-xl shadow-black/5"
              >
                {loading ? "Se verifică..." : "Acces Cont"}
              </button>
            )}
          </div>
        </form>

        {/* REGISTER */}
        <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-900 text-center">
          <p className="text-[13px] font-bold text-zinc-400 uppercase tracking-widest">
            Nu ai inca cont la noi?
            <Link
              href="/account/"
              className="text-blue-600 dark:text-blue-400 font-extrabold underline underline-offset-4 hover:opacity-80 transition-opacity ml-3"
            >
              Creează cont client
            </Link>

          </p>
        </div>
      </main>

    </div>
  );
}

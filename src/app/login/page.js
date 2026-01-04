"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
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
          window.location.href = "https://www.ucab.ro/cursa/";
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
          Autentificare Client /Athentification client
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
          <div className="mb-8 p-4 border-l-4 border-red-600 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-[10px] font-black uppercase tracking-widest">
            Eroare Sistem // {error}
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
              placeholder="nume@companie.ro"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PAROLĂ */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Cheie Acces
              </label>
              <Link
                href="/forgot"
                className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-600 transition-colors"
              >
                Recuperare
              </Link>
            </div>
            <input
              type="password"
              disabled={loading || success}
              className={`${inputBase} ${error && !pass ? errorInput : normalInput}`}
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          {/* BUTON / SUCCESS */}
          <div className="pt-6">
            {success ? (
              <div className="p-5 border-l-4 border-green-600 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                Sistem // {success}
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-5 px-8 font-black uppercase text-[11px] tracking-[0.4em] hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-30"
              >
                {loading ? "Se verifică..." : "Acces Cont"}
              </button>
            )}
          </div>
        </form>

        {/* REGISTER */}
        <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-900 text-center">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Lipsă acreditări?
            <Link
              href="/account"
              className="text-black dark:text-white underline underline-offset-8 hover:opacity-50 transition-opacity ml-3"
            >
              Creează profil client
            </Link>
          </p>
        </div>
      </main>


    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !pass || !confirm) {
      setError("Completează toate câmpurile.");
      return;
    }

    if (pass !== confirm) {
      setError("Parolele nu coincid.");
      return;
    }

    try {
      const res = await fetch("https://siteultau.ro/api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: pass }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Eroare la creare cont.");
      } else {
        setSuccess("Cont creat! Te poți autentifica acum.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } catch (err) {
      setError("Probleme de server. Încearcă mai târziu.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 w-full max-w-md animate-fadeIn">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-wide">
            <span className="text-black dark:text-white">UC</span>
            <span className="text-green-500">ab</span>
            <span className="text-gray-500">.ro</span>
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Creează un cont nou
        </h2>

        {/* NOTIFICATIONS */}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/15 border border-red-500 text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded bg-green-500/15 border border-green-600 text-green-600 text-sm">
            {success}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-5">

          <div>
            <label className="text-gray-700 dark:text-gray-300 font-medium">Nume complet</label>
            <input
              type="text"
              className="w-full px-4 py-3 mt-1 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Popescu Andrei"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-300 font-medium">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 mt-1 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="ex: nume@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-300 font-medium">Parolă</label>
            <input
              type="password"
              className="w-full px-4 py-3 mt-1 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-300 font-medium">Confirmă parola</label>
            <input
              type="password"
              className="w-full px-4 py-3 mt-1 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition shadow-lg"
          >
            Creează cont
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
          <span className="text-gray-500 text-sm">sau</span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
        </div>

        {/* Social login */}
        <div className="space-y-3">
          <button className="w-full py-3 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Image src="/google.webp" width={20} height={20} alt="Google" />
            Creează cont cu Google
          </button>

          <button className="w-full py-3 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Image src="/apple.png" width={20} height={20} alt="Apple" />
            Creează cont cu Apple
          </button>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
          Ai deja cont?{" "}
          <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
            Autentifică-te
          </Link>
        </p>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

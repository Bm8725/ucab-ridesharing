"use client";

import Link from "next/link";

// no router dependency — stable everywhere
export default function NotFound() {
  const handleGoHome = () => {
    if (typeof window !== "undefined") window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-black px-6 py-20 relative overflow-hidden">
      {/* Decorative blurred shapes for WOW effect */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>

      <div className="relative max-w-6xl w-full flex flex-col md:flex-row items-center gap-16">
        {/* Left: Illustration with car */}
        <div className="flex-1 flex items-center justify-center" aria-hidden="true">
          <div className="w-72 h-72 rounded-3xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center backdrop-blur-xl relative">
            {/* Car SVG */}
            <svg className="w-48 h-24" viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="18" width="108" height="18" rx="6" fill="#111827" className="dark:fill-white/90" />
              <rect x="18" y="8" width="64" height="16" rx="4" fill="#10b981" />
              <rect x="84" y="10" width="12" height="8" rx="2" fill="#059669" opacity="0.9" />
              <circle cx="34" cy="38" r="6" fill="#0f172a" />
              <circle cx="86" cy="38" r="6" fill="#0f172a" />
              <circle cx="34" cy="38" r="3" fill="#9ca3af" />
              <circle cx="86" cy="38" r="3" fill="#9ca3af" />
            </svg>
            {/* Wheels shadow animation */}
            <div className="absolute bottom-2 left-0 w-full flex justify-between px-6">
              <div className="w-6 h-6 bg-gray-800 dark:bg-gray-600 rounded-full animate-bounce"></div>
              <div className="w-6 h-6 bg-gray-800 dark:bg-gray-600 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
            404
          </h2>
          <h3 className="mt-2 text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-200 leading-tight">
            Pagina nu a fost găsită
          </h3>

          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-md">
            Ups… pagina căutată nu există sau a fost mutată. Revino la pagina principală și continuă explorarea.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button
              onClick={handleGoHome}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all"
            >
              Înapoi acasă
            </button>

            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-sm"
            >
              Explorează site-ul
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            Dacă ai ajuns aici dintr-un link valid, te rugăm să ne anunți.
          </div>
        </div>
      </div>
    </div>
  );
}

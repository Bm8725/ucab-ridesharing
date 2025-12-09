"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black px-6">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-10">
        {/* Left: Illustration */}
        <div className="flex-1 relative flex items-center justify-center">
          {/* floating cloud / confetti */}
          <div className="absolute -top-10 left-6 opacity-60 animate-float">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-yellow-400">
              <circle cx="12" cy="12" r="6" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute -bottom-10 right-6 opacity-50 animate-float2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-pink-400">
              <circle cx="12" cy="12" r="5" fill="currentColor" />
            </svg>
          </div>

          {/* Road + moving car */}
          <div className="w-full max-w-lg">
            <div className="relative h-40 md:h-48 flex items-end">
              <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-full shadow-sm"></div>

              {/* car wrapper that slides */}
              <div className="absolute left-0 bottom-4 w-36 md:w-44 animate-drive">
                <svg viewBox="0 0 120 48" className="w-full">
                  <g>
                    <rect x="6" y="18" width="108" height="18" rx="6" fill="#111827" className="dark:fill-white/90"></rect>
                    <rect x="18" y="8" width="64" height="16" rx="4" fill="#10b981"></rect>
                    <circle cx="34" cy="38" r="6" fill="#0f172a"></circle>
                    <circle cx="86" cy="38" r="6" fill="#0f172a"></circle>
                    <circle cx="34" cy="38" r="3" fill="#9ca3af"></circle>
                    <circle cx="86" cy="38" r="3" fill="#9ca3af"></circle>
                    <rect x="84" y="10" width="12" height="8" rx="2" fill="#059669" opacity="0.9"></rect>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Text + actions */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-6xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight leading-tight">
            404
          </h2>
          <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200">
            Pagina nu a fost găsită
          </h3>

          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
            Îmi pare rău — linkul pe care l-ai accesat nu există sau a fost mutat. Poți merge înapoi acasă sau folosi căutarea.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
            <button
              onClick={() => router.push("/")}
              className="px-5 py-3 bg-black text-white rounded-lg font-medium shadow hover:bg-gray-800 transition"
            >
              Du-mă acasă
            </button>

            <Link
              href="/"
              className="px-5 py-3 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Explorează site-ul
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            Dacă ai ajuns aici dintr-un link valid, <button onClick={() => alert("Mulțumim — vom verifica link-ul!") } className="underline">raportează problema</button>.
          </div>
        </div>
      </div>

      {/* Styled JSX for keyframes and precise small animations */}
      <style jsx>{`
        .animate-drive {
          animation: drive 4.5s linear infinite;
        }
        @keyframes drive {
          0% { transform: translateX(-10%) translateY(0) rotate(0deg); }
          30% { transform: translateX(35%) translateY(-6px) rotate(-1deg); }
          60% { transform: translateX(75%) translateY(0) rotate(0deg); }
          100% { transform: translateX(110%) translateY(4px) rotate(1deg); }
        }

        .animate-float {
          animation: floaty 4s ease-in-out infinite;
        }
        .animate-float2 {
          animation: floaty 5s ease-in-out infinite reverse;
        }
        @keyframes floaty {
          0% { transform: translateY(0) scale(1); opacity: 0.9; }
          50% { transform: translateY(-8px) scale(1.06); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 0.9; }
        }

        /* small responsive tweaks */
        @media (max-width: 640px) {
          .animate-drive { animation-duration: 6s; }
        }
      `}</style>
    </div>
  );
}

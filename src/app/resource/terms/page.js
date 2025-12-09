"use client";

// Next.js client component (JavaScript + Tailwind)
// Save as: /app/legal/page.js or /components/LegalComponent.js

import { useState, useMemo } from "react";

export default function LegalComponent() {
  // ------------------------------
  // CONTENT
  // ------------------------------
  const data = useMemo(() => ({
    terms: {
      title: "Termeni și condiții",
      sections: [
        { id: "intro", heading: "1. Introducere", body: "Acești termeni guvernează utilizarea site-ului." },
        { id: "use", heading: "2. Utilizarea site-ului", body: "Este interzisă folosirea site-ului în scop ilegal." }
      ]
    },
    cookies: {
      title: "Politica Cookies",
      sections: [
        { id: "c1", heading: "Ce sunt cookies", body: "Cookies sunt fișiere salvate pentru îmbunătățirea experienței." }
      ]
    },
    refunds: {
      title: "Politica de rambursări",
      sections: [
        { id: "r1", heading: "Rambursări", body: "Returnările sunt acceptate în 14 zile." }
      ]
    },
    contact: {
      title: "Contact",
      sections: [
        { id: "ct1", heading: "Informații", body: "Email: contact@site.ro" }
      ]
    }
  }), []);

  const tabs = Object.keys(data);
  const [active, setActive] = useState("terms");

  const activeDoc = data[active];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">

        {/* SIDEBAR */}
        <aside className="w-full md:w-1/4 space-y-4">
          <div className="p-4 border rounded-xl shadow-sm bg-white sticky top-6">
            <h3 className="text-lg font-semibold mb-2">Documente</h3>
            <nav className="flex flex-col gap-2 text-sm">
              {tabs.map(key => (
                <button
                  key={key}
                  onClick={() => { setActive(key); }}
                  className={`text-left py-2 px-3 rounded-md transition ${active === key ? "bg-blue-100 font-semibold" : "hover:bg-slate-100"}`}
                >
                  {data[key].title}
                </button>
              ))}
            </nav>

            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1 border rounded-md" onClick={() => window.print()}>Print</button>
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="w-full md:w-3/4 space-y-6">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{activeDoc.title}</h1>
              <p className="text-sm text-gray-500">Ultima actualizare: {new Date().toLocaleDateString()}</p>
            </div>
            <button onClick={() => window.print()} className="px-3 py-1 border rounded-md">Print</button>
          </header>

          {activeDoc.sections.map(sec => (
            <section key={sec.id} id={sec.id} className="mb-6">
              <h2 className="text-xl font-semibold">{sec.heading}</h2>
              <p className="mt-2 text-gray-700">{sec.body}</p>
            </section>
          ))}

        </main>
      </div>
    </div>
  );
}

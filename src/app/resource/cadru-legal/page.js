"use client";

import { useState, useMemo } from "react";

export default function TransportLegalComponent() {
  const data = useMemo(() => ({
    transport: {
      title: "Cadrul legal - Transport alternativ",
      sections: [
        { id: "l1", heading: "1. Legislație generală", body: "Legea nr. 55/2020 reglementează serviciile de transport alternativ (ridesharing), iar HG nr. 30/2015 reglementează utilizarea trotinetelor electrice și bicicletelor în orașe." },
        { id: "l2", heading: "2. Reguli de circulație", body: "Codul Rutier, art. 72 și 73, stabilește regulile pentru vehicule electrice ușoare. Utilizatorii trebuie să poarte echipament de protecție, să respecte limita de viteză și să utilizeze parcările dedicate." },
        { id: "l3", heading: "3. Răspunderea operatorului", body: "Operatorii de transport alternativ trebuie să asigure asigurare RCA și respectarea normelor de siguranță, conform Legii 55/2020." },
        { id: "l4", heading: "4. Protecția datelor", body: "Colectarea datelor prin aplicații mobile se face conform GDPR, pentru monitorizarea serviciului și comunicarea cu utilizatorul." },
        { id: "l5", heading: "5. Contact legal și autorități", body: "Pentru aspecte legale, contactați Autoritatea Rutieră Română (ARR) sau Poliția Rutieră. Email: legal@ucab.ro" }
      ]
    }
  }), []);

  const tabs = Object.keys(data);
  const [active, setActive] = useState("transport");
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
                  onClick={() => setActive(key)}
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
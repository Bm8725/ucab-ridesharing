"use client";

import { useState, useMemo } from "react";

export default function SafetyProtectionComponent() {
  const data = useMemo(() => ({
safety: {
  title: "Siguranță și protecție",
  sections: [
    { id: "s1", heading: "1. Siguranța livratorului", body: "Livratorii trebuie să poarte echipament de protecție: casca, veste reflectorizante, genunchiere și cotiere, să fie instruiți corespunzător privind manipularea vehiculului și a coletelor și să respecte strict normele de circulație. Este recomandată verificarea zilnică a stării vehiculului înainte de plecare și respectarea timpilor de odihnă pentru a preveni accidentele și oboseala." },
    { id: "s2", heading: "2. Siguranța șoferului/operatorului", body: "Vehiculul trebuie să fie întreținut regulat: frâne, lumini, stare baterie și alte componente critice. Șoferul trebuie să respecte timpii legali de odihnă și să nu opereze sub influența oboselii sau a substanțelor interzise. Operatorul trebuie să dețină toate asigurările obligatorii (RCA, accidente, răspundere civilă) și să asigure instruirea angajaților în privința normelor de siguranță și a procedurilor de urgență." },
    { id: "s3", heading: "3. Siguranța clientului", body: "Clientul trebuie informat clar asupra utilizării corecte a vehiculului/serviciului, inclusiv restricții și recomandări pentru prevenirea accidentelor. Protecția datelor personale se face conform GDPR, iar toate informațiile colectate sunt folosite exclusiv pentru funcționarea serviciului și securizarea livrărilor. Clientul trebuie să respecte instrucțiunile de preluare și livrare a bunurilor și să raporteze imediat orice incident sau deteriorare." },
    { id: "s4", heading: "4. Reguli generale", body: "Proceduri de urgență: în caz de accident sau incident, se contactează autoritățile competente și se raportează imediat operatorului. Limitarea vitezei trebuie respectată conform regulilor locale și tipului de vehicul. Recomandări generale: purtați echipament vizibil, nu utilizați telefoane sau alte dispozitive în timpul deplasării, respectați pietonii și ceilalți participanți la trafic. Operatorul trebuie să monitorizeze conformitatea și să ofere instruire periodică privind siguranța și prevenirea accidentelor." }
  ]
}
  }), []);

  const tabs = Object.keys(data);
  const [active, setActive] = useState("safety");
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

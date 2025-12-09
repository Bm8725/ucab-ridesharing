"use client";

import { useState, useMemo } from "react";

export default function ContractSelectionComponent() {
  const data = useMemo(() => ({
   contract: {
title: "Model contract",
sections: [
{
id: "c1",
heading: "Contract Livrator",
chapters: [
{ id: "c1a", title: "Capitol 1: Părțile contractante", content: "Acest contract este încheiat între Operator și Livrator. Datele de identificare și informațiile personale vor fi completate conform anexelor specifice. Operatorul se angajează să furnizeze echipamentele și instruirea necesară, iar Livratorul se obligă să respecte toate regulile interne și legale aplicabile." },
{ id: "c1b", title: "Capitol 2: Obiectul contractului", content: "Obiectul contractului constă în prestarea serviciilor de livrare a bunurilor către clienți conform instrucțiunilor Operatorului și legislației aplicabile. Serviciile includ preluarea, transportul, livrarea și raportarea incidentelor, precum și respectarea standardelor de calitate și siguranță." },
{ id: "c1c", title: "Capitol 3: Obligațiile Livratorului", content: "Livratorul se obligă să respecte normele de siguranță rutieră, să manipuleze coletele cu atenție, să raporteze orice incident sau deteriorare, să respecte programul și procedurile Operatorului și să păstreze confidențialitatea datelor clienților și a Operatorului." },
{ id: "c1d", title: "Capitol 4: Drepturile Livratorului", content: "Livratorul are dreptul la remunerare conform contractului, la protecția datelor personale, la echipamentele necesare și la instruire periodică privind siguranța și procedurile interne. De asemenea, poate solicita suport pentru probleme apărute în timpul livrărilor." },
{ id: "c1e", title: "Capitol 5: Durata și încetarea contractului", content: "Contractul se poate încheia pe durată determinată sau nedeterminată. Încetarea poate avea loc prin notificare scrisă, neîndeplinirea obligațiilor, încetarea activității Operatorului sau alte condiții stipulate în contract. Toate părțile trebuie să respecte procedurile de returnare a echipamentelor și închiderea responsabilităților financiare." }
]
},
{
id: "c2",
heading: "Contract Șofer/Partener",
chapters: [
{ id: "c2a", title: "Capitol 1: Părțile contractante", content: "Contractul este încheiat între Operator și Șofer/Partener. Datele exacte, inclusiv identitatea și informațiile vehiculului, vor fi completate în anexele contractuale. Operatorul se obligă să ofere suport și instrucțiuni, iar Șoferul/Partenerul să respecte regulile de circulație și procedurile interne." },
{ id: "c2b", title: "Capitol 2: Obiectul contractului", content: "Furnizarea serviciilor de transport și livrare în condiții de siguranță și conform instrucțiunilor Operatorului. Serviciile includ preluarea, transportul și livrarea bunurilor, respectarea timpilor de odihnă, întreținerea vehiculului și raportarea incidentelor." },
{ id: "c2c", title: "Capitol 3: Obligațiile Șoferului/Partenerului", content: "Șoferul/Partenerul se obligă să respecte legislația rutieră, să asigure întreținerea vehiculului, să respecte timpii de odihnă, să raporteze incidentele, să păstreze confidențialitatea datelor clienților și să urmeze instrucțiunile Operatorului privind livrările și siguranța." },
{ id: "c2d", title: "Capitol 4: Drepturile Șoferului/Partenerului", content: "Dreptul la remunerare, protecție legală, instruire periodică, acces la echipamente adecvate și suport în caz de incidente. Șoferul/Partenerul poate solicita clarificări și actualizări ale procedurilor de livrare." },
{ id: "c2e", title: "Capitol 5: Durata și încetarea contractului", content: "Contractul poate fi pe durată determinată sau nedeterminată. Încetarea se poate face prin notificare scrisă, neîndeplinirea obligațiilor, acordul părților sau conform legislației aplicabile. Procedurile de predare a vehiculului și de închidere a responsabilităților financiare trebuie respectate." }
]
},
{
id: "c3",
heading: "Contract Partener",
chapters: [
{ id: "c3a", title: "Capitol 1: Părțile contractante", content: "Contractul este încheiat între Operator și Partener (ex. magazin sau firmă colaboratoare). Informațiile detaliate vor fi completate în anexele contractuale. Operatorul oferă suport și instruire pentru partener, iar partenerul se angajează să respecte standardele Operatorului." },
{ id: "c3b", title: "Capitol 2: Obiectul contractului", content: "Furnizarea bunurilor și serviciilor conform standardelor Operatorului, inclusiv termene de livrare, calitate și proceduri de comunicare cu Operatorul. Partenerul trebuie să respecte regulile interne și legislația aplicabilă." },
{ id: "c3c", title: "Capitol 3: Obligațiile Partenerului", content: "Respectarea termenelor de livrare, asigurarea calității bunurilor și serviciilor, comunicarea corectă și promptă cu Operatorul, păstrarea confidențialității datelor și respectarea procedurilor interne stabilite de Operator." },
{ id: "c3d", title: "Capitol 4: Drepturile Partenerului", content: "Dreptul la remunerare conform contractului, protecția informațiilor, suport și instruire din partea Operatorului, posibilitatea de a solicita clarificări sau modificări ale procedurilor." },
{ id: "c3e", title: "Capitol 5: Durata și încetarea contractului", content: "Contractul poate fi pe durată determinată sau nedeterminată. Încetarea se poate face prin notificare scrisă, neîndeplinirea obligațiilor sau acordul părților. Toate responsabilitățile financiare și procedurile administrative trebuie finalizate înainte de încetare." }
]
}
]
}
  }), []);

  const tabs = data.contract.sections.map(sec => sec.heading);
  const [active, setActive] = useState(tabs[0]);
  const activeSection = data.contract.sections.find(sec => sec.heading === active);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">

        {/* SIDEBAR */}
        <aside className="w-full md:w-1/4 space-y-4">
          <div className="p-4 border rounded-xl shadow-sm bg-white sticky top-6">
            <h3 className="text-lg font-semibold mb-2">Selectați contractul</h3>
            <nav className="flex flex-col gap-2 text-sm">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActive(tab)}
                  className={`text-left py-2 px-3 rounded-md transition ${active === tab ? "bg-blue-100 font-semibold" : "hover:bg-slate-100"}`}
                >
                  {tab}
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
          {activeSection.chapters.map(chapter => (
            <section key={chapter.id} className="mb-6">
              <h2 className="text-xl font-semibold">{chapter.title}</h2>
              <p className="mt-2 text-gray-700">{chapter.content}</p>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

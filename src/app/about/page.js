"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Calendar, Flag, Rocket, MapPin } from "lucide-react";

export default function About() {
  const roadmapSteps = [
    {
      icon: <Calendar size={24} className="text-blue-500" />,
      title: "Planificare",
      date: "septembrie 2025",
      description: "Stabilirea echipei, obiectivelor și conceptului UCab."
    },
    {
      icon: <Flag size={24} className="text-blue-500" />,
      title: "Dezvoltare Aplicații",
      date: "noiembrie 2025 - Mai 2026",
      description: "Crearea aplicațiilor UCab App și UCab Food, web platform, dashboard business adminitration, testarea funcționalităților."
    },
    {
      icon: <Rocket size={24} className="text-blue-500" />,
      title: "Pilot Test. Atestare oficiala",
      date: "Iunie 2026",
      description: "Testare în Târgoviște si Bucuresti cu șoferi și clienți reali. Obtinere aviz de la autorități."
    },
    {
      icon: <MapPin size={24} className="text-blue-500" />,
      title: "Lansare Oficială",
      date: "1 decembrie 2026",
      description: "Aplicațiile disponibile public, extindere graduală la nivel national"
    },
  ];

  const lineRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);

  // Control individual pentru fiecare milestone
  const stepRefs = roadmapSteps.map(() => useRef(null));
  const stepInViews = stepRefs.map((ref) => useInView(ref, { margin: "-100px" }));

  useEffect(() => {
    // Înălțimea liniei până la ultimul milestone vizibil
    const visibleIndex = stepInViews.reduce((acc, inView, idx) => (inView ? idx : acc), -1);
    if (lineRef.current && visibleIndex >= 0) {
      const lastStep = stepRefs[visibleIndex].current;
      if (lastStep) {
        const lineTop = lineRef.current.getBoundingClientRect().top;
        const stepCenter = lastStep.getBoundingClientRect().top + lastStep.offsetHeight / 2;
        setLineHeight(stepCenter - lineTop);
      }
    }
  }, [stepInViews]);

  return (
    <div className="bg-gray-50 text-gray-900">

      {/* HERO */}
      <section className="py-20 md:py-32 px-6 bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Despre <span className="text-blue-600">UCab</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto"
          >
            UCab înseamnă profesionalism, transparență și inovație. Servicii de transport și livrări rapide, dedicate comunității și afacerilor locale. Acesta este un start-up românesc construit pentru români si care este in faza de inceput, cu mare potential de crestere. In momentul actual se lucreaza la aplicatiile mobile si la platforma web pentru administrare. <strong>IN MOMENTUL DE FATA NU ESTE OPERABILA PLATFORMA! VA MULTUMIM PENTRU SPRIJIN SI ATENTIE! </strong> 
          </motion.p>
        </div>
      </section>

      {/* ROADMAP CORPORATIST */}
      <section className="py-20 md:py-28 px-6 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Roadmap UCab</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Etapele planificate pentru lansarea și extinderea serviciilor UCab.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Linie verticală statică (fundal) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200 rounded"></div>

          {/* Linie verticală animată progresiv */}
          <motion.div
            ref={lineRef}
            className="absolute left-1/2 transform -translate-x-1/2 w-1 rounded"
            style={{
              height: lineHeight,
              background: "linear-gradient(to bottom, #3b82f6, #60a5fa)",
              transition: "height 0.5s ease-out",
            }}
          ></motion.div>

          <div className="space-y-20">
            {roadmapSteps.map((step, index) => (
              <div
                key={index}
                ref={stepRefs[index]}
                className={`flex flex-col md:flex-row items-center md:justify-${index % 2 === 0 ? 'start' : 'end'} relative`}
              >
                {/* Punct animat */}
                <motion.div
                  className="z-10 bg-white rounded-full p-3 border-2 border-blue-500 flex items-center justify-center -translate-x-1/2 md:translate-x-0 absolute left-1/2 md:static"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.3 }}
                >
                  {step.icon}
                </motion.div>

                {/* Card step */}
                <motion.div
                  className={`bg-gray-50 p-6 rounded-lg shadow-md max-w-md md:w-1/2 ${index % 2 === 0 ? 'ml-8 md:ml-12' : 'mr-8 md:mr-12'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.3 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <h3 className="font-semibold text-xl text-blue-600">{step.title}</h3>
                  <p className="text-gray-500 text-sm mb-2">{step.date}</p>
                  <p className="text-gray-700 text-sm">{step.description}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 text-center px-6 bg-gray-50 border-t border-gray-200">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Alătură-te UCab</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Începe să folosești UCab pentru transport și livrări rapide sau devino partener ucab.ro.
        </p>
        <a
          href="/driver/"
          className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
        >
          Începe cu UCab
        </a>
      </section>

    </div>
  );
}

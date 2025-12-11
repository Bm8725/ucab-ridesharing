"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUtensils, FaStore, FaEnvelope, FaCheckCircle, FaHandshake, FaMapMarkerAlt } from "react-icons/fa";

export default function RestaurantPartnerForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    restaurantName: "",
    cuisineType: "",
    licenseNumber: "",
    region: "",
    city: "",
    acceptedPolicy: false,
  });
  const [completedFields, setCompletedFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const steps = [
    { id: 1, label: "Confirmare", icon: <FaHandshake /> },
    { id: 2, label: "Date Personale", icon: <FaStore /> },
    { id: 3, label: "Contact", icon: <FaEnvelope /> },
    { id: 4, label: "Finalizare", icon: <FaCheckCircle /> },
  ];

  useEffect(() => {
    const fields = [];
    if (formData.name) fields.push("name");
    if (formData.restaurantName) fields.push("restaurantName");
    if (formData.cuisineType) fields.push("cuisineType");
    if (formData.licenseNumber) fields.push("licenseNumber");
    if (formData.region) fields.push("region");
    if (formData.city) fields.push("city");
    if (formData.email) fields.push("email");
    setCompletedFields(fields);
  }, [formData]);

  const handleNext = () => setStep(Math.min(step + 1, steps.length));
  const handlePrev = () => setStep(Math.max(step - 1, 1));

  const handleSubmit = async () => {
    if (!formData.acceptedPolicy) {
      setMessage("Trebuie să accepți politica de confidențialitate.");
      setIsError(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://api.doxer.ro/api/partner_restaurant.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Cererea a fost trimisă cu succes!");
        setIsError(false);
        setFormData({
          name: "",
          email: "",
          restaurantName: "",
          cuisineType: "",
          licenseNumber: "",
          region: "",
          city: "",
          acceptedPolicy: false,
        });
        setStep(1);
        setCompletedFields([]);
      } else {
        setMessage(data.error || "A apărut o eroare.");
        setIsError(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("Eroare de server.");
      setIsError(true);
    }
    setLoading(false);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white transition flex items-center gap-3";

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <img src="/burgerucab.png" alt="Background Burger" className="absolute inset-0 w-full h-full object-cover brightness-50" />
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 w-full max-w-4xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-16 space-y-8">
             <div className="flex justify-center mb-4">
          <img src="/ucabro.png" alt="UCab Logo" className="h-15 md:h-23 w-auto object-contain" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-2">Devino Partener Restaurant</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 text-lg md:text-xl">
          Completează formularul pentru a deveni restaurant partener UCab Food Delivery.
        </p>

        {/* Step progress */}
        <div className="relative flex items-center justify-between mb-12">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300 dark:bg-gray-600 z-0 -translate-y-1/2"></div>
          <motion.div
            className="absolute top-1/2 h-1 bg-green-500 z-0 -translate-y-1/2 origin-left"
            initial={{ width: 0 }}
            animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
          {steps.map((s, index) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center">
              <motion.div
                className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full text-white ${
                  step > index ? "bg-green-500" : step === index + 1 ? "bg-blue-500" : "bg-gray-400 dark:bg-gray-600"
                }`}
                animate={{ scale: step === index + 1 ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {step > index ? <FaCheckCircle size={24} /> : s.icon}
              </motion.div>
              <span className="mt-2 text-xs md:text-sm text-center text-gray-700 dark:text-gray-300">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Message */}
        {message && (
          <motion.div
            key="msg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-3 rounded text-sm md:text-base text-center ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          >
            {message}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <p className="text-center text-gray-700 dark:text-gray-300 text-lg md:text-xl">
                Te rugăm să confirmi că vrei să devii **partener restaurant UCab**.
              </p>
              <div className="flex justify-center gap-8 mt-6">
                <button
                  className="flex flex-col items-center px-8 py-6 rounded-2xl font-semibold shadow-lg bg-green-500 text-white hover:bg-green-600 transition transform hover:scale-105"
                  onClick={handleNext}
                >
                  <FaUtensils size={48} className="mb-2" /> Continuă
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Personal Data */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-lg md:text-xl">Nume complet</label>
                <div className={inputClass}>
                  <FaStore className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nume complet"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent focus:outline-none text-lg md:text-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-lg md:text-xl">Nume restaurant</label>
                <div className={inputClass}>
                  <FaUtensils className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nume restaurant"
                    value={formData.restaurantName}
                    onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                    className="w-full bg-transparent focus:outline-none text-lg md:text-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-lg md:text-xl">Tip bucătărie</label>
                <input
                  type="text"
                  placeholder="Ex: Italian, Sushi, Fast Food"
                  value={formData.cuisineType}
                  onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-lg md:text-xl">Număr licență / CIF</label>
                <input
                  type="text"
                  placeholder="Licența restaurantului"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className={inputClass}
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Contact + Location */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-lg md:text-xl">Email</label>
                <div className={inputClass}>
                  <FaEnvelope className="text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent focus:outline-none text-lg md:text-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-lg md:text-xl">Regiune</label>
                <div className={inputClass}>
                  <FaMapMarkerAlt className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Județ / Regiune"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full bg-transparent focus:outline-none text-lg md:text-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2 text-lg md:text-xl">Oraș</label>
                <div className={inputClass}>
                  <FaMapMarkerAlt className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Oraș"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-transparent focus:outline-none text-lg md:text-xl"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Finalizare */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-6 md:space-y-8">
              <p className="text-center text-gray-700 dark:text-gray-300 text-lg md:text-xl">
                Cererea ta a fost completată! Apasă „Trimite cererea” pentru a deveni partener UCab Food Delivery.
              </p>
              <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-2 text-lg md:text-xl">
                <input
                  type="checkbox"
                  checked={formData.acceptedPolicy}
                  onChange={() => setFormData({ ...formData, acceptedPolicy: !formData.acceptedPolicy })}
                  className="rounded border-gray-300 focus:ring-2 focus:ring-green-500"
                />
                Accept Politica de Confidențialitate
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button onClick={handlePrev} className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-lg md:text-xl">
              Înapoi
            </button>
          )}
          {step < 4 && (
            <button onClick={handleNext} className="px-6 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition text-lg md:text-xl">
              Următor
            </button>
          )}
          {step === 4 && (
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 text-lg md:text-xl">
              {loading ? "Se încarcă..." : "Trimite cererea"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

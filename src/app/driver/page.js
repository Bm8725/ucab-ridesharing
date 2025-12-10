"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCar, FaBicycle, FaUser, FaEnvelope, FaCheckCircle, FaMotorcycle } from "react-icons/fa";

export default function RequestFormPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("driver");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    carBrand: "",
    carModel: "",
    carType: "",
    carYear: "",
    plateNumber: "",
    vehicle: "",
    acceptedPolicy: false,
  });
  const [completedFields, setCompletedFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const vehicleOptions = ["Bicicletă", "Trotinetă Electrică", "Scuter", "Motocicletă"];
  const carBrands = ["Toyota", "BMW", "Mercedes", "Audi", "Ford"];
  const carModels = {
    Toyota: ["Corolla", "Yaris", "RAV4"],
    BMW: ["X3", "X5", "3 Series"],
    Mercedes: ["C Class", "E Class", "GLA"],
    Audi: ["A3", "A4", "Q5"],
    Ford: ["Focus", "Fiesta", "Kuga"],
  };
  const carTypes = ["Sedan", "Hatchback", "SUV", "Pickup", "Coupe"];
  const carYears = Array.from({ length: 30 }, (_, i) => `${2025 - i}`);

  useEffect(() => {
    const fields = [];
    if (formData.name) fields.push("name");
    if (formData.email) fields.push("email");
    if (role === "driver") {
      if (formData.carBrand) fields.push("carBrand");
      if (formData.carModel) fields.push("carModel");
      if (formData.carType) fields.push("carType");
      if (formData.carYear) fields.push("carYear");
      if (formData.plateNumber) fields.push("plateNumber");
    }
    if (role === "courier" && formData.vehicle) fields.push("vehicle");
    setCompletedFields(fields);
  }, [formData, role]);

  const handleNext = () => setStep(Math.min(step + 1, 5));
  const handlePrev = () => setStep(Math.max(step - 1, 1));

  const handleSubmit = async () => {
    if (!formData.acceptedPolicy) {
      setMessage("Trebuie să accepți politica de confidențialitate.");
      setIsError(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://siteultau.ro/api/request.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          name: formData.name,
          email: formData.email,
          carBrand: role === "driver" ? formData.carBrand : "",
          carModel: role === "driver" ? formData.carModel : "",
          carType: role === "driver" ? formData.carType : "",
          carYear: role === "driver" ? formData.carYear : "",
          plateNumber: role === "driver" ? formData.plateNumber : "",
          vehicle: role === "courier" ? formData.vehicle : "",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Cererea a fost trimisă cu succes!");
        setIsError(false);
        setFormData({
          name: "",
          email: "",
          carBrand: "",
          carModel: "",
          carType: "",
          carYear: "",
          plateNumber: "",
          vehicle: "",
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

  const stepIcons = [
    { id: 1, label: "Rol", icon: role === "driver" ? <FaCar /> : <FaBicycle /> },
    { id: 2, label: "Nume", icon: <FaUser /> },
    { id: 3, label: "Email", icon: <FaEnvelope /> },
    { id: 4, label: role === "driver" ? "Mașină" : "Vehicul", icon: role === "driver" ? <FaCar /> : <FaBicycle /> },
    { id: 5, label: "Finalizare", icon: <FaCheckCircle /> },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <img src="/ucab2.png" alt="UCab Background" className="absolute inset-0 w-full h-full object-cover brightness-50" />
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 w-full max-w-5xl md:mx-12 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-16 space-y-8 backdrop-blur-sm overflow-y-auto max-h-screen">
        <div className="flex justify-center mb-4">
          <img src="/ucabro.png" alt="UCab Logo" className="h-15 md:h-23 w-auto object-contain" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-2">Formular de Cerere</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 text-lg md:text-xl">
          Completează pașii de mai jos pentru a trimite cererea ta.
        </p>

        <div className="flex justify-between mb-10">
          {stepIcons.map((s) => (
            <div key={s.id} className="flex flex-col items-center relative">
              <motion.div
                className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full text-white ${
                  completedFields.length >= s.id - 1 ? "bg-green-500" : step === s.id ? "bg-blue-500" : "bg-gray-400 dark:bg-gray-600"
                }`}
                animate={{ scale: completedFields.length >= s.id - 1 ? 1.3 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {completedFields.length >= s.id - 1 ? <FaCheckCircle size={24} /> : s.icon}
              </motion.div>
              <span className="mt-2 text-xs md:text-sm text-gray-700 dark:text-gray-300">{s.label}</span>
              {s.id < stepIcons.length && (
                <motion.div
                  className={`absolute top-6 md:top-7 left-14 md:left-20 w-16 h-1 ${completedFields.length >= s.id ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"} rounded-full`}
                  layout
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          ))}
        </div>

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
          {/* Steps */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="flex justify-around gap-6 md:gap-12">
              <button
                className={`flex flex-col items-center px-8 py-6 md:px-12 md:py-8 rounded-2xl font-semibold shadow-lg transition transform hover:scale-105 ${
                  role === "driver" ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setRole("driver")}
              >
                <FaCar size={48} className="mb-2" /> Șofer
              </button>
              <button
                className={`flex flex-col items-center px-8 py-6 md:px-12 md:py-8 rounded-2xl font-semibold shadow-lg transition transform hover:scale-105 ${
                  role === "courier" ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
                onClick={() => setRole("courier")}
              >
                <FaBicycle size={48} className="mb-2" /> Livrator
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-lg md:text-xl">Nume complet</label>
              <div className={inputClass}>
                <FaUser className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Nume complet"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent focus:outline-none text-lg md:text-xl"
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
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
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-4 md:space-y-6">
              {role === "driver" && (
                <>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-lg md:text-xl">Marca</label>
                  <select
                    value={formData.carBrand}
                    onChange={(e) => setFormData({ ...formData, carBrand: e.target.value, carModel: "" })}
                    className={inputClass}
                  >
                    <option value="">Selectează marca</option>
                    {carBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>

                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-lg md:text-xl">Model</label>
                  <select
                    value={formData.carModel}
                    onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                    className={inputClass}
                    disabled={!formData.carBrand}
                  >
                    <option value="">Selectează modelul</option>
                    {formData.carBrand && carModels[formData.carBrand].map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>

                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-lg md:text-xl">Tip</label>
                  <select value={formData.carType} onChange={(e) => setFormData({ ...formData, carType: e.target.value })} className={inputClass}>
                    <option value="">Selectează tipul</option>
                    {carTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>

                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-lg md:text-xl">An</label>
                  <select value={formData.carYear} onChange={(e) => setFormData({ ...formData, carYear: e.target.value })} className={inputClass}>
                    <option value="">Selectează anul</option>
                    {carYears.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>

                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-lg md:text-xl">Număr înmatriculare</label>
                  <div className={inputClass}>
                    <FaCar className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Număr înmatriculare"
                      value={formData.plateNumber}
                      onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                      className="w-full bg-transparent focus:outline-none text-lg md:text-xl"
                    />
                  </div>
                </>
              )}

              {role === "courier" && (
                <>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-lg md:text-xl">Tip vehicul</label>
                  <select value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })} className={inputClass}>
                    <option value="">Selectează vehicul</option>
                    {vehicleOptions.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </>
              )}

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

"use client";

import { useState, useEffect } from "react";
import { FaCoins, FaChartLine } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function InvestorsForm() {
  const [selectedTier, setSelectedTier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    message: "",
    acceptedPolicy: false,
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const investmentTiers = [
    { id: 1, label: "Investor Basic", minAmount: 99, benefits: ["Acces la rapoarte trimestriale"] },
    { id: 2, label: "Investor Activ", minAmount: 2499, benefits: ["Rapoarte + întâlniri lunare"] },
    { id: 3, label: "Investor Gold", minAmount: 4999, benefits: ["Board consultativ + toate beneficiile"] },
  ];

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.amount) {
      setFeedback({ type: "error", message: "Completează toate câmpurile obligatorii." });
      return;
    }
    if (!validateEmail(formData.email)) {
      setFeedback({ type: "error", message: "Email invalid." });
      return;
    }
    if (!formData.acceptedPolicy) {
      setFeedback({ type: "error", message: "Trebuie să accepți politica de confidențialitate." });
      return;
    }
    if (selectedTier && Number(formData.amount) < investmentTiers.find(t => t.id === selectedTier).minAmount) {
      setFeedback({ type: "error", message: `Investiția minimă pentru acest tier este ${investmentTiers.find(t => t.id === selectedTier).minAmount}€.` });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("https://api.doxer.ro/api/investor_request.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: selectedTier, ...formData }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setFeedback({ type: "success", message: data.message || "Cererea ta a fost trimisă cu succes!" });
        setFormData({ name: "", email: "", amount: "", message: "", acceptedPolicy: false });
        setSelectedTier(null);
      } else {
        setFeedback({ type: "error", message: data.message || "A apărut o eroare." });
      }
    } catch (err) {
      setFeedback({ type: "error", message: "Eroare de conexiune cu serverul." });
    }

    setLoading(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-4 md:p-12">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-2">
          <FaCoins /> Investitori Strategici
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mt-2 text-lg md:text-xl">
          Alege nivelul de implicare și completează formularul pentru a susține proiectul.
        </p>
      </div>

      {/* Investment Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
        {investmentTiers.map((tier) => (
          <motion.div
            key={tier.id}
            onClick={() => setSelectedTier(tier.id)}
            className={`p-6 rounded-2xl cursor-pointer border-2 shadow-lg transition-all duration-300 ${
              selectedTier === tier.id ? "border-blue-500 bg-blue-50 scale-105" : "border-gray-300 bg-white"
            }`}
            whileHover={{ scale: 1.05 }}
            layout
          >
            <h4 className="text-xl font-semibold mb-2">{tier.label}</h4>
            <p className="text-gray-600 mb-2">Min. Investiție: {tier.minAmount}€</p>
            <ul className="list-disc list-inside text-gray-700">
              {tier.benefits.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Form */}
      <AnimatePresence mode="wait">
        {selectedTier && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 md:p-12 space-y-4"
          >
            {feedback && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-3 rounded text-center ${feedback.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {feedback.message}
              </motion.div>
            )}
            <input
              type="text"
              placeholder="Nume complet"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Sumă investiție (€)"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Mesaj / observații"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <label className="flex items-center gap-2 text-gray-700 mt-2">
              <input
                type="checkbox"
                checked={formData.acceptedPolicy}
                onChange={() => setFormData({ ...formData, acceptedPolicy: !formData.acceptedPolicy })}
                className="rounded border-gray-300 focus:ring-2 focus:ring-gray-500"
              />
              Accept Politica de Confidențialitate și Termenii
            </label>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition mt-2 disabled:opacity-50"
            >
              {loading ? "Se trimite..." : "Trimite cererea"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats / Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-12 text-center mt-12 w-full max-w-5xl">
        <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
          <FaChartLine /> Statistici & Impact
        </h3>
        <p className="text-gray-600 mt-4 text-lg">
          În curând vom afișa grafice cu investițiile și impactul lor asupra dezvoltării proiectului.
        </p>
      </div>
    </div>
  );
}

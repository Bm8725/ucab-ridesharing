"use client";

import { useState } from "react";
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

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.amount) {
      setFeedback({ type: "error", message: "Completează toate câmpurile obligatorii." });
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
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12 font-sans">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <FaCoins /> Investitori Strategici
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Alege nivelul de implicare și completează formularul pentru a susține proiectul.
        </p>
      </div>

      {/* Investment Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {investmentTiers.map((tier) => (
          <div
            key={tier.id}
            onClick={() => setSelectedTier(tier.id)}
            className={`p-6 rounded-2xl cursor-pointer border-2 transition hover:scale-105 shadow-md ${
              selectedTier === tier.id ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white dark:bg-gray-800"
            }`}
          >
            <h4 className="text-xl font-semibold mb-2">{tier.label}</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-2">Min. Investiție: {tier.minAmount}€</p>
            <ul className="text-gray-700 dark:text-gray-200 list-disc list-inside space-y-1">
              {tier.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
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
            transition={{ duration: 0.3 }}
            className="mt-6 space-y-4 text-left max-w-xl mx-auto"
          >
            {feedback && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
              className="w-full py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition font-semibold mt-2"
            >
              {loading ? "Se trimite..." : "Trimite cererea"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats / Info */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-12 shadow-lg text-center mt-12">
        <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
          <FaChartLine /> Statistici & Impact
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg">
          În curând vom afișa grafice cu investițiile și impactul lor asupra dezvoltării proiectului.
        </p>
      </div>
    </div>
  );
}

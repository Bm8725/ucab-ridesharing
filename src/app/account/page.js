"use client";

import { useState } from "react";

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    paymentMethod: "",
    acceptPolicy: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!formData.acceptPolicy) return;
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Cont creat cu succes!");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        setErrorMsg(data.message || "Eroare server");
      }
    } catch {
      setErrorMsg("Eroare server");
    }
    setLoading(false);
  };

  /* ---------- Progress Uber-style ---------- */
  const steps = ["Info", "Contact", "Plată", "Politică"];

  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="p-6 text-center">
        <h1 className="text-3xl font-bold">UCab.ro</h1>
        <p className="text-gray-500">Creare cont client</p>
      </header>

      {/* Progress bar */}
      <div className="max-w-3xl w-full mx-auto px-6">
        <div className="relative h-1 bg-gray-300 rounded-full">
          <div
            className="absolute h-1 bg-black rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between mt-4">
          {steps.map((label, i) => {
            const index = i + 1;
            const active = step >= index;
            return (
              <div key={label} className="flex flex-col items-center w-full">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300
                    ${active ? "bg-black text-white border-black" : "border-gray-400 text-gray-400"}
                  `}
                >
                  {index}
                </div>
                <span className="text-xs mt-2 text-center">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 animate-fadeIn">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Informații personale</h2>
              <input className="input" name="name" placeholder="Nume complet" value={formData.name} onChange={handleChange} />
              <input className="input" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
              <input className="input" type="password" name="password" placeholder="Parolă" value={formData.password} onChange={handleChange} />
              <button className="btn-primary" onClick={nextStep}>Continuă</button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Date de contact</h2>
              <input className="input" name="phone" placeholder="Telefon" value={formData.phone} onChange={handleChange} />
              <input className="input" name="address" placeholder="Adresă" value={formData.address} onChange={handleChange} />
              <div className="flex justify-between">
                <button className="btn-secondary" onClick={prevStep}>Înapoi</button>
                <button className="btn-primary" onClick={nextStep}>Continuă</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Metodă de plată</h2>
              <select className="input" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                <option value="">Selectează</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="mixt">Mixt</option>
              </select>
              <div className="flex justify-between">
                <button className="btn-secondary" onClick={prevStep}>Înapoi</button>
                <button className="btn-primary" onClick={nextStep}>Continuă</button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Politică de confidențialitate</h2>
              <label className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.acceptPolicy}
                  onChange={(e) => setFormData({ ...formData, acceptPolicy: e.target.checked })}
                />
                Accept termenii și politica
              </label>

              <div className="flex justify-between">
                <button className="btn-secondary" onClick={prevStep}>Înapoi</button>
                <button
                  className="btn-primary"
                  disabled={!formData.acceptPolicy || loading}
                  onClick={handleSubmit}
                >
                  {loading ? "Se trimite..." : "Finalizează"}
                </button>
              </div>

              {successMsg && <p className="text-green-600">{successMsg}</p>}
              {errorMsg && <p className="text-red-600">{errorMsg}</p>}
            </div>
          )}
        </div>
      </main>

      {/* Tailwind helpers */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #d1d5db;
        }
        .btn-primary {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: black;
          color: white;
        }
        .btn-secondary {
          padding: 0.75rem 1.25rem;
          border-radius: 0.75rem;
          background: #e5e7eb;
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

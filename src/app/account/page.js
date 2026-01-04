"use client";

import { useState } from "react";

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [errorStepMsg, setErrorStepMsg] = useState("");
  const [language, setLanguage] = useState("ro"); // 'ro' sau 'en'

  const translations = {
    ro: {
      headerTitle: "UCab.ro",
      headerSubtitle: "Creare cont client",
      steps: ["Info", "Contact", "Plată", "Politică"],
      continue: "Continuă",
      back: "Înapoi",
      submit: "Finalizează",
      submitting: "Se trimite...",
      requiredFields: "Toate câmpurile sunt obligatorii.",
      acceptPolicy: "Accept termenii și politica",
      personalInfo: "Informații personale",
      contactInfo: "Date de contact",
      paymentMethod: "Metodă de plată",
      privacyPolicy: "Politică de confidențialitate",
      success: "Cont creat cu succes!",
      phonePlaceholder: "Telefon (07xx xxx xxx)",
      namePlaceholder: "Nume complet",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Parolă",
      addressPlaceholder: "Adresă",
      selectPayment: "Selectează",
      card: "Card",
      cash: "Cash",
      mixed: "Mixt",
      invalidEmail: "Email invalid",
      invalidPhone: "Telefon invalid",
    },
    en: {
      headerTitle: "UCab.ro",
      headerSubtitle: "Create client account",
      steps: ["Info", "Contact", "Payment", "Policy"],
      continue: "Next",
      back: "Back",
      submit: "Finish",
      submitting: "Submitting...",
      requiredFields: "All fields are required.",
      acceptPolicy: "I accept the terms and policy",
      personalInfo: "Personal Information",
      contactInfo: "Contact Information",
      paymentMethod: "Payment Method",
      privacyPolicy: "Privacy Policy",
      success: "Account created successfully!",
      phonePlaceholder: "Phone (07xx xxx xxx)",
      namePlaceholder: "Full Name",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Password",
      addressPlaceholder: "Address",
      selectPayment: "Select",
      card: "Card",
      cash: "Cash",
      mixed: "Mixed",
      invalidEmail: "Invalid email",
      invalidPhone: "Invalid phone",
    },
  };

  const t = translations[language];

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

const handleChange = (e) => {
  let value = e.target.value;

  if (e.target.name === "phone") {
    // Elimină orice caracter care nu e cifră
    let digits = value.replace(/\D/g, "").slice(0, 10); // maxim 10 cifre

    // Aplică masca 07xx xxx xxx
    if (digits.length <= 4) {
      value = digits;
    } else if (digits.length <= 7) {
      value = `${digits.slice(0, 4)} ${digits.slice(4)}`;
    } else {
      value = `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
    }
  }

  setFormData({ ...formData, [e.target.name]: value });
};

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    // Format RO: 07xx xxx xxx, 10 cifre
    const digits = phone.replace(/\D/g, "");
    return /^07\d{8}$/.test(digits);
  };

  const validateStep = () => {
    setErrorStepMsg("");
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setErrorStepMsg(t.requiredFields);
        return false;
      }
      if (!validateEmail(formData.email)) {
        setErrorStepMsg(t.invalidEmail);
        return false;
      }
    } else if (step === 2) {
      if (!formData.phone || !formData.address) {
        setErrorStepMsg(t.requiredFields);
        return false;
      }
      if (!validatePhone(formData.phone)) {
        setErrorStepMsg(t.invalidPhone);
        return false;
      }
    } else if (step === 3) {
      if (!formData.paymentMethod) {
        setErrorStepMsg(t.requiredFields);
        return false;
      }
    } else if (step === 4) {
      if (!formData.acceptPolicy) {
        setErrorStepMsg(t.acceptPolicy);
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, totalSteps));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

const handleSubmit = async () => {
  if (!validateStep()) return;
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
      setSuccessMsg(t.success);
      setTimeout(() => (window.location.href = "/login"), 2000);
    } else {
      setErrorMsg(data.message || "Server error");
    }
  } catch (err) {
    console.error(err);
    setErrorMsg("Server error");
  }
  setLoading(false);
};


  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="p-6 text-center">
        <div className="flex justify-end mb-2">
          <select
            className="border rounded px-2 py-1"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="ro">RO</option>
            <option value="en">EN</option>
          </select>
        </div>
        <h1 className="text-3xl font-bold">{t.headerTitle}</h1>
        <p className="text-gray-500">{t.headerSubtitle}</p>
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
          {t.steps.map((label, i) => {
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
          {errorStepMsg && <p className="text-red-600 mb-2">{errorStepMsg}</p>}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{t.personalInfo}</h2>
              <input className="input" name="name" placeholder={t.namePlaceholder} value={formData.name} onChange={handleChange} />
              <input className="input" type="email" name="email" placeholder={t.emailPlaceholder} value={formData.email} onChange={handleChange} />
              <input className="input" type="password" name="password" placeholder={t.passwordPlaceholder} value={formData.password} onChange={handleChange} />
              <button className="btn-primary" onClick={nextStep}>{t.continue}</button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{t.contactInfo}</h2>
              <input className="input" name="phone" placeholder={t.phonePlaceholder} value={formData.phone} onChange={handleChange} />
              <input className="input" name="address" placeholder={t.addressPlaceholder} value={formData.address} onChange={handleChange} />
              <div className="flex justify-between">
                <button className="btn-secondary" onClick={prevStep}>{t.back}</button>
                <button className="btn-primary" onClick={nextStep}>{t.continue}</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{t.paymentMethod}</h2>
              <select className="input" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                <option value="">{t.selectPayment}</option>
                <option value="card">{t.card}</option>
                <option value="cash">{t.cash}</option>
                <option value="mixed">{t.mixed}</option>
              </select>
              <div className="flex justify-between">
                <button className="btn-secondary" onClick={prevStep}>{t.back}</button>
                <button className="btn-primary" onClick={nextStep}>{t.continue}</button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">{t.privacyPolicy}</h2>
              <label className="flex gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={formData.acceptPolicy}
                  onChange={(e) => setFormData({ ...formData, acceptPolicy: e.target.checked })}
                />
                {t.acceptPolicy}
              </label>

              <div className="flex justify-between">
                <button className="btn-secondary" onClick={prevStep}>{t.back}</button>
                <button
                  className="btn-primary"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? t.submitting : t.submit}
                </button>
              </div>

              {successMsg && <p className="text-green-600">{successMsg}</p>}
              {errorMsg && <p className="text-red-600">{errorMsg}</p>}
            </div>
          )}
        </div>
      </main>

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

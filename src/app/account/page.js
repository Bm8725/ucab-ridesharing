"use client";

import { useState } from "react";

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [errorStepMsg, setErrorStepMsg] = useState("");
  const [language, setLanguage] = useState("ro");

  const translations = {
    ro: {
      headerTitle: "UCab.ro/cont client",
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
      headerTitle: "UCab.ro/client account",
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
    let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    if (e.target.name === "phone") {
      let digits = value.replace(/\D/g, "").slice(0, 10);
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
      setErrorMsg("Server error");
    }
    setLoading(false);
  };

  const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;

  // Stilizare dinamică pentru input-uri bazată pe erori
  const getInputClass = (hasError) => `
    w-full bg-transparent border-b-2 py-4 outline-none transition-all text-lg placeholder:text-zinc-400 font-light
    ${errorStepMsg && hasError ? 'border-red-600 dark:border-red-500' : 'border-zinc-200 dark:border-zinc-800 focus:border-black dark:focus:border-white'}
  `;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans antialiased">
      
      {/* Navbar cu selector limbă */}
      <nav className="p-6 md:p-10 flex justify-between items-center max-w-2xl mx-auto">
        <h3 className="text-xl font-black tracking-tighter uppercase">{t.headerTitle}</h3>
        <div className="flex gap-6">
          {['ro', 'en'].map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={`text-[10px] font-black uppercase tracking-widest ${language === l ? 'border-b-2 border-black dark:border-white' : 'opacity-30 hover:opacity-100'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-6 py-12 flex flex-col min-h-[70vh]">
        
        {/* Progress Bar - Devine VERDE la final/succes */}
        <header className="mb-16">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 mb-2">Step 0{step}</p>
              <h2 className="text-4xl font-light tracking-tighter uppercase italic">{t.steps[step - 1]}</h2>
            </div>
          </div>
          <div className="w-full h-[2px] bg-zinc-100 dark:bg-zinc-900">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${successMsg ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-black dark:bg-white'}`} 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </header>

        <div className="flex-1">
          {/* Mesaj de EROARE - ROSU */}
          {errorStepMsg && (
            <div className="mb-8 p-4 border-l-4 border-red-600 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-[11px] font-bold uppercase tracking-widest animate-bounce">
              EROARE // {errorStepMsg}
            </div>
          )}

          {/* Mesaj de SUCCES - VERDE */}
          {successMsg ? (
            <div className="py-20 text-center border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-emerald-600 dark:text-emerald-400 animate-pulse">
                {t.success}
              </h3>
              <p className="mt-4 text-xs font-bold text-emerald-700 uppercase tracking-widest">Redirecționare în curs...</p>
            </div>
          ) : (
            <div className="space-y-12">
              {step === 1 && (
                <div className="space-y-6">
                  <input className={getInputClass(!formData.name)} name="name" placeholder={t.namePlaceholder} value={formData.name} onChange={handleChange} autoFocus />
                  <input className={getInputClass(!formData.email || !validateEmail(formData.email))} type="email" name="email" placeholder={t.emailPlaceholder} value={formData.email} onChange={handleChange} />
                  <input className={getInputClass(!formData.password)} type="password" name="password" placeholder={t.passwordPlaceholder} value={formData.password} onChange={handleChange} />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="relative">
                    <span className="absolute left-0 top-4 text-[10px] font-black text-zinc-400">RO</span>
                    <input className={`${getInputClass(!formData.phone || !validatePhone(formData.phone))} pl-8`} name="phone" placeholder={t.phonePlaceholder} value={formData.phone} onChange={handleChange} autoFocus />
                  </div>
                  <input className={getInputClass(!formData.address)} name="address" placeholder={t.addressPlaceholder} value={formData.address} onChange={handleChange} />
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-4">
                  {['card', 'cash', 'mixed'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setFormData({...formData, paymentMethod: m})}
                      className={`text-left p-6 border transition-all flex justify-between items-center 
                        ${formData.paymentMethod === m 
                          ? 'bg-black text-white border-black dark:bg-white dark:text-black' 
                          : errorStepMsg && !formData.paymentMethod ? 'border-red-300 bg-red-50' : 'border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white'}`}
                    >
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">{t[m]}</span>
                      {formData.paymentMethod === m && <span className="text-[9px] font-bold tracking-widest">SELECTED</span>}
                    </button>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8">
                  <div className={`text-[12px] leading-relaxed uppercase tracking-tight max-h-48 overflow-y-auto border p-6 italic
                    ${errorStepMsg && !formData.acceptPolicy ? 'border-red-300 bg-red-50 text-red-900' : 'border-zinc-100 dark:border-zinc-900 text-zinc-500'}`}>
                    {t.privacyPolicy}: Utilizarea platformei UCab.ro în anul 2026 implică acceptarea prelucrării datelor.
                  </div>
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      name="acceptPolicy" 
                      checked={formData.acceptPolicy} 
                      onChange={handleChange} 
                      className={`w-6 h-6 rounded-none accent-emerald-600 ${errorStepMsg && !formData.acceptPolicy ? 'outline outline-2 outline-red-500' : ''}`}
                    />
                    <span className={`text-[11px] font-black uppercase tracking-tighter ${errorStepMsg && !formData.acceptPolicy ? 'text-red-600' : ''}`}>{t.acceptPolicy}</span>
                  </label>
                </div>
              )}

              {/* Navigație */}
              <div className="pt-12 flex flex-col md:flex-row-reverse gap-4">
                <button 
                  onClick={step < totalSteps ? nextStep : handleSubmit}
                  disabled={loading}
                  className={`flex-1 py-5 px-8 font-black uppercase text-[11px] tracking-[0.3em] transition-all disabled:opacity-30
                    ${step === totalSteps ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20' : 'bg-black dark:bg-white text-white dark:text-black'}`}
                >
                  {loading ? t.submitting : (step === totalSteps ? t.submit : t.continue)}
                </button>
                
                {step > 1 && (
                  <button onClick={prevStep} className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-black dark:hover:text-white">
                    {t.back}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Eroare de Server - ROSU */}
        {errorMsg && <p className="mt-8 text-center text-red-600 text-[10px] font-black uppercase tracking-widest italic border-2 border-red-600 p-2">{errorMsg}</p>}
      </main>

    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    faceImage: "",
    acceptPolicy: false,
    paymentMethod: "",
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [instruction, setInstruction] = useState("");

  const totalSteps = 5;

  const nextStep = () => setStep(Math.min(step + 1, totalSteps));
  const prevStep = () => setStep(Math.max(step - 1, 1));

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- Camera & Capture ---
  useEffect(() => {
    if (step === 3 && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setInstruction("Mișcă capul stânga-dreapta pentru verificare...");
          setTimeout(captureFace, 3000);
        })
        .catch((err) => console.error("Camera error:", err));
    } else if (videoRef.current?.srcObject) {
      let stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
    }
  }, [step]);

  const captureFace = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setFormData({ ...formData, faceImage: dataUrl });
    nextStep();
  };

  // --- Fancy Progress ---
  const renderProgress = () => {
    const steps = ["Info", "Contact", "Poză", "Plată", "Politică"];
    return (
      <div className="flex justify-between items-center mb-6">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = step > stepNumber;
          const isCurrent = step === stepNumber;
          return (
            <div key={index} className="flex-1 flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? "bg-blue-600 border-blue-600 text-white"
                      : isCurrent
                      ? "border-blue-600 text-blue-600"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>
                <span className="mt-2 text-xs text-center">{label}</span>
              </div>
              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-1 ${
                    step > stepNumber ? "bg-blue-600" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-center text-2xl font-bold mb-6">UCab.ro - Înregistrare Client</h1>

        {renderProgress()}

        {/* --- Step 1: Nume, Email, Parolă --- */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-4">Informații personale</h2>
            <input
              type="text"
              name="name"
              placeholder="Nume complet"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 mb-3 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mb-3 border rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Parolă"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 mb-3 border rounded"
            />
            <div className="flex justify-end">
              <button onClick={nextStep} className="bg-black text-white p-3 rounded">
                Următorul
              </button>
            </div>
          </>
        )}

        {/* --- Step 2: Telefon și Adresă --- */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-4">Date contact</h2>
            <input
              type="tel"
              name="phone"
              placeholder="Telefon"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 mb-3 border rounded"
            />
            <input
              type="text"
              name="address"
              placeholder="Adresă"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 mb-3 border rounded"
            />
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-gray-300 p-3 rounded">
                Înapoi
              </button>
              <button onClick={nextStep} className="bg-black text-white p-3 rounded">
                Următorul
              </button>
            </div>
          </>
        )}

        {/* --- Step 3: Captură față --- */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-bold mb-4">Poză față</h2>
            {instruction && <p className="mb-2 text-sm text-gray-600">{instruction}</p>}
            <video ref={videoRef} className="w-full rounded mb-3" autoPlay muted />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-gray-300 p-3 rounded">
                Înapoi
              </button>
              <button onClick={captureFace} className="bg-black text-white p-3 rounded">
                Capturează manual
              </button>
            </div>
          </>
        )}

        {/* --- Step 4: Metodă plată --- */}
        {step === 4 && (
          <>
            <h2 className="text-xl font-bold mb-4">Metodă plată</h2>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full p-3 mb-3 border rounded"
            >
              <option value="">Selectează metoda de plată</option>
              <option value="card">Card</option>
              <option value="paypal">PayPal</option>
            </select>
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-gray-300 p-3 rounded">
                Înapoi
              </button>
              <button onClick={nextStep} className="bg-black text-white p-3 rounded">
                Următorul
              </button>
            </div>
          </>
        )}

        {/* --- Step 5: Acceptare politică --- */}
        {step === 5 && (
          <>
            <h2 className="text-xl font-bold mb-4">Politica de confidențialitate</h2>
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                name="acceptPolicy"
                checked={formData.acceptPolicy}
                onChange={(e) =>
                  setFormData({ ...formData, acceptPolicy: e.target.checked })
                }
              />
              Accept politica de confidențialitate
            </label>
            {formData.faceImage && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-1">Poză capturată:</h3>
                <img
                  src={formData.faceImage}
                  alt="Face"
                  className="w-32 h-32 object-cover rounded-full"
                />
              </div>
            )}
            <div className="flex justify-between mt-3">
              <button onClick={prevStep} className="bg-gray-300 p-3 rounded">
                Înapoi
              </button>
              <button
                onClick={() => alert("Formular complet: " + JSON.stringify(formData))}
                disabled={!formData.acceptPolicy}
                className="bg-black text-white p-3 rounded disabled:opacity-50"
              >
                Trimite
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

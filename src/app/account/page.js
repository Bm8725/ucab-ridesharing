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
  const [faceDetected, setFaceDetected] = useState(false);
  const totalSteps = 5;

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const nextStep = () => setStep(Math.min(step + 1, totalSteps));
  const prevStep = () => setStep(Math.max(step - 1, 1));
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Camera setup
  useEffect(() => {
    if (step === 3 && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setInstruction("Mișcă capul stânga-dreapta pentru verificare...");
          setFaceDetected(false);
        })
        .catch((err) => console.error("Camera error:", err));
    } else if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
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

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const imageData = ctx.getImageData(centerX - 50, centerY - 50, 100, 100);
    let sum = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      sum += imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2];
    }
    const brightness = sum / (100 * 100);
    if (brightness > 30) setFaceDetected(true);

    const dataUrl = canvas.toDataURL("image/png");
    setFormData({ ...formData, faceImage: dataUrl });
    nextStep();
  };

  const handleSubmit = async () => {
    if (!formData.acceptPolicy) return;

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("Cont creat cu succes! Redirecționare...");
        setTimeout(() => (window.location.href = "/login"), 2000);
      } else {
        setErrorMsg(data.message || "Eroare la server");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Eroare server");
    }
    setLoading(false);
  };

  const renderProgress = () => {
    const steps = ["Info", "Contact", "Poză", "Plată", "Politică"];
    return (
      <div className="flex justify-between items-center mb-6 relative">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = step > stepNumber;
          const isCurrent = step === stepNumber;
          return (
            <div key={index} className="flex-1 flex items-center relative">
              <div className="flex flex-col items-center z-10">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors duration-300 ${
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
                  className={`absolute top-3.5 left-10 right-0 h-1 rounded transition-all duration-500`}
                  style={{
                    background:
                      step > stepNumber
                        ? "linear-gradient(to right, #3b82f6, #60a5fa)"
                        : "#e5e7eb",
                  }}
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
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-6 md:p-10 w-full max-w-lg">
        <h1 className="text-center text-2xl md:text-3xl font-bold mb-6">
          UCab.ro - Înregistrare Client
        </h1>

        {renderProgress()}

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Nume complet"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Parolă"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end">
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
              >
                Următorul
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <input
              type="tel"
              name="phone"
              placeholder="Telefon"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="address"
              placeholder="Adresă"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="bg-gray-300 p-3 rounded-lg hover:bg-gray-400 transition"
              >
                Înapoi
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
              >
                Următorul
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            {instruction && <p className="text-sm text-gray-600">{instruction}</p>}
            <video
              ref={videoRef}
              className="w-full rounded-xl mb-3 border"
              autoPlay
              muted
            />
            <canvas
              ref={canvasRef}
              style={{
                display: "block",
                width: "100%",
                border: faceDetected ? "2px solid green" : "2px dashed gray",
                borderRadius: "12px",
                marginBottom: "10px",
              }}
            />
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="bg-gray-300 p-3 rounded-lg hover:bg-gray-400 transition"
              >
                Înapoi
              </button>
              <button
                onClick={captureFace}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
              >
                Capturează
              </button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Selectează metoda de plată</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="mixt">Mixt</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="bg-gray-300 p-3 rounded-lg hover:bg-gray-400 transition"
              >
                Înapoi
              </button>
              <button
                onClick={nextStep}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
              >
                Următorul
              </button>
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="space-y-4">
            <label className="flex items-center gap-2">
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
              <div className="mt-4 flex justify-center">
                <img
                  src={formData.faceImage}
                  alt="Face"
                  className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
                />
              </div>
            )}

            <div className="flex justify-between mt-3">
              <button
                onClick={prevStep}
                className="bg-gray-300 p-3 rounded-lg hover:bg-gray-400 transition"
              >
                Înapoi
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.acceptPolicy || loading}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Se trimite..." : "Trimite"}
              </button>
            </div>

            {successMsg && <p className="mt-2 text-green-600">{successMsg}</p>}
            {errorMsg && <p className="mt-2 text-red-600">{errorMsg}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

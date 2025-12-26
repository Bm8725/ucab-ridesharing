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
  const detectionCanvasRef = useRef(null);

  const [instruction, setInstruction] = useState("");
  const [faceDetected, setFaceDetected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const totalSteps = 5;
  const nextStep = () => setStep(Math.min(step + 1, totalSteps));
  const prevStep = () => setStep(Math.max(step - 1, 1));

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- Camera & Detection ---
  useEffect(() => {
    let animationFrame;
    const video = videoRef.current;
    const canvas = detectionCanvasRef.current;
    const ctx = canvas?.getContext("2d");

    const drawDetection = () => {
      if (!video || !ctx || video.videoWidth === 0) {
        animationFrame = requestAnimationFrame(drawDetection);
        return;
      }

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      canvas.width = vw;
      canvas.height = vh;

      ctx.clearRect(0, 0, vw, vh);
      ctx.drawImage(video, 0, 0, vw, vh);

      // Chenar oval centrat
      const ovalWidth = vw * 0.5;
      const ovalHeight = vh * 0.6;
      const centerX = vw / 2;
      const centerY = vh / 2;

      ctx.strokeStyle = faceDetected ? "green" : "red";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, ovalWidth / 2, ovalHeight / 2, 0, 0, Math.PI * 2);
      ctx.stroke();

      animationFrame = requestAnimationFrame(drawDetection);
    };

    if (step === 3 && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
          setInstruction("Mișcă capul stânga-dreapta pentru verificare...");
          setFaceDetected(false);
          animationFrame = requestAnimationFrame(drawDetection);
        })
        .catch((err) => console.error("Camera error:", err));
    }

    return () => {
      cancelAnimationFrame(animationFrame);
      if (video?.srcObject) video.srcObject.getTracks().forEach((t) => t.stop());
    };
  }, [step, faceDetected]);

  const captureFace = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Simplificat: detectare demo
    setFaceDetected(true);

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
        setTimeout(() => window.location.href = "/login", 2000);
      } else {
        setErrorMsg(data.message || "Eroare server");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Eroare server");
    }
    setLoading(false);
  };

  // --- Progress bar ---
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
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors duration-300 text-sm ${
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
                  className={`absolute top-5 left-10 right-0 h-1 rounded transition-all duration-500`}
                  style={{ background: step > stepNumber ? "linear-gradient(to right,#3b82f6,#60a5fa)" : "#e5e7eb" }}
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
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 md:p-8 w-full max-w-md">
        <h1 className="text-center text-2xl font-bold mb-6">UCab.ro - Înregistrare Client</h1>

        {renderProgress()}

        {/* Step 1: Info */}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold mb-2">Informații personale</h2>
            <input type="text" name="name" placeholder="Nume complet" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded" />
            <input type="password" name="password" placeholder="Parolă" value={formData.password} onChange={handleChange} className="w-full p-3 border rounded" />
            <div className="flex justify-end">
              <button onClick={nextStep} className="bg-black text-white p-3 rounded">Următorul</button>
            </div>
          </div>
        )}

        {/* Step 2: Contact */}
        {step === 2 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold mb-2">Date contact</h2>
            <input type="tel" name="phone" placeholder="Telefon" value={formData.phone} onChange={handleChange} className="w-full p-3 border rounded" />
            <input type="text" name="address" placeholder="Adresă" value={formData.address} onChange={handleChange} className="w-full p-3 border rounded" />
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-gray-300 p-3 rounded">Înapoi</button>
              <button onClick={nextStep} className="bg-black text-white p-3 rounded">Următorul</button>
            </div>
          </div>
        )}

        {/* Step 3: Captură față */}
        {step === 3 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold mb-2">Poză față</h2>
            {instruction && <p className="text-sm text-gray-600">{instruction}</p>}
            <div className="relative w-full" style={{ paddingTop: "75%" }}>
              <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover rounded-xl" autoPlay muted />
              <canvas ref={detectionCanvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div className="flex justify-between mt-3">
              <button onClick={prevStep} className="bg-gray-300 p-3 rounded">Înapoi</button>
              <button onClick={captureFace} className="bg-blue-600 text-white p-3 rounded">Capturează</button>
            </div>
          </div>
        )}

        {/* Step 4: Plată */}
        {step === 4 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold mb-2">Metodă plată</h2>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full p-3 border rounded">
              <option value="">Selectează metoda de plată</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="mixt">Mixt</option>
            </select>
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-gray-300 p-3 rounded">Înapoi</button>
              <button onClick={nextStep} className="bg-black text-white p-3 rounded">Următorul</button>
            </div>
          </div>
        )}

        {/* Step 5: Politică */}
        {step === 5 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold mb-2">Politica de confidențialitate</h2>
            <label className="flex items-center gap-2 mb-3">
              <input type="checkbox" name="acceptPolicy" checked={formData.acceptPolicy} onChange={(e) => setFormData({ ...formData, acceptPolicy: e.target.checked })} />
              Accept politica de confidențialitate
            </label>
            {formData.faceImage && (
              <div className="mt-2">
                <h3 className="text-sm font-medium mb-1">Poză capturată:</h3>
                <img src={formData.faceImage} alt="Face" className="w-32 h-32 object-cover rounded-full" />
              </div>
            )}
            <div className="flex justify-between mt-3">
              <button onClick={prevStep} className="bg-gray-300 p-3 rounded">Înapoi</button>
              <button onClick={handleSubmit} disabled={!formData.acceptPolicy || loading} className="bg-blue-600 text-white p-3 rounded disabled:opacity-50">
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

"use client";

import { useState, useRef, useEffect } from "react";

export default function RegisterWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    faceImage: "",
    acceptPolicy: false,
    paymentMethod: "",
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Pasul 3: Camera
  useEffect(() => {
    if (step === 3 && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch((err) => console.error("Camera error:", err));
    } else if (videoRef.current?.srcObject) {
      let stream = videoRef.current.srcObject;
      let tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  }, [step]);

  const captureFace = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setFormData({ ...formData, faceImage: dataUrl });
      nextStep();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-md">

        {/* Pasul 1: Email & Parolă */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold mb-4">Email & Parolă</h2>
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
            <button onClick={nextStep} className="w-full bg-black text-white p-3 rounded">
              Următorul
            </button>
          </>
        )}

        {/* Pasul 2: Telefon */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-4">Telefon</h2>
            <input
              type="tel"
              name="phone"
              placeholder="Număr de telefon"
              value={formData.phone}
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

        {/* Pasul 3: Captură față */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-bold mb-4">Poză față</h2>
            <video ref={videoRef} className="w-full rounded mb-3" autoPlay muted />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <button onClick={captureFace} className="w-full bg-black text-white p-3 rounded">
              Capturează
            </button>
            <button onClick={prevStep} className="mt-2 w-full bg-gray-300 p-3 rounded">
              Înapoi
            </button>
          </>
        )}

        {/* Pasul 4: Metodă plată */}
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

            <div className="flex justify-between mt-3">
              <button onClick={prevStep} className="bg-gray-300 p-3 rounded">
                Înapoi
              </button>
              <button onClick={nextStep} className="bg-black text-white p-3 rounded">
                Următorul
              </button>
            </div>
          </>
        )}

        {/* Pasul 5: Acceptare politică */}
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

            {formData.faceImage && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-1">Poză capturată:</h3>
                <img src={formData.faceImage} alt="Face" className="w-32 h-32 object-cover rounded-full" />
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

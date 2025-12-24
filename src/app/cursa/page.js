/* app web app december 2025 BM V 0.1.13 */

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  FaMapMarkerAlt,
  FaFlagCheckered,
  FaDollarSign,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

/* ================= CONFIG ================= */
const libraries = ["places"];
const containerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 44.92756, lng: 25.46090 };  // mitropolia  din  targoviste coords
const carOptions = {
  standard: { label: "Standard", rate: 0.5 },
  comfort: { label: "Comfort", rate: 0.8 },
  electric: { label: "Electric", rate: 0.7 },
};

/* ================= COMPONENT ================= */
export default function RideSharePage() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapRef = useRef(null);
  const pickupRef = useRef(null);
  const destinationRef = useRef(null);

  const [center, setCenter] = useState(defaultCenter);
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [pickupText, setPickupText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [driverPos, setDriverPos] = useState(null);
  const [rideStatus, setRideStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCar, setSelectedCar] = useState("standard");
  const [sheetMinimized, setSheetMinimized] = useState(false);

  /* ================= GEOLOCATION LIVE ================= */
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCenter(coords);
          setPickup(coords); // live update plecare
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, maximumAge: 1000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  /* ================= ROUTE CALC ================= */
  const calculateRoute = () => {
    if (!pickup || !destination) {
      setMessage("Completează plecarea și destinația.");
      return;
    }

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: pickup,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          const leg = result.routes[0].legs[0];
          setDistance(leg.distance.value / 1000);
          setTime(leg.duration.text);
          setMessage("");
        } else {
          setMessage("Eroare calcul rută.");
        }
      }
    );
  };

  /* ================= COST ================= */
  const cost = distance ? (distance * carOptions[selectedCar].rate).toFixed(2) : "0.00";

  /* ================= CONFIRM ================= */
  const confirmRide = () => {
    if (!directions) return;
    setLoading(true);
    setTimeout(() => {
      setRideStatus("assigned");
      setDriverPos(pickup);
      setMessage("Cursă confirmată. Șofer în drum spre tine.");
      setLoading(false);
    }, 1200);
  };

  /* ================= DRIVER SIM ================= */
  useEffect(() => {
    if (!directions || !driverPos || rideStatus !== "assigned") return;
    const path = directions.routes[0].overview_path;
    let i = 0;

    const interval = setInterval(() => {
      if (i < path.length) {
        setDriverPos({ lat: path[i].lat(), lng: path[i].lng() });
        if (i > path.length / 2) setRideStatus("in_progress");
        i++;
      } else {
        setRideStatus("completed");
        clearInterval(interval);
      }
    }, 223);

    return () => clearInterval(interval);
  }, [directions, rideStatus]);



  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading Google Maps...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative perspective-1000">
      {/* ===== MAP ===== */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={(map) => (mapRef.current = map)}
      >
        {pickup && <Marker position={pickup} />}
        {destination && <Marker position={destination} />}
        {driverPos && (
          <Marker
            position={driverPos}
            icon={{ url: "/driver-icon.png", scaledSize: new window.google.maps.Size(40, 40) }}
          />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* ===== BOTTOM SHEET 3D ===== */}
      <AnimatePresence>
        <motion.div
          initial={{ y: "100%", scale: 0.9, rotateX: 25 }}
          animate={{
            y: sheetMinimized ? "25%" : 0, // doar header vizibil
            scale: sheetMinimized ? 0.95 : 1,
            rotateX: sheetMinimized ? 10 : 0,
          }}
          exit={{ y: "100%", scale: 0.9, rotateX: 25 }}
          transition={{ type: "spring", damping: 20, stiffness: 120 }}
          className="fixed bottom-0 w-full bg-white rounded-t-3xl shadow-xl z-50 transform-origin-bottom overflow-hidden"
        >
          {/* HEADER FIX */}
          <div
            className="flex justify-between items-center cursor-pointer px-4 py-3"
            onClick={() => setSheetMinimized(!sheetMinimized)}
          >
            <h2 className="font-bold text-lg flex-1 text-center">
              {rideStatus === "pending" && "Cursă UCab"}
              {rideStatus === "assigned" && "Șofer în drum"}
              {rideStatus === "in_progress" && "Cursă în desfășurare"}
              {rideStatus === "completed" && "Cursă finalizată"}
            </h2>
            {sheetMinimized ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {/* CONTENT */}
          {!sheetMinimized && (
            <div className="px-4 pb-4">
              {/* Tip mașină */}
              {rideStatus === "pending" && (
                <div className="flex gap-2 mb-3">
                  {Object.keys(carOptions).map((car) => (
                    <button
                      key={car}
                      className={`flex-1 py-2 rounded-xl border ${
                        selectedCar === car
                          ? "bg-black text-white border-blue-800"
                          : "border-gray-300"
                      }`}
                      onClick={() => setSelectedCar(car)}
                    >
                      {carOptions[car].label}
                    </button>
                  ))}
                </div>
              )}

              {/* Input-uri */}
              {rideStatus === "pending" && (
                <>
                  <div className="flex gap-2 items-center mb-2">
                    <FaMapMarkerAlt />
                    <Autocomplete
                      onLoad={(ref) => (pickupRef.current = ref)}
                      onPlaceChanged={() => {
                        const p = pickupRef.current.getPlace();
                        if (p?.geometry) {
                          setPickup({ lat: p.geometry.location.lat(), lng: p.geometry.location.lng() });
                          setPickupText(p.formatted_address);
                        }
                      }}
                    >
                      <input
                        value={pickupText}
                        onChange={(e) => setPickupText(e.target.value)}
                        placeholder="Plecare"
                        className="w-full border rounded-xl px-3 py-2"
                      />
                    </Autocomplete>
                  </div>

                  <div className="flex gap-2 items-center mb-3">
                    <FaFlagCheckered />
                    <Autocomplete
                      onLoad={(ref) => (destinationRef.current = ref)}
                      onPlaceChanged={() => {
                        const p = destinationRef.current.getPlace();
                        if (p?.geometry) {
                          setDestination({ lat: p.geometry.location.lat(), lng: p.geometry.location.lng() });
                          setDestinationText(p.formatted_address);
                        }
                      }}
                    >
                      <input
                        value={destinationText}
                        onChange={(e) => setDestinationText(e.target.value)}
                        placeholder="Destinație"
                        className="w-full border rounded-xl px-3 py-2"
                      />
                    </Autocomplete>
                  </div>

                  <button
                    onClick={calculateRoute}
                    className="w-full  bg-black text-white py-2 rounded-xl"
                  >
                    Calculează ruta
                  </button>
                </>
              )}

              {/* Preview + confirm */}
              {directions && rideStatus === "pending" && (
                <div className="space-y-1 mt-2">
                  <p>Distanță: {distance?.toFixed(2)} km</p>
                  <p>Timp: {time}</p>
                  <p className="font-bold">Cost ({carOptions[selectedCar].label}): {cost} RON</p>
                  <button
                    onClick={confirmRide}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-xl"
                  >
                    {loading ? "Se confirmă..." : "Confirmă cursa"}
                  </button>
                </div>
              )}

              {/* Mesaj status */}
              {message && (
                <p className={`text-sm text-center ${rideStatus === "completed" ? "text-green-600" : "text-blue-600"}`}>
                  {message}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

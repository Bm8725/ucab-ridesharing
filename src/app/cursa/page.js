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
  FaTimes,
} from "react-icons/fa";

/* ================= CONFIG ================= */
const libraries = ["places"];
const containerStyle = {
  width: "100%",
  height: "100%",
};
const defaultCenter = { lat: 44.4268, lng: 26.1025 };

/* ================= COMPONENT ================= */
export default function RideSharePage() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

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

  /* ================= GEOLOCATION ================= */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCenter(coords);
        setPickup(coords);
      });
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
  const cost = distance ? (distance * 0.5).toFixed(2) : "0.00";

  /* ================= CONFIRM ================= */
  const confirmRide = async () => {
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
    if (!directions || !driverPos) return;

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
    }, 900);

    return () => clearInterval(interval);
  }, [directions, driverPos]);

  /* ================= LOADING ================= */
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        Se încarcă Google Maps...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="h-screen w-screen relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
      >
        {pickup && <Marker position={pickup} />}
        {destination && <Marker position={destination} />}
        {driverPos && (
          <Marker
            position={driverPos}
            icon={{
              url: "/driver-icon.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* ===== BOTTOM SHEET ===== */}
      <AnimatePresence>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30 }}
          className="fixed bottom-0 w-full bg-white rounded-t-3xl shadow-xl p-6 space-y-3"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">Cursă UCab</h2>
            <FaTimes />
          </div>

          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <FaMapMarkerAlt />
              <Autocomplete
                onLoad={(ref) => (pickupRef.current = ref)}
                onPlaceChanged={() => {
                  const p = pickupRef.current.getPlace();
                  if (p?.geometry) {
                    setPickup({
                      lat: p.geometry.location.lat(),
                      lng: p.geometry.location.lng(),
                    });
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

            <div className="flex gap-2 items-center">
              <FaFlagCheckered />
              <Autocomplete
                onLoad={(ref) => (destinationRef.current = ref)}
                onPlaceChanged={() => {
                  const p = destinationRef.current.getPlace();
                  if (p?.geometry) {
                    setDestination({
                      lat: p.geometry.location.lat(),
                      lng: p.geometry.location.lng(),
                    });
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
              className="w-full bg-green-600 text-white py-2 rounded-xl"
            >
              Calculează ruta
            </button>

            {directions && (
              <>
                <p>Distanță: {distance?.toFixed(2)} km</p>
                <p>Timp: {time}</p>
                <p>
                  Cost estimat: <FaDollarSign className="inline" /> {cost} RON
                </p>
                <p>Status: {rideStatus.replace("_", " ")}</p>

                <button
                  onClick={confirmRide}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-xl"
                >
                  {loading ? "Se confirmă..." : "Confirmă cursa"}
                </button>
              </>
            )}

            {message && (
              <p className="text-sm text-center text-green-600">{message}</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

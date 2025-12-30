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
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

/* ================= CONFIG ================= */
const libraries = ["places"];
const containerStyle = { width: "100%", height: "100%" };
const defaultCenter = { lat: 44.92756, lng: 25.4609 };

const carOptions = {
  standard: { label: "Standard", rate: 0.5 },
  comfort: { label: "Comfort", rate: 0.8 },
  electric: { label: "Electric", rate: 0.7 },
};

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
  const [rideId, setRideId] = useState(null);

  /* ================= CURRENT LOCATION ================= */
  const useCurrentLocation = async () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      setPickup(coords);
      setCenter(coords);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`
      );
      const data = await res.json();

      setPickupText(data.display_name || "Current location");
    });
  };

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

  const cost = distance
    ? (distance * carOptions[selectedCar].rate).toFixed(2)
    : "0.00";

    
  /* ================= CONFIRM RIDE (API) ================= */
  const confirmRide = async () => {
    if (!directions) return;
    setLoading(true);

    // 1. Creare ride
    const rideRes = await fetch("/api/rides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pickup,
        destination,
        distance,
        time,
        carType: selectedCar,
      }),
    });

    const rideData = await rideRes.json();
    setRideId(rideData.ride.rideId);

    // 2. Creare driver pentru ride
    const driverRes = await fetch("/api/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rideId: rideData.ride.rideId,
        position: pickup,
        status: "assigned",
      }),
    });

    const driverData = await driverRes.json();
    setDriverPos(driverData.driver.position);
    setRideStatus(driverData.driver.status);
    setMessage("Cursă confirmată. Șofer în drum spre tine.");
    setLoading(false);
  };

  /* ================= TRACK DRIVER LIVE ================= */
  useEffect(() => {
    if (!rideId || rideStatus === "completed") return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/drivers/${rideId}`);
      if (res.status === 200) {
        const data = await res.json();
        setDriverPos(data.driver.position);
        setRideStatus(data.driver.status);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [rideId, rideStatus]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading Google Maps...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen relative">
      {/* MAP */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={(map) => (mapRef.current = map)}
      >
        {pickup && <Marker position={pickup} />}
        {destination && <Marker position={destination} />}
        {driverPos && <Marker position={driverPos} />}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* BOTTOM SHEET */}
      <AnimatePresence>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: sheetMinimized ? "25%" : 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 120 }}
          className="fixed bottom-0 w-full bg-white rounded-t-3xl shadow-xl z-50"
        >
          {/* HEADER */}
          <div
            className="flex justify-between items-center px-4 py-3 cursor-pointer"
            onClick={() => setSheetMinimized(!sheetMinimized)}
          >
            <h2 className="font-bold text-lg flex-1 text-center">Cursă UCab</h2>
            {sheetMinimized ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {!sheetMinimized && (
            <div className="px-4 pb-4">
              {/* PLECARE */}
              <div className="mb-3">
                <div
                  onClick={useCurrentLocation}
                  className="mb-2 flex items-center gap-2 px-3 py-2
                             rounded-xl bg-gray-100 hover:bg-gray-200
                             cursor-pointer text-sm font-medium"
                >
                  📍 Use current location
                </div>

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
              </div>

              {/* DESTINATIE */}
              <div className="flex gap-2 items-center mb-3">
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
                className="w-full bg-black text-white py-2 rounded-xl"
              >
                Calculează ruta
              </button>

              {directions && (
                <div className="mt-3">
                  <p>Distanță: {distance?.toFixed(2)} km</p>
                  <p>Timp: {time}</p>
                  <p className="font-bold">Cost: {cost} RON</p>
                  <button
                    onClick={confirmRide}
                    className="w-full bg-blue-600 text-white py-2 rounded-xl mt-2"
                    disabled={loading}
                  >
                    {loading ? "Se confirmă..." : "Confirmă cursa"}
                  </button>
                </div>
              )}

              {message && (
                <p className="text-center text-sm text-blue-600 mt-2">{message}</p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

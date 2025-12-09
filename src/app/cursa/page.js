"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaFlagCheckered, FaDollarSign, FaTimes } from "react-icons/fa";

// Dynamic import pentru Google Map (fără SSR)
const Map = dynamic(
  () =>
    Promise.resolve(({ center, pickup, destination, directions, driverPos }) => {
      const { GoogleMap, LoadScript, Marker, DirectionsRenderer } = require("@react-google-maps/api");
      const containerStyle = { width: "100%", height: "100%" };
      return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
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
        </LoadScript>
      );
    }),
  { ssr: false }
);

// Component client-only pentru Autocomplete
function AutocompleteInput({ placeholder, value, onChange, onPlaceChanged }) {
  const [isClient, setIsClient] = useState(false);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && typeof window !== "undefined" && window.google && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
          onPlaceChanged(place);
        }
      });
    }
  }, [isClient]);

  return (
    <input
      ref={inputRef}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-xl"
    />
  );
}

export default function RideSharePage() {
  const defaultCenter = { lat: 44.4268, lng: 26.1025 };
  const [center, setCenter] = useState(defaultCenter);
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [rideConfirmed, setRideConfirmed] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [driverPos, setDriverPos] = useState(null);
  const [rideStatus, setRideStatus] = useState("pending");

  // Detectare automată GPS
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCenter(coords);
          setPickup(coords);
        },
        () => setCenter(defaultCenter)
      );
    }
  }, []);

  // Calcul rută
  const handleCalculate = () => {
    if (!pickup || !destination) {
      setStatusMessage("Completează plecarea și destinația.");
      return;
    }

    if (typeof window === "undefined" || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      { origin: pickup, destination: destination, travelMode: window.google.maps.TravelMode.DRIVING },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          const route = result.routes[0].legs[0];
          setDistance(route.distance.value / 1000);
          setTime(route.duration.text);
          setStatusMessage("");
        } else setStatusMessage("Eroare rută: " + status);
      }
    );
  };

  // Calcul cost
  const getCost = () => {
    if (!distance) return 0;
    return (distance * 0.5).toFixed(2);
  };

  // Confirmare cursă
  const handleConfirmRide = async () => {
    if (!pickup || !destination) return;

    setLoading(true);

    const rideData = {
      pickup: pickupAddress || `${pickup.lat},${pickup.lng}`,
      destination: destinationAddress || `${destination.lat},${destination.lng}`,
      vehicleType: "car",
      distance,
      time,
      cost: getCost(),
    };

    try {
      const res = await fetch("/api/rideshare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rideData),
      });
      const data = await res.json();
      if (res.ok) {
        setRideConfirmed(true);
        setStatusMessage("Cursă confirmată! Driver asignat.");
        setRideStatus("assigned");
        setDriverPos(pickup);
      } else setStatusMessage(data.error || "Eroare confirmare cursă.");
    } catch (err) {
      setStatusMessage("Eroare server.");
    }
    setLoading(false);
  };

  // Simulare driver
  useEffect(() => {
    if (driverPos && directions && rideStatus !== "completed") {
      const route = directions.routes[0].overview_path;
      let i = 0;
      const interval = setInterval(() => {
        if (i < route.length) {
          setDriverPos({ lat: route[i].lat(), lng: route[i].lng() });
          if (rideStatus === "assigned") setRideStatus("arriving");
          if (i > route.length * 0.5 && rideStatus !== "in_progress") setRideStatus("in_progress");
          i++;
        } else {
          setRideStatus("completed");
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [driverPos, directions, rideStatus]);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Map */}
      <Map center={center} pickup={pickup} destination={destination} directions={directions} driverPos={driverPos} />

      {/* Bottom sheet */}
      <AnimatePresence>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 w-full bg-white shadow-xl rounded-t-3xl p-6 space-y-3"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg">Rezumat cursă</h2>
            <button onClick={() => setDirections(null)}>
              <FaTimes />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-500" />
              <AutocompleteInput
                placeholder="Plecare"
                value={pickupAddress}
                onChange={setPickupAddress}
                onPlaceChanged={(place) => {
                  setPickupAddress(place.formatted_address);
                  setPickup({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <FaFlagCheckered className="text-red-500" />
              <AutocompleteInput
                placeholder="Destinație"
                value={destinationAddress}
                onChange={setDestinationAddress}
                onPlaceChanged={(place) => {
                  setDestinationAddress(place.formatted_address);
                  setDestination({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
                }}
              />
            </div>

            <button onClick={handleCalculate} className="w-full py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition">
              Calculează ruta
            </button>

            {directions && (
              <>
                <p>Distanță: {distance?.toFixed(2)} km</p>
                <p>Timp estimat: {time}</p>
                <p>Cost: <FaDollarSign className="inline" /> {getCost()} RON</p>
                <p>Status: {rideStatus.replace("_", " ")}</p>
                <button
                  onClick={handleConfirmRide}
                  disabled={loading || rideConfirmed}
                  className="w-full py-2 bg-blue-600 text-white rounded-xl"
                >
                  {rideConfirmed ? "Cursă confirmată ✅" : loading ? "Se încarcă..." : "Confirmă cursa"}
                </button>
              </>
            )}
          </div>

          {statusMessage && (
            <p className={`text-sm ${rideConfirmed ? "text-green-600" : "text-red-600"}`}>{statusMessage}</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

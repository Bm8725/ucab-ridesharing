"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Map, { Marker, Source, Layer, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "../../lib/supabaseConfig";
import { useRouter } from "next/navigation";
import { 
  Navigation, MapPin, Flag, Zap, Clock, 
  ChevronDown, ChevronUp, LocateFixed, Car, 
  ShieldCheck, CreditCard, Loader2, ArrowLeft 
} from "lucide-react";

/* ================= CONFIG ================= */
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const carOptions = {
  standard: { label: "uCAB Basic", rate: 1.5, time: "3 min" },
  comfort: { label: "uCAB Comfort", rate: 2.2, time: "5 min" },
  electric: { label: "uCAB Eco", rate: 1.9, time: "4 min" },
};

export default function RideSharePage() {
  const router = useRouter();
  const mapRef = useRef(null);

  // AUTH & USER
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // MAP STATES
  const [viewState, setViewState] = useState({
    latitude: 44.4396,
    longitude: 26.0963,
    zoom: 13,
    pitch: 45,
  });

  // RIDE STATES
  const [pickup, setPickup] = useState(null); // {lat, lng}
  const [destination, setDestination] = useState(null);
  const [pickupText, setPickupText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [routeData, setRouteData] = useState(null);
  const [driverPos, setDriverPos] = useState(null);
  const [rideStatus, setRideStatus] = useState("idle"); // idle, ready, searching, active
  const [selectedCar, setSelectedCar] = useState("standard");
  const [sheetMinimized, setSheetMinimized] = useState(false);
  const [rideId, setRideId] = useState(null);

  /* ================= 1. AUTH CHECK ================= */
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        setLoadingAuth(false);
      }
    };
    checkUser();
  }, [router]);

  /* ================= 2. CURRENT LOCATION ================= */
  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setPickup(coords);
      setViewState((prev) => ({ ...prev, ...coords, zoom: 15 }));
      setPickupText("Locația ta actuală");
    });
  };

  /* ================= 3. ROUTE CALC (MAPBOX) ================= */
  const getRoute = async () => {
    if (!pickup || !destination) return;
    
const query = await fetch(
  `https://mapbox.com{pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
);

    const data = await query.json();
    
    if (data.routes && data.routes[0]) {
      const route = data.routes[0];
      setRouteData({
        geometry: route.geometry,
        distance: route.distance / 1000,
        duration: Math.floor(route.duration / 60),
      });
      setRideStatus("ready");
    }
  };

  useEffect(() => {
    if (pickup && destination) getRoute();
  }, [pickup, destination]);

  const cost = routeData
    ? (routeData.distance * carOptions[selectedCar].rate).toFixed(2)
    : "0.00";

  /* ================= 4. CONFIRM RIDE ================= */
  const confirmRide = async () => {
    setRideStatus("searching");
    // Aici vine logica ta de API / Supabase insert
    // Exemplu: const { data } = await supabase.from('orders').insert(...)
    
    setTimeout(() => {
        setRideStatus("active");
        setRideId("RIDE-123");
    }, 3000);
  };

  if (loadingAuth) return <div className="h-screen flex items-center justify-center bg-black text-white italic font-black uppercase tracking-widest">uCAB Loading...</div>;

  return (
    <div className="h-screen w-full relative bg-white overflow-hidden">
      
      {/* 1. MAP ENGINE */}
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="bottom-right" />
        {pickup && <Marker longitude={pickup.lng} latitude={pickup.lat} color="#2563eb" />}
        {destination && <Marker longitude={destination.lng} latitude={destination.lat} color="#000000" />}
        
        {routeData && (
          <Source id="route" type="geojson" data={{ type: 'Feature', geometry: routeData.geometry }}>
            <Layer
              id="route-line"
              type="line"
              paint={{ 'line-color': '#2563eb', 'line-width': 4, 'line-opacity': 0.8 }}
            />
          </Source>
        )}
      </Map>

      {/* 2. TOP NAV (Uber Style) */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => router.back()} 
          className="pointer-events-auto bg-white p-3 rounded-2xl shadow-xl hover:scale-105 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="bg-black text-white px-5 py-2 rounded-2xl shadow-2xl flex items-center gap-2">
          <Zap size={16} fill="currentColor" className="text-blue-500" />
          <span className="text-xs font-black tracking-tighter uppercase italic">uCAB Online</span>
        </div>
      </div>

      {/* 3. BOTTOM SHEET (uCAB Style) */}
      <AnimatePresence>
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: sheetMinimized ? "80%" : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] z-50 max-w-2xl mx-auto"
        >
          {/* DRAG HANDLE */}
          <div 
            className="w-full py-4 flex flex-col items-center cursor-pointer"
            onClick={() => setSheetMinimized(!sheetMinimized)}
          >
            <div className="w-12 h-1.5 bg-slate-100 rounded-full mb-2"></div>
            <h2 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">
               {rideStatus === "active" ? "Cursă în desfășurare" : "Comandă uCAB"}
            </h2>
          </div>

          <div className="px-8 pb-10">
            {rideStatus === "idle" || rideStatus === "ready" ? (
              <div className="space-y-6">
                {/* INPUTS */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                    <Navigation size={18} className="text-blue-600" />
                    <input 
                      className="bg-transparent outline-none text-sm font-bold w-full"
                      placeholder="Locație plecare"
                      value={pickupText}
                      onChange={(e) => setPickupText(e.target.value)}
                    />
                    <button onClick={useCurrentLocation} className="p-2 text-blue-600"><LocateFixed size={18}/></button>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-transparent focus-within:border-black transition-all">
                    <Flag size={18} className="text-slate-400" />
                    <input 
                      className="bg-transparent outline-none text-sm font-bold w-full"
                      placeholder="Unde mergem?"
                      value={destinationText}
                      onChange={(e) => setDestinationText(e.target.value)}
                      onBlur={() => setDestination({ lat: 44.44, lng: 26.12 })} // Exemplu hardcoded pt test
                    />
                  </div>
                </div>

                {/* VEHICLE SELECTION */}
                {rideStatus === "ready" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    {Object.entries(carOptions).map(([key, car]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedCar(key)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${
                          selectedCar === key ? 'border-black bg-slate-50' : 'border-transparent bg-slate-50/50 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-4 text-left">
                           <div className={`p-3 rounded-xl ${selectedCar === key ? 'bg-black text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                             <Car size={20} />
                           </div>
                           <div>
                              <p className="font-black text-sm uppercase italic">{car.label}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{car.time} • {routeData.duration} min ride</p>
                           </div>
                        </div>
                        <p className="font-black text-lg tracking-tighter">{(routeData.distance * car.rate).toFixed(2)} <small className="text-[10px] font-normal">RON</small></p>
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* ACTION BUTTON */}
                <button 
                  disabled={rideStatus !== "ready"}
                  onClick={confirmRide}
                  className="w-full bg-black text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl disabled:opacity-20 transition-all hover:bg-zinc-800"
                >
                  Confirmă {carOptions[selectedCar].label}
                </button>
              </div>
            ) : rideStatus === "searching" ? (
              <div className="py-12 flex flex-col items-center text-center gap-6">
                 <div className="relative">
                    <Loader2 size={64} className="animate-spin text-blue-600" />
                    <Zap size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="currentColor" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Se caută uCAB...</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Te conectăm cu cel mai apropiat partener</p>
                 </div>
              </div>
            ) : (
              <div className="py-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                      <User size={32} />
                    </div>
                    <div>
                      <p className="font-black text-lg uppercase italic leading-none">Mihai D.</p>
                      <p className="text-xs font-bold text-blue-600 mt-1 uppercase">Dacia Logan • B 123 CAB</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black tracking-tighter italic leading-none">4.9 ★</p>
                  </div>
                </div>
                <button className="w-full py-4 border-2 border-red-500/20 text-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px]">Anulează Cursa</button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* FLOAT BUTTON LOCATION */}
      <button 
        onClick={useCurrentLocation}
        className="absolute bottom-[35%] right-6 bg-white p-4 rounded-2xl shadow-2xl text-black hover:bg-slate-50 border border-slate-100 transition-all z-20"
      >
        <LocateFixed size={24} />
      </button>
    </div>
  );
}

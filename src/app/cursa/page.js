"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Map, { Marker, Source, Layer, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "../../lib/supabaseConfig";
import { useRouter } from "next/navigation";
import { 
  Navigation, MapPin, Flag, Zap, Clock, 
  LocateFixed, Car, ShieldCheck, Loader2, Search, X, ChevronRight 
} from "lucide-react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const carOptions = {
  standard: { label: "uCAB Basic", rate: 1.5, time: "3 min", icon: Zap },
  comfort: { label: "uCAB Plus", rate: 2.2, time: "5 min", icon: ShieldCheck },
  electric: { label: "uCAB Eco", rate: 1.9, time: "4 min", icon: Car },
};

export default function RidePage() {
  const router = useRouter();
  
  // DATE USER & PROFILE
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // STATE-URI HARTA
  const [viewState, setViewState] = useState({
    latitude: 44.4396, longitude: 26.0963, zoom: 13, pitch: 45
  });

  // STATE-URI RIDE
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [pickupText, setPickupText] = useState("Se caută locația...");
  const [destText, setDestText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [routeData, setRouteData] = useState(null);
  
  // STATUS & UI
  const [selectedCar, setSelectedCar] = useState("standard");
  const [rideStatus, setRideStatus] = useState("idle"); 

  // 1. GPS AUTOMAT & AUTH (REPARAT)
  const handleAutoGPS = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setPickup(coords);
      setViewState(prev => ({ ...prev, ...coords, zoom: 15 }));
      
      // REVERSE GEOCODING (URL REPARAT)
      try {
        const res = await fetch(`https://mapbox.com{coords.lng},${coords.lat}.json?access_token=${MAPBOX_TOKEN}`);
        const data = await res.json();
        setPickupText(data.features?.[0]?.place_name || "Locație detectată");
      } catch (e) {
        setPickupText("Locație curentă");
      }
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }
      setUser(session.user);
      
      const { data: prof } = await supabase.from("riders").select("*").eq("id", session.user.id).single();
      setProfile(prof);
      setLoadingAuth(false);
      handleAutoGPS();
    };
    init();
  }, [router, handleAutoGPS]);

  // 2. AUTOCOMPLETE AVANSAT (URL REPARAT)
  const fetchSuggestions = async (query) => {
    setDestText(query);
    if (query.length < 3) { setSuggestions([]); return; }

    try {
      const res = await fetch(
        `https://mapbox.com{encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&proximity=${viewState.longitude},${viewState.latitude}&country=ro`
      );
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (e) {
      console.error("Sugestii error:", e);
    }
  };

  const handleSelectDest = (feat) => {
    const [lng, lat] = feat.center;
    setDestination({ lat, lng });
    setDestText(feat.place_name);
    setSuggestions([]);
    setViewState(prev => ({ ...prev, latitude: lat, longitude: lng, zoom: 14 }));
  };

  // 3. CALCUL RUTĂ (URL REPARAT)
  const getRoute = useCallback(async () => {
    if (!pickup || !destination) return;
    try {
      const url = `https://mapbox.com{pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.routes?.[0]) {
        setRouteData({
          geometry: data.routes[0].geometry,
          distance: data.routes[0].distance / 1000,
          duration: Math.floor(data.routes[0].duration / 60)
        });
        setRideStatus("ready");
      }
    } catch (e) {
      console.error("Route error:", e);
    }
  }, [pickup, destination]);

  useEffect(() => { getRoute(); }, [getRoute]);

  // 4. PLASEAZĂ COMANDA (CONFORM TABELULUI SQL)
  const handlePlaceOrder = async () => {
    setRideStatus("searching");
    const price = (routeData.distance * carOptions[selectedCar].rate).toFixed(2);

    // Coloana 'items' este jsonb not null în schema ta
    const itemsData = [{
      type: "ride",
      service: carOptions[selectedCar].label,
      km: routeData.distance.toFixed(1)
    }];

    const { error } = await supabase.from('orders').insert([{
      user_id: user.id,
      items: itemsData,
      total_amount: price,
      status: 'pending',
      delivery_address: destText,
      customer_name: profile?.name || user.email,
      customer_phone: profile?.phone || "",
      restaurant_name: `uCAB ${carOptions[selectedCar].label}`,
      notes: `Pickup: ${pickupText}`
    }]);

    if (!error) {
      setTimeout(() => setRideStatus("active"), 2000);
    } else {
      console.error(error);
      alert("Eroare SQL: " + error.message);
      setRideStatus("ready");
    }
  };

  if (loadingAuth) return null;

  return (
    <div className="h-screen w-full relative bg-[#F8FAFC] overflow-hidden">
      <Map
        {...viewState}
        onMove={e => setViewState(e.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="bottom-right" />
        {pickup && <Marker longitude={pickup.lng} latitude={pickup.lat} color="#2563eb" />}
        {destination && <Marker longitude={destination.lng} latitude={destination.lat} color="#000" />}
        {routeData && (
          <Source id="rt" type="geojson" data={{ type: 'Feature', geometry: routeData.geometry }}>
            <Layer id="rt-line" type="line" paint={{ 'line-color': '#2563eb', 'line-width': 5 }} />
          </Source>
        )}
      </Map>

      {/* SEARCH PANEL */}
      <div className="absolute top-6 left-6 w-full max-w-[400px] z-50">
        <div className="bg-white rounded-[2rem] shadow-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">uCAB Rider</p>
              <p className="text-xs font-bold">{user.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-transparent">
              <Navigation size={18} className="text-blue-600" />
              <input readOnly className="bg-transparent outline-none text-sm font-bold w-full text-slate-500" value={pickupText} />
              <button onClick={handleAutoGPS} className="text-blue-600"><LocateFixed size={18}/></button>
            </div>

            <div className="relative">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-transparent focus-within:border-black transition-all">
                <Flag size={18} className="text-slate-400" />
                <input 
                  placeholder="Unde mergem?" 
                  className="bg-transparent outline-none text-sm font-bold w-full"
                  value={destText}
                  onChange={e => fetchSuggestions(e.target.value)}
                />
              </div>

              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => handleSelectDest(s)} className="w-full text-left p-4 hover:bg-slate-50 flex items-start gap-3 border-b border-slate-50 last:border-none">
                        <MapPin size={16} className="text-slate-300 mt-1" />
                        <div>
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{s.text}</p>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{s.place_name}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM PANEL */}
      <AnimatePresence>
        {rideStatus === "ready" && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="absolute bottom-0 left-0 right-0 p-6 z-50 bg-gradient-to-t from-white via-white to-transparent">
            <div className="max-w-[500px] mx-auto bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-50">
              <div className="flex justify-between items-center mb-8">
                <div className="text-left">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Confirmă Cursa</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{routeData.duration} min drum • {routeData.distance.toFixed(1)} km</p>
                </div>
                <p className="text-3xl font-black tracking-tighter italic">{(routeData.distance * carOptions[selectedCar].rate).toFixed(2)} <span className="text-xs font-bold">RON</span></p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {Object.entries(carOptions).map(([key, car]) => (
                  <button key={key} onClick={() => setSelectedCar(key)} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedCar === key ? 'border-black bg-slate-50' : 'border-transparent bg-slate-50/50'}`}>
                    <car.icon size={20} className={selectedCar === key ? 'text-black' : 'text-slate-300'} />
                    <span className="text-[9px] font-black uppercase tracking-tighter">{car.label}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={handlePlaceOrder}
                className="w-full bg-black text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-4 group"
              >
                PLASEAZĂ COMANDA <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAYS */}
      <AnimatePresence>
        {(rideStatus === "searching" || rideStatus === "active") && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <div className="bg-white rounded-[3rem] p-12 text-center max-w-sm w-full">
              {rideStatus === "searching" ? (
                <>
                  <Loader2 size={48} className="text-blue-600 animate-spin mx-auto mb-6" />
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter italic">Se caută uCAB...</h3>
                </>
              ) : (
                <>
                  <ShieldCheck size={64} className="text-emerald-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter italic text-emerald-600">Comandă Plasată!</h3>
                  <button onClick={() => router.push("/account")} className="mt-8 w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest">Istoric Curse</button>
                </>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

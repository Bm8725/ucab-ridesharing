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
  
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [viewState, setViewState] = useState({
    latitude: 44.4396,
    longitude: 26.0963,
    zoom: 13,
    pitch: 45
  });

  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [pickupText, setPickupText] = useState("Localizare...");
  const [destText, setDestText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [routeData, setRouteData] = useState(null);
  const [selectedCar, setSelectedCar] = useState("standard");
  const [rideStatus, setRideStatus] = useState("idle");

  // 1. LOCALIZARE GPS (REPARATA PENTRU MOBIL)
  const handleAutoGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setPickupText("GPS indisponibil");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPickup(coords);
        setViewState(prev => ({ ...prev, ...coords, zoom: 15 }));
        
        try {
          const res = await fetch(`https://mapbox.com{coords.lng},${coords.lat}.json?access_token=${MAPBOX_TOKEN}`);
          const data = await res.json();
          if (data.features && data.features.length > 0) {
            setPickupText(data.features[0].place_name);
          } else {
            setPickupText("Locație detectată");
          }
        } catch (e) {
          setPickupText("Eroare adresă GPS");
        }
      },
      (err) => {
        console.error(err);
        setPickupText("Permite accesul la locație");
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // 2. AUTH & STARTUP
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);
      
      const { data: prof } = await supabase.from("riders").select("*").eq("id", session.user.id).single();
      if (prof) setProfile(prof);
      
      setLoadingAuth(false);
      handleAutoGPS(); // Pornim GPS-ul imediat
    };
    init();
  }, [router, handleAutoGPS]);

  // 3. AUTOCOMPLETE DESTINATIE
  const fetchSuggestions = async (query) => {
    setDestText(query);
    if (query.length < 3) { setSuggestions([]); return; }
    try {
      const res = await fetch(`https://mapbox.com{encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&proximity=${viewState.longitude},${viewState.latitude}&country=ro`);
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (e) { console.error(e); }
  };

  const handleSelectDest = (feat) => {
    const [lng, lat] = feat.center;
    setDestination({ lat, lng });
    setDestText(feat.place_name);
    setSuggestions([]);
    setViewState(prev => ({ ...prev, latitude: lat, longitude: lng, zoom: 14 }));
  };

  // 4. CALCUL RUTA (URL REPARAT TOTAL)
  const getRoute = useCallback(async () => {
    if (!pickup || !destination) return;
    
    const url = `https://mapbox.com{pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        setRouteData({
          geometry: data.routes[0].geometry,
          distance: data.routes[0].distance / 1000,
          duration: Math.floor(data.routes[0].duration / 60)
        });
        setRideStatus("ready");
      }
    } catch (e) {
      console.error("Eroare ruta:", e);
    }
  }, [pickup, destination]);

  useEffect(() => {
    getRoute();
  }, [getRoute]);

  // 5. PLASARE COMANDA (CONFORM SCHEMA SQL)
  const handlePlaceOrder = async () => {
    if (!routeData) return;
    setRideStatus("searching");
    const price = (routeData.distance * carOptions[selectedCar].rate).toFixed(2);

    const { error } = await supabase.from('orders').insert([{
      user_id: user.id,
      items: [{ type: "ride", service: carOptions[selectedCar].label }],
      total_amount: price,
      status: 'pending',
      delivery_address: destText,
      customer_name: profile?.name || user.email,
      restaurant_name: `uCAB ${carOptions[selectedCar].label}`,
      notes: `Plecarea: ${pickupText}`
    }]);

    if (!error) {
      setTimeout(() => setRideStatus("active"), 2000);
    } else {
      alert("Eroare!");
      setRideStatus("ready");
    }
  };

  if (loadingAuth) return (
    <div className="h-screen w-full flex items-center justify-center bg-black">
      <Loader2 className="animate-spin text-blue-500" size={40} />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-white overflow-hidden flex flex-col">
      
      {/* MAPBOX CONTAINER - FORTAT PE MOBIL */}
      <div className="relative flex-1 w-full h-full z-0">
        <Map
          {...viewState}
          onMove={e => setViewState(e.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v12"
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
      </div>

      {/* PANOU CAUTARE (SUS) */}
      <div className="absolute top-4 left-4 right-4 z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <Zap size={16} fill="currentColor" />
            </div>
            <p className="text-xs font-bold text-slate-800 truncate">{user?.email}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
              <Navigation size={16} className="text-blue-600 shrink-0" />
              <input readOnly className="bg-transparent outline-none text-sm font-bold w-full text-slate-500 truncate" value={pickupText} />
              <button onClick={handleAutoGPS} className="text-blue-600 p-1"><LocateFixed size={18}/></button>
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-transparent focus-within:border-black transition-all">
                <Flag size={16} className="text-slate-400 shrink-0" />
                <input 
                  placeholder="Unde mergem?" 
                  className="bg-transparent outline-none text-sm font-bold w-full text-slate-900"
                  value={destText}
                  onChange={e => fetchSuggestions(e.target.value)}
                />
              </div>

              <AnimatePresence>
                {suggestions.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60]">
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => handleSelectDest(s)} className="w-full text-left p-4 hover:bg-slate-50 border-b border-slate-50 last:border-none flex items-start gap-3">
                        <MapPin size={16} className="text-slate-300 mt-1" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{s.text}</p>
                          <p className="text-[10px] text-slate-400">{s.place_name}</p>
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

      {/* BUTON PLASARE (JOS) */}
      <AnimatePresence>
        {rideStatus === "ready" && (
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} className="absolute bottom-0 left-0 right-0 p-4 z-50 bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center px-4 py-2 border-b border-slate-50 mb-4">
              <div className="text-left">
                <h3 className="text-xl font-black italic tracking-tighter uppercase italic">Confirmă</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{routeData?.duration} min • {routeData?.distance.toFixed(1)} km</p>
              </div>
              <p className="text-2xl font-black tracking-tighter italic">{(routeData?.distance * carOptions[selectedCar].rate).toFixed(2)} RON</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {Object.entries(carOptions).map(([key, car]) => (
                <button key={key} onClick={() => setSelectedCar(key)} className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 ${selectedCar === key ? 'border-black bg-slate-50' : 'border-transparent bg-slate-50'}`}>
                  <car.icon size={18} className={selectedCar === key ? 'text-black' : 'text-slate-300'} />
                  <span className="text-[9px] font-black uppercase tracking-tighter">{car.label}</span>
                </button>
              ))}
            </div>

            <button onClick={handlePlaceOrder} className="w-full bg-black text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
              PLASEAZĂ COMANDA
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL SEARCHING / SUCCESS */}
      <AnimatePresence>
        {(rideStatus === "searching" || rideStatus === "active") && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <div className="bg-white rounded-[3rem] p-10 text-center max-w-sm w-full">
              {rideStatus === "searching" ? (
                <div className="py-4">
                  <Loader2 size={40} className="text-blue-600 animate-spin mx-auto mb-4" />
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">Se caută uCAB...</h3>
                </div>
              ) : (
                <div className="py-4">
                  <ShieldCheck size={50} className="text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-black italic uppercase tracking-tighter text-emerald-600">Comandă Plasată!</h3>
                  <button onClick={() => router.push("/account")} className="mt-6 w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest">Istoric</button>
                </div>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

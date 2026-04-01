"use client";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabaseConfig";
import {
  LocateFixed, Loader2, User, ChevronRight,
  MapPin, X, Clock, Route, CheckCircle2
} from "lucide-react";

const MapUser = dynamic(() => import("./MapUser"), { ssr: false });

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

// ─── URL-uri Mapbox corecte ───────────────────────────────────────────────────
const URL_REVERSE = (lng, lat) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${TOKEN}&language=ro`;

const URL_SEARCH = (query) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${TOKEN}&country=ro&language=ro&limit=5`;

const URL_DIRECTIONS = (pickup, dest) =>
  `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${dest.lng},${dest.lat}?geometries=geojson&overview=full&access_token=${TOKEN}`;
// ─────────────────────────────────────────────────────────────────────────────

export default function RidePage() {
  const [user, setUser] = useState(null);
  const [viewState, setViewState] = useState({ latitude: 44.4396, longitude: 26.0963, zoom: 12 });
  const [pickup, setPickup] = useState(null);
  const [pickupText, setPickupText] = useState("Se detectează locația...");
  const [destination, setDestination] = useState(null);
  const [destText, setDestText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState("idle"); // idle | loading | success | error

  // ── AUTH ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
    });
  }, []);

  // ── GPS ───────────────────────────────────────────────────────────────────
  const initGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setPickupText("GPS indisponibil");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const coords = { lng: pos.coords.longitude, lat: pos.coords.latitude };
          setPickup(coords);
          setViewState(v => ({ ...v, longitude: coords.lng, latitude: coords.lat, zoom: 15 }));
          const res = await fetch(URL_REVERSE(coords.lng, coords.lat));
          const data = await res.json();
          setPickupText(data.features?.[0]?.place_name || "Locația mea");
        } catch {
          setPickupText("Locația mea");
        } finally {
          setGpsLoading(false);
        }
      },
      () => {
        setPickupText("Locație indisponibilă");
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => { initGPS(); }, [initGPS]);

  // ── SEARCH ────────────────────────────────────────────────────────────────
  const handleSearch = async (val) => {
    setDestText(val);
    setDestination(null);
    setRouteData(null);
    if (val.length < 3) return setSuggestions([]);
    try {
      const res = await fetch(URL_SEARCH(val));
      const data = await res.json();
      setSuggestions(data.features || []);
    } catch (e) {
      console.error("Search Error:", e);
    }
  };

  const selectDest = (s) => {
    const coords = { lng: s.center[0], lat: s.center[1] };
    setDestination(coords);
    setDestText(s.place_name);
    setSuggestions([]);
    setViewState(v => ({ ...v, longitude: coords.lng, latitude: coords.lat, zoom: 14 }));
  };

  const clearDest = () => {
    setDestination(null);
    setDestText("");
    setSuggestions([]);
    setRouteData(null);
  };

  // ── RUTĂ AUTOMATĂ ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!pickup || !destination) return;
    fetch(URL_DIRECTIONS(pickup, destination))
      .then(r => r.json())
      .then(data => {
        if (data.routes?.[0]) setRouteData(data.routes[0]);
      })
      .catch(e => console.error("Directions Error:", e));
  }, [pickup, destination]);

  // ── COMANDĂ ───────────────────────────────────────────────────────────────
  const handleOrder = async () => {
    if (!routeData || !user || orderStatus === "loading") return;
    setOrderStatus("loading");

    const pret = parseFloat((routeData.distance / 1000 * 2.5).toFixed(2));
    const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Client";

    const { error } = await supabase.from("orders").insert([{
      user_id: user.id,
      items: [],                          // ride → items gol
      total_amount: pret,
      status: "pending",
      delivery_address: destText,         // destinație
      notes: pickupText,                  // pickup salvat în notes
      customer_name: userName,
      customer_phone: null,
      restaurant_name: "uCAB Ride",       // diferențiator față de food orders
      restaurant_id: null,
      payment_method: "cash",
    }]);

    if (error) {
      console.error("Supabase error:", error.message);
      setOrderStatus("error");
      setTimeout(() => setOrderStatus("idle"), 3000);
    } else {
      setOrderStatus("success");
      clearDest();
      setTimeout(() => setOrderStatus("idle"), 4000);
    }
  };

  // ── Calcule ───────────────────────────────────────────────────────────────
  const distantaKm = routeData ? (routeData.distance / 1000).toFixed(1) : null;
  const timpMin    = routeData ? Math.ceil(routeData.duration / 60) : null;
  const pret       = routeData ? (routeData.distance / 1000 * 2.5).toFixed(2) : null;
  const userName   = user?.user_metadata?.full_name || user?.email?.split("@")[0];

  // ── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (orderStatus === "success") return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <div className="text-green-500 mb-6">
        <CheckCircle2 size={100} strokeWidth={2.5} />
      </div>
      <h1 className="text-4xl font-black uppercase italic tracking-tighter">Cursă confirmată!</h1>
      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
        Un șofer uCAB este pe drum
      </p>
      <p className="mt-8 text-gray-300 animate-pulse text-[10px] uppercase font-black">
        Se revine la hartă...
      </p>
    </div>
  );

  // ── MAIN ──────────────────────────────────────────────────────────────────
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white">

      {/* HARTĂ */}
      <div className="absolute inset-0 z-0">
        <MapUser
          viewState={viewState}
          setViewState={setViewState}
          pickup={pickup}
          destination={destination}
          routeData={routeData?.geometry}
        />
      </div>

      {/* HEADER — logo + user */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between pointer-events-none">
        <div className="bg-black text-white px-5 py-3 rounded-2xl shadow-2xl pointer-events-auto">
          <span className="font-black text-sm uppercase italic tracking-tighter">uCAB</span>
          <span className="text-blue-400 font-black text-sm italic">.ro</span>
        </div>

        {userName && (
          <div className="bg-white/90 backdrop-blur px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-gray-100 pointer-events-auto">
            <User size={14} className="text-blue-600" />
            <span className="text-[11px] font-black uppercase tracking-tight text-gray-700">
              {userName}
            </span>
          </div>
        )}
      </div>

      {/* PANEL JOS */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <div className="max-w-md mx-auto space-y-3">

          {/* INFO RUTĂ — apare doar când avem rută */}
          {routeData && (
            <div className="bg-white/90 backdrop-blur rounded-[2rem] px-6 py-4 shadow-xl border border-gray-100 flex items-center justify-around">
              <div className="text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Distanță</p>
                <p className="font-black text-lg text-black">{distantaKm} km</p>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Timp</p>
                <p className="font-black text-lg text-black">{timpMin} min</p>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Preț</p>
                <p className="font-black text-lg text-blue-600">{pret} Lei</p>
              </div>
            </div>
          )}

          {/* PANEL PRINCIPAL */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-5 border border-slate-100">

            {/* SUGESTII */}
            {suggestions.length > 0 && (
              <div className="mb-3 bg-slate-50 rounded-2xl max-h-44 overflow-y-auto border border-slate-100">
                {suggestions.map(s => (
                  <button
                    key={s.id}
                    onClick={() => selectDest(s)}
                    className="w-full text-left p-3 hover:bg-white flex items-center gap-3 border-b border-white last:border-0 transition-colors"
                  >
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    <span className="text-[11px] font-bold truncate text-slate-600">{s.place_name}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {/* PICKUP */}
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                <span className="text-[11px] font-bold text-slate-400 truncate flex-1">
                  {gpsLoading ? "Se detectează..." : pickupText}
                </span>
                <button onClick={initGPS} className="shrink-0">
                  {gpsLoading
                    ? <Loader2 size={15} className="text-blue-500 animate-spin" />
                    : <LocateFixed size={15} className="text-blue-600" />
                  }
                </button>
              </div>

              {/* DESTINAȚIE */}
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border-2 border-black">
                <div className="w-2.5 h-2.5 rounded-full bg-black shrink-0" />
                <input
                  placeholder="Unde mergem?"
                  className="bg-transparent outline-none text-[11px] font-black w-full text-black placeholder:text-slate-400"
                  value={destText}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {destText.length > 0 && (
                  <button onClick={clearDest} className="shrink-0">
                    <X size={14} className="text-slate-400" />
                  </button>
                )}
              </div>
            </div>

            {/* BUTON COMANDĂ */}
            {routeData && (
              <button
                onClick={handleOrder}
                disabled={orderStatus === "loading"}
                className="w-full mt-4 bg-black text-white py-5 rounded-2xl font-black text-xs shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-blue-600 disabled:bg-gray-200 uppercase tracking-widest italic"
              >
                {orderStatus === "loading"
                  ? <Loader2 size={18} className="animate-spin" />
                  : <>Comandă Cursa • {pret} Lei <ChevronRight size={14} /></>
                }
              </button>
            )}

            {orderStatus === "error" && (
              <p className="text-center text-red-500 text-[10px] font-black uppercase tracking-widest mt-3">
                Eroare! Încearcă din nou.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
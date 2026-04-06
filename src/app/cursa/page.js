"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabaseConfig";
import {
  LocateFixed, Loader2, User, ChevronRight,
  MapPin, X, CheckCircle2, AlertCircle,
} from "lucide-react";

const MapUser = dynamic(() => import("./MapUser"), { ssr: false });

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const URL_REVERSE = (lng, lat) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${TOKEN}&language=ro`;

const URL_SEARCH = (query) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${TOKEN}&country=ro&language=ro&limit=6`;

const URL_DIRECTIONS = (pickup, dest) =>
  `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${dest.lng},${dest.lat}?geometries=geojson&overview=full&access_token=${TOKEN}`;

// ─── Preț ─────────────────────────────────────────────────────────────────
const PRET_PER_KM = 2.5;
const calcPret = (distanceMeters) =>
  parseFloat(((distanceMeters / 1000) * PRET_PER_KM).toFixed(2));

// ─────────────────────────────────────────────────────────────────────────────
export default function RidePage() {
  const [user,       setUser]       = useState(null);
  const [userName,   setUserName]   = useState("");
  const [viewState,  setViewState]  = useState({ latitude: 44.4396, longitude: 26.0963, zoom: 13 });
  const [pickup,     setPickup]     = useState(null);
  const [pickupText, setPickupText] = useState("Se detectează locația...");
  const [destination,  setDestination]  = useState(null);
  const [destText,     setDestText]     = useState("");
  const [suggestions,  setSuggestions]  = useState([]);
  const [routeData,    setRouteData]    = useState(null);
  const [gpsLoading,   setGpsLoading]   = useState(false);
  const [orderStatus,  setOrderStatus]  = useState("idle"); // idle | loading | success | error
  const searchRef = useRef(null);

  // ── AUTH ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // ── Nume utilizator din tabelul riders ────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    supabase
      .from("riders")
      .select("name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setUserName(
          data?.name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Client"
        );
      });
  }, [user]);

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
          setViewState((v) => ({ ...v, longitude: coords.lng, latitude: coords.lat, zoom: 15 }));
          const res  = await fetch(URL_REVERSE(coords.lng, coords.lat));
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

  // ── SEARCH (debounced) ────────────────────────────────────────────────────
  const handleSearch = (val) => {
    setDestText(val);
    setDestination(null);
    setRouteData(null);
    clearTimeout(searchRef.current);
    if (val.length < 3) { setSuggestions([]); return; }
    searchRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(URL_SEARCH(val));
        const data = await res.json();
        setSuggestions(data.features || []);
      } catch (e) {
        console.error("Search error:", e);
      }
    }, 300);
  };

  const selectDest = (s) => {
    const coords = { lng: s.center[0], lat: s.center[1] };
    setDestination(coords);
    setDestText(s.place_name);
    setSuggestions([]);
    setViewState((v) => ({ ...v, longitude: coords.lng, latitude: coords.lat, zoom: 14 }));
  };

  const clearDest = () => {
    setDestination(null);
    setDestText("");
    setSuggestions([]);
    setRouteData(null);
  };

  // ── RUTĂ automată ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!pickup || !destination) return;
    fetch(URL_DIRECTIONS(pickup, destination))
      .then((r) => r.json())
      .then((data) => {
        if (data.routes?.[0]) setRouteData(data.routes[0]);
      })
      .catch((e) => console.error("Directions error:", e));
  }, [pickup, destination]);

  // ── COMANDĂ ───────────────────────────────────────────────────────────────
  const handleOrder = async () => {
    if (!routeData || !user || orderStatus === "loading") return;
    setOrderStatus("loading");

    const pret     = calcPret(routeData.distance);
    const userName_ = userName || "Client";

    const { error } = await supabase.from("orders").insert([
      {
        user_id:          user.id,
        items:            [],
        total_amount:     pret,
        status:           "pending",
        type:             "ride",
        delivery_address: destText,
        notes:            pickupText,
        customer_name:    userName_,
        customer_phone:   null,
        restaurant_name:  "uCAB Ride",
        restaurant_id:    null,
        payment_method:   "cash",
        // Coordonate exacte
        pickup_lat:   pickup?.lat  ?? null,
        pickup_lng:   pickup?.lng  ?? null,
        dropoff_lat:  destination?.lat ?? null,
        dropoff_lng:  destination?.lng ?? null,
        delivery_fee: 0,
        tip_amount:   0,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error.message);
      setOrderStatus("error");
      setTimeout(() => setOrderStatus("idle"), 4000);
    } else {
      setOrderStatus("success");
      clearDest();
      setTimeout(() => setOrderStatus("idle"), 5000);
    }
  };

  // ── Valori calculate ──────────────────────────────────────────────────────
  const distantaKm = routeData ? (routeData.distance / 1000).toFixed(1) : null;
  const timpMin    = routeData ? Math.ceil(routeData.duration / 60)     : null;
  const pret       = routeData ? calcPret(routeData.distance)           : null;

  // ── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (orderStatus === "success") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 p-8 text-center gap-4">
        <div className="w-24 h-24 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center">
          <CheckCircle2 size={56} className="text-green-500" strokeWidth={2} />
        </div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-black dark:text-white">
          Cursă confirmată!
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Un șofer uCAB este pe drum
        </p>
        <p className="mt-6 text-[10px] uppercase font-bold text-gray-300 animate-pulse">
          Se revine la hartă...
        </p>
      </div>
    );
  }

  // ── MAIN ──────────────────────────────────────────────────────────────────
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white dark:bg-zinc-950">

      {/* HARTĂ */}
      <div className="absolute inset-0 z-0">
        <MapUser
          viewState={viewState}
          setViewState={setViewState}
          pickup={pickup}
          destination={destination}
          routeData={routeData?.geometry ?? null}
        />
      </div>

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between pointer-events-none">
        <div className="bg-black text-white px-5 py-3 rounded-2xl shadow-xl pointer-events-auto">
          <span className="font-black text-sm uppercase italic tracking-tighter">uCAB</span>
          <span className="text-blue-400 font-black text-sm italic">.ro</span>
        </div>

        {userName && (
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-gray-100 dark:border-zinc-800 pointer-events-auto">
            <User size={13} className="text-blue-600" />
            <span className="text-[11px] font-black uppercase tracking-tight text-gray-700 dark:text-gray-200">
              {userName}
            </span>
          </div>
        )}
      </div>

      {/* PANEL JOS */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 pb-6">
        <div className="max-w-md mx-auto space-y-3">

          {/* INFO RUTĂ */}
          {routeData && (
            <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur rounded-[2rem] px-6 py-4 shadow-xl border border-gray-100 dark:border-zinc-800 flex items-center justify-around">
              <div className="text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Distanță</p>
                <p className="font-black text-lg text-black dark:text-white">{distantaKm} km</p>
              </div>
              <div className="w-px h-8 bg-gray-100 dark:bg-zinc-700" />
              <div className="text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Timp</p>
                <p className="font-black text-lg text-black dark:text-white">{timpMin} min</p>
              </div>
              <div className="w-px h-8 bg-gray-100 dark:bg-zinc-700" />
              <div className="text-center">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Preț</p>
                <p className="font-black text-lg text-blue-600">{pret} Lei</p>
              </div>
            </div>
          )}

          {/* PANOU PRINCIPAL */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl p-5 border border-slate-100 dark:border-zinc-800">

            {/* SUGESTII */}
            {suggestions.length > 0 && (
              <div className="mb-3 bg-slate-50 dark:bg-zinc-800 rounded-2xl max-h-44 overflow-y-auto border border-slate-100 dark:border-zinc-700">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => selectDest(s)}
                    className="w-full text-left p-3 hover:bg-white dark:hover:bg-zinc-700 flex items-center gap-3 border-b border-white dark:border-zinc-700 last:border-0 transition-colors"
                  >
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    <span className="text-[11px] font-bold truncate text-slate-600 dark:text-slate-300">
                      {s.place_name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {/* PICKUP */}
              <div className="bg-slate-50 dark:bg-zinc-800 p-4 rounded-2xl flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate flex-1">
                  {gpsLoading ? "Detectez..." : pickupText}
                </span>
                <button onClick={initGPS} className="shrink-0" aria-label="Redetectează GPS">
                  {gpsLoading
                    ? <Loader2 size={15} className="text-blue-500 animate-spin" />
                    : <LocateFixed size={15} className="text-blue-600" />
                  }
                </button>
              </div>

              {/* DESTINAȚIE */}
              <div className="bg-slate-50 dark:bg-zinc-800 p-4 rounded-2xl flex items-center gap-3 border-2 border-black dark:border-white">
                <div className="w-2.5 h-2.5 rounded-full bg-black dark:bg-white shrink-0" />
                <input
                  type="text"
                  placeholder="Unde mergem?"
                  className="bg-transparent outline-none text-[11px] font-black w-full text-black dark:text-white placeholder:text-slate-400"
                  value={destText}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoComplete="off"
                  aria-label="Destinație"
                />
                {destText.length > 0 && (
                  <button onClick={clearDest} className="shrink-0" aria-label="Șterge destinația">
                    <X size={14} className="text-slate-400" />
                  </button>
                )}
              </div>
            </div>

            {/* BUTON COMANDĂ */}
            {routeData && (
              <button
                onClick={handleOrder}
                disabled={orderStatus === "loading" || !user}
                className="w-full mt-4 bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black text-xs shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-blue-600 disabled:bg-gray-200 dark:disabled:bg-zinc-700 disabled:text-gray-400 uppercase tracking-widest italic"
              >
                {orderStatus === "loading" ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : !user ? (
                  "Autentifică-te pentru a comanda"
                ) : (
                  <>Comandă cursa • {pret} Lei <ChevronRight size={14} /></>
                )}
              </button>
            )}

            {/* EROARE */}
            {orderStatus === "error" && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <AlertCircle size={13} className="text-red-500" />
                <p className="text-center text-red-500 text-[10px] font-black uppercase tracking-widest">
                  Eroare! Încearcă din nou.
                </p>
              </div>
            )}

            {/* USER NELOGAT */}
            {!user && !routeData && (
              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-3">
                Trebuie să fii autentificat pentru a comanda
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
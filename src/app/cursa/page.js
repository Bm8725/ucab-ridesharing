"use client";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabaseConfig";
import { Navigation, Flag, LocateFixed, Loader2, User, ChevronRight, MapPin } from "lucide-react";

const MapUser = dynamic(() => import("./MapUser"), { ssr: false });
const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function RidePage() {
  const [user, setUser] = useState(null);
  const [viewState, setViewState] = useState({ latitude: 44.4396, longitude: 26.0963, zoom: 12 });
  const [pickup, setPickup] = useState(null);
  const [pickupText, setPickupText] = useState("Locația mea");
  const [destination, setDestination] = useState(null);
  const [destText, setDestText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. AUTH & USERNAME
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
    });
  }, []);

  // 2. GPS REPARAT (Fără Failed to Fetch)
  const initGPS = useCallback(async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const coords = { lng: pos.coords.longitude, lat: pos.coords.latitude };
      setPickup(coords);
      setViewState(v => ({ ...v, ...coords, zoom: 15 }));
      
      const res = await fetch(`https://mapbox.com{coords.lng},${coords.lat}.json?access_token=${TOKEN}`);
      const data = await res.json();
      if (data.features) setPickupText(data.features[0].place_name);
    });
  }, []);

  useEffect(() => { initGPS(); }, [initGPS]);

  // 3. SEARCH & SELECT
  const handleSearch = async (val) => {
    setDestText(val);
    if (val.length < 3) return setSuggestions([]);
    const res = await fetch(`https://mapbox.com{encodeURIComponent(val)}.json?access_token=${TOKEN}&country=ro&limit=5`);
    const data = await res.json();
    setSuggestions(data.features || []);
  };

  const selectDest = (s) => {
    const coords = { lng: s.center[0], lat: s.center[1] };
    setDestination(coords);
    setDestText(s.place_name);
    setSuggestions([]);
    setViewState(v => ({ ...v, ...coords, zoom: 14 }));
  };

  // 4. RUTA AUTOMATĂ
  useEffect(() => {
    if (!pickup || !destination) return;
    fetch(`https://mapbox.com{pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${TOKEN}`)
      .then(r => r.json())
      .then(data => {
        if (data.routes) setRouteData(data.routes[0]);
      });
  }, [pickup, destination]);

  // 5. COMANDA (SQL)
  const handleOrder = async () => {
    setLoading(true);
    const { error } = await supabase.from('orders').insert([{
      user_id: user?.id,
      customer_name: user?.user_metadata?.full_name || user?.email.split('@')[0],
      total_amount: (routeData.distance * 0.0025).toFixed(2), // 2.5 lei pe km
      status: 'pending',
      delivery_address: destText,
      restaurant_name: "uCAB Ride"
    }]);
    setLoading(false);
    if (!error) alert("Comandă confirmată!"); else alert(error.message);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col bg-white">
      <div className="flex-1 z-0"><MapUser viewState={viewState} setViewState={setViewState} pickup={pickup} destination={destination} routeData={routeData?.geometry} /></div>

      <div className="absolute bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto space-y-3">
          
          {/* BADGE UTILIZATOR */}
          <div className="bg-black text-white p-3 rounded-2xl flex items-center justify-between shadow-xl border border-white/10 w-fit ml-auto">
             <div className="flex items-center gap-2 px-2">
                <User size={14} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-tighter">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                </span>
             </div>
          </div>

          {/* PANEL CONTROL */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 border border-slate-100">
            {suggestions.length > 0 && (
              <div className="mb-3 bg-slate-50 rounded-2xl max-h-40 overflow-y-auto border border-slate-100 shadow-inner">
                {suggestions.map(s => (
                  <button key={s.id} onClick={() => selectDest(s)} className="w-full text-left p-3 hover:bg-white flex items-center gap-3 border-b border-white last:border-0 transition-colors">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="text-[11px] font-bold truncate text-slate-600">{s.place_name}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-[11px] font-bold text-slate-400 truncate flex-1">{pickupText}</span>
                <LocateFixed size={16} className="text-blue-600 cursor-pointer" onClick={initGPS} />
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3 border-2 border-black">
                <div className="w-2 h-2 rounded-full bg-black" />
                <input 
                  placeholder="Unde mergem?" 
                  className="bg-transparent outline-none text-[11px] font-black w-full text-black"
                  value={destText}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* BUTONUL DE COMANDĂ - Apare doar când ai rută */}
            {routeData && (
              <button 
                onClick={handleOrder} 
                disabled={loading} 
                className="w-full mt-4 bg-black text-white py-4 rounded-2xl font-black text-xs shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>CONFIRMĂ CURSA ({(routeData.distance * 0.0025).toFixed(2)} Lei) <ChevronRight size={14}/></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

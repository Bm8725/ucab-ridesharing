"use client";
import { useState, useEffect, useRef } from "react";
import Map, { Marker, Source, Layer, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

// Fix RTLTextPlugin — necesar pentru texte arabe/ebraice în Mapbox
if (typeof window !== "undefined" && !mapboxgl.getRTLTextPluginStatus) {
  mapboxgl.setRTLTextPlugin(
    "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js",
    null,
    true
  );
}

export default function MapUser({ viewState, setViewState, pickup, destination, routeData }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);

  // ── Auto-fit bounds când avem pickup + destination ────────────────────────
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !pickup || !destination) return;

    const map = mapRef.current.getMap();
    const bounds = new mapboxgl.LngLatBounds(
      [pickup.lng, pickup.lat],
      [destination.lng, destination.lat]
    );
    map.fitBounds(bounds, { padding: 80, maxZoom: 15, duration: 1000 });
  }, [pickup, destination, mapLoaded]);

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      onLoad={() => setMapLoaded(true)}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      style={{ width: "100%", height: "100%" }}
      mapLib={mapboxgl}
      reuseMaps                   // ✅ previne memory leak la re-render
    >
      {/* Butoane zoom */}
      <NavigationControl position="top-right" showCompass={false} />

      {mapLoaded && (
        <>
          {/* ── MARKER PICKUP ─────────────────────────────────────── */}
          {pickup?.lng != null && pickup?.lat != null && (
            <Marker
              longitude={Number(pickup.lng)}
              latitude={Number(pickup.lat)}
              anchor="center"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-xl z-10" />
                <div className="absolute w-10 h-10 rounded-full bg-blue-400 opacity-30 animate-ping" />
              </div>
            </Marker>
          )}

          {/* ── MARKER DESTINAȚIE ─────────────────────────────────── */}
          {destination?.lng != null && destination?.lat != null && (
            <Marker
              longitude={Number(destination.lng)}
              latitude={Number(destination.lat)}
              anchor="bottom"
            >
              <div className="flex flex-col items-center">
                <div className="bg-black text-white text-[9px] font-black uppercase px-2 py-1 rounded-xl shadow-xl tracking-widest mb-1">
                  DEST
                </div>
                <div className="w-3 h-3 bg-black rounded-full border-2 border-white shadow-lg" />
              </div>
            </Marker>
          )}

          {/* ── RUTĂ ──────────────────────────────────────────────── */}
          {routeData && (
            <Source
              id="rt-source"
              type="geojson"
              data={{ type: "Feature", geometry: routeData }}
            >
              {/* Shadow */}
              <Layer
                id="line-shadow"
                type="line"
                paint={{
                  "line-color": "#000000",
                  "line-width": 9,
                  "line-opacity": 0.12,
                  "line-blur": 3,
                }}
                layout={{ "line-cap": "round", "line-join": "round" }}
              />
              {/* Linie principală */}
              <Layer
                id="line-main"
                type="line"
                paint={{
                  "line-color": "#2563eb",
                  "line-width": 5,
                }}
                layout={{ "line-cap": "round", "line-join": "round" }}
              />
              {/* Linie albă deasupra — efect de progres */}
              <Layer
                id="line-inner"
                type="line"
                paint={{
                  "line-color": "#ffffff",
                  "line-width": 2,
                  "line-opacity": 0.6,
                }}
                layout={{ "line-cap": "round", "line-join": "round" }}
              />
            </Source>
          )}
        </>
      )}
    </Map>
  );
}
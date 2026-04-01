"use client";
import Map, { Marker, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

// Fix eroare worker
if (typeof window !== "undefined") {
  mapboxgl.workerClass = null;
}

export default function MapUser({ viewState, setViewState, pickup, destination, routeData }) {
  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Marker PICKUP — punct albastru cu puls */}
      {pickup && (
        <Marker longitude={pickup.lng} latitude={pickup.lat} anchor="center">
          <div className="relative flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-xl z-10" />
            <div className="absolute w-10 h-10 rounded-full bg-blue-400 opacity-30 animate-ping" />
          </div>
        </Marker>
      )}

      {/* Marker DESTINATIE — pin negru */}
      {destination && (
        <Marker longitude={destination.lng} latitude={destination.lat} anchor="bottom">
          <div className="flex flex-col items-center">
            <div className="bg-black text-white text-[9px] font-black uppercase px-2 py-1 rounded-xl shadow-xl tracking-widest mb-1">
              DEST
            </div>
            <div className="w-3 h-3 bg-black rounded-full border-2 border-white shadow-lg" />
          </div>
        </Marker>
      )}

      {/* RUTA */}
      {routeData && (
        <>
          {/* Shadow linie */}
          <Source id="rt-shadow" type="geojson" data={{ type: "Feature", geometry: routeData }}>
            <Layer
              id="line-shadow"
              type="line"
              paint={{ "line-color": "#000000", "line-width": 9, "line-opacity": 0.15 }}
              layout={{ "line-cap": "round", "line-join": "round" }}
            />
          </Source>
          {/* Linie principală */}
          <Source id="rt" type="geojson" data={{ type: "Feature", geometry: routeData }}>
            <Layer
              id="line"
              type="line"
              paint={{ "line-color": "#2563eb", "line-width": 5 }}
              layout={{ "line-cap": "round", "line-join": "round" }}
            />
          </Source>
        </>
      )}
    </Map>
  );
}
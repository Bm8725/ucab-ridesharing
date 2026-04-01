"use client";
import Map, { Marker, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

mapboxgl.workerClass = null; // Omoară eroarea "Map not supported"

export default function MapUser({ viewState, setViewState, pickup, destination, routeData }) {
  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      style={{ width: "100%", height: "100%" }}
    >
      {pickup && <Marker longitude={pickup.lng} latitude={pickup.lat} color="#2563eb" />}
      {destination && <Marker longitude={destination.lng} latitude={destination.lat} color="#000" />}
      {routeData && (
        <Source id="rt" type="geojson" data={{ type: 'Feature', geometry: routeData }}>
          <Layer id="line" type="line" paint={{ 'line-color': '#2563eb', 'line-width': 5 }} />
        </Source>
      )}
    </Map>
  );
}

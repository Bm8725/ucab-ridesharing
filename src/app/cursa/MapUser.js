"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const ROUTE_SOURCE = "ucab-route";
const ROUTE_LAYER  = "ucab-route-line";

export default function MapUser({ viewState, setViewState, pickup, destination, routeData }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);
  const pickupMarker = useRef(null);
  const destMarker   = useRef(null);

  // ── Init hartă ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    map.on("move", () => {
      const c = map.getCenter();
      setViewState({
        longitude: c.lng,
        latitude:  c.lat,
        zoom:      map.getZoom(),
      });
    });

    map.on("load", () => {
      // Sursă + layer rută
      map.addSource(ROUTE_SOURCE, {
        type: "geojson",
        data: { type: "Feature", geometry: { type: "LineString", coordinates: [] } },
      });
      map.addLayer({
        id: ROUTE_LAYER,
        type: "line",
        source: ROUTE_SOURCE,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#3b82f6", "line-width": 5, "line-opacity": 0.85 },
      });
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync viewState extern → hartă (ex. când GPS detectează locația) ──────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const c = map.getCenter();
    const same =
      Math.abs(c.lng - viewState.longitude) < 0.0001 &&
      Math.abs(c.lat - viewState.latitude)  < 0.0001;
    if (!same) {
      map.flyTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        speed: 1.4,
      });
    }
  }, [viewState]);

  // ── Marker pickup ────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !pickup) return;

    if (pickupMarker.current) {
      pickupMarker.current.setLngLat([pickup.lng, pickup.lat]);
      return;
    }

    const el = document.createElement("div");
    el.style.cssText = `
      width:18px; height:18px; border-radius:50%;
      background:#3b82f6; border:3px solid #fff;
      box-shadow:0 0 0 3px rgba(59,130,246,0.35);
    `;
    pickupMarker.current = new mapboxgl.Marker({ element: el })
      .setLngLat([pickup.lng, pickup.lat])
      .addTo(map);
  }, [pickup]);

  // ── Marker destinație ────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!destination) {
      destMarker.current?.remove();
      destMarker.current = null;
      return;
    }

    if (destMarker.current) {
      destMarker.current.setLngLat([destination.lng, destination.lat]);
      return;
    }

    const el = document.createElement("div");
    el.style.cssText = `
      width:16px; height:16px; border-radius:50%;
      background:#111; border:3px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
    `;
    destMarker.current = new mapboxgl.Marker({ element: el })
      .setLngLat([destination.lng, destination.lat])
      .addTo(map);
  }, [destination]);

  // ── Rută GeoJSON ─────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const updateRoute = () => {
      const source = map.getSource(ROUTE_SOURCE);
      if (!source) return;

      if (!routeData) {
        source.setData({ type: "Feature", geometry: { type: "LineString", coordinates: [] } });
        return;
      }

      source.setData({ type: "Feature", geometry: routeData });

      // Fit bounds să cuprindă toată ruta
      if (routeData.coordinates?.length > 1) {
        const coords = routeData.coordinates;
        const bounds = coords.reduce(
          (b, c) => b.extend(c),
          new mapboxgl.LngLatBounds(coords[0], coords[0])
        );
        map.fitBounds(bounds, { padding: 80, maxZoom: 15, duration: 900 });
      }
    };

    if (map.isStyleLoaded()) {
      updateRoute();
    } else {
      map.once("load", updateRoute);
    }
  }, [routeData]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
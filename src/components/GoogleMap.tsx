import { useEffect, useRef, useState } from "react";
import logoAsset from "@/assets/tuktuk-logo.png.asset.json";
import type { Auto, Stand } from "@/lib/mock-data";
import { DEFAULT_CENTER } from "@/lib/mock-data";

declare global {
  interface Window {
    google?: any;
    __initTourBuddyMap?: () => void;
    __tourBuddyMapReady?: boolean;
  }
}

let loadPromise: Promise<void> | null = null;

function loadGoogleMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    window.__initTourBuddyMap = () => {
      window.__tourBuddyMapReady = true;
      resolve();
    };
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    if (!key) {
      reject(new Error("Missing Google Maps browser key"));
      return;
    }
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__initTourBuddyMap${channel ? `&channel=${channel}` : ""}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return loadPromise;
}

type Props = {
  autos: Auto[];
  stands: Stand[];
  selectedAutoId: string | null;
  onSelectAuto: (id: string) => void;
  onSelectStand: (stand: Stand, distanceKm: number | null) => void;
  userLocation: { lat: number; lng: number } | null;
};

export function GoogleMapView({
  autos,
  stands,
  selectedAutoId,
  onSelectAuto,
  onSelectStand,
  userLocation,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const autoMarkersRef = useRef<Map<string, any>>(new Map());
  const standMarkersRef = useRef<Map<string, any>>(new Map());
  const userMarkerRef = useRef<any>(null);
  const userAccuracyRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Boot map
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps()
      .then(() => {
        if (cancelled || !ref.current) return;
        const g = window.google;
        const center = userLocation ?? DEFAULT_CENTER;
        mapRef.current = new g.maps.Map(ref.current, {
          center,
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          gestureHandling: "greedy",
          styles: getMapStyle(),
        });
      })
      .catch((e) => setError(e.message));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // User location marker
  useEffect(() => {
    const g = window.google;
    if (!g || !mapRef.current || !userLocation) return;
    if (!userMarkerRef.current) {
      userMarkerRef.current = new g.maps.Marker({
        position: userLocation,
        map: mapRef.current,
        icon: {
          path: g.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#1565C0",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 3,
        },
        title: "You are here",
        zIndex: 999,
      });
      userAccuracyRef.current = new g.maps.Circle({
        map: mapRef.current,
        center: userLocation,
        radius: 80,
        fillColor: "#1565C0",
        fillOpacity: 0.12,
        strokeColor: "#1565C0",
        strokeOpacity: 0.4,
        strokeWeight: 1,
      });
      mapRef.current.panTo(userLocation);
    } else {
      userMarkerRef.current.setPosition(userLocation);
      userAccuracyRef.current?.setCenter(userLocation);
    }
  }, [userLocation]);

  // Auto markers
  useEffect(() => {
    const g = window.google;
    if (!g || !mapRef.current) return;
    autos.forEach((a) => {
      const existing = autoMarkersRef.current.get(a.id);
      const isSel = selectedAutoId === a.id;
      const size = isSel ? 56 : 44;
      const icon = {
        url: logoAsset.url,
        scaledSize: new g.maps.Size(size, size),
        anchor: new g.maps.Point(size / 2, size / 2),
      };
      if (existing) {
        existing.setPosition({ lat: a.lat, lng: a.lng });
        existing.setIcon(icon);
        existing.setZIndex(isSel ? 500 : 100);
      } else {
        const m = new g.maps.Marker({
          position: { lat: a.lat, lng: a.lng },
          map: mapRef.current,
          icon,
          title: a.plate,
          zIndex: isSel ? 500 : 100,
        });
        m.addListener("click", () => onSelectAuto(a.id));
        autoMarkersRef.current.set(a.id, m);
      }
    });
  }, [autos, selectedAutoId, onSelectAuto]);

  // Stand markers
  useEffect(() => {
    const g = window.google;
    if (!g || !mapRef.current) return;
    stands.forEach((s) => {
      if (standMarkersRef.current.has(s.id)) return;
      const m = new g.maps.Marker({
        position: { lat: s.lat, lng: s.lng },
        map: mapRef.current,
        title: s.name,
        label: { text: "P", color: "#fff", fontSize: "11px", fontWeight: "700" },
        icon: {
          path: "M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z",
          fillColor: "#F59E0B",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
          scale: 1.4,
          anchor: new g.maps.Point(12, 32),
          labelOrigin: new g.maps.Point(12, 12),
        },
      });
      m.addListener("click", () => {
        let dist: number | null = null;
        if (userLocation) {
          dist = haversineKm(userLocation, { lat: s.lat, lng: s.lng });
        }
        onSelectStand(s, dist);
      });
      standMarkersRef.current.set(s.id, m);
    });
  }, [stands, userLocation, onSelectStand]);

  if (error) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-muted p-6 text-center text-xs text-muted-foreground">
        Map failed to load: {error}
      </div>
    );
  }

  return <div ref={ref} className="absolute inset-0 h-full w-full" />;
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function getMapStyle() {
  // Lightly desaturated, removes POI clutter so our markers pop
  return [
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  ];
}

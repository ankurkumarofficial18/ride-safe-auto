export type Auto = {
  id: string;
  driverFirst: string;
  plateLast4: string;
  plate: string;
  avatar: string;
  destination: string;
  seatsAvailable: number;
  seatsTotal: number;
  fareLow: number;
  fareHigh: number;
  fare: number;
  etaMin: number;
  rating: number;
  verified: boolean;
  lat: number;
  lng: number;
};

// Patna center as a default fallback for the demo
export const DEFAULT_CENTER = { lat: 25.6127, lng: 85.1376 };

export const mockAutos: Auto[] = [
  { id: "a1", driverFirst: "Ramesh", plateLast4: "4729", plate: "BR 01 AB 4729", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ramesh&backgroundColor=b6e3f4", destination: "Boring Road",   seatsAvailable: 2, seatsTotal: 4, fareLow: 18, fareHigh: 22, fare: 20, etaMin: 3, rating: 4.7, verified: true, lat: 25.6155, lng: 85.1342 },
  { id: "a2", driverFirst: "Suresh", plateLast4: "8812", plate: "BR 01 CD 8812", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Suresh&backgroundColor=ffd5dc", destination: "Patna Junction", seatsAvailable: 1, seatsTotal: 4, fareLow: 25, fareHigh: 30, fare: 28, etaMin: 5, rating: 4.9, verified: true, lat: 25.6110, lng: 85.1418 },
  { id: "a3", driverFirst: "Anil",   plateLast4: "3301", plate: "BR 01 EF 3301", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Anil&backgroundColor=c0aede",   destination: "Kankarbagh",     seatsAvailable: 3, seatsTotal: 4, fareLow: 30, fareHigh: 38, fare: 35, etaMin: 7, rating: 4.5, verified: true, lat: 25.6088, lng: 85.1305 },
  { id: "a4", driverFirst: "Vinod",  plateLast4: "9145", plate: "BR 01 GH 9145", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Vinod&backgroundColor=ffdfbf",  destination: "Gandhi Maidan",  seatsAvailable: 2, seatsTotal: 4, fareLow: 15, fareHigh: 20, fare: 18, etaMin: 2, rating: 4.6, verified: true, lat: 25.6172, lng: 85.1410 },
];

export type Stand = { id: string; name: string; lat: number; lng: number };

export const mockStands: Stand[] = [
  { id: "s1", name: "Dak Bungalow Stand",   lat: 25.6140, lng: 85.1360 },
  { id: "s2", name: "Income Tax Stand",     lat: 25.6115, lng: 85.1385 },
  { id: "s3", name: "Exhibition Stand",     lat: 25.6075, lng: 85.1330 },
  { id: "s4", name: "Gandhi Maidan Stand",  lat: 25.6190, lng: 85.1440 },
  { id: "s5", name: "Patna Jn Stand",       lat: 25.6020, lng: 85.1370 },
];

export type RideHistoryItem = {
  id: string;
  date: string;
  from: string;
  to: string;
  fare: number;
  driver: string;
  status: "completed" | "cancelled";
};

export const mockHistory: RideHistoryItem[] = [
  { id: "r1", date: "Jun 03, 2026 · 6:12 PM", from: "Income Tax",    to: "Boring Road",     fare: 20, driver: "Ramesh", status: "completed" },
  { id: "r2", date: "Jun 01, 2026 · 9:48 AM", from: "Kankarbagh",    to: "Patna Junction",  fare: 28, driver: "Suresh", status: "completed" },
  { id: "r3", date: "May 28, 2026 · 7:30 PM", from: "Gandhi Maidan", to: "Rajendra Nagar",  fare: 35, driver: "Anil",   status: "completed" },
  { id: "r4", date: "May 25, 2026 · 11:02 AM",from: "Boring Road",   to: "AIIMS Patna",     fare: 0,  driver: "Vinod",  status: "cancelled" },
];

export function findAuto(id: string): Auto | undefined {
  return mockAutos.find((a) => a.id === id);
}

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

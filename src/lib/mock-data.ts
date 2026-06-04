export type Auto = {
  id: string;
  driverFirst: string;
  plateLast4: string;
  destination: string;
  seatsAvailable: number;
  seatsTotal: number;
  fareLow: number;
  fareHigh: number;
  etaMin: number;
  rating: number;
  verified: boolean;
};

export const mockAutos: Auto[] = [
  { id: "a1", driverFirst: "Ramesh", plateLast4: "4729", destination: "Boring Road", seatsAvailable: 2, seatsTotal: 4, fareLow: 18, fareHigh: 22, etaMin: 3, rating: 4.7, verified: true },
  { id: "a2", driverFirst: "Suresh", plateLast4: "8812", destination: "Patna Junction", seatsAvailable: 1, seatsTotal: 4, fareLow: 25, fareHigh: 30, etaMin: 5, rating: 4.9, verified: true },
  { id: "a3", driverFirst: "Anil", plateLast4: "3301", destination: "Kankarbagh", seatsAvailable: 3, seatsTotal: 4, fareLow: 30, fareHigh: 38, etaMin: 7, rating: 4.5, verified: true },
  { id: "a4", driverFirst: "Vinod", plateLast4: "9145", destination: "Gandhi Maidan", seatsAvailable: 2, seatsTotal: 4, fareLow: 15, fareHigh: 20, etaMin: 2, rating: 4.6, verified: true },
];

export const mockStands = [
  { id: "s1", name: "Dak Bungalow Stand", x: 35, y: 40 },
  { id: "s2", name: "Income Tax Stand", x: 65, y: 55 },
  { id: "s3", name: "Exhibition Stand", x: 25, y: 70 },
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
  { id: "r1", date: "Jun 03, 2026 · 6:12 PM", from: "Income Tax", to: "Boring Road", fare: 20, driver: "Ramesh", status: "completed" },
  { id: "r2", date: "Jun 01, 2026 · 9:48 AM", from: "Kankarbagh", to: "Patna Junction", fare: 28, driver: "Suresh", status: "completed" },
  { id: "r3", date: "May 28, 2026 · 7:30 PM", from: "Gandhi Maidan", to: "Rajendra Nagar", fare: 35, driver: "Anil", status: "completed" },
  { id: "r4", date: "May 25, 2026 · 11:02 AM", from: "Boring Road", to: "AIIMS Patna", fare: 0, driver: "Vinod", status: "cancelled" },
];

export function findAuto(id: string): Auto | undefined {
  return mockAutos.find((a) => a.id === id);
}
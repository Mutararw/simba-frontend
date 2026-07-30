import type { Branch } from "./types";

export const BRANCHES: Branch[] = [
  { id: "remera", name: "Simba Remera", area: "Remera/Kisimenti", rating: 4.6, reviews: 312, hours: "07:00 – 22:00" },
  { id: "kimironko", name: "Simba Kimironko", area: "Kimironko", rating: 4.5, reviews: 280, hours: "07:00 – 22:00" },
  { id: "kacyiru", name: "Simba Kacyiru", area: "Kacyiru", rating: 4.7, reviews: 411, hours: "07:00 – 22:00" },
  { id: "nyamirambo", name: "Simba Nyamirambo", area: "Nyamirambo", rating: 4.4, reviews: 198, hours: "07:00 – 22:00" },
  { id: "gikondo", name: "Simba Gikondo", area: "Gikondo", rating: 4.5, reviews: 224, hours: "07:00 – 22:00" },
  { id: "kanombe", name: "Simba Kanombe", area: "Kanombe", rating: 4.3, reviews: 156, hours: "07:00 – 22:00" },
  { id: "kinyinya", name: "Simba Kinyinya", area: "Kinyinya", rating: 4.4, reviews: 142, hours: "07:00 – 22:00" },
  { id: "kibagabaga", name: "Simba Kibagabaga", area: "Kibagabaga", rating: 4.6, reviews: 267, hours: "07:00 – 22:00" },
  { id: "nyanza", name: "Simba Nyanza", area: "Nyanza", rating: 4.2, reviews: 98, hours: "07:00 – 22:00" },
  { id: "kicukiro", name: "Simba Kicukiro", area: "Kicukiro", rating: 4.3, reviews: 175, hours: "07:00 – 22:00" },
  { id: "kisimenti", name: "Simba Kisimenti", area: "Kisimenti", rating: 4.8, reviews: 520, hours: "24 Hours" },
  { id: "sonatube", name: "Simba Sonatube", area: "Sonatube", rating: 4.4, reviews: 190, hours: "07:00 – 22:00" },
  { id: "rebero", name: "Simba Rebero", area: "Rebero", rating: 4.3, reviews: 135, hours: "07:00 – 22:00" },
  { id: "gahanga", name: "Simba Gahanga", area: "Gahanga", rating: 4.1, reviews: 88, hours: "07:00 – 22:00" },
  { id: "utc", name: "Simba UTC", area: "City Centre", rating: 4.6, reviews: 340, hours: "07:00 – 22:00" },
  { id: "kigali-heights", name: "Simba Kigali Heights", area: "Kigali Heights", rating: 4.7, reviews: 295, hours: "07:00 – 22:00" },
  { id: "gishushu", name: "Simba Gishushu", area: "Gishushu", rating: 4.5, reviews: 230, hours: "07:00 – 22:00" },
  { id: "gacuriro", name: "Simba Center Gacuriro", area: "Gacuriro", rating: 4.4, reviews: 165, hours: "07:00 – 22:00" },
  { id: "centenary", name: "Simba Centenary", area: "Centenary House", rating: 4.5, reviews: 210, hours: "07:00 – 22:00" },
];

export const BRANCH_COORDS: Record<string, { lat: number; lng: number }> = {
  remera: { lat: -1.9555, lng: 30.1149 },
  kimironko: { lat: -1.9367, lng: 30.1264 },
  kacyiru: { lat: -1.9392, lng: 30.0768 },
  nyamirambo: { lat: -1.9833, lng: 30.0456 },
  gikondo: { lat: -1.9722, lng: 30.0786 },
  kanombe: { lat: -1.9688, lng: 30.1342 },
  kinyinya: { lat: -1.9167, lng: 30.0911 },
  kibagabaga: { lat: -1.9317, lng: 30.1065 },
  nyanza: { lat: -1.9868, lng: 30.0903 },
  kicukiro: { lat: -1.9906, lng: 30.1034 },
  kisimenti: { lat: -1.9555, lng: 30.1149 },
  sonatube: { lat: -1.9612, lng: 30.1005 },
  rebero: { lat: -1.9707, lng: 30.1088 },
  gahanga: { lat: -2.0028, lng: 30.1110 },
  utc: { lat: -1.9486, lng: 30.0581 },
  "kigali-heights": { lat: -1.9475, lng: 30.0893 },
  gishushu: { lat: -1.9534, lng: 30.0657 },
  gacuriro: { lat: -1.9357, lng: 30.1120 },
  centenary: { lat: -1.9428, lng: 30.0594 },
};

export const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const getNearbyBranches = (referenceBranchId: string, candidateBranchIds: string[]) => {
  const referenceCoords = BRANCH_COORDS[referenceBranchId];
  const candidates = BRANCHES.filter((branch) => candidateBranchIds.includes(branch.id));

  if (!referenceCoords) {
    return candidates;
  }

  return [...candidates].sort((a, b) => {
    const aCoords = BRANCH_COORDS[a.id];
    const bCoords = BRANCH_COORDS[b.id];

    if (!aCoords || !bCoords) {
      return a.name.localeCompare(b.name);
    }

    return (
      getDistanceKm(referenceCoords.lat, referenceCoords.lng, aCoords.lat, aCoords.lng) -
      getDistanceKm(referenceCoords.lat, referenceCoords.lng, bCoords.lat, bCoords.lng)
    );
  });
};

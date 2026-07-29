import type { Branch } from "./types";

export const BRANCHES: Branch[] = [
  { id: "remera", name: "Remera Branch", area: "Remera", rating: 4.6, reviews: 312, hours: "07:00 – 22:00" },
  { id: "kimironko", name: "Kimironko Branch", area: "Kimironko", rating: 4.5, reviews: 280, hours: "07:00 – 22:00" },
  { id: "kacyiru", name: "Kacyiru Branch", area: "Kacyiru", rating: 4.7, reviews: 411, hours: "07:00 – 22:00" },
  { id: "nyamirambo", name: "Nyamirambo Branch", area: "Nyamirambo", rating: 4.4, reviews: 198, hours: "07:00 – 22:00" },
  { id: "gikondo", name: "Gikondo Branch", area: "Gikondo", rating: 4.5, reviews: 224, hours: "07:00 – 22:00" },
  { id: "kanombe", name: "Kanombe Branch", area: "Kanombe", rating: 4.3, reviews: 156, hours: "07:00 – 22:00" },
  { id: "kinyinya", name: "Kinyinya Branch", area: "Kinyinya", rating: 4.4, reviews: 142, hours: "07:00 – 22:00" },
  { id: "kibagabaga", name: "Kibagabaga Branch", area: "Kibagabaga", rating: 4.6, reviews: 267, hours: "07:00 – 22:00" },
  { id: "nyanza", name: "Nyanza Branch", area: "Nyanza", rating: 4.2, reviews: 98, hours: "07:00 – 22:00" },
];

export const BRANCH_COORDS: Record<string, { lat: number; lng: number }> = {
  remera: { lat: -1.9585, lng: 30.1116 },
  kimironko: { lat: -1.9367, lng: 30.1264 },
  kacyiru: { lat: -1.9392, lng: 30.0768 },
  nyamirambo: { lat: -1.9833, lng: 30.0456 },
  gikondo: { lat: -1.9722, lng: 30.0786 },
  kanombe: { lat: -1.9688, lng: 30.1342 },
  kinyinya: { lat: -1.9167, lng: 30.0911 },
  kibagabaga: { lat: -1.9317, lng: 30.1065 },
  nyanza: { lat: -1.9868, lng: 30.0903 },
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

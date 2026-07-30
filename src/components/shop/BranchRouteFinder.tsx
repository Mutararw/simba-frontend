import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, ShoppingBag, Truck, Crosshair, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrder } from "@/store/order";
import { BRANCHES, BRANCH_COORDS, getDistanceKm } from "@/lib/branches";

export function BranchRouteFinder() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setDraft = useOrder((s) => s.setDraft);

  const [startLocation, setStartLocation] = useState("");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [nearestBranchId, setNearestBranchId] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showActionPopup, setShowActionPopup] = useState(false);

  // Auto-find nearest branch when coords are set
  useEffect(() => {
    if (userCoords) {
      let minDistance = Infinity;
      let nearestId = "";
      for (const [id, coords] of Object.entries(BRANCH_COORDS)) {
        const dist = getDistanceKm(userCoords.lat, userCoords.lng, coords.lat, coords.lng);
        if (dist < minDistance) {
          minDistance = dist;
          nearestId = id;
        }
      }
      setNearestBranchId(nearestId);
      if (!selectedBranchId) {
        setSelectedBranchId(nearestId);
      }
    }
  }, [userCoords, selectedBranchId]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStartLocation(`${pos.coords.latitude},${pos.coords.longitude}`);
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        setIsLocating(false);
        alert("Failed to get your location. Please type it manually.");
      }
    );
  };

  const handleShowRoute = () => {
    if (!startLocation || !selectedBranchId) return;
    setShowMap(true);
    // Show action popup 3 seconds after map loads
    setTimeout(() => {
      setShowActionPopup(true);
    }, 3000);
  };

  const handlePickUp = () => {
    setDraft({ branchId: selectedBranchId });
    navigate("/branches?next=checkout");
  };

  const handleShopInStore = () => {
    setShowActionPopup(false);
    navigate("/browse");
  };

  const selectedBranch = BRANCHES.find((b) => b.id === selectedBranchId);

  return (
    <section className="container py-8 relative">
      <div className="premium-card overflow-hidden rounded-3xl border border-border bg-card shadow-lg relative z-10">
        <div className="grid md:grid-cols-[1fr_1.5fr]">
          
          {/* Controls Panel */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Map className="h-6 w-6 text-primary" />
              {t("route.title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("route.subtitle")}
            </p>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("route.startLabel")}
                </label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="E.g. Kigali Heights" 
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    className="flex-1 rounded-xl"
                  />
                  <Button 
                    variant="outline" 
                    className="rounded-xl px-3 border-primary/20 hover:bg-primary/10"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                  >
                    <Crosshair className={`h-5 w-5 text-primary ${isLocating ? "animate-spin" : ""}`} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("route.destLabel")}
                </label>
                <select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>{t("route.selectBranch")}</option>
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} {nearestBranchId === b.id ? `(${t("route.nearest")})` : ""}
                    </option>
                  ))}
                </select>
                {nearestBranchId && nearestBranchId === selectedBranchId && (
                  <p className="text-xs text-primary font-medium mt-1">✓ {t("route.recommended")}</p>
                )}
              </div>

              <Button 
                onClick={handleShowRoute}
                className="w-full rounded-xl py-6 font-bold text-base mt-2"
                disabled={!startLocation || !selectedBranchId}
              >
                <Navigation className="mr-2 h-5 w-5" />
                {t("route.cta")}
              </Button>
            </div>
          </div>

          {/* Map Panel */}
          <div className="relative min-h-[300px] bg-muted/30 border-t md:border-t-0 md:border-l border-border flex items-center justify-center">
            <iframe
              title="Google Maps Location"
              width="100%"
              height="100%"
              frameBorder="0"
              className="absolute inset-0 h-full w-full object-cover"
              src={
                showMap && startLocation && selectedBranch
                  ? `https://maps.google.com/maps?saddr=${encodeURIComponent(startLocation)}&daddr=Simba+Supermarket+${encodeURIComponent(selectedBranch.area)}+Kigali&t=&z=13&ie=UTF8&iwloc=&output=embed`
                  : selectedBranch
                  ? `https://maps.google.com/maps?q=Simba+Supermarket+${encodeURIComponent(selectedBranch.area)}+Kigali&t=&z=14&ie=UTF8&iwloc=&output=embed`
                  : `https://maps.google.com/maps?q=Kigali&t=&z=12&ie=UTF8&iwloc=&output=embed`
              }
              allowFullScreen
            />
          </div>
        </div>
      </div>

      {/* Post-Route Action Popup */}
      <AnimatePresence>
        {showActionPopup && selectedBranch && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-primary/20"
          >
            <h3 className="font-display text-xl font-bold text-center mb-2">{t("route.popupTitle")}</h3>
            <p className="text-muted-foreground text-center text-sm mb-6">
              {t("route.popupText", { name: selectedBranch.name })}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleShopInStore}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
              >
                <div className="h-12 w-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="font-bold">{t("route.shopInStore")}</div>
                  <div className="text-xs text-muted-foreground">{t("route.shopInStoreSub")}</div>
                </div>
              </button>

              <button 
                onClick={handlePickUp}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-primary/20 bg-primary/5 hover:border-primary hover:bg-primary/10 transition-all group"
              >
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Truck className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-primary">{t("route.placePickup")}</div>
                  <div className="text-xs text-primary/80">{t("route.placePickupSub")}</div>
                </div>
              </button>
            </div>
            
            <button 
              onClick={() => setShowActionPopup(false)}
              className="mt-6 w-full text-center text-xs font-semibold text-muted-foreground hover:text-foreground underline"
            >
              {t("route.close")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

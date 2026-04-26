import { useEffect, useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/store/order";
import { useTranslation } from "react-i18next";

export function OrderCountdown() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lastOrder = useOrder((s) => s.lastOrder);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!lastOrder || !lastOrder.pickupTime) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      // Parse "HH:mm"
      const [hours, minutes] = lastOrder.pickupTime.split(":").map(Number);
      const targetTime = new Date();
      targetTime.setHours(hours, minutes, 0, 0);

      const diffMs = targetTime.getTime() - now.getTime();

      if (diffMs <= 0) {
        setIsReady(true);
        setTimeLeft("00m 00s");
        clearInterval(interval);
      } else {
        setIsReady(false);
        const diffMins = Math.floor(diffMs / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);
        setTimeLeft(`${String(diffMins).padStart(2, '0')}m ${String(diffSecs).padStart(2, '0')}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastOrder]);

  if (!lastOrder) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="hidden sm:flex gap-1.5 font-bold text-white bg-green-600 hover:bg-green-700 rounded-full px-4 shadow-sm" 
        onClick={() => navigate("/orders")}
      >
        <Clock className="h-4 w-4" /> Track Order
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => navigate("/orders")}
      className={`hidden sm:flex items-center gap-2 border-white/20 shadow-sm transition-all rounded-full px-4 py-4 ${
        isReady ? "bg-green-500 text-white hover:bg-green-600 border-none" : "bg-green-600 text-white hover:bg-green-700 border-none"
      }`}
    >
      <Clock className={`h-4 w-4 ${!isReady && timeLeft ? "animate-pulse" : ""}`} />
      <div className="flex flex-col items-start text-left">
        <span className="text-[10px] leading-none font-bold uppercase opacity-90">
          {isReady ? "Ready Now" : "Time Left"}
        </span>
        <span className="text-sm leading-none font-mono font-bold tracking-tight">
          {timeLeft || "--m --s"}
        </span>
      </div>
    </Button>
  );
}

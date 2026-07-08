import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, Smartphone, CreditCard, Banknote, MapPin, Truck, AlertTriangle, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/store/cart";
import { useOrder } from "@/store/order";
import { BRANCHES, getNearbyBranches } from "@/lib/branches";
import { formatRWF } from "@/lib/products";
import { ApiError, api } from "@/lib/api";
import { toast } from "sonner";

const DEPOSIT = 500;
const MIN_ORDER = 2500;

const DISTRICTS = [
  { id: "gasabo", name: "Gasabo" },
  { id: "kicukiro", name: "Kicukiro" },
  { id: "nyarugenge", name: "Nyarugenge" },
];

const ZONES: Record<string, { name: string; fee: number }[]> = {
  gasabo: [
    { name: "Remera", fee: 1500 },
    { name: "Kacyiru", fee: 1500 },
    { name: "Kimironko", fee: 1500 },
    { name: "Nyarutarama", fee: 2000 },
    { name: "Gisozi", fee: 1500 },
  ],
  kicukiro: [
    { name: "Kicukiro Center", fee: 1200 },
    { name: "Kanombe", fee: 1800 },
    { name: "Niboye", fee: 1200 },
    { name: "Gahanga", fee: 2000 },
  ],
  nyarugenge: [
    { name: "Kiyovu", fee: 1000 },
    { name: "Nyamirambo", fee: 1500 },
    { name: "Muhima", fee: 1000 },
    { name: "Kimisagara", fee: 1500 },
  ],
};

const TIME_SLOTS = [
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM",
];

// Rwandan phone regex: +250 followed by 78, 79, 72, or 73 and 7 more digits
const RW_PHONE_REGEX = /^\+250(78|79|72|73)\d{7}$/;

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.items.reduce((n, i) => n + i.qty * i.product.price, 0));
  const clear = useCart((s) => s.clear);
  const draft = useOrder((s) => s.pendingDraft);
  const setDraft = useOrder((s) => s.setDraft);
  const setLastOrder = useOrder((s) => s.setLastOrder);
  
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>(draft.orderType || 'pickup');
  const [phone, setPhone] = useState("+250");
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [paying, setPaying] = useState(false);
  const [address, setAddress] = useState(draft.address || "");
  const [district, setDistrict] = useState(draft.district || "");
  const [zone, setZone] = useState(draft.zone || "");
  const [deliverySlot, setDeliverySlot] = useState(draft.deliverySlot || "");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const branch = BRANCHES.find((b) => b.id === draft.branchId);

  const belowMinimum = subtotal < MIN_ORDER;

  const deliveryFee = useMemo(() => {
    if (orderType === 'pickup') return 0;
    if (!district || !zone) return 0;
    return ZONES[district]?.find(z => z.name === zone)?.fee || 0;
  }, [orderType, district, zone]);

  const totalToPay = subtotal + deliveryFee;

  const validatePhone = (value: string) => {
    if (!value || value === "+250") {
      setPhoneError("Phone number is required");
      return false;
    }
    if (!RW_PHONE_REGEX.test(value)) {
      setPhoneError("Enter a valid Rwandan number: +250 7X XXX XXXX (prefixes: 78, 79, 72, 73)");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhone(val);
    if (phoneError) {
      validatePhone(val);
    }
  };

  if (orderType === 'pickup' && (!branch || !draft.pickupTime) && items.length > 0) {
    // We allow proceeding but with a warning or redirect
  }

  async function pay() {
    // Validate phone for momo
    if (paymentMethod === "momo" && !validatePhone(phone)) {
      toast.error("Please enter a valid Rwandan phone number.");
      return;
    }

    // Validate minimum
    if (belowMinimum) {
      toast.error(`Minimum order is ${formatRWF(MIN_ORDER)}.`);
      return;
    }

    setPaying(true);

    // Build final address with landmarks
    const finalAddress = deliveryNotes
      ? `${address} | Landmark: ${deliveryNotes}`
      : address;

    const payload = {
      items: items.map((i) => ({
        productId: i.product.id,
        quantity: i.qty,
      })),
      orderType,
      branchId: orderType === 'pickup' ? branch?.id : undefined,
      pickupTime: orderType === 'pickup' ? draft.pickupTime : undefined,
      phone,
      paymentMethod,
      address: orderType === 'delivery' ? finalAddress : undefined,
      district: orderType === 'delivery' ? district : undefined,
      zone: orderType === 'delivery' ? zone : undefined,
      deliveryFee,
      deliverySlot: orderType === 'delivery' ? deliverySlot : undefined,
    };

    try {
      const { data: serverOrder } = await api.post("/api/orders", payload);

      setLastOrder({
        id: serverOrder.id.toString(),
        branchId: branch?.id,
        branchName: branch?.name,
        pickupTime: draft.pickupTime,
        address: finalAddress,
        district,
        zone,
        deliverySlot,
        deliveryFee,
        items,
        total: subtotal,
        deposit: DEPOSIT,
        status: "Placed",
        createdAt: new Date().toISOString(),
        paymentMethod,
      });

      clear();
      toast.success("Order placed successfully.");
      navigate("/confirmation");
    } catch (err) {
      console.error("Payment failed", err);
      const msg = err instanceof ApiError ? err.message : (err instanceof Error ? err.message : "Failed to place order.");
      toast.error(msg);
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="container grid gap-8 py-8 md:grid-cols-[1fr_360px]">
      <div>
        <h1 className="font-display text-3xl font-bold">{t("checkout.title")}</h1>

        {/* Minimum Order Warning */}
        {belowMinimum && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Minimum order is {formatRWF(MIN_ORDER)}
              </p>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/70 mt-0.5">
                Your cart total is {formatRWF(subtotal)}. Add {formatRWF(MIN_ORDER - subtotal)} more to proceed.
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex gap-4 p-1 bg-secondary rounded-xl w-fit">
          <Button 
            variant={orderType === 'pickup' ? 'default' : 'ghost'} 
            onClick={() => setOrderType('pickup')}
            className="rounded-lg px-6"
          >
            <MapPin className="mr-2 h-4 w-4" /> {t("checkout.pickup", { defaultValue: "Pickup" })}
          </Button>
          <Button 
            variant={orderType === 'delivery' ? 'default' : 'ghost'} 
            onClick={() => setOrderType('delivery')}
            className="rounded-lg px-6"
          >
            <Truck className="mr-2 h-4 w-4" /> {t("checkout.delivery", { defaultValue: "Delivery" })}
          </Button>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          {orderType === 'pickup' ? (
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <Label className="text-base font-bold">{t("checkout.pickupInfo", { defaultValue: "Pickup Information" })}</Label>
                <Button variant="link" size="sm" onClick={() => navigate("/branches?next=checkout")}>
                  {t("checkout.changeBranch", { defaultValue: "Change Branch" })}
                </Button>
              </div>
              {branch ? (
                <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                  <div className="font-bold">{branch.name}</div>
                  <div className="text-sm text-muted-foreground">{branch.location}</div>
                  <div className="mt-2 text-sm font-semibold text-primary">
                    {t("checkout.at")} {draft.pickupTime}
                  </div>
                </div>
              ) : (
                <Button className="w-full" variant="outline" onClick={() => navigate("/branches?next=checkout")}>
                  {t("checkout.chooseBranch")}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4 mb-6 animate-in fade-in slide-in-from-top-4">
              <Label className="text-base font-bold">{t("checkout.deliveryInfo", { defaultValue: "Delivery Information" })}</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("checkout.district", { defaultValue: "District" })}</Label>
                  <Select value={district} onValueChange={(v) => { setDistrict(v); setZone(""); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTRICTS.map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t("checkout.zone", { defaultValue: "Zone" })}</Label>
                  <Select value={zone} onValueChange={setZone} disabled={!district}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {district && ZONES[district]?.map(z => (
                        <SelectItem key={z.name} value={z.name}>{z.name} ({formatRWF(z.fee)})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("checkout.address", { defaultValue: "Specific Address / Apartment / House No" })}</Label>
                <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. KG 123 St, House 45" />
              </div>

              {/* Delivery Instructions & Landmarks */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-primary" />
                  Delivery Instructions & Landmarks
                </Label>
                <Textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder='e.g. "Opposite Gisozi Sector Office", "Near the pharmacy", "Blue gate on left"'
                  className="resize-none rounded-xl"
                  rows={2}
                />
                <p className="text-[11px] text-muted-foreground">Helps our riders find you faster in Kigali's neighborhoods.</p>
              </div>

              <div className="space-y-2">
                <Label>{t("checkout.timeSlot", { defaultValue: "Preferred Delivery Time Slot" })}</Label>
                <Select value={deliverySlot} onValueChange={setDeliverySlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Time Slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(slot => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Phone Number Input (always visible) */}
          <div className="mb-4 space-y-2 border-t border-border pt-6">
            <Label htmlFor="phone" className="text-base font-bold flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" />
              {t("checkout.phone")}
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={() => validatePhone(phone)}
              placeholder="+250 78X XXX XXX"
              className={phoneError ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {phoneError && (
              <p className="text-xs text-destructive font-medium animate-in fade-in">{phoneError}</p>
            )}
            <p className="text-[11px] text-muted-foreground">Rwandan format: +250 followed by 78, 79, 72, or 73</p>
          </div>

          {/* Payment Method */}
          <div className="mb-4 space-y-3 border-t border-border pt-6">
            <Label className="text-base font-bold">{t("checkout.paymentMethod")}</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("momo")}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${paymentMethod === "momo" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"}`}
              >
                <Smartphone className="h-5 w-5" /> {t("checkout.momo")}
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${paymentMethod === "card" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"}`}
              >
                <CreditCard className="h-5 w-5" /> {t("checkout.card")}
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${paymentMethod === "cod" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent"}`}
              >
                <Banknote className="h-5 w-5" /> Cash on Delivery
              </button>
            </div>
          </div>

          {/* Payment method-specific notes */}
          {paymentMethod === "momo" && (
            <div className="animate-in fade-in zoom-in-95">
              <p className="text-sm text-muted-foreground">{t("checkout.momoNote")}</p>
            </div>
          )}

          {paymentMethod === "cod" && (
            <div className="animate-in fade-in zoom-in-95 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4">
              <p className="text-sm font-semibold text-green-800 dark:text-green-300">Cash on Delivery / Pay on Collection</p>
              <p className="text-xs text-green-700/80 dark:text-green-400/70 mt-1">
                Pay the full amount in cash when your order is delivered to your doorstep or when you collect it at the branch. No advance payment is needed.
              </p>
            </div>
          )}

          <Button
            size="lg"
            className="mt-6 w-full rounded-full shadow-md"
            onClick={pay}
            disabled={
              paying ||
              belowMinimum ||
              (paymentMethod === "momo" && !RW_PHONE_REGEX.test(phone)) ||
              (orderType === 'delivery' && (!district || !zone || !address || !deliverySlot))
            }
          >
            {paying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("checkout.paying")}
              </>
            ) : belowMinimum ? (
              `Minimum order: ${formatRWF(MIN_ORDER)}`
            ) : paymentMethod === "cod" ? (
              `Place Order — ${formatRWF(orderType === 'delivery' ? totalToPay : subtotal)}`
            ) : (
              t("checkout.pay", { amount: formatRWF(orderType === 'delivery' ? totalToPay : DEPOSIT) })
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">{t("checkout.mockNote")}</p>
        </div>
      </div>
      <aside className="h-fit rounded-2xl border border-border bg-card p-5 sticky top-24">
        <h2 className="mb-3 font-display text-lg font-bold">{t("checkout.summary")}</h2>
        
        <ul className="max-h-64 space-y-2 overflow-y-auto text-sm border-b border-border pb-4 mb-4">
          {items.map((i) => (
            <li key={i.product.id} className="flex justify-between gap-2">
              <span className="line-clamp-1">
                {i.qty}x {i.product.name}
              </span>
              <span className="shrink-0 font-semibold">{formatRWF(i.product.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("cart.subtotal")}</span>
            <span>{formatRWF(subtotal)}</span>
          </div>
          {orderType === 'delivery' && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("checkout.deliveryFee", { defaultValue: "Delivery Fee" })}</span>
              <span>{formatRWF(deliveryFee)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-border mt-2">
            <span>{t("cart.total", { defaultValue: "Total" })}</span>
            <span className="text-primary">{formatRWF(orderType === 'delivery' ? totalToPay : subtotal)}</span>
          </div>
          {orderType === 'pickup' && paymentMethod !== "cod" && (
             <div className="flex justify-between text-xs font-semibold text-primary bg-primary/5 p-2 rounded-lg mt-2">
              <span>{t("cart.deposit")}</span>
              <span>{formatRWF(DEPOSIT)}</span>
            </div>
          )}
          {paymentMethod === "cod" && (
            <div className="flex justify-between text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-2 rounded-lg mt-2">
              <span>Pay on {orderType === 'delivery' ? 'delivery' : 'collection'}</span>
              <span>{formatRWF(orderType === 'delivery' ? totalToPay : subtotal)}</span>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

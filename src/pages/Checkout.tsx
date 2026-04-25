import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, Smartphone, CreditCard, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/store/cart";
import { useOrder } from "@/store/order";
import { BRANCHES } from "@/lib/branches";
import { formatRWF } from "@/lib/products";
import { api } from "@/lib/api";
import { toast } from "sonner";

const DEPOSIT = 500;

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.items.reduce((n, i) => n + i.qty * i.product.price, 0));
  const clear = useCart((s) => s.clear);
  const draft = useOrder((s) => s.pendingDraft);
  const setLastOrder = useOrder((s) => s.setLastOrder);
  const branch = BRANCHES.find((b) => b.id === draft.branchId);

  const [phone, setPhone] = useState("078");
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [paying, setPaying] = useState(false);

  if (!branch || !draft.pickupTime || items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Please select branch and pick-up time first.</p>
        <Button className="mt-4" onClick={() => navigate("/branches?next=checkout")}>Choose branch</Button>
      </div>
    );
  }

  async function pay() {
    setPaying(true);
    try {
      // Prepare payload for backend
      const payload = {
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.qty,
        })),
        branchId: branch?.id,
        pickupTime: draft.pickupTime,
        phone,
        paymentMethod,
      };

      const { data: serverOrder } = await api.post("/api/orders", payload);

      const order = {
        id: serverOrder.id.toString(),
        branchId: branch!.id,
        branchName: branch!.name,
        pickupTime: draft.pickupTime!,
        items,
        total: subtotal,
        deposit: DEPOSIT,
        createdAt: new Date().toISOString(),
      };
      
      setLastOrder(order);
      clear();
      toast.success("Order placed successfully!");
      navigate("/confirmation");
    } catch (err) {
      console.error("Payment failed", err);
      toast.error(err instanceof Error ? err.message : "Failed to place order. Are you signed in?");
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="container grid gap-8 py-8 md:grid-cols-[1fr_360px]">
      <div>
        <h1 className="font-display text-3xl font-bold">{t("checkout.title")}</h1>
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 space-y-3">
            <Label className="text-base">Select Payment Method</Label>
            <div className="grid grid-cols-3 gap-3">
              <button 
                type="button"
                onClick={() => setPaymentMethod("momo")}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${paymentMethod === 'momo' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}
              >
                <Smartphone className="h-5 w-5" /> MoMo
              </button>
              <button 
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}
              >
                <CreditCard className="h-5 w-5" /> Card
              </button>
              <button 
                type="button"
                onClick={() => setPaymentMethod("cash")}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${paymentMethod === 'cash' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}
              >
                <Banknote className="h-5 w-5" /> Cash
              </button>
            </div>
          </div>

          {paymentMethod === "momo" && (
            <>
              <div className="flex items-center gap-2 font-display text-lg font-bold mt-6 pt-4 border-t border-border">
                <Smartphone className="h-5 w-5 text-primary" />{t("checkout.momoTitle")}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t("checkout.momoNote")}</p>
              <div className="mt-4 space-y-2">
                <Label htmlFor="phone">{t("checkout.phone")}</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0788 123 456" />
              </div>
            </>
          )}

          {paymentMethod === "card" && (
            <>
              <div className="flex items-center gap-2 font-display text-lg font-bold mt-6 pt-4 border-t border-border">
                <CreditCard className="h-5 w-5 text-primary" /> Pay with Card
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Enter your card details to process the deposit.</p>
              <div className="mt-4 space-y-2">
                <Label htmlFor="card">Card Number</Label>
                <Input id="card" placeholder="0000 0000 0000 0000" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
            </>
          )}

          {paymentMethod === "cash" && (
            <>
              <div className="flex items-center gap-2 font-display text-lg font-bold mt-6 pt-4 border-t border-border">
                <Banknote className="h-5 w-5 text-primary" /> Pay on Pickup
              </div>
              <p className="mt-2 text-sm text-muted-foreground">You will pay the full amount when you pick up your order at the branch.</p>
            </>
          )}

          <Button 
            size="lg" 
            className="mt-6 w-full rounded-full shadow-md" 
            onClick={pay} 
            disabled={paying || (paymentMethod === "momo" && phone.length < 9)}
          >
            {paying ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("checkout.paying")}</>
            ) : paymentMethod === "cash" ? (
              "Confirm Order"
            ) : (
              t("checkout.pay", { amount: formatRWF(DEPOSIT) })
            )}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">{t("checkout.mockNote")}</p>
        </div>
      </div>
      <aside className="h-fit rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-3 font-display text-lg font-bold">{t("checkout.summary")}</h2>
        <div className="space-y-1 text-sm">
          <div className="text-muted-foreground">Pick-up at</div>
          <div className="font-semibold">{branch.name}</div>
          <div className="text-muted-foreground">at {draft.pickupTime}</div>
        </div>
        <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto text-sm">
          {items.map((i) => (
            <li key={i.product.id} className="flex justify-between gap-2">
              <span className="line-clamp-1">{i.qty}× {i.product.name}</span>
              <span className="shrink-0 font-semibold">{formatRWF(i.product.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">{t("cart.subtotal")}</span><span>{formatRWF(subtotal)}</span></div>
          <div className="flex justify-between font-semibold text-primary"><span>{t("cart.deposit")}</span><span>{formatRWF(DEPOSIT)}</span></div>
        </div>
      </aside>
    </div>
  );
}
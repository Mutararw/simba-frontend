import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/store/cart";
import { useOrder } from "@/store/order";
import { BRANCHES } from "@/lib/branches";
import { formatRWF } from "@/lib/products";

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
    await new Promise((r) => setTimeout(r, 1400));
    const order = {
      id: "SMB-" + Math.floor(1000 + Math.random() * 9000),
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
    setPaying(false);
    navigate("/confirmation");
  }

  return (
    <div className="container grid gap-8 py-8 md:grid-cols-[1fr_360px]">
      <div>
        <h1 className="font-display text-3xl font-bold">{t("checkout.title")}</h1>
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 font-display text-lg font-bold"><Smartphone className="h-5 w-5 text-primary" />{t("checkout.momoTitle")}</div>
          <p className="mt-2 text-sm text-muted-foreground">{t("checkout.momoNote")}</p>
          <div className="mt-4 space-y-2">
            <Label htmlFor="phone">{t("checkout.phone")}</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0788 123 456" />
          </div>
          <Button size="lg" className="mt-5 w-full rounded-full" onClick={pay} disabled={paying || phone.length < 9}>
            {paying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("checkout.paying")}</> : t("checkout.pay", { amount: formatRWF(DEPOSIT) })}
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
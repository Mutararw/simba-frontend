import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Minus, Plus, ShoppingBag, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { formatRWF, PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { useMemo } from "react";
import { useDynamicTranslation } from "@/hooks/use-dynamic-translation";

const DEPOSIT = 500;

export default function Cart() {
  const { t } = useTranslation();
  const { translateProduct } = useDynamicTranslation();
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.items.reduce((n, i) => n + i.qty * i.product.price, 0));

  const upsellProducts = useMemo(() => {
    if (items.length === 0) return [];
    const categoriesInCart = new Set(items.map(i => i.product.category));
    const itemIdsInCart = new Set(items.map(i => i.product.id));
    
    return PRODUCTS
      .filter(p => categoriesInCart.has(p.category) && !itemIdsInCart.has(p.id))
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary"><ShoppingBag className="h-8 w-8 text-muted-foreground" /></div>
        <h1 className="font-display text-2xl font-bold">{t("cart.empty")}</h1>
        <Button asChild><Link to="/browse">{t("cart.emptyCta")}</Link></Button>
      </div>
    );
  }

  return (
    <div className="container grid gap-8 py-8 md:grid-cols-[1fr_360px]">
      <div>
        <h1 className="mb-4 font-display text-3xl font-bold">{t("cart.title")}</h1>
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {items.map((i) => (
            <li key={i.product.id} className="flex gap-4 p-4 first:pt-0">
              <img src={i.product.image} alt={translateProduct(i.product.name)} className="h-20 w-20 rounded-xl bg-muted object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <Link to={`/product/${i.product.id}`} className="line-clamp-2 text-sm font-semibold hover:text-primary">{translateProduct(i.product.name)}</Link>
                  <button onClick={() => remove(i.product.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full border border-border">
                    <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary" onClick={() => setQty(i.product.id, i.qty - 1)}><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-6 text-center text-sm font-semibold">{i.qty}</span>
                    <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary" onClick={() => setQty(i.product.id, i.qty + 1)}><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <span className="font-display font-bold">{formatRWF(i.product.price * i.qty)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {upsellProducts.length > 0 && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold">{t("cart.upsell", { defaultValue: "Customers also bought" })}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {upsellProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
      <aside className="h-fit rounded-2xl border border-border bg-card p-5 md:sticky md:top-20">
        <h2 className="mb-4 font-display text-lg font-bold">{t("checkout.summary")}</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">{t("cart.subtotal")}</span><span className="font-semibold">{formatRWF(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t("cart.deposit")}</span><span className="font-semibold">{formatRWF(DEPOSIT)}</span></div>
          <div className="my-2 h-px bg-border" />
          <div className="flex justify-between text-base"><span className="font-semibold">{t("cart.total")}</span><span className="font-display text-lg font-extrabold">{formatRWF(DEPOSIT)}</span></div>
          <p className="pt-1 text-xs text-muted-foreground">Pay {formatRWF(subtotal - DEPOSIT)} on pick-up.</p>
        </div>
        <Button size="lg" className="mt-5 w-full rounded-full" onClick={() => user ? navigate("/branches?next=checkout") : navigate("/login?redirect=/cart")}>
          {t("cart.checkout")}
        </Button>
      </aside>
    </div>
  );
}
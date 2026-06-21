import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Minus, Plus, ShoppingBag, Trash2, Sparkles, AlertTriangle, Bookmark, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { formatRWF, PRODUCTS } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { useMemo } from "react";
import { useDynamicTranslation } from "@/hooks/use-dynamic-translation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DEPOSIT = 500;
const MIN_ORDER = 2500;

export default function Cart() {
  const { t } = useTranslation();
  const { translateProduct } = useDynamicTranslation();
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const savedItems = useCart((s) => s.savedItems);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const saveForLater = useCart((s) => s.saveForLater);
  const moveToCart = useCart((s) => s.moveToCart);
  const removeSaved = useCart((s) => s.removeSaved);
  const subtotal = useCart((s) => s.items.reduce((n, i) => n + i.qty * i.product.price, 0));

  const belowMinimum = subtotal > 0 && subtotal < MIN_ORDER;

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
      <div className="container flex flex-col items-center justify-center gap-6 py-24 text-center">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10 blur-xl" />
          <div className="relative grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border border-border shadow-lg">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
          </div>
        </div>
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight">{t("cart.empty")}</h1>
          <p className="mt-2 text-muted-foreground max-w-sm">
            Looks like you haven't added anything to your cart yet. Browse our catalog and discover fresh products!
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full px-8 gap-2 shadow-lg hover:-translate-y-0.5 transition-all">
          <Link to="/browse">
            <ShoppingCart className="h-5 w-5" />
            {t("cart.emptyCta")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>

        {/* Show saved items even when cart is empty */}
        {savedItems.length > 0 && (
          <div className="w-full max-w-2xl mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Bookmark className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold">Saved for Later ({savedItems.length})</h2>
            </div>
            <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
              {savedItems.map((i) => (
                <li key={i.product.id} className="flex gap-4 p-4">
                  <img src={i.product.image} alt={translateProduct(i.product.name)} className="h-16 w-16 rounded-xl bg-muted object-cover" />
                  <div className="flex flex-1 flex-col">
                    <Link to={`/product/${i.product.id}`} className="text-sm font-semibold hover:text-primary">{translateProduct(i.product.name)}</Link>
                    <span className="text-sm font-bold text-primary mt-1">{formatRWF(i.product.price)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="rounded-full text-xs" onClick={() => { moveToCart(i.product.id); toast.success("Moved to cart!"); }}>
                      Move to Cart
                    </Button>
                    <button onClick={() => removeSaved(i.product.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container grid gap-8 py-8 md:grid-cols-[1fr_360px]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-3xl font-bold">{t("cart.title")}</h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 rounded-full text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Clear your entire cart?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all {items.length} item(s) from your cart. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full">Keep Items</AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-full bg-destructive hover:bg-destructive/90"
                  onClick={() => { clear(); toast.success("Cart cleared!"); }}
                >
                  Yes, Clear Cart
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Minimum Order Warning */}
        {belowMinimum && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 p-4 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Minimum order is {formatRWF(MIN_ORDER)}
              </p>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/70 mt-0.5">
                Add {formatRWF(MIN_ORDER - subtotal)} more to proceed to checkout. This helps us ensure efficient delivery.
              </p>
            </div>
          </div>
        )}

        <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
          {items.map((i) => (
            <li key={i.product.id} className="flex gap-4 p-4 first:pt-0">
              <img src={i.product.image} alt={translateProduct(i.product.name)} className="h-20 w-20 rounded-xl bg-muted object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <Link to={`/product/${i.product.id}`} className="line-clamp-2 text-sm font-semibold hover:text-primary">{translateProduct(i.product.name)}</Link>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { saveForLater(i.product.id); toast.info("Saved for later!"); }}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Save for later"
                      title="Save for later"
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(i.product.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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

        {/* Saved for Later Shelf */}
        {savedItems.length > 0 && (
          <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 mb-4">
              <Bookmark className="h-5 w-5 text-primary" />
              <h2 className="font-display text-xl font-bold">Saved for Later ({savedItems.length})</h2>
            </div>
            <ul className="divide-y divide-border rounded-2xl border border-dashed border-border bg-card/50">
              {savedItems.map((i) => (
                <li key={i.product.id} className="flex gap-4 p-4">
                  <img src={i.product.image} alt={translateProduct(i.product.name)} className="h-16 w-16 rounded-xl bg-muted object-cover" />
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <Link to={`/product/${i.product.id}`} className="text-sm font-semibold hover:text-primary">{translateProduct(i.product.name)}</Link>
                      <div className="text-sm font-bold text-primary mt-0.5">{formatRWF(i.product.price)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="rounded-full text-xs" onClick={() => { moveToCart(i.product.id); toast.success("Moved to cart!"); }}>
                        Move to Cart
                      </Button>
                      <button onClick={() => removeSaved(i.product.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

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
        <Button
          size="lg"
          className="mt-5 w-full rounded-full"
          onClick={() => navigate("/branches?next=checkout")}
          disabled={belowMinimum}
        >
          {t("cart.checkout")}
        </Button>
        {belowMinimum && (
          <p className="mt-2 text-center text-xs text-amber-600 dark:text-amber-400 font-semibold">
            Add {formatRWF(MIN_ORDER - subtotal)} more to checkout
          </p>
        )}
      </aside>
    </div>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Star, Bell, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { formatRWF } from "@/lib/products";
import type { Product } from "@/lib/types";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useDynamicTranslation } from "@/hooks/use-dynamic-translation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const { t } = useTranslation();
  const { translateProduct, translateCategory } = useDynamicTranslation();
  const [showQuickView, setShowQuickView] = useState(false);

  const isLowStock = product.inStock && product.stock !== undefined && product.stock > 0 && product.stock < 10;
  
  return (
    <>
      <Link to={`/product/${product.id}`} className="block h-full group">
        <div className="premium-card relative">
          <div className="premium-card__shine"></div>
          <div className="premium-card__glow"></div>
          <div className="premium-card__content">
            {!product.inStock ? (
              <div className="premium-card__badge bg-red-600 text-white">
                {t("product.outOfStock")}
              </div>
            ) : isLowStock ? (
              <div className="premium-card__badge bg-amber-500 text-white">
                Low Stock
              </div>
            ) : null}

            {product.rating !== undefined && product.rating > 0 && (
              <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm z-10">
                <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                {product.rating}
              </div>
            )}

            <div className="premium-card__image-container text-foreground">
              <img
                src={product.image}
                alt={translateProduct(product.name)}
                loading="lazy"
                className="premium-card__image-img"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.3")}
              />
              {/* Quick View Overlay on Hover */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <Button
                  variant="secondary"
                  size="sm"
                  className="rounded-full font-bold gap-1 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white text-foreground hover:bg-white/90"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowQuickView(true);
                  }}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Quick View
                </Button>
              </div>
            </div>
            <div className="premium-card__text">
              <p className="premium-card__title line-clamp-2">{translateProduct(product.name)}</p>
              <p className="premium-card__description">{translateCategory(product.category)}</p>
            </div>
            <div className="premium-card__footer">
              <div className="premium-card__price">{formatRWF(product.price)}</div>
              {product.inStock ? (
                <div 
                  className="premium-card__button"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    add(product); 
                    toast.success(`${product.name} added to cart!`);
                  }}
                  aria-label={t("product.add")}
                >
                  <Plus className="h-4 w-4" />
                </div>
              ) : (
                <div 
                  className="premium-card__button bg-secondary text-muted-foreground"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    toast.info(`We will notify you when ${product.name} is back in stock!`);
                  }}
                  title="Notify Me"
                >
                  <Bell className="h-4 w-4" />
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      <Dialog open={showQuickView} onOpenChange={setShowQuickView}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl p-6 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold leading-tight pr-6 text-foreground">
              {translateProduct(product.name)}
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-primary uppercase tracking-wider">
              {translateCategory(product.category)}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 sm:grid-cols-2 mt-2">
            <div className="overflow-hidden rounded-2xl bg-muted aspect-square relative">
              <img
                src={product.image}
                alt={translateProduct(product.name)}
                className="h-full w-full object-cover"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.3")}
              />
            </div>

            <div className="flex flex-col justify-between gap-4">
              <div className="space-y-3 text-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl font-extrabold">
                    {formatRWF(product.price)}
                  </span>
                  <span className="text-xs text-muted-foreground">/ {product.unit || "Pcs"}</span>
                </div>

                <div>
                  {product.inStock ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none rounded-full px-3">
                      {t("product.inStock")}
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="rounded-full px-3">
                      {t("product.outOfStock")}
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                  {product.description || "Fresh and high-quality product sourced directly from local producers in Rwanda, ensuring the best value and standards for your family."}
                </p>
              </div>

              <Button
                disabled={!product.inStock}
                className="w-full gap-2 rounded-full font-bold shadow-md h-10 mt-auto"
                onClick={() => {
                  add(product);
                  toast.success(`${product.name} added to cart!`);
                  setShowQuickView(false);
                }}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
import { Link } from "react-router-dom";
import { Plus, Star, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { formatRWF } from "@/lib/products";
import type { Product } from "@/lib/types";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useDynamicTranslation } from "@/hooks/use-dynamic-translation";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const { t } = useTranslation();
  const { translateProduct, translateCategory } = useDynamicTranslation();

  const isLowStock = product.inStock && product.stock !== undefined && product.stock > 0 && product.stock < 10;
  
  return (
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

          <div className="premium-card__image-container">
            <img
              src={product.image}
              alt={translateProduct(product.name)}
              loading="lazy"
              className="premium-card__image-img"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.3")}
            />
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
  );
}
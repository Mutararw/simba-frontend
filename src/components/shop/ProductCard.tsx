import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { formatRWF } from "@/lib/products";
import type { Product } from "@/lib/types";
import { useTranslation } from "react-i18next";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const { t } = useTranslation();
  
  return (
    <Link to={`/product/${product.id}`} className="block h-full group">
      <div className="premium-card">
        <div className="premium-card__shine"></div>
        <div className="premium-card__glow"></div>
        <div className="premium-card__content">
          {!product.inStock && (
            <div className="premium-card__badge bg-destructive text-destructive-foreground">
              {t("product.outOfStock")}
            </div>
          )}
          <div className="premium-card__image-container">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="premium-card__image-img"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.3")}
            />
          </div>
          <div className="premium-card__text">
            <p className="premium-card__title line-clamp-2">{product.name}</p>
            <p className="premium-card__description">{product.category}</p>
          </div>
          <div className="premium-card__footer">
            <div className="premium-card__price">{formatRWF(product.price)}</div>
            <div 
              className="premium-card__button"
              onClick={(e) => { 
                e.preventDefault(); 
                if(product.inStock) add(product); 
              }}
              aria-label={t("product.add")}
            >
              <Plus className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
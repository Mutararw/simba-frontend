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
    <article className="product-card group flex flex-col">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0.3")}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link to={`/product/${product.id}`} className="line-clamp-2 text-sm font-medium leading-snug hover:text-primary">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="font-display text-base font-bold text-foreground">{formatRWF(product.price)}</span>
          <Button
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={(e) => { e.preventDefault(); add(product); }}
            aria-label={t("product.add")}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS, formatRWF, getProductsByCategory } from "@/lib/products";
import { useCart } from "@/store/cart";
import { ProductCard } from "@/components/shop/ProductCard";

export default function ProductPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const product = PRODUCTS.find((p) => p.id === Number(id));
  const add = useCart((s) => s.add);

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <p>Product not found.</p>
        <Button asChild className="mt-4"><Link to="/browse">{t("nav.browse")}</Link></Button>
      </div>
    );
  }

  const related = getProductsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 5);

  return (
    <div className="container py-6">
      <Link to="/browse" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-muted">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">{product.category}</div>
          <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl">{product.name}</h1>
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl font-extrabold">{formatRWF(product.price)}</span>
            <span className="text-sm text-muted-foreground">/ {product.unit}</span>
          </div>
          {product.inStock ? (
            <Badge variant="secondary" className="w-fit bg-primary/10 text-primary">{t("product.inStock")}</Badge>
          ) : (
            <Badge variant="destructive" className="w-fit">{t("product.outOfStock")}</Badge>
          )}
          <Button size="lg" disabled={!product.inStock} className="mt-4 w-fit gap-2 rounded-full px-8" onClick={() => add(product)}>
            <ShoppingCart className="h-4 w-4" /> {t("product.add")}
          </Button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 font-display text-2xl font-bold">{t("product.related")}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
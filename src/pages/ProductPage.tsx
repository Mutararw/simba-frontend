import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ShoppingCart, Loader2, Heart, Plus, Minus, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchProduct, formatRWF, PRODUCTS } from "@/lib/products";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { ProductCard } from "@/components/shop/ProductCard";
import type { Product } from "@/lib/types";
import { toast } from "sonner";

export default function ProductPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState<Product[]>([]);
  
  const addItem = useCart((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchProduct(id).then((p) => {
      setProduct(p);
      if (p) {
        const rel = PRODUCTS.filter((r) => r.category === p.category && r.id !== p.id).slice(0, 5);
        setRelated(rel);
      }
      setLoading(false);
    });
  }, [id]);

  const toggleWishlist = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addItem({ 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image, 
        category: product.category 
      });
    }
    toast.success(`${qty}x ${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <p>Product not found.</p>
        <Button asChild className="mt-4"><Link to="/browse">{t("nav.browse")}</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-6">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Link to="/" className="flex items-center gap-1 hover:text-primary">
          <Home className="h-3 w-3" /> Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/browse" className="hover:text-primary">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/browse?cat=${product.category}`} className="hover:text-primary">{product.category}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-bold text-foreground truncate max-w-[150px]">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-muted aspect-square relative">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleWishlist}
            className={`absolute top-4 right-4 rounded-full bg-white/80 shadow-md backdrop-blur-sm transition-all hover:scale-110 ${isInWishlist(product.id) ? "text-red-500" : "text-slate-400"}`}
          >
            <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
          </Button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-sm font-semibold uppercase tracking-wider text-primary">{product.category}</div>
          <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl">{product.name}</h1>
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl font-extrabold">{formatRWF(product.price)}</span>
            <span className="text-sm text-muted-foreground">/ {product.unit || "Pcs"}</span>
          </div>
          
          {product.inStock ? (
            <Badge variant="secondary" className="w-fit bg-green-100 text-green-700">{t("product.inStock")}</Badge>
          ) : (
            <Badge variant="destructive" className="w-fit">{t("product.outOfStock")}</Badge>
          )}

          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Label className="font-bold">Quantity</Label>
              <div className="flex items-center gap-1 p-1 bg-secondary rounded-full">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full" 
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-bold">{qty}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full" 
                  onClick={() => setQty(q => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4 mt-2">
              <Button 
                size="lg" 
                disabled={!product.inStock} 
                className="flex-1 gap-2 rounded-full h-12 text-base font-bold shadow-lg" 
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" /> {t("product.add")}
              </Button>
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <h3 className="font-bold mb-2">Product Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description || `Premium ${product.name} from our ${product.category} section. High quality guaranteed and fresh daily.`}
            </p>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Customer Reviews</h3>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{product.rating || "5.0"}</span>
                <span className="text-xs text-muted-foreground ml-1">(24 reviews)</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Jean Pierre", rating: 5, comment: "Excellent quality, very fresh!" },
                { name: "Marie Claire", rating: 4, comment: "Good product, but the delivery was a bit late." }
              ].map((rev, i) => (
                <div key={i} className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold">{rev.name}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className={`h-3 w-3 ${idx < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{rev.comment}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full rounded-xl text-xs font-bold h-10">Write a Review</Button>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl font-bold">{t("product.related")}</h2>
            <Link to={`/browse?cat=${product.category}`} className="text-sm font-semibold text-primary hover:underline">See more →</Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
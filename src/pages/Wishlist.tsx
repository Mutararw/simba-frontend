import { useTranslation } from "react-i18next";
import { useWishlist } from "@/store/wishlist";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

export default function Wishlist() {
  const { t } = useTranslation();
  const { items, removeItem } = useWishlist();
  const addItem = useCart((s) => s.addItem);

  const moveAllToCart = () => {
    items.forEach((item) => {
      addItem({ 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        image: item.image, 
        category: item.category 
      });
      removeItem(item.id);
    });
    toast.success("All items moved to cart!");
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("wishlist.title", { defaultValue: "My Wishlist" })}</h1>
          <p className="text-muted-foreground">{t("wishlist.subtitle", { defaultValue: "Products you've saved for later." })}</p>
        </div>
        {items.length > 0 && (
          <Button onClick={moveAllToCart} className="rounded-full gap-2">
            <ShoppingCart className="h-4 w-4" /> Move all to cart
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed rounded-3xl">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-secondary text-muted-foreground">
            <Heart className="h-8 w-8" />
          </div>
          <p className="text-muted-foreground">Your wishlist is empty.</p>
          <Button asChild className="mt-4 rounded-full">
            <Link to="/browse">Explore products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((p) => (
            <div key={p.id} className="relative group">
              <ProductCard product={p} />
              <Button 
                variant="destructive" 
                size="sm" 
                className="absolute top-2 right-2 rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeItem(p.id)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

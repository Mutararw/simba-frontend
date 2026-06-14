import { useTranslation } from "react-i18next";
import { formatRWF } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Timer } from "lucide-react";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

const PROMOTIONS = [
  {
    id: 1,
    name: "Fresh Milk 1L",
    price: 1600,
    originalPrice: 2000,
    discount: "20%",
    image: "https://res.cloudinary.com/eskalate/image/upload/v1776507711/simba_contest/product_66002.jpg",
    endsIn: "05:12:45",
  },
  {
    id: 2,
    name: "Basmati Rice 5kg",
    price: 15600,
    originalPrice: 18000,
    discount: "13%",
    image: "https://res.cloudinary.com/eskalate/image/upload/v1776507729/simba_contest/product_71002.jpg",
    endsIn: "02:30:10",
  },
  {
    id: 3,
    name: "Inyange Low Fat Milk",
    price: 800,
    originalPrice: 1000,
    discount: "20%",
    image: "https://res.cloudinary.com/eskalate/image/upload/v1776507711/simba_contest/product_66001.jpg",
    endsIn: "10:45:00",
  }
];

export default function Promotions() {
  const { t } = useTranslation();
  const addItem = useCart((s) => s.addItem);

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("promotions.title", { defaultValue: "Promotions & Deals" })}</h1>
          <p className="text-muted-foreground">{t("promotions.subtitle", { defaultValue: "Limited time offers for you." })}</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROMOTIONS.map((promo) => (
          <Card key={promo.id} className="overflow-hidden border-primary/20 bg-primary/5">
            <CardHeader className="p-0">
              <div className="relative aspect-square overflow-hidden">
                <img src={promo.image} alt={promo.name} className="h-full w-full object-cover transition-transform hover:scale-105" />
                <Badge className="absolute left-4 top-4 bg-red-600 hover:bg-red-700">
                  {promo.discount} OFF
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-red-600">
                <Timer className="h-3 w-3" />
                Ends in: {promo.endsIn}
              </div>
              <CardTitle className="text-lg line-clamp-1">{promo.name}</CardTitle>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-bold text-primary">{formatRWF(promo.price)}</span>
                <span className="text-sm text-muted-foreground line-through">{formatRWF(promo.originalPrice)}</span>
              </div>
            </CardContent>
            <CardFooter className="p-5 pt-0">
              <Button 
                className="w-full rounded-full" 
                onClick={() => {
                  addItem({ id: promo.id, name: promo.name, price: promo.price, image: promo.image, category: "Promotions" });
                  toast.success(`${promo.name} added to cart!`);
                }}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> {t("product.add")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Clock, Sparkles, MapPin, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryRail } from "@/components/shop/CategoryRail";
import { ProductCard } from "@/components/shop/ProductCard";
import { AiSearchBar } from "@/components/shop/AiSearchBar";
import { PRODUCTS } from "@/lib/products";
import hero from "@/assets/hero-groceries.jpg";

const featured = PRODUCTS.filter((p) => p.inStock).slice(0, 10);

export default function Index() {
  const { t } = useTranslation();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary/50">
        <div className="container grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-5"
          >
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" /> Kigali · {t("brand.tagline")}
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="max-w-md text-base text-muted-foreground md:text-lg">{t("hero.subtitle")}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link to="/browse">{t("hero.cta")} <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                <Link to="/branches">{t("hero.secondary")}</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={hero}
                alt="Fresh groceries from Simba"
                width={1600}
                height={1024}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-2xl bg-card p-3 shadow-lg md:flex md:items-center md:gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-sm font-bold">45 min</div>
                <div className="text-xs text-muted-foreground">Avg. pick-up time</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="container -mt-2 pb-2 md:pb-4">
        <AiSearchBar />
      </section>

      {/* Perks */}
      <section className="container grid grid-cols-2 gap-3 py-8 md:grid-cols-4">
        {[
          { icon: Clock, key: "pickup" },
          { icon: Sparkles, key: "fresh" },
          { icon: Smartphone, key: "momo" },
          { icon: MapPin, key: "branches" },
        ].map(({ icon: Icon, key }) => (
          <div key={key} className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="font-display text-sm font-bold">{t(`perks.${key}.title` as any)}</div>
            <div className="mt-1 text-xs text-muted-foreground">{t(`perks.${key}.body` as any)}</div>
          </div>
        ))}
      </section>

      <CategoryRail />

      {/* Featured */}
      <section className="container pb-16">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Popular this week</h2>
          <Link to="/browse" className="text-sm font-semibold text-primary hover:underline">See all →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </>
  );
}

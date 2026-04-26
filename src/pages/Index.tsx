import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Clock, Sparkles, MapPin, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryRail } from "@/components/shop/CategoryRail";
import { ProductCard } from "@/components/shop/ProductCard";
import { AiSearchBar } from "@/components/shop/AiSearchBar";
import { BranchRouteFinder } from "@/components/shop/BranchRouteFinder";
import { WhyChooseUs } from "@/components/shop/WhyChooseUs";
import { GetInTouch } from "@/components/shop/GetInTouch";
import { useProducts } from "@/hooks/use-products";
import hero from "@/assets/hero-groceries.jpg";

export default function Index() {
  const { t } = useTranslation();
  const { products, categories, loading } = useProducts();
  
  // Get top categories with products
  const topCategories = categories
    .filter(c => c.count >= 2) // Lowered threshold to ensure we get enough blocks
    .slice(0, 3);

  const featured = products.filter((p) => p.inStock).slice(0, 10);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-50 blur-[100px]" />
        
        <div className="container relative z-10 grid items-center gap-8 py-12 md:grid-cols-2 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Kigali · {t("brand.tagline")}
            </motion.span>
            
            <h1 className="font-display text-5xl font-extrabold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Fresh, Quality Groceries.
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-[#fd7e14] bg-clip-text text-transparent">
                Ready When You Are.
              </span>
            </h1>
            
            <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
              Experience Kigali's premium supermarket from the comfort of your home. Shop online and collect at your nearest Simba branch in just 45 minutes. Fresh, fast, and always trusted.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="h-12 rounded-full px-8 text-base shadow-[0_0_40px_-10px_hsl(var(--primary))] hover:shadow-[0_0_60px_-15px_hsl(var(--primary))] transition-all duration-300 hover:-translate-y-1">
                <Link to="/browse">{t("hero.cta")} <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-8 text-base border-primary/20 hover:bg-primary/5 transition-all duration-300">
                <Link to="/branches">{t("hero.secondary")}</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/30 to-[#fd7e14]/20 blur-2xl opacity-50 z-0 animate-pulse" />
            <div className="relative z-10 overflow-hidden rounded-[2rem] shadow-2xl border border-white/10">
              <img
                src={hero}
                alt="Fresh groceries from Simba"
                width={1600}
                height={1024}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-card/95 backdrop-blur p-4 shadow-xl border border-border md:flex md:items-center md:gap-4 z-20"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <div className="font-display text-lg font-black text-foreground">45 min</div>
                <div className="text-sm font-medium text-muted-foreground">Avg. pick-up time</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="container -mt-2 pb-2 md:pb-4">
        <AiSearchBar />
      </section>

      {/* Location Finder */}
      <BranchRouteFinder />

      <CategoryRail />

      <div className="space-y-16 pb-16">
        {loading ? (
          <section className="container">
            <div className="h-8 w-48 bg-secondary animate-pulse rounded-md mb-4" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="aspect-[3/4] bg-secondary animate-pulse rounded-2xl" />
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* Featured Section */}
            <section className="container">
              <div className="mb-4 flex items-end justify-between">
                <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Popular this week</h2>
                <Link to="/browse" className="text-sm font-semibold text-primary hover:underline">See all →</Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {featured.slice(0, 5).map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>

            {/* Category Blocks */}
            {topCategories.map((cat) => (
              <section key={cat.key} className="container">
                <div className="mb-4 flex items-end justify-between">
                  <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                    {cat.emoji} {cat.key}
                  </h2>
                  <Link to={`/browse?cat=${encodeURIComponent(cat.key)}`} className="text-sm font-semibold text-primary hover:underline">See all →</Link>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {products
                    .filter((p) => p.category === cat.key && p.inStock)
                    .slice(0, 5)
                    .map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </section>
            ))}
          </>
        )}
      </div>

      <WhyChooseUs />

      {/* Get In Touch / Feedback Section */}
      <GetInTouch />
    </>
  );
}

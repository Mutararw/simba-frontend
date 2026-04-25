import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProducts } from "@/hooks/use-products";

const TILE_BG = ["bg-tile-1", "bg-tile-2", "bg-tile-3", "bg-tile-4", "bg-tile-5", "bg-tile-6", "bg-tile-7", "bg-tile-8"];

export function CategoryRail() {
  const { t } = useTranslation();
  const { categories } = useProducts();
  return (
    <section className="container py-8">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{t("categories.title")}</h2>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 lg:grid-cols-5">
        {categories.map((c) => (
          <Link
            key={c.key}
            to={`/browse?cat=${encodeURIComponent(c.key)}`}
            className={`category-tile ${TILE_BG[c.tile - 1]} min-w-[140px] md:min-w-0 group overflow-hidden relative`}
          >
            {c.image && (
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                <img 
                  src={c.image} 
                  alt="" 
                  className="h-full w-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500"
                />
              </div>
            )}
            <div className="absolute right-3 top-3 text-3xl drop-shadow-sm group-hover:scale-110 transition-transform z-20">
              {c.emoji}
            </div>
            <div className="z-20 mt-auto w-full">
              <h3 className="font-display text-sm font-bold leading-tight text-foreground md:text-base">{c.key}</h3>
              <p className="mt-1 text-xs text-foreground/60">
                {t("categories.count", { count: c.count })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
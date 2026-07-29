import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProducts } from "@/hooks/use-products";
import { useDynamicTranslation } from "@/hooks/use-dynamic-translation";

export function CategoryRail() {
  const { t } = useTranslation();
  const { translateCategory } = useDynamicTranslation();
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
            className={`category-tile min-w-[140px] md:min-w-0 group overflow-hidden relative bg-background`}
          >
            {c.image && (
              <div className="absolute inset-0">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            <div className="z-20 mt-auto w-full">
              <h3 className="font-display text-sm font-bold leading-tight text-white md:text-base drop-shadow-lg">{translateCategory(c.key)}</h3>
              <p className="mt-1 text-xs text-white/80 drop-shadow-lg">
                {t("categories.count", { count: c.count })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
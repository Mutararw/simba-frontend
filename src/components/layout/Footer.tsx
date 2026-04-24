import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-secondary/40 py-10">
      <div className="container flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
        <div className="font-display text-base font-bold text-foreground">{t("brand.name")}</div>
        <p>{t("brand.tagline")} · Kigali, Rwanda</p>
        <p className="text-xs">© {new Date().getFullYear()} Simba. {t("footer.rights")} · {t("footer.built")}</p>
      </div>
    </footer>
  );
}
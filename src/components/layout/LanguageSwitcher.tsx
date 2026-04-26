import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "rw", label: "RW" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
  { code: "zh", label: "ZH" },
] as const;

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  
  useEffect(() => {
    // Set RTL direction for Arabic
    if (i18n.language.startsWith('ar')) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }, [i18n.language]);

  const current = LANGS.find((l) => l.code === i18n.language.split("-")[0]) ?? LANGS[0];
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 font-semibold">
          <Globe className="h-4 w-4" />
          {current.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => i18n.changeLanguage(l.code)}
            className={i18n.language.startsWith(l.code) ? "font-semibold text-primary" : ""}
          >
            {t(`lang.${l.code}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

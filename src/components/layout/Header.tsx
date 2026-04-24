import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingCart, MapPin, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { t } = useTranslation();
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="container flex h-16 items-center gap-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">S</span>
          <span className="hidden sm:inline">{t("brand.name")}</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {[
            { to: "/", label: t("nav.home") },
            { to: "/browse", label: t("nav.browse") },
            { to: "/branches", label: t("nav.branches") },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Button variant="ghost" size="sm" className="hidden gap-1.5 sm:inline-flex" onClick={() => navigate("/branches")}>
            <MapPin className="h-4 w-4" /> Kigali
          </Button>
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/cart")} aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <UserIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs text-muted-foreground">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setUser(null); navigate("/"); }}>
                  <LogOut className="mr-2 h-4 w-4" /> {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={() => navigate("/login")}>
              {t("nav.login")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
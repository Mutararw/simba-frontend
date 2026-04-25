import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingCart, MapPin, User as UserIcon, LogOut, Home, Grid, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { OrderCountdown } from "../shop/OrderCountdown";
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
    <header className="sticky top-0 z-40 w-full border-b border-[#fd7e14]/20 bg-[#fd7e14] text-white shadow-md">
      <div className="container flex h-16 items-center gap-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
          <img 
            src="https://www.simbaonlineshopping.com/images/simbaheaderM.png" 
            alt="Simba Logo" 
            className="h-10 object-contain" 
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span class="text-primary-foreground text-xl">🦁 SIMBA</span>';
            }} 
          />
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {[
            { to: "/", label: t("nav.home"), icon: Home },
            { to: "/browse", label: t("nav.browse"), icon: Grid },
            { to: "/branches", label: t("nav.branches"), icon: Store },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-white/20 text-white" : "text-white/80 hover:text-white hover:bg-white/10"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Global Navbar Search */}
        <div className="ml-4 hidden md:flex flex-1 max-w-sm relative text-white">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const q = (e.target as HTMLFormElement).search.value;
              if (q.trim()) navigate(`/browse?q=${encodeURIComponent(q)}`);
            }}
            className="w-full relative"
          >
            <input 
              name="search"
              placeholder="Search products..." 
              className="w-full h-9 rounded-full border border-white/20 bg-white/10 pl-10 pr-4 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <OrderCountdown />
          <ThemeToggle />
          <LanguageSwitcher />
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20 hover:text-white" onClick={() => navigate("/cart")} aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-bold text-[#fd7e14] shadow-sm">
                {count}
              </span>
            )}
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account" className="text-white hover:bg-white/20 hover:text-white">
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
            <Button size="sm" onClick={() => navigate("/login")} className="ml-1 rounded-full bg-white text-[#fd7e14] hover:bg-white/90 px-4 font-bold shadow-md hover:-translate-y-0.5 transition-transform">
              {t("nav.login")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
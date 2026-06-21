import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingCart, User as UserIcon, LogOut, Grid, Store, Menu, X, Bell, LayoutDashboard, Settings, Truck, ShieldCheck, Heart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { OrderCountdown } from "../shop/OrderCountdown";
import { AiSearchBar } from "../shop/AiSearchBar";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { api } from "@/lib/api";
import { BRANCHES } from "@/lib/branches";

export function Header() {
  const { t } = useTranslation();
  const count = useCart((s) => (Array.isArray(s.items) ? s.items : []).reduce((n, i) => n + i.qty, 0));
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/browse", label: "Products", icon: Grid },
    { to: "/promotions", label: "Deals", icon: Truck },
    { to: "/branches", label: t("nav.branches"), icon: Store },
    { to: "/about", label: "About", icon: Info },
  ];

  if (user) {
    const accountType = (user as any).accountType;
    const adminRole = (user as any).adminRole;
    const userRole = user.role;

    const isAdmin = accountType === 'admin' || userRole === 'admin' || adminRole === 'admin';
    const isManager = accountType === 'manager' || userRole === 'manager' || adminRole === 'manager';
    const isSupplier = accountType === 'supplier' || userRole === 'supplier' || adminRole === 'supplier';

    if (isAdmin) {
      navLinks.push({ to: "/dashboard", label: "Admin Panel", icon: ShieldCheck });
    } else if (isManager) {
      const branchName = BRANCHES.find(b => b.id.toLowerCase() === (user as any).branchId?.toLowerCase())?.name || "Manager";
      navLinks.push({ to: "/dashboard", label: `Manager - ${branchName}`, icon: Store });
    } else if (isSupplier) {
      navLinks.push({ to: "/dashboard", label: "Supplier", icon: Truck });
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#fd7e14]/20 bg-[#fd7e14] text-white shadow-md">
      <div className="container flex h-20 items-center justify-between gap-3">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="icon" className="text-white">
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-[#fd7e14] text-white border-none w-64">
                    <div className="flex flex-col gap-4 mt-8">
                        {navLinks.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 text-lg font-medium p-3 rounded-lg hover:bg-white/10"
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </NavLink>
                        ))}
                    </div>
                </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
              <img 
                src="https://www.simbaonlineshopping.com/images/simbaheaderM.png" 
                alt="Simba Logo" 
                className="h-8 md:h-10 object-contain" 
              />
            </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => (
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

        {/* Global Navbar Search - Hidden on Smallest Mobile */}
        <div className="hidden sm:flex flex-1 max-w-xl mx-2">
          <AiSearchBar />
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <div className="hidden md:block mr-2">
             <OrderCountdown />
          </div>
          <LanguageSwitcher />
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20 hover:text-white" onClick={() => navigate("/wishlist")} aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20 hover:text-white" onClick={() => navigate("/notifications")} aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-white ring-2 ring-[#fd7e14]" />
          </Button>
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
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel className="p-3">
                  <div className="font-bold">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(user.role === 'manager' || (user as any).accountType === 'admin') && (
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <Settings className="mr-2 h-4 w-4" /> Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setUser(null); navigate("/"); }} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" /> {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={() => navigate("/login")} className="rounded-full bg-white text-[#fd7e14] hover:bg-white/90 px-3 md:px-4 font-bold shadow-md">
              {t("nav.login")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

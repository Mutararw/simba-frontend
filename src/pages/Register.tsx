import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp, signInWithGoogle, signInWithGithub } from "@/lib/auth";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShieldCheck, Building2, Eye, EyeOff, Lock, Truck, Mail, UserCircle } from "lucide-react";
import { BRANCHES } from "@/lib/branches";

type UserRole = "customer" | "manager" | "admin" | "supplier";

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuth((s) => s.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>("customer");
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0].id);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSocialLogin(provider: "google" | "github") {
    try {
      if (provider === "google") await signInWithGoogle();
      if (provider === "github") await signInWithGithub();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to sign in with ${provider}`);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // Map UI role to backend accountType: "customer" → "user"
      const backendAccountType = role === "customer" ? "user" : role;
      
      const u = await signUp(
        email, 
        password, 
        name, 
        backendAccountType, 
        backendAccountType === "admin" ? "manager" : undefined,
        backendAccountType === "manager" ? selectedBranch : undefined
      );
      
      setUser(u);
      
      if (role === "customer") {
        toast.success(`Welcome to Simba, ${u.name}!`);
        navigate("/");
      } else {
        toast.success("Account created! Please wait for administrator approval before logging in.", {
          duration: 6000
        });
        navigate("/login"); // Send back to login to wait
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container relative min-h-[calc(100vh-100px)] grid place-items-center py-12 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 -right-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 -left-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg rounded-[2.5rem] border border-border bg-card p-1 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)]"
      >
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl font-black tracking-tight text-foreground">{t("auth.signup")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Join the Simba Supermarket Network</p>
          </div>

          {/* User Type Tabs */}
          <div className="relative mb-8 grid grid-cols-4 gap-1 rounded-2xl bg-secondary p-1">
            <TabButton active={role === "customer"} onClick={() => setRole("customer")} icon={<User className="h-4 w-4" />} label="Client" />
            <TabButton active={role === "manager"} onClick={() => setRole("manager")} icon={<ShieldCheck className="h-4 w-4" />} label="Manager" />
            <TabButton active={role === "supplier"} onClick={() => setRole("supplier")} icon={<Truck className="h-4 w-4" />} label="Supplier" />
            <TabButton active={role === "admin"} onClick={() => setRole("admin")} icon={<Lock className="h-4 w-4" />} label="Admin" />
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Full Name / Business Name
              </Label>
              <div className="relative group">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input 
                  id="name" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter name"
                  className="h-14 rounded-2xl border-border bg-background pl-12 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input 
                  id="email" 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="you@example.com"
                  className="h-14 rounded-2xl border-border bg-background pl-12 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {role === "manager" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5"
                >
                  <Label htmlFor="branch" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Assign to Branch
                  </Label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <select
                      id="branch"
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="flex h-14 w-full items-center justify-between rounded-2xl border border-border bg-background pl-12 pr-4 py-2 text-sm font-semibold ring-offset-background transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
                    >
                      {BRANCHES.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Secure Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  minLength={6}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-14 rounded-2xl border-border bg-background pl-12 pr-12 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="h-14 w-full rounded-2xl bg-primary text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1 active:translate-y-0" 
              disabled={loading}
            >
              {loading ? "Creating Account..." : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </Button>
          </form>

          {role === "customer" && (
            <div className="mt-8">
              <div className="relative flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-6">
                <div className="h-px flex-1 bg-border" />
                Social Sign Up
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12 rounded-2xl border-border" onClick={() => handleSocialLogin("google")}>
                   Google
                </Button>
                <Button variant="outline" className="h-12 rounded-2xl border-border" onClick={() => handleSocialLogin("github")}>
                   GitHub
                </Button>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t("auth.haveAccount")}{" "}
            <Link to="/login" className="font-bold text-primary hover:underline">
              {t("auth.signin")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-all ${
        active ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signInWithGoogle, signInWithGithub } from "@/lib/auth";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import { BRANCHES } from "@/lib/branches";
import { User, ShieldCheck, Building2, Eye, EyeOff, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuth((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"customer" | "manager">("customer");
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
      // For demonstration: Check if it's a manager login simulation
      let u;
      if (role === "manager") {
        const branch = BRANCHES.find(b => b.id === selectedBranch);
        u = {
          id: `mgr-${selectedBranch}`,
          name: `${branch?.name} Manager`,
          email: `${selectedBranch}@simba.com`,
          role: "manager",
          branchId: selectedBranch
        };
      } else {
        u = await signIn(email, password);
        u = { ...u, role };
      }
      
      setUser(u);
      toast.success(`Welcome back, ${u.name}!`);

      if (role === "manager") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container relative min-h-[calc(100vh-100px)] grid place-items-center py-12 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 -left-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-[2.5rem] border border-border bg-card p-1 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)]"
      >
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl font-black tracking-tight text-foreground">{t("auth.signin")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Access your Simba Supermarket account</p>
          </div>

          {/* User Type Tabs */}
          <div className="relative mb-8 grid grid-cols-2 gap-1 rounded-2xl bg-secondary p-1">
            <button
              onClick={() => setRole("customer")}
              className={`relative flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                role === "customer" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4" />
              Customer
            </button>
            <button
              onClick={() => setRole("manager")}
              className={`relative flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
                role === "manager" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Manager
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, x: role === "customer" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: role === "customer" ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              {role === "customer" && (
                <div className="mb-6 space-y-3">
                  <Button 
                    variant="outline" 
                    className="h-12 w-full rounded-2xl border-border bg-background hover:bg-secondary transition-all" 
                    onClick={() => handleSocialLogin("google")}
                  >
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </Button>
                </div>
              )}

              {role === "manager" && (
                <div className="mb-6 space-y-1.5">
                  <Label htmlFor="branch" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Select Your Branch
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
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <motion.svg 
                        width="12" height="8" viewBox="0 0 12 8" fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        animate={{ y: [0, 2, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </motion.svg>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {role === "customer" && (
            <div className="my-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
              <div className="h-px flex-1 bg-border" />
              {t("auth.or")}
              <div className="h-px flex-1 bg-border" />
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                {role === "manager" ? "Manager Username" : t("auth.email")}
              </Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input 
                  id="email" 
                  type={role === "manager" ? "text" : "email"} 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder={role === "manager" ? "Enter your username" : "you@example.com"}
                  className="h-14 rounded-2xl border-border bg-background pl-12 pr-4 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("auth.password")}
                </Label>
                {role === "customer" && (
                  <Link to="/forgot" className="text-xs font-bold text-primary hover:underline">
                    {t("auth.forgot")}
                  </Link>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
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
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Please wait...
                </div>
              ) : (
                role === "manager" ? "Access Dashboard" : t("auth.signin")
              )}
            </Button>
          </form>

          {role === "customer" && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              {t("auth.noAccount")}{" "}
              <Link to="/register" className="font-bold text-primary hover:underline">
                {t("auth.signup")}
              </Link>
            </p>
          )}
          
          {role === "manager" && (
            <div className="mt-6 rounded-xl bg-primary/5 p-4 text-center">
              <p className="text-xs text-primary font-medium">
                Tip: Manager login is simulated for training purposes.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

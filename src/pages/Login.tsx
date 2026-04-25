import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signInWithGoogle, signInWithGithub } from "@/lib/auth";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuth((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"customer" | "manager" | "admin" | "accountant">("customer");

  async function handleSocialLogin(provider: 'google' | 'github') {
    try {
      if (provider === 'google') await signInWithGoogle();
      if (provider === 'github') await signInWithGithub();
    } catch (err) {
      toast.error(`Failed to sign in with ${provider}`);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await signIn(email, password);
      const userWithRole = { ...u, role };
      setUser(userWithRole);
      toast.success(`Welcome back, ${u.name}!`);
      
      if (role === "admin" || role === "manager") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error("Invalid credentials");
    } finally { setLoading(false); }
  }

  return (
    <div className="container grid place-items-center py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <h1 className="font-display text-3xl font-bold">{t("auth.signin")}</h1>

        <div className="mt-6 flex flex-col gap-2">
          <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('google')}>
            {t("auth.google")}
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleSocialLogin('github')}>
            GitHub
          </Button>
        </div>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />{t("auth.or")}<div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5"><Label htmlFor="email">{t("auth.email")}</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="space-y-1.5"><Label htmlFor="password">{t("auth.password")}</Label><Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          
          <div className="space-y-1.5">
            <Label htmlFor="role">Simulate Login As</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="customer">Customer</option>
              <option value="accountant">Accountant</option>
              <option value="manager">Branch Manager</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="flex justify-end"><Link to="/forgot" className="text-xs font-semibold text-primary hover:underline">{t("auth.forgot")}</Link></div>
          <Button type="submit" className="w-full rounded-full" disabled={loading}>{loading ? "…" : t("auth.signin")}</Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {t("auth.noAccount")} <Link to="/register" className="font-semibold text-primary hover:underline">{t("auth.signup")}</Link>
        </p>
      </div>
    </div>
  );
}
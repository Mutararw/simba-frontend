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
      setUser(u);
      toast.success(`Welcome back, ${u.name}!`);
      navigate("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="container grid place-items-center py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <h1 className="font-display text-3xl font-bold">{t("auth.signin")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("brand.tagline")}</p>

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
          <div className="space-y-1.5">
            <Label htmlFor="email">{t("auth.email")}</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="text-right">
            <Link to="/forgot" className="text-xs font-semibold text-primary hover:underline">{t("auth.forgot")}</Link>
          </div>
          <Button type="submit" className="w-full rounded-full" disabled={loading}>
            {loading ? "…" : t("auth.signin")}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {t("auth.noAccount")} <Link to="/register" className="font-semibold text-primary hover:underline">{t("auth.signup")}</Link>
        </p>
      </div>
    </div>
  );
}
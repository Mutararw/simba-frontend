import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestReset } from "@/lib/auth";
import { toast } from "sonner";

export default function Forgot() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await requestReset(email).catch(() => {});
      toast.success(t("auth.resetSent"));
    } finally { setLoading(false); }
  }

  return (
    <div className="container grid place-items-center py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-card)]">
        <h1 className="font-display text-3xl font-bold">{t("auth.reset")}</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5"><Label htmlFor="email">{t("auth.email")}</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <Button type="submit" className="w-full rounded-full" disabled={loading}>{loading ? "…" : t("auth.reset")}</Button>
        </form>
        <p className="mt-5 text-center text-sm">
          <Link to="/login" className="font-semibold text-primary hover:underline">{t("auth.signin")}</Link>
        </p>
      </div>
    </div>
  );
}
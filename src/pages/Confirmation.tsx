import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOrder } from "@/store/order";
import { toast } from "sonner";

export default function Confirmation() {
  const { t } = useTranslation();
  const order = useOrder((s) => s.lastOrder);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="container max-w-2xl py-12">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary"
      >
        <CheckCircle2 className="h-10 w-10" />
      </motion.div>
      <h1 className="text-center font-display text-3xl font-bold md:text-4xl">{t("confirm.title")}</h1>
      <p className="mt-3 text-center text-muted-foreground">{t("confirm.body", { branch: order.branchName })}</p>

      <div className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{t("confirm.code")}</div>
          <div className="font-display text-2xl font-extrabold tracking-wider text-primary">{order.id}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Pick-up</div>
          <div className="font-display text-base font-bold">{t("confirm.eta", { time: order.pickupTime })}</div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-bold">{t("reviews.title")}</h2>
        <div className="mt-3 flex gap-1">
          {[1,2,3,4,5].map((n) => (
            <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
              <Star className={`h-7 w-7 transition-colors ${n <= rating ? "fill-accent text-accent" : "text-muted-foreground/40"}`} />
            </button>
          ))}
        </div>
        <Textarea
          className="mt-3"
          placeholder={t("reviews.placeholder")}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          className="mt-3 rounded-full"
          disabled={rating === 0}
          onClick={() => { toast.success(t("reviews.thanks")); setRating(0); setComment(""); }}
        >
          {t("reviews.submit")}
        </Button>
      </div>

      <div className="mt-6 text-center">
        <Button asChild variant="outline" className="rounded-full"><Link to="/">{t("confirm.home")}</Link></Button>
      </div>
    </div>
  );
}
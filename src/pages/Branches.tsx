import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Star, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRANCHES } from "@/lib/branches";
import { useOrder } from "@/store/order";

const TIMES = ["10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"];

export default function Branches() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isCheckout = params.get("next") === "checkout";
  const draft = useOrder((s) => s.pendingDraft);
  const setDraft = useOrder((s) => s.setDraft);

  const selectedBranch = BRANCHES.find((b) => b.id === draft.branchId);

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">{t("branch.title")}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{t("branch.subtitle")}</p>

      <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {BRANCHES.map((b) => {
          const active = draft.branchId === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setDraft({ branchId: b.id })}
              className={`text-left rounded-2xl border-2 bg-card p-5 transition-all ${
                active ? "border-primary shadow-[var(--shadow-elevated)]" : "border-border hover:border-primary/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-display text-base font-bold">{b.name}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {b.area}, Kigali
                  </div>
                </div>
                {active && <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">{t("branch.selected")}</span>}
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {b.rating.toFixed(1)}
                </span>
                <span>{t("branch.reviews", { count: b.reviews })}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {b.hours}</span>
              </div>
            </button>
          );
        })}
      </div>

      {isCheckout && (
        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold">{t("branch.pickupTime")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {TIMES.map((time) => {
              const active = draft.pickupTime === time;
              return (
                <button
                  key={time}
                  onClick={() => setDraft({ pickupTime: time })}
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
          <Button
            size="lg"
            className="mt-6 rounded-full px-8"
            disabled={!selectedBranch || !draft.pickupTime}
            onClick={() => navigate("/checkout")}
          >
            {t("branch.continue")}
          </Button>
        </div>
      )}
    </div>
  );
}
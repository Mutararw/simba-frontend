import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Calendar, ShieldCheck, Heart, Award } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="container py-12 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 -right-32 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 -z-10 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary shadow-sm"
        >
          {t("about.hero.badge")}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-4 font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          {t("about.hero.title")} <span className="bg-gradient-to-r from-primary to-[#fd7e14] bg-clip-text text-transparent">{t("about.hero.titleHighlight")}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-lg text-muted-foreground leading-relaxed"
        >
          {t("about.hero.description")}
        </motion.p>
      </div>

      {/* History & Mission Cards */}
      <div className="grid gap-8 md:grid-cols-2 mb-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-border bg-card p-8 shadow-md relative overflow-hidden group"
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition-transform group-hover:scale-150 duration-500" />
          <Calendar className="h-10 w-10 text-primary mb-6" />
          <h2 className="font-display text-2xl font-bold mb-4">{t("about.history.title")}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("about.history.description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-border bg-card p-8 shadow-md relative overflow-hidden group"
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#fd7e14]/5 transition-transform group-hover:scale-150 duration-500" />
          <Award className="h-10 w-10 text-[#fd7e14] mb-6" />
          <h2 className="font-display text-2xl font-bold mb-4">{t("about.commitment.title")}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t("about.commitment.description")}
          </p>
        </motion.div>
      </div>

      {/* Contact Section */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold">{t("about.contact.title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("about.contact.subtitle")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          <ContactCard
            icon={<Phone className="h-6 w-6 text-primary" />}
            title={t("about.contact.phone.title")}
            content={t("about.contact.phone.content")}
            subtitle={t("about.contact.phone.subtitle")}
          />
          <ContactCard
            icon={<Mail className="h-6 w-6 text-primary" />}
            title={t("about.contact.email.title")}
            content={t("about.contact.email.content")}
            subtitle={t("about.contact.email.subtitle")}
          />
          <ContactCard
            icon={<MapPin className="h-6 w-6 text-primary" />}
            title={t("about.contact.address.title")}
            content={t("about.contact.address.content")}
            subtitle={t("about.contact.address.subtitle")}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto mb-12">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold">{t("about.faq.title")}</h2>
          <p className="mt-2 text-muted-foreground">{t("about.faq.subtitle")}</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="faq-1" className="border border-border bg-card rounded-2xl px-6">
            <AccordionTrigger className="hover:no-underline font-bold text-foreground">
              {t("about.faq.q1.question")}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
              {t("about.faq.q1.answer")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2" className="border border-border bg-card rounded-2xl px-6">
            <AccordionTrigger className="hover:no-underline font-bold text-foreground">
              {t("about.faq.q2.question")}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
              {t("about.faq.q2.answer")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3" className="border border-border bg-card rounded-2xl px-6">
            <AccordionTrigger className="hover:no-underline font-bold text-foreground">
              {t("about.faq.q3.question")}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
              {t("about.faq.q3.answer")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-4" className="border border-border bg-card rounded-2xl px-6">
            <AccordionTrigger className="hover:no-underline font-bold text-foreground">
              {t("about.faq.q4.question")}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
              {t("about.faq.q4.answer")}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-5" className="border border-border bg-card rounded-2xl px-6">
            <AccordionTrigger className="hover:no-underline font-bold text-foreground">
              {t("about.faq.q5.question")}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
              {t("about.faq.q5.answer")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}

function ContactCard({ icon, title, content, subtitle }: { icon: React.ReactNode; title: string; content: string; subtitle: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="flex flex-col items-center text-center p-6 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-all"
    >
      <div className="mb-4 p-3 bg-primary/5 rounded-2xl">{icon}</div>
      <h3 className="font-display font-semibold text-sm text-muted-foreground mb-1">{title}</h3>
      <div className="font-display text-lg font-bold text-foreground mb-1">{content}</div>
      <span className="text-xs text-muted-foreground/80">{subtitle}</span>
    </motion.div>
  );
}

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
          Established in 2007
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-4 font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl"
        >
          Our Story & <span className="bg-gradient-to-r from-primary to-[#fd7e14] bg-clip-text text-transparent">Values</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-lg text-muted-foreground leading-relaxed"
        >
          Simba Supermarket has been a cornerstone of Kigali's community since 2007, pioneering the modern retail experience in Rwanda. We are dedicated to bringing you the freshest ingredients, premium products, and exceptional customer service.
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
          <h2 className="font-display text-2xl font-bold mb-4">Our History</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Founded in 2007 as a single, family-oriented supermarket in Nyarugenge, Simba Supermarket set out with a vision to deliver a standardized, hygienic, and affordable grocery shopping environment. Over the last two decades, Simba has grown to become the largest and most trusted retail supermarket network in Kigali, operating multiple branches equipped to serve thousands of families daily.
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
          <h2 className="font-display text-2xl font-bold mb-4">Our Commitment</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            We are committed to empowering local farmers and manufacturers across Rwanda. By sourcing fresh agricultural produce directly from Kigali's rural cooperatives, we guarantee the shortest time from field to store shelves. Quality assurance, strict hygiene practices, and customer-first service form the core DNA of Simba.
          </p>
        </motion.div>
      </div>

      {/* Contact Section */}
      <section className="mb-20">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold">Get In Touch</h2>
          <p className="mt-2 text-muted-foreground">We are here to help you 24/7. Reach out through our official support lines.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          <ContactCard
            icon={<Phone className="h-6 w-6 text-primary" />}
            title="Local Phone Lines"
            content="+250 788 000 000"
            subtitle="Available: 07:00 AM – 10:00 PM"
          />
          <ContactCard
            icon={<Mail className="h-6 w-6 text-primary" />}
            title="Customer Support Email"
            content="info@Simbasupermarket.rw"
            subtitle="Response within 24 hours"
          />
          <ContactCard
            icon={<MapPin className="h-6 w-6 text-primary" />}
            title="Headquarters Office"
            content="Centenary House, Kiyovu"
            subtitle="Kigali, Rwanda"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto mb-12">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="mt-2 text-muted-foreground">Find quick answers to common questions about our services.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="faq-1" className="border border-border bg-card rounded-2xl px-6">
            <AccordionTrigger className="hover:no-underline font-bold text-foreground">
              Do you deliver on public holidays?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
              Yes, we deliver 365 days a year, including public holidays. Delivery schedules on public holidays typically run between 09:00 AM and 06:00 PM. Any specific holiday updates are posted via our in-app notification center.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-2" className="border border-border bg-card rounded-2xl px-6">
            <AccordionTrigger className="hover:no-underline font-bold text-foreground">
              Can I return fresh vegetables or dairy?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
              To guarantee the highest food safety and hygiene standard, fresh vegetables, fruits, meat, and dairy items cannot be returned after delivery. For shelf-stable packaged goods, returns are accepted within 48 hours with original receipt proof.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-3" className="border border-border bg-card rounded-2xl px-6">
            <AccordionTrigger className="hover:no-underline font-bold text-foreground">
              What are the delivery areas and charges?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
              We deliver to all districts of Kigali (Gasabo, Kicukiro, Nyarugenge). Delivery fees range from 1,000 RWF to 2,000 RWF depending on your exact neighborhood. You can view the exact shipping fee breakdown in the delivery selector during checkout.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-4" className="border border-border bg-card rounded-2xl px-6">
            <AccordionTrigger className="hover:no-underline font-bold text-foreground">
              What payment methods do you support?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
              We support MTN Mobile Money (MoMo), credit/debit card payments, and Cash on Delivery (CoD). You can choose your preferred method at the final checkout screen.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="faq-5" className="border border-border bg-card rounded-2xl px-6">
            <AccordionTrigger className="hover:no-underline font-bold text-foreground">
              How long does pickup collection take?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
              Pickup orders are generally prepared and ready for collection within 45 minutes of placement. You will receive an SMS and email notification when your package is ready at your selected Simba branch.
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

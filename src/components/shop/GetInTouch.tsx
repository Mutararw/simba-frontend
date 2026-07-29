import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  Sparkles,
  Gift,
  Heart,
  CheckCircle2,
  X,
  User,
  Mail,
  MessageSquare,
} from "lucide-react";

type FormState = "box" | "form" | "thanks";

export function GetInTouch() {
  const { t } = useTranslation();
  const [state, setState] = useState<FormState>("box");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setState("thanks");
    // Clear after showing thank you
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setState("box");
    }, 4000);
  };

  return (
    <section className="relative overflow-hidden bg-[#fd7e14] py-20 md:py-28 text-white shadow-md">
      <div className="container relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <img
            src="https://www.simbaonlineshopping.com/images/simbaheaderM.png"
            alt="Simba Logo"
            className="h-12 md:h-16 object-contain mx-auto mb-6 brightness-0 invert"
          />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold mb-4"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {t("contact.badge")}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-3xl font-extrabold tracking-tight md:text-5xl lg:text-6xl mb-4"
        >
          {t("contact.title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-base md:text-lg text-white/80 leading-relaxed mb-10"
        >
          {t("contact.subtitle")}
        </motion.p>

        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-xl"
        >
          <AnimatePresence mode="wait">
            {state === "box" && (
              <motion.div
                key="surprise-box"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                onClick={() => setState("form")}
                className="group relative cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-white/30 bg-white/10 p-10 md:p-14 transition-all duration-500 hover:bg-white/20">
                  <div className="absolute top-4 right-6 text-white/40">
                    <Sparkles className="h-6 w-6 animate-pulse" />
                  </div>
                  <div className="absolute bottom-4 left-6 text-white/40">
                    <Heart className="h-5 w-5 animate-pulse" style={{ animationDelay: "0.5s" }} />
                  </div>

                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [0, -3, 3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-6 inline-flex"
                  >
                    <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white text-[#fd7e14] shadow-lg">
                      <Gift className="h-10 w-10" />
                    </div>
                  </motion.div>

                  <h3 className="font-display text-xl md:text-2xl font-bold mb-2">
                    {t("contact.boxTitle")}
                  </h3>
                  <p className="text-sm text-white/70">
                    {t("contact.boxSubtitle")}
                  </p>

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                </div>
              </motion.div>
            )}

            {state === "form" && (
              <motion.div
                key="contact-form"
                initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-3xl bg-white text-[#fd7e14] shadow-2xl">
                  <div className="flex items-center justify-between border-b border-[#fd7e14]/10 bg-[#fd7e14]/5 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#fd7e14] text-white">
                        <MessageSquare className="h-4.5 w-4.5" />
                      </div>
                      <div className="text-left">
                        <p className="font-display text-sm font-bold text-[#fd7e14]">{t("contact.formTitle")}</p>
                        <p className="text-xs text-[#fd7e14]/60">{t("contact.formSubtitle")}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setState("box")}
                      className="grid h-8 w-8 place-items-center rounded-lg text-[#fd7e14]/50 hover:text-[#fd7e14] hover:bg-[#fd7e14]/10 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 md:p-8">
                    <div className="relative group">
                      <label className="mb-1.5 block text-left text-xs font-semibold text-[#fd7e14]/70 uppercase tracking-wider">
                        {t("contact.nameLabel")}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#fd7e14]/30 group-focus-within:text-[#fd7e14] transition-colors" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Jean Pierre"
                          required
                          className="w-full rounded-xl border border-[#fd7e14]/20 bg-[#fd7e14]/5 py-3 pl-10 pr-4 text-sm text-[#fd7e14] placeholder:text-[#fd7e14]/30 focus:outline-none focus:ring-2 focus:ring-[#fd7e14]/30 focus:border-[#fd7e14] transition-all"
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="mb-1.5 block text-left text-xs font-semibold text-[#fd7e14]/70 uppercase tracking-wider">
                        {t("contact.emailLabel")}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#fd7e14]/30 group-focus-within:text-[#fd7e14] transition-colors" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@email.com"
                          className="w-full rounded-xl border border-[#fd7e14]/20 bg-[#fd7e14]/5 py-3 pl-10 pr-4 text-sm text-[#fd7e14] placeholder:text-[#fd7e14]/30 focus:outline-none focus:ring-2 focus:ring-[#fd7e14]/30 focus:border-[#fd7e14] transition-all"
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="mb-1.5 block text-left text-xs font-semibold text-[#fd7e14]/70 uppercase tracking-wider">
                        {t("contact.messageLabel")}
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share your experience, suggestions, or feedback..."
                        required
                        rows={4}
                        className="w-full resize-none rounded-xl border border-[#fd7e14]/20 bg-[#fd7e14]/5 py-3 px-4 text-sm text-[#fd7e14] placeholder:text-[#fd7e14]/30 focus:outline-none focus:ring-2 focus:ring-[#fd7e14]/30 focus:border-[#fd7e14] transition-all"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative flex items-center justify-center gap-2 rounded-xl bg-[#fd7e14] py-3.5 px-6 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        {t("contact.submit")}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}

            {state === "thanks" && (
              <motion.div
                key="thank-you"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-3xl bg-white/10 border border-white/20 p-12 md:p-16">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                        x: (Math.random() - 0.5) * 200,
                        y: (Math.random() - 0.5) * 200,
                      }}
                      transition={{ duration: 1.5, delay: i * 0.08, ease: "easeOut" }}
                      className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                      style={{ background: i % 3 === 0 ? "white" : i % 3 === 1 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)" }}
                    />
                  ))}

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    className="mb-6 inline-flex"
                  >
                    <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-[#fd7e14] shadow-xl">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-display text-2xl md:text-3xl font-extrabold mb-3"
                  >
                    {t("contact.thanksTitle")}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/70 text-sm md:text-base"
                  >
                    {t("contact.thanksSubtitle")}
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

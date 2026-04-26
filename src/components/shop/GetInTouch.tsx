import { useState, useRef } from "react";
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
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="container relative z-10 flex flex-col items-center text-center">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold text-primary mb-6">
            <MessageCircle className="h-3.5 w-3.5" />
            Get In Touch
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-3xl font-extrabold tracking-tight md:text-5xl lg:text-6xl mb-6"
        >
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            We'd Love to{" "}
          </span>
          <span className="bg-gradient-to-r from-primary to-[#fd7e14] bg-clip-text text-transparent">
            Hear From You
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed mb-12"
        >
          Did you face any challenges while shopping with us? Did our service make your day better? 
          Or maybe you have some advice to help us improve? Whatever it is —{" "}
          <span className="font-semibold text-primary">we want to know!</span>{" "}
          Your feedback shapes the future of Simba.
        </motion.p>

        {/* The Surprise Box / Form / Thank You */}
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-xl"
        >
          <AnimatePresence mode="wait">
            {/* ── SURPRISE BOX ── */}
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
                {/* Outer glow ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/40 via-[#fd7e14]/30 to-primary/40 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />

                <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-card via-card to-primary/[0.04] p-10 md:p-14 transition-all duration-500 group-hover:border-primary/60 group-hover:shadow-[0_0_60px_-15px_hsl(var(--primary)/0.3)]">
                  {/* Floating sparkles */}
                  <div className="absolute top-4 right-6 text-primary/20 group-hover:text-primary/50 transition-colors duration-500">
                    <Sparkles className="h-6 w-6 animate-pulse" />
                  </div>
                  <div className="absolute bottom-4 left-6 text-[#fd7e14]/20 group-hover:text-[#fd7e14]/50 transition-colors duration-500">
                    <Heart className="h-5 w-5 animate-pulse" style={{ animationDelay: "0.5s" }} />
                  </div>

                  {/* Gift icon */}
                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, -3, 3, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mb-6 inline-flex"
                  >
                    <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow duration-500">
                      <Gift className="h-10 w-10" />
                    </div>
                  </motion.div>

                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    Tap to Share Your Thoughts
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                    A little surprise awaits inside — your voice matters to us! 💬
                  </p>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                </div>
              </motion.div>
            )}

            {/* ── CONTACT FORM ── */}
            {state === "form" && (
              <motion.div
                key="contact-form"
                initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
              >
                {/* Glow background */}
                <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-r from-primary/20 via-[#fd7e14]/10 to-primary/20 blur-2xl opacity-50" />

                <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-primary/5">
                  {/* Header bar */}
                  <div className="flex items-center justify-between border-b border-border bg-primary/[0.03] px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white">
                        <MessageSquare className="h-4.5 w-4.5" />
                      </div>
                      <div className="text-left">
                        <p className="font-display text-sm font-bold text-foreground">Send Us Feedback</p>
                        <p className="text-xs text-muted-foreground">We read every single message</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setState("box")}
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Form body */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 md:p-8">
                    {/* Name */}
                    <div className="relative group">
                      <label className="mb-1.5 block text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Your Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Jean Pierre"
                          required
                          className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* Email (optional) */}
                    <div className="relative group">
                      <label className="mb-1.5 block text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Email <span className="text-muted-foreground/40 normal-case">(optional)</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@email.com"
                          className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className="relative group">
                      <label className="mb-1.5 block text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Your Message
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share your experience, suggestions, or feedback..."
                        required
                        rows={4}
                        className="w-full resize-none rounded-xl border border-border bg-background py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Feedback
                      </span>
                      {/* Hover shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ── THANK YOU ── */}
            {state === "thanks" && (
              <motion.div
                key="thank-you"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-r from-primary/30 via-[#fd7e14]/20 to-primary/30 blur-2xl opacity-60" />

                <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-12 md:p-16">
                  {/* Confetti-like dots */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        opacity: 0,
                        scale: 0,
                        x: 0,
                        y: 0,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                        x: (Math.random() - 0.5) * 200,
                        y: (Math.random() - 0.5) * 200,
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.08,
                        ease: "easeOut",
                      }}
                      className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                      style={{
                        background: i % 3 === 0 ? "hsl(152, 72%, 25%)" : i % 3 === 1 ? "#fd7e14" : "#fbbf24",
                      }}
                    />
                  ))}

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    className="mb-6 inline-flex"
                  >
                    <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl shadow-primary/30">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-display text-2xl md:text-3xl font-extrabold text-foreground mb-3"
                  >
                    Thank You for Your Feedback! 🎉
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground text-sm md:text-base"
                  >
                    Your message means the world to us. We'll use it to make Simba even better!
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

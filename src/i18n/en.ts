const en = {
  brand: { name: "Simba", tagline: "Rwanda's Online Supermarket" },
  nav: { home: "Home", browse: "Browse", branches: "Branches", cart: "Cart", login: "Sign in", logout: "Sign out", account: "Account" },
  hero: {
    title: "Fresh, Quality Groceries. Ready When You Are.",
    subtitle: "Experience Kigali's premium supermarket from the comfort of your home. Shop online and collect at your nearest Simba branch in just 45 minutes. Fresh, fast, and always trusted.",
    cta: "Start Shopping",
    secondary: "Explore Branches",
  },
  perks: {
    pickup: { title: "45-min pick-up", body: "Order now, collect from your branch in under an hour." },
    fresh: { title: "Fresh products", body: "Daily restocked across 9 Kigali branches." },
    momo: { title: "MoMo payment", body: "Pay a small deposit on Mobile Money to confirm." },
    branches: { title: "9 branches", body: "From Remera to Nyamirambo, we are around the corner." },
  },
  categories: { title: "Shop by category", count_one: "{{count}} item", count_other: "{{count}} items" },
  search: {
    placeholder: "Search or ask: \"I need something for breakfast\"",
    askButton: "Ask AI",
    aiTitle: "AI suggestions",
    empty: "Try searching for milk, rice, or shampoo.",
  },
  product: { add: "Add to cart", outOfStock: "Out of stock", inStock: "In stock", related: "You might also like" },
  cart: {
    title: "Your cart",
    empty: "Your cart is empty.",
    emptyCta: "Browse products",
    subtotal: "Subtotal",
    deposit: "MoMo deposit",
    total: "Total today",
    checkout: "Continue to pick-up",
    remove: "Remove",
  },
  branch: {
    title: "Choose your pick-up branch",
    subtitle: "All 9 Simba branches across Kigali. Pick the one closest to you.",
    select: "Select",
    selected: "Selected",
    pickupTime: "Pick-up time",
    continue: "Continue to payment",
    reviews_one: "{{count}} review",
    reviews_other: "{{count}} reviews",
  },
  checkout: {
    title: "Confirm your order",
    summary: "Order summary",
    momoTitle: "Pay deposit with MoMo",
    momoNote: "A small non-refundable deposit secures your order so the branch can start preparing.",
    phone: "MoMo phone number",
    pay: "Pay {{amount}} & confirm",
    paying: "Processing payment…",
    mockNote: "Mock payment for demo — no real charge.",
  },
  confirm: {
    title: "Order confirmed!",
    body: "Your order is on its way to {{branch}}. We'll send a notification when it's ready.",
    code: "Pick-up code",
    eta: "Ready around {{time}}",
    home: "Back to home",
    review: "Leave a review",
  },
  auth: {
    signin: "Sign in",
    signup: "Create account",
    forgot: "Forgot password?",
    reset: "Reset password",
    email: "Email",
    password: "Password",
    name: "Full name",
    google: "Continue with Google",
    or: "or",
    haveAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    resetSent: "If an account exists, we've sent a reset link.",
    googleNote: "Google sign-in will be wired with Better Auth on export.",
  },
  reviews: { title: "Rate your pick-up", placeholder: "How was your experience?", submit: "Submit review", thanks: "Thanks for your feedback!" },
  lang: { en: "English", rw: "Kinyarwanda", fr: "Français" },
  footer: {
    rights: "All rights reserved.",
    built: "Built for A2SV Rwanda — Simba 2.0.",
    description: "Kigali's most trusted supermarket, now at your fingertips. Freshness and quality delivered in 45 minutes.",
    sections: {
      shop: {
        title: "Shop",
        categories: {
          food: "Food & Groceries",
          drinks: "Alcoholic Drinks",
          baby: "Baby Products",
          cleaning: "Cleaning & Sanitary",
          electronics: "Kitchenware & Electronics"
        }
      },
      company: {
        title: "Company",
        about: "About Us",
        branches: "Our Branches",
        careers: "Careers",
        press: "Press"
      },
      support: {
        title: "Support",
        help: "Help Center",
        contact: "Contact Us",
        pickup: "Pick-up Info",
        returns: "Returns"
      },
      newsletter: {
        title: "Stay Fresh",
        subtitle: "Join our newsletter for weekly deals.",
        placeholder: "Enter your email",
        button: "Subscribe"
      },
      legal: {
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        cookies: "Cookie Policy"
      }
    }
  },
};
export default en;
export type Dict = typeof en;
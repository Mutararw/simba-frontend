import type { Dict } from "./en";
const fr: Dict = {
  brand: { name: "Simba", tagline: "Le supermarché en ligne du Rwanda" },
  nav: { home: "Accueil", browse: "Parcourir", branches: "Magasins", cart: "Panier", login: "Connexion", logout: "Déconnexion", account: "Compte" },
  hero: {
    title: "Vos courses Simba, prêtes en 45 minutes.",
    subtitle: "Commandez en ligne, retirez dans votre magasin Simba à Kigali — frais, rapide, fiable.",
    cta: "Commencer mes achats",
    secondary: "Trouver un magasin",
  },
  perks: {
    pickup: { title: "Retrait en 45 min", body: "Commandez maintenant, récupérez en moins d'une heure." },
    fresh: { title: "Produits frais", body: "Réapprovisionnés chaque jour dans 9 magasins." },
    momo: { title: "Paiement MoMo", body: "Un petit acompte Mobile Money confirme la commande." },
    branches: { title: "9 magasins", body: "De Remera à Nyamirambo, toujours près de vous." },
  },
  categories: { title: "Acheter par catégorie", count_one: "{{count}} article", count_other: "{{count}} articles" },
  search: {
    placeholder: "Cherchez ou demandez : \"Je veux du petit-déjeuner\"",
    askButton: "Demander à l'IA",
    aiTitle: "Suggestions IA",
    empty: "Essayez « lait », « riz » ou « shampoing ».",
  },
  product: { add: "Ajouter au panier", outOfStock: "Rupture", inStock: "En stock", related: "Vous aimerez aussi" },
  cart: {
    title: "Votre panier",
    empty: "Votre panier est vide.",
    emptyCta: "Voir les produits",
    subtotal: "Sous-total",
    deposit: "Acompte MoMo",
    total: "À payer aujourd'hui",
    checkout: "Continuer vers le retrait",
    remove: "Retirer",
  },
  branch: {
    title: "Choisissez votre magasin de retrait",
    subtitle: "Les 9 magasins Simba de Kigali. Choisissez le plus proche.",
    select: "Choisir",
    selected: "Choisi",
    pickupTime: "Heure de retrait",
    continue: "Continuer vers le paiement",
    reviews_one: "{{count}} avis",
    reviews_other: "{{count}} avis",
  },
  checkout: {
    title: "Confirmer votre commande",
    summary: "Récapitulatif",
    momoTitle: "Payer l'acompte par MoMo",
    momoNote: "Un petit acompte non remboursable garantit que le magasin commence à préparer.",
    phone: "Numéro MoMo",
    pay: "Payer {{amount}} et confirmer",
    paying: "Paiement en cours…",
    mockNote: "Paiement fictif pour la démo — aucun débit réel.",
  },
  confirm: {
    title: "Commande confirmée !",
    body: "Votre commande est en route vers {{branch}}. Nous vous notifierons quand elle sera prête.",
    code: "Code de retrait",
    eta: "Prête vers {{time}}",
    home: "Retour à l'accueil",
    review: "Laisser un avis",
  },
  auth: {
    signin: "Se connecter",
    signup: "Créer un compte",
    forgot: "Mot de passe oublié ?",
    reset: "Réinitialiser",
    email: "Email",
    password: "Mot de passe",
    name: "Nom complet",
    google: "Continuer avec Google",
    or: "ou",
    haveAccount: "Déjà un compte ?",
    noAccount: "Pas de compte ?",
    resetSent: "Si un compte existe, un lien de réinitialisation a été envoyé.",
    googleNote: "La connexion Google sera branchée avec Better Auth.",
  },
  reviews: { title: "Notez votre retrait", placeholder: "Comment s'est passée l'expérience ?", submit: "Envoyer", thanks: "Merci pour votre avis !" },
  lang: { en: "Anglais", rw: "Kinyarwanda", fr: "Français" },
  footer: {
    rights: "Tous droits réservés.",
    built: "Construit pour A2SV Rwanda — Simba 2.0.",
    description: "Le supermarché le plus fiable de Kigali, désormais à portée de main. Fraîcheur et qualité livrées en 45 minutes.",
    sections: {
      shop: {
        title: "Achat",
        categories: {
          food: "Alimentation et épicerie",
          drinks: "Boissons alcoolisées",
          baby: "Produits pour bébés",
          cleaning: "Nettoyage et hygiène",
          electronics: "Cuisine et électronique"
        }
      },
      company: {
        title: "Entreprise",
        about: "À propos de nous",
        branches: "Nos magasins",
        careers: "Carrières",
        press: "Presse"
      },
      support: {
        title: "Support",
        help: "Centre d'aide",
        contact: "Contactez-nous",
        pickup: "Infos retrait",
        returns: "Retours"
      },
      newsletter: {
        title: "Restez au courant",
        subtitle: "Inscrivez-vous à notre newsletter pour les offres hebdomadaires.",
        placeholder: "Entrez votre email",
        button: "S'abonner"
      },
      legal: {
        privacy: "Politique de confidentialité",
        terms: "Conditions d'utilisation",
        cookies: "Politique des cookies"
      }
    }
  },
};
export default fr;
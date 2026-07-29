import type { Dict } from "./en";
const fr: Dict = {
  brand: { name: "Simba", tagline: "Le supermarché en ligne du Rwanda" },
  nav: { 
    home: "Accueil", 
    browse: "Produits", 
    products: "Produits", 
    branches: "Magasins", 
    cart: "Panier", 
    login: "Connexion", 
    logout: "Déconnexion", 
    account: "Compte",
    deals: "Offres",
    wishlist: "Liste de souhaits",
    notifications: "Notifications",
    dashboard: "Tableau de bord",
    orders: "Mes commandes",
    profile: "Profil"
  },
  hero: {
    title: "Produits frais et de qualité. Prêts quand vous l'êtes.",
    subtitle: "Découvrez le supermarché premium de Kigali depuis le confort de votre maison. Achetez en ligne et retirez dans votre magasin Simba en seulement 45 minutes. Frais, rapide et toujours fiable.",
    cta: "Commencer mes achats",
    secondary: "Trouver un magasin",
    stats: {
      time: "45 min",
      label: "Temps moyen de retrait",
    },
  },
  perks: {
    pickup: { title: "Retrait en 45 min", body: "Commandez maintenant, récupérez en moins d'une heure." },
    fresh: { title: "Produits frais", body: "Réapprovisionnés chaque jour dans 9 magasins." },
    momo: { title: "Paiement MoMo", body: "Un petit acompte Mobile Money confirme la commande." },
    branches: { title: "9 magasins", body: "De Remera à Nyamirambo, toujours près de vous." },
  },
  home: {
    popular: "Populaire cette semaine",
    seeAll: "Voir tout →",
    happyCustomers: "Plus de 10 000 clients satisfaits",
    verified: "Client vérifié",
    liked: "Aimé",
    helpful: "Utile",
  },
  categories: { 
    title: "Acheter par catégorie", 
    count_one: "{{count}} article", 
    count_other: "{{count}} articles",
    names: {
      cosmetics_and_personal_care: "Cosmétiques et soins personnels",
      sports_and_wellness: "Sports et bien-être",
      baby_products: "Produits pour bébés",
      kitchenware_and_electronics: "Cuisine et électronique",
      food_products: "Produits alimentaires",
      alcoholic_drinks: "Boissons alcoolisées",
      general: "Général",
      cleaning_and_sanitary: "Nettoyage et hygiène",
      kitchen_storage: "Rangement cuisine",
      household: "Maison",
      pet_care: "Animaux"
    }
  },
  search: {
    placeholder: "Cherchez ou demandez : \"Je veux du petit-déjeuner\"",
    askButton: "Demander à l'IA",
    aiTitle: "Suggestions IA",
    empty: "Essayez « lait », « riz » ou « shampoing ».",
    listening: "Écoute...",
    response: "Réponse de l'IA",
    clear: "Effacer les résultats",
    autoAdd: "Ajouté automatiquement {{count}} article(s) au panier!",
    voiceError: "Désolé, je n'ai pas bien entendu.",
    voiceSupport: "L'entrée vocale n'est pas supportée."
  },
  product: { 
    add: "Ajouter au panier", 
    outOfStock: "Rupture", 
    inStock: "En stock", 
    related: "Vous aimerez aussi",
    description: "Description du produit",
    reviews: "Avis clients",
    writeReview: "Écrire un avis",
    quantity: "Quantité"
  },
  cart: {
    title: "Votre panier",
    empty: "Votre panier est vide.",
    emptyCta: "Voir les produits",
    subtotal: "Sous-total",
    deposit: "Acompte MoMo",
    total: "À payer aujourd'hui",
    checkout: "Continuer vers le retrait",
    remove: "Retirer",
    upsell: "Les clients ont aussi acheté"
  },
  wishlist: {
    title: "Ma Liste de souhaits",
    subtitle: "Produits enregistrés pour plus tard.",
    empty: "Votre liste est vide.",
    moveAll: "Tout ajouter au panier",
    explore: "Explorer les produits"
  },
  promotions: {
    title: "Promotions et Offres",
    subtitle: "Offres limitées pour vous.",
    off: "DE RÉDUCTION",
    endsIn: "Finit dans"
  },
  orders: {
    title: "Mes Commandes",
    reorder: "Commander à nouveau",
    status: "Statut",
    date: "Date",
    total: "Total",
    track: "Suivre"
  },
  checkout: {
    title: "Confirmer votre commande",
    summary: "Récapitulatif",
    pickup: "Retrait",
    delivery: "Livraison",
    pickupInfo: "Informations de retrait",
    deliveryInfo: "Informations de livraison",
    changeBranch: "Changer de magasin",
    chooseBranch: "Choisir un magasin",
    district: "District",
    zone: "Zone",
    address: "Adresse spécifique / Appt / Maison No",
    timeSlot: "Créneau de livraison préféré",
    deliveryFee: "Frais de livraison",
    momoTitle: "Payer avec MoMo",
    momoNote: "Entrez votre numéro pour recevoir l'invitation de paiement.",
    phone: "Numéro MoMo",
    pay: "Payer {{amount}} et confirmer",
    paying: "Paiement en cours…",
    mockNote: "Paiement fictif pour la démo — aucun débit réel.",
    paymentMethod: "Choisir le mode de paiement",
    momo: "MoMo",
    card: "Carte",
    cash: "Espèces",
    cardTitle: "Payer par Carte",
    cardNote: "Entrez vos coordonnées bancaires en sécurité.",
    cardNumber: "Numéro de carte",
    expiry: "Expiration",
    cvv: "CVV",
    cashTitle: "Payer à la réception",
    cashNote: "Vous paierez le montant total à la réception de votre commande.",
    confirm: "Confirmer la commande",
    pickupAt: "Retrait à",
    at: "à",
  },
  confirm: {
    title: "Commande confirmée !",
    body: "Votre commande est en route vers {{branch}}. Nous vous notifierons quand elle sera prête.",
    code: "Code de retrait",
    eta: "Prête vers {{time}}",
    home: "Retour à l'accueil",
    review: "Laisser un avis",
    pickup: "Retrait",
  },
  auth: {
    signin: "Se connecter",
    signup: "Créer un compte",
    forgot: "Mot de passe oublié ?",
    reset: "Réinitialiser",
    email: "Email",
    password: "Mot de passe",
    name: "Nom complet",
    phone: "Numéro de téléphone",
    google: "Continuer avec Google",
    or: "ou",
    haveAccount: "Déjà un compte ?",
    noAccount: "Pas de compte ?",
    resetSent: "Si un compte existe, un lien de réinitialisation a été envoyé.",
    googleNote: "La connexion Google est sécurisée et rapide.",
  },
  lang: { en: "Anglais", rw: "Kinyarwanda", fr: "Français", ar: "Arabe", zh: "Chinois" },
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
        button: "S'abonner",
        success: "Inscription réussie!"
      },
      legal: {
        privacy: "Politique de confidentialité",
        terms: "Conditions d'utilisation",
        cookies: "Politique des cookies"
      },
      apps: {
        download: "Télécharger sur",
        get: "Disponible sur",
        appStore: "App Store",
        playStore: "Google Play",
      }
    }
  },
};
export default fr;

import type { Dict } from "./en";
const rw: Dict = {
  brand: { name: "Simba", tagline: "Isupermarket ya Rwanda kuri Internet" },
  nav: { home: "Ahabanza", browse: "Reba ibicuruzwa", branches: "Amaduka", cart: "Igare", login: "Injira", logout: "Sohoka", account: "Konti" },
  hero: {
    title: "Ibiribwa bya Simba, biteguye mu minota 45.",
    subtitle: "Tumiza kuri internet, ufate mu iduka rya Simba ririmo hafi yawe i Kigali — bishya, byihuse, byizewe.",
    cta: "Tangira kugura",
    secondary: "Shaka iduka",
  },
  perks: {
    pickup: { title: "Gufata mu minota 45", body: "Tumiza none, ufate mu iduka mu masaha make." },
    fresh: { title: "Ibicuruzwa bishya", body: "Bishyirwaho buri munsi mu maduka 9." },
    momo: { title: "Kwishyura na MoMo", body: "Ishyura akaguzi gato kuri MoMo kugira ngo wemeze." },
    branches: { title: "Amaduka 9", body: "Kuva Remera kugeza Nyamirambo, turi hafi yawe." },
  },
  categories: { title: "Hitamo ibyiciro", count_one: "ikintu {{count}}", count_other: "ibintu {{count}}" },
  search: {
    placeholder: "Shakisha cyangwa ubaze: \"Nshaka ibyo gusangira\"",
    askButton: "Baza AI",
    aiTitle: "Inama za AI",
    empty: "Gerageza gushaka amata, umuceri cyangwa shampoo.",
  },
  product: { add: "Shyira mu igare", outOfStock: "Birashize", inStock: "Birahari", related: "Ushobora kandi gukunda" },
  cart: {
    title: "Igare ryawe",
    empty: "Igare ryawe ntakintu kirimo.",
    emptyCta: "Reba ibicuruzwa",
    subtotal: "Igiteranyo",
    deposit: "Akaguzi ka MoMo",
    total: "Ihiyishyure none",
    checkout: "Komeza ku gufata",
    remove: "Kuraho",
  },
  branch: {
    title: "Hitamo iduka uzafateramo",
    subtitle: "Amaduka yose 9 ya Simba i Kigali. Hitamo iri hafi yawe.",
    select: "Hitamo",
    selected: "Byatoranyijwe",
    pickupTime: "Igihe cyo gufata",
    continue: "Komeza ku kwishyura",
    reviews_one: "icyitegererezo 1",
    reviews_other: "ibitekerezo {{count}}",
  },
  checkout: {
    title: "Emeza ikurikira ryawe",
    summary: "Incamake y'ikurikira",
    momoTitle: "Ishyura akaguzi na MoMo",
    momoNote: "Akaguzi gato katasubizwa kemeza ko iduka ritangira gutegura.",
    phone: "Numero ya MoMo",
    pay: "Ishyura {{amount}} wemeze",
    paying: "Kwishyura biragenda…",
    mockNote: "Igeragezwa ry'ubwishyu — nta mafaranga afatwa.",
  },
  confirm: {
    title: "Ikurikira ryemejwe!",
    body: "Ikurikira ryawe rigeze i {{branch}}. Tuzakubwira igihe biteguye.",
    code: "Kode yo gufata",
    eta: "Biteguye ahagana saa {{time}}",
    home: "Subira ahabanza",
    review: "Tanga igitekerezo",
  },
  auth: {
    signin: "Injira",
    signup: "Fungura konti",
    forgot: "Wibagiwe ijambobanga?",
    reset: "Hindura ijambobanga",
    email: "Imeli",
    password: "Ijambobanga",
    name: "Amazina yose",
    google: "Komeza na Google",
    or: "cyangwa",
    haveAccount: "Ufite konti?",
    noAccount: "Nta konti ufite?",
    resetSent: "Niba konti ihari, twoherereje urubuga rwo guhindura.",
    googleNote: "Kwinjira na Google bizashyirwaho na Better Auth.",
  },
  reviews: { title: "Tanga amanota ku gufata", placeholder: "Wabonye iki?", submit: "Ohereza", thanks: "Murakoze ku gitekerezo!" },
  lang: { en: "Icyongereza", rw: "Ikinyarwanda", fr: "Igifaransa" },
  footer: {
    rights: "Uburenganzira bwose burabitswe.",
    built: "Yubatswe kuri A2SV Rwanda — Simba 2.0.",
    description: "Isupermarket ya Kigali yizewe cyane, ubu iri mu ntoki zawe. Ibishya n'ubuziranenge biboneka mu minota 45.",
    sections: {
      shop: {
        title: "Gura",
        categories: {
          food: "Ibiribwa n'ibikenerwa",
          drinks: "Ibinyobwa bisindisha",
          baby: "Ibikenerwa n'abana",
          cleaning: "Ibikoresho by'isuku",
          electronics: "Ibikoresho byo mu gikoni n'ikoranabuhanga"
        }
      },
      company: {
        title: "Ikigo",
        about: "Turi ba nde?",
        branches: "Amaduka yacu",
        careers: "Akazi",
        press: "Amakuru"
      },
      support: {
        title: "Ubufasha",
        help: "Ahabanza h'ubufasha",
        contact: "Twandikire",
        pickup: "Amakuru yo gufata",
        returns: "Gusubiza ibicuruzwa"
      },
      newsletter: {
        title: "Horana amakuru",
        subtitle: "Injira mu banyamakuru bacu ubone poromosiyo buri cyumweru.",
        placeholder: "Shyiramo imeli yawe",
        button: "Injira"
      },
      legal: {
        privacy: "Amategeko y'ibanga",
        terms: "Amategeko n'amabwiriza",
        cookies: "Amategeko ya cookies"
      }
    }
  },
};
export default rw;
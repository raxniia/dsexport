// Actualités du bandeau défilant.
// Source principale : table Supabase `trade_news` (ajout / modification sans redéployer).
// Ces éléments servent de secours si la base est vide ou injoignable.
// Règle : uniquement des informations publiées par une source officielle, avec le lien.

export type NewsCategory = "actualite" | "loi" | "procedure" | "institution" | "marche" | "evenement" | "operation";

export type NewsItem = {
  id: string;
  bulletin_date?: string; // date de la nshra (YYYY-MM-DD)
  published_at: string; // date de publication par la source
  summary_fr?: string | null;
  summary_ar?: string | null;
  summary_en?: string | null;
  is_official?: boolean;
  organisme: string;
  category: NewsCategory;
  title_fr: string;
  title_ar: string | null;
  title_en: string | null;
  source_label: string;
  url: string;
};

export const SEED_NEWS: NewsItem[] = [
  {
    id: "s1", published_at: "2026-10-19", organisme: "Ministère du Commerce extérieur", category: "evenement",
    title_fr: "Salon national des dattes du 29 au 31 octobre à Biskra",
    title_ar: "الصالون الوطني للتمور من 29 إلى 31 أكتوبر ببسكرة",
    title_en: "National Date Fair from 29 to 31 October in Biskra",
    is_official: true, source_label: "APS", url: "https://www.aps.dz/fr/economie/commerce-et-service/mvfjd65o-le-salon-national-des-dattes-du-29-au-31-octobre-a-biskra",
  },
  {
    id: "s2", published_at: "2026-09-24", organisme: "Ministère du Commerce extérieur", category: "operation",
    title_fr: "Lancement d’opérations d’exportation d’équipements électroniques et électroménagers depuis El Tarf, Sétif et Bordj Bou Arreridj",
    title_ar: "انطلاق عمليات تصدير تجهيزات إلكترونية وكهرومنزلية من الطارف وسطيف وبرج بوعريريج",
    title_en: "Export operations of electronic and household appliances launched from El Tarf, Sétif and Bordj Bou Arreridj",
    is_official: true, source_label: "APS", url: "https://www.aps.dz/fr/economie/commerce-et-service/muftcb3k-lancement-d-operations-d-exportation-d-equipements-electroniques-et-electromenagers-depuis-el-tarf-setif-et-bordj-bou-arreridj",
  },
  {
    id: "s3", published_at: "2026-09-21", organisme: "Port de Ténès", category: "operation",
    title_fr: "Exportation de plus de 15.000 tonnes de ciment et de clinker via le port de Ténès",
    title_ar: "تصدير أكثر من 15 ألف طن من الإسمنت والكلنكر عبر ميناء تنس",
    title_en: "Over 15,000 tonnes of cement and clinker exported via the port of Ténès",
    is_official: true, source_label: "APS", url: "https://www.aps.dz/fr/economie/commerce-et-service/mubc9zky-exportation-de-plus-de-15-000-tonnes-de-ciment-et-de-clinker-via-le-port-de-tenes",
  },
  {
    id: "s4", published_at: "2026-08-23", organisme: "CAGEX", category: "procedure",
    title_fr: "Délais de paiement entre 120 et 180 jours : la garantie CAGEX devient obligatoire pour les exportations hors hydrocarbures",
    title_ar: "آجال الدفع بين 120 و180 يومًا: ضمان CAGEX أصبح إلزاميًا لصادرات خارج المحروقات",
    title_en: "Payment terms of 120 to 180 days: CAGEX guarantee now mandatory for non-hydrocarbon exports",
    source_label: "TSA Algérie (note CAGEX)", url: "https://www.tsa-algerie.com/exportations-hors-hydrocarbures-lalgerie-instaure-une-nouvelle-obligation/",
  },
  {
    id: "s5", published_at: "2026-07-23", organisme: "Banque d’Algérie", category: "loi",
    title_fr: "Règlement n° 26-02 : rapatriement des recettes d’exportation sous 120 jours (180 jours maximum avec assurance-crédit à l’export)",
    title_ar: "النظام رقم 26-02: إعادة عائدات التصدير في أجل 120 يومًا (180 يومًا كحد أقصى مع تأمين قرض التصدير)",
    title_en: "Regulation No. 26-02: export proceeds to be repatriated within 120 days (180 days max with export credit insurance)",
    source_label: "Algérie Eco (JO n° 58)", url: "https://algerie-eco.com/2026/08/14/banque-dalgerie-nouvelles-regles-pour-le-rapatriement-des-devises-des-exportations-hors-hydrocarbures/",
  },
  {
    id: "s6", published_at: "2026-04-11", organisme: "Ministère du Commerce extérieur", category: "operation",
    title_fr: "Lancement d’opérations d’exportation de divers produits locaux vers plusieurs pays",
    title_ar: "انطلاق عمليات تصدير منتجات محلية متنوعة نحو عدة دول",
    title_en: "Export operations of various local products launched to several countries",
    is_official: true, source_label: "APS", url: "https://www.aps.dz/fr/economie/commerce-et-service/mnuql62i-lancement-d-operations-d-exportation-de-divers-produits-locaux-vers-plusieurs-pays",
  },
  {
    id: "s7", published_at: "2026-03-07", organisme: "Ministère du Commerce extérieur", category: "operation",
    title_fr: "Chargement de plus de 15.000 tonnes de fer à béton vers la Lituanie",
    title_ar: "شحن أكثر من 15 ألف طن من حديد الخرسانة نحو ليتوانيا",
    title_en: "Over 15,000 tonnes of rebar loaded for Lithuania",
    is_official: true, source_label: "APS", url: "https://www.aps.dz/fr/economie/commerce-et-service/mmgj8owx-chargement-de-plus-de-15-000-tonnes-de-fer-a-beton-vers-la-lituanie",
  },
];

const ORG: Record<string, { ar: string; en: string }> = {
  "Ministère du Commerce extérieur": { ar: "وزارة التجارة الخارجية", en: "Ministry of Foreign Trade" },
  "Ministère du Commerce": { ar: "وزارة التجارة", en: "Ministry of Commerce" },
  "Port de Ténès": { ar: "ميناء تنس", en: "Port of Ténès" },
  "Ports": { ar: "الموانئ", en: "Ports" },
  "Ministère des Finances": { ar: "وزارة المالية", en: "Ministry of Finance" },
  "Banque d’Algérie": { ar: "بنك الجزائر", en: "Bank of Algeria" },
  "Banque d'Algérie": { ar: "بنك الجزائر", en: "Bank of Algeria" },
  "Douanes algériennes": { ar: "الجمارك الجزائرية", en: "Algerian Customs" },
  "JORADP": { ar: "الجريدة الرسمية", en: "Official Journal" },
  "ALGEX": { ar: "الوكالة الوطنية لترقية التجارة الخارجية", en: "ALGEX" },
  "CACI": { ar: "الغرفة الجزائرية للتجارة والصناعة", en: "CACI" },
  "CAGEX": { ar: "CAGEX", en: "CAGEX" },
};

export function orgName(o: string, lang: "fr" | "ar" | "en") {
  return lang === "fr" ? o : ORG[o]?.[lang] || o;
}

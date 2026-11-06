import type { Lang } from "./i18n";
import { IMAGES } from "./site";

type L = Record<Lang, string>;

export const INCOTERMS: { code: string; name: L; seller: L; buyer: L; risk: L }[] = [
  {
    code: "EXW",
    name: { fr: "Ex Works — À l’usine", en: "Ex Works", ar: "تسليم في المصنع" },
    seller: { fr: "Met la marchandise à disposition dans ses locaux.", en: "Makes goods available at its premises.", ar: "يضع البضاعة تحت التصرف في مقره." },
    buyer: { fr: "Chargement, export, transport, assurance, import : tout.", en: "Loading, export, transport, insurance, import: everything.", ar: "الشحن، التصدير، النقل، التأمين، الاستيراد: كل شيء." },
    risk: { fr: "Dès la mise à disposition chez le vendeur.", en: "When goods are made available at the seller’s site.", ar: "عند وضع البضاعة تحت التصرف لدى البائع." },
  },
  {
    code: "FCA",
    name: { fr: "Free Carrier — Franco transporteur", en: "Free Carrier", ar: "تسليم للناقل" },
    seller: { fr: "Dédouane à l’export et remet au transporteur désigné.", en: "Clears for export and hands over to the named carrier.", ar: "يقوم بجمركة التصدير ويسلم للناقل المعيّن." },
    buyer: { fr: "Transport principal, assurance et import.", en: "Main carriage, insurance and import.", ar: "النقل الرئيسي، التأمين والاستيراد." },
    risk: { fr: "À la remise au transporteur.", en: "On delivery to the carrier.", ar: "عند التسليم للناقل." },
  },
  {
    code: "FOB",
    name: { fr: "Free On Board — Franco à bord", en: "Free On Board", ar: "تسليم على ظهر السفينة" },
    seller: { fr: "Dédouane à l’export et charge à bord du navire (maritime).", en: "Clears for export and loads on board the vessel (sea).", ar: "يقوم بجمركة التصدير والشحن على متن السفينة (بحري)." },
    buyer: { fr: "Fret maritime, assurance, déchargement et import.", en: "Sea freight, insurance, unloading and import.", ar: "الشحن البحري، التأمين، التفريغ والاستيراد." },
    risk: { fr: "Une fois la marchandise à bord.", en: "Once goods are on board.", ar: "بمجرد وجود البضاعة على متن السفينة." },
  },
  {
    code: "CFR",
    name: { fr: "Cost and Freight — Coût et fret", en: "Cost and Freight", ar: "التكلفة والشحن" },
    seller: { fr: "Export + fret maritime jusqu’au port de destination.", en: "Export + sea freight to destination port.", ar: "التصدير + الشحن البحري حتى ميناء الوصول." },
    buyer: { fr: "Assurance, déchargement et import.", en: "Insurance, unloading and import.", ar: "التأمين، التفريغ والاستيراد." },
    risk: { fr: "À bord du navire au port de départ.", en: "On board at the port of shipment.", ar: "على متن السفينة في ميناء الشحن." },
  },
  {
    code: "CIF",
    name: { fr: "Cost, Insurance and Freight", en: "Cost, Insurance and Freight", ar: "التكلفة والتأمين والشحن" },
    seller: { fr: "Export + fret + assurance minimale jusqu’au port de destination.", en: "Export + freight + minimum insurance to destination port.", ar: "التصدير + الشحن + تأمين أدنى حتى ميناء الوصول." },
    buyer: { fr: "Déchargement et formalités d’import.", en: "Unloading and import formalities.", ar: "التفريغ وإجراءات الاستيراد." },
    risk: { fr: "À bord du navire au port de départ (même si le vendeur assure).", en: "On board at port of shipment (even though seller insures).", ar: "على متن السفينة في ميناء الشحن (رغم تأمين البائع)." },
  },
  {
    code: "DAP",
    name: { fr: "Delivered At Place — Rendu au lieu", en: "Delivered At Place", ar: "التسليم في المكان" },
    seller: { fr: "Transport jusqu’au lieu convenu, prêt à décharger.", en: "Transport to the agreed place, ready for unloading.", ar: "النقل حتى المكان المتفق عليه، جاهزة للتفريغ." },
    buyer: { fr: "Déchargement et dédouanement à l’import.", en: "Unloading and import clearance.", ar: "التفريغ وجمركة الاستيراد." },
    risk: { fr: "À l’arrivée au lieu convenu.", en: "On arrival at the agreed place.", ar: "عند الوصول إلى المكان المتفق عليه." },
  },
  {
    code: "DDP",
    name: { fr: "Delivered Duty Paid — Rendu droits acquittés", en: "Delivered Duty Paid", ar: "التسليم مع دفع الرسوم" },
    seller: { fr: "Tout, y compris droits et taxes à l’import.", en: "Everything, including import duties and taxes.", ar: "كل شيء، بما في ذلك رسوم وضرائب الاستيراد." },
    buyer: { fr: "Déchargement et réception.", en: "Unloading and receipt.", ar: "التفريغ والاستلام." },
    risk: { fr: "À la livraison au lieu convenu, dédouané.", en: "On delivery at the agreed place, cleared.", ar: "عند التسليم في المكان المتفق عليه بعد الجمركة." },
  },
];

const base: Record<"export" | "import", L[]> = {
  export: [
    { fr: "Facture commerciale", en: "Commercial invoice", ar: "الفاتورة التجارية" },
    { fr: "Liste de colisage (packing list)", en: "Packing list", ar: "قائمة التعبئة" },
    { fr: "Certificat d’origine", en: "Certificate of origin", ar: "شهادة المنشأ" },
    { fr: "Déclaration en douane d’exportation", en: "Export customs declaration", ar: "التصريح الجمركي للتصدير" },
    { fr: "Document de transport (connaissement / LTA / CMR)", en: "Transport document (B/L / AWB / CMR)", ar: "وثيقة النقل (سند الشحن / رسالة النقل الجوي / CMR)" },
    { fr: "Contrat ou bon de commande, Incoterm précisé", en: "Contract or purchase order with Incoterm", ar: "العقد أو طلب الشراء مع تحديد الإنكوترم" },
  ],
  import: [
    { fr: "Facture commerciale / facture pro forma", en: "Commercial / pro forma invoice", ar: "الفاتورة التجارية / الشكلية" },
    { fr: "Document de transport (connaissement / LTA)", en: "Transport document (B/L / AWB)", ar: "وثيقة النقل (سند الشحن / رسالة النقل الجوي)" },
    { fr: "Liste de colisage", en: "Packing list", ar: "قائمة التعبئة" },
    { fr: "Certificat d’origine", en: "Certificate of origin", ar: "شهادة المنشأ" },
    { fr: "Domiciliation bancaire de l’opération", en: "Bank domiciliation of the operation", ar: "التوطين البنكي للعملية" },
    { fr: "Déclaration en douane d’importation", en: "Import customs declaration", ar: "التصريح الجمركي للاستيراد" },
  ],
};

const byProduct: Record<string, L[]> = {
  food: [
    { fr: "Certificat sanitaire / phytosanitaire selon le produit", en: "Health / phytosanitary certificate depending on product", ar: "شهادة صحية / صحة نباتية حسب المنتج" },
    { fr: "Bulletin d’analyse (laboratoire)", en: "Laboratory analysis report", ar: "تقرير تحاليل مخبرية" },
    { fr: "Étiquetage conforme au pays visé", en: "Labelling compliant with destination", ar: "ملصق مطابق لبلد الوجهة" },
  ],
  industrial: [
    { fr: "Fiche technique / certificat de conformité", en: "Technical sheet / certificate of conformity", ar: "البطاقة التقنية / شهادة المطابقة" },
    { fr: "Manuel et marquage selon les normes du pays", en: "Manual and marking per country standards", ar: "الدليل والوسم حسب معايير البلد" },
  ],
  cosmetic: [
    { fr: "Fiche de composition / FDS", en: "Ingredient list / safety data sheet", ar: "بطاقة التركيبة / بطاقة السلامة" },
    { fr: "Enregistrement ou notification exigé par le pays visé", en: "Registration or notification required by destination", ar: "التسجيل أو الإشعار المطلوب في بلد الوجهة" },
  ],
  textile: [
    { fr: "Étiquette de composition et d’entretien", en: "Composition and care label", ar: "ملصق التركيبة والعناية" },
    { fr: "Certificat de conformité si exigé", en: "Conformity certificate if required", ar: "شهادة المطابقة إن طُلبت" },
  ],
  other: [{ fr: "Certificats spécifiques à vérifier selon le produit", en: "Product-specific certificates to check", ar: "شهادات خاصة يجب التحقق منها حسب المنتج" }],
};

export function checklist(op: "export" | "import", product: string, lang: Lang) {
  return [...base[op], ...(byProduct[product] || [])].map((x) => x[lang]);
}

export const ARTICLES: { cat: number; img: string; title: L; excerpt: L; body: L[] }[] = [
  {
    cat: 0,
    img: IMAGES.containers,
    title: { fr: "7 erreurs à éviter avant votre première exportation", en: "7 mistakes to avoid before your first export", ar: "7 أخطاء يجب تجنبها قبل أول عملية تصدير" },
    excerpt: { fr: "Prix mal calculé, marché trop large, documents oubliés… les pièges classiques.", en: "Wrong pricing, too broad a market, missing documents… the classic traps.", ar: "سعر محسوب بشكل خاطئ، سوق واسعة جدًا، وثائق منسية… الأفخاخ الكلاسيكية." },
    body: [
      { fr: "1. Viser trop de marchés à la fois. Commencez par un ou deux pays que vous comprenez bien.", en: "1. Targeting too many markets at once. Start with one or two countries you understand.", ar: "1. استهداف أسواق كثيرة في آن واحد. ابدأ ببلد أو بلدين تفهمهما جيدًا." },
      { fr: "2. Calculer le prix export comme le prix local. Intégrez emballage, transport, assurance, frais bancaires et marge selon l’Incoterm.", en: "2. Pricing exports like local sales. Include packaging, freight, insurance, bank fees and margin based on the Incoterm.", ar: "2. حساب سعر التصدير كالسعر المحلي. أدرج التغليف والنقل والتأمين والمصاريف البنكية والهامش حسب الإنكوترم." },
      { fr: "3. Négliger l’étiquetage et les normes du pays visé.", en: "3. Overlooking labelling and destination standards.", ar: "3. إهمال الملصقات ومعايير بلد الوجهة." },
      { fr: "4. Promettre des volumes impossibles à tenir.", en: "4. Promising volumes you can’t deliver.", ar: "4. الوعد بكميات لا يمكن الوفاء بها." },
      { fr: "5. Accepter un mode de paiement non sécurisé avec un nouveau client.", en: "5. Accepting an unsecured payment method with a new client.", ar: "5. قبول وسيلة دفع غير آمنة مع زبون جديد." },
      { fr: "6. Oublier un certificat (origine, sanitaire…) qui bloque la marchandise.", en: "6. Forgetting a certificate (origin, health…) that blocks the goods.", ar: "6. نسيان شهادة (منشأ، صحية…) تعرقل البضاعة." },
      { fr: "7. Partir seul : informez-vous auprès des organismes d’appui et d’un conseiller.", en: "7. Going alone: get informed by support agencies and an advisor.", ar: "7. الانطلاق وحيدًا: استعلم لدى هيئات الدعم ومستشار مختص." },
    ],
  },
  {
    cat: 5,
    img: IMAGES.aerial,
    title: { fr: "Comment choisir un marché cible ?", en: "How to choose a target market?", ar: "كيف تختار سوقك المستهدفة؟" },
    excerpt: { fr: "Demande, concurrence, accès, distance : une méthode simple en 4 critères.", en: "Demand, competition, access, distance: a simple 4-criteria method.", ar: "الطلب، المنافسة، شروط الدخول، المسافة: طريقة بسيطة بأربعة معايير." },
    body: [
      { fr: "La demande : le pays importe-t-il déjà votre produit ? En quelles quantités ?", en: "Demand: does the country already import your product? In what volumes?", ar: "الطلب: هل يستورد البلد منتجك أصلًا؟ وبأي كميات؟" },
      { fr: "La concurrence : qui sont les fournisseurs actuels et à quel prix ?", en: "Competition: who supplies it today and at what price?", ar: "المنافسة: من هم الموردون الحاليون وبأي سعر؟" },
      { fr: "L’accès : droits de douane, accords commerciaux, normes et certifications exigées.", en: "Access: duties, trade agreements, required standards and certifications.", ar: "الدخول: الرسوم الجمركية، الاتفاقيات التجارية، المعايير والشهادات المطلوبة." },
      { fr: "La logistique : distance, fréquence des lignes, coût du transport.", en: "Logistics: distance, shipping frequency, freight cost.", ar: "اللوجستيك: المسافة، تواتر الخطوط، تكلفة النقل." },
    ],
  },
  {
    cat: 3,
    img: IMAGES.loaded,
    title: { fr: "FOB vs CIF : quelle différence ?", en: "FOB vs CIF: what’s the difference?", ar: "FOB أم CIF: ما الفرق؟" },
    excerpt: { fr: "Deux Incoterms maritimes très utilisés, mais des responsabilités différentes.", en: "Two widely used sea Incoterms with different responsibilities.", ar: "إنكوترمز بحريان شائعان لكن بمسؤوليات مختلفة." },
    body: [
      { fr: "En FOB, le vendeur dédouane et charge la marchandise à bord ; l’acheteur paie le fret et l’assurance.", en: "Under FOB, the seller clears and loads the goods on board; the buyer pays freight and insurance.", ar: "في FOB، يقوم البائع بالجمركة والشحن على السفينة، ويدفع المشتري الشحن والتأمين." },
      { fr: "En CIF, le vendeur paie aussi le fret et une assurance minimale jusqu’au port de destination.", en: "Under CIF, the seller also pays freight and minimum insurance to the destination port.", ar: "في CIF، يدفع البائع أيضًا الشحن وتأمينًا أدنى حتى ميناء الوصول." },
      { fr: "Dans les deux cas, le risque passe à l’acheteur dès que la marchandise est à bord au départ.", en: "In both cases, risk passes to the buyer once goods are on board at departure.", ar: "في الحالتين، تنتقل المخاطر إلى المشتري بمجرد وجود البضاعة على متن السفينة عند الانطلاق." },
    ],
  },
  {
    cat: 0,
    img: IMAGES.harbor,
    title: { fr: "Comment trouver des acheteurs étrangers ?", en: "How to find foreign buyers?", ar: "كيف تجد مشترين أجانب؟" },
    excerpt: { fr: "Salons, plateformes B2B, réseaux et missions : par où commencer.", en: "Trade fairs, B2B platforms, networks and missions: where to begin.", ar: "المعارض، المنصات B2B، الشبكات والبعثات: من أين تبدأ." },
    body: [
      { fr: "Préparez d’abord un catalogue clair en français et en anglais, avec prix indicatifs et capacités.", en: "First prepare a clear French/English catalogue with indicative prices and capacity.", ar: "حضّر أولًا كتالوجًا واضحًا بالفرنسية والإنجليزية مع أسعار إرشادية وقدرات." },
      { fr: "Participez aux salons internationaux de votre secteur et aux missions commerciales.", en: "Attend international trade fairs in your sector and trade missions.", ar: "شارك في المعارض الدولية لقطاعك وفي البعثات التجارية." },
      { fr: "Utilisez les plateformes B2B et les réseaux professionnels, puis vérifiez sérieusement chaque prospect.", en: "Use B2B platforms and professional networks, then vet each lead carefully.", ar: "استعمل المنصات B2B والشبكات المهنية، ثم تحقق جيدًا من كل زبون محتمل." },
      { fr: "Rejoignez le réseau DS EXPORT pour être mis en relation.", en: "Join the DS EXPORT network to get introductions.", ar: "انضم إلى شبكة DS EXPORT ليتم ربطك بالشركاء." },
    ],
  },
];

export const OFFICIAL_SOURCES = [
  { name: "Ministère du Commerce", desc: { fr: "Réglementation, commerce extérieur, accords.", en: "Regulations, foreign trade, agreements.", ar: "التنظيم، التجارة الخارجية، الاتفاقيات." }, url: "https://www.commerce.gov.dz" },
  { name: "ALGEX", desc: { fr: "Agence nationale de promotion du commerce extérieur.", en: "National foreign trade promotion agency.", ar: "الوكالة الوطنية لترقية التجارة الخارجية." }, url: "https://www.algex.dz" },
  { name: "Douanes algériennes", desc: { fr: "Tarif douanier, procédures, dédouanement.", en: "Customs tariff, procedures, clearance.", ar: "التعريفة الجمركية، الإجراءات، الجمركة." }, url: "https://www.douane.gov.dz" },
  { name: "CACI", desc: { fr: "Chambre algérienne de commerce et d’industrie — certificats d’origine.", en: "Algerian Chamber of Commerce and Industry — certificates of origin.", ar: "الغرفة الجزائرية للتجارة والصناعة — شهادات المنشأ." }, url: "https://www.caci.dz" },
  { name: "Banque d’Algérie", desc: { fr: "Règlementation des changes, rapatriement des recettes d’export.", en: "Foreign exchange rules, repatriation of export proceeds.", ar: "تنظيم الصرف وإعادة عائدات التصدير." }, url: "https://www.bank-of-algeria.dz" },
  { name: "CAGEX", desc: { fr: "Assurance-crédit et garantie des exportations.", en: "Export credit insurance and guarantees.", ar: "تأمين وضمان الصادرات." }, url: "https://www.cagex.dz" },
  { name: "Journal officiel (JORADP)", desc: { fr: "Lois, décrets et règlements publiés.", en: "Published laws, decrees and regulations.", ar: "القوانين والمراسيم والأنظمة المنشورة." }, url: "https://www.joradp.dz" },
  { name: "SAFEX", desc: { fr: "Foires, salons et expositions à l’international.", en: "International fairs and exhibitions.", ar: "المعارض والصالونات الدولية." }, url: "https://www.safex.dz" },
  { name: "APS", desc: { fr: "Agence officielle : actualités du commerce extérieur.", en: "Official news agency: foreign trade news.", ar: "الوكالة الرسمية: أخبار التجارة الخارجية." }, url: "https://www.aps.dz/fr/tags/exportation" },
];

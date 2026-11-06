import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

type Lang = "fr" | "ar" | "en";

function detectLang(text: string, fallback: Lang): Lang {
  if (/[؀-ۿ]/.test(text)) return "ar";
  if (/\b(the|how|what|want|where|which|import|export to|i )\b/i.test(text) && !/\b(je|des|les|vers|quels|comment)\b/i.test(text)) return "en";
  if (/\b(je|des|les|vers|quels|comment|pour|une)\b/i.test(text)) return "fr";
  return fallback;
}

const SYSTEM = `Tu es l'Assistant IA Import/Export du site de Said Dellioua (DS EXPORT), qui accompagne les entreprises algériennes dans le commerce extérieur.
Règles :
- Réponds TOUJOURS dans la langue de la question (arabe, français ou anglais).
- Structure obligatoire, avec ces 5 titres numérotés (traduits dans la langue de réponse) : 1. Votre situation 2. Les étapes principales 3. Documents à vérifier 4. Points réglementaires à considérer 5. Questions à poser à votre conseiller.
- Reste concret et concis (max ~350 mots). Utilise des puces "- ".
- Tu es un assistant d'orientation, pas un expert juridique : ne donne pas de chiffres réglementaires précis (taux, seuils, délais légaux) que tu ne peux garantir ; renvoie vers les sources officielles (Ministère du Commerce, ALGEX, Douanes algériennes, CACI, banque domiciliataire) pour vérification.
- N'invente jamais de lois, d'actualités ou d'accords.
- Termine par une ligne invitant à contacter Said Dellioua (DS EXPORT) sur WhatsApp ou à réserver une consultation pour un accompagnement personnalisé.
- Pas de markdown gras ni de titres #, uniquement du texte, des numéros et des puces.`;

const T = {
  fr: {
    h: ["1. Votre situation", "2. Les étapes principales", "3. Documents à vérifier", "4. Points réglementaires à considérer", "5. Questions à poser à votre conseiller"],
    end: "Besoin d’un accompagnement personnalisé ? Contactez Said Dellioua (DS EXPORT) sur WhatsApp ou réservez une consultation.",
  },
  en: {
    h: ["1. Your situation", "2. Main steps", "3. Documents to check", "4. Regulatory points to consider", "5. Questions to ask your advisor"],
    end: "Need personalised guidance? Contact Said Dellioua (DS EXPORT) on WhatsApp or book a consultation.",
  },
  ar: {
    h: ["1. وضعك", "2. الخطوات الرئيسية", "3. الوثائق التي يجب التحقق منها", "4. نقاط تنظيمية يجب مراعاتها", "5. أسئلة تطرحها على مستشارك"],
    end: "تحتاج مرافقة شخصية؟ تواصل مع السعيد دليوة (DS EXPORT) عبر واتساب أو احجز استشارة.",
  },
};

type Intent = "export" | "import" | "incoterm" | "partner" | "market";

function intentOf(q: string): Intent {
  const s = q.toLowerCase();
  if (/(fob|cif|exw|dap|ddp|cfr|fca|incoterm|إنكوترم|انكوترم)/i.test(s)) return "incoterm";
  if (/(import|استيراد|استورد)/i.test(s)) return "import";
  if (/(partenaire|acheteur|buyer|partner|شريك|مشتر|زبون)/i.test(s)) return "partner";
  if (/(march[ée]|market|سوق|أسواق)/i.test(s) && !/export|تصدير/i.test(s)) return "market";
  return "export";
}

const G: Record<Intent, Record<Lang, string[][]>> = {
  export: {
    fr: [
      ["Vous souhaitez vendre votre produit à l’étranger. La réussite dépend de la préparation : statut, produit, marché et documents."],
      ["Vérifier que votre registre de commerce couvre l’activité d’export", "Calculer un prix export complet (emballage, transport, assurance, frais bancaires)", "Choisir 1 à 2 marchés cibles et étudier la demande", "Adapter emballage et étiquetage au pays visé", "Choisir l’Incoterm et le moyen de paiement", "Organiser la logistique avec un transitaire", "Effectuer les formalités douanières d’exportation"],
      ["Facture commerciale et liste de colisage", "Certificat d’origine", "Certificats sanitaires / phytosanitaires si produit agricole ou alimentaire", "Document de transport (connaissement, LTA ou CMR)", "Déclaration en douane d’exportation"],
      ["Normes et exigences d’entrée du pays de destination", "Règles de rapatriement des recettes d’export auprès de votre banque", "Avantages éventuels liés aux accords commerciaux (à vérifier auprès des organismes officiels)"],
      ["Quel marché est le plus réaliste pour mon produit ?", "Quels certificats exactement pour mon produit et ce pays ?", "Quel Incoterm et quel paiement pour un premier client ?"],
    ],
    en: [
      ["You want to sell your product abroad. Success depends on preparation: status, product, market and documents."],
      ["Check that your business registration covers export", "Calculate a full export price (packaging, freight, insurance, bank fees)", "Pick 1–2 target markets and study demand", "Adapt packaging and labelling to the destination", "Choose the Incoterm and payment method", "Organise logistics with a freight forwarder", "Complete export customs formalities"],
      ["Commercial invoice and packing list", "Certificate of origin", "Health / phytosanitary certificates for food or agricultural goods", "Transport document (B/L, AWB or CMR)", "Export customs declaration"],
      ["Destination entry standards and requirements", "Rules for repatriating export proceeds via your bank", "Possible trade-agreement benefits (to check with official bodies)"],
      ["Which market is most realistic for my product?", "Which exact certificates for my product and country?", "Which Incoterm and payment for a first client?"],
    ],
    ar: [
      ["تريد بيع منتجك في الخارج. النجاح يعتمد على التحضير: الوضع القانوني، المنتج، السوق والوثائق."],
      ["تحقق أن سجلك التجاري يغطي نشاط التصدير", "احسب سعر تصدير كامل (تغليف، نقل، تأمين، مصاريف بنكية)", "اختر سوقًا أو سوقين وادرس الطلب", "كيّف التغليف والملصق مع بلد الوجهة", "اختر الإنكوترم ووسيلة الدفع", "نظّم اللوجستيك مع وكيل عبور", "أتمم الإجراءات الجمركية للتصدير"],
      ["الفاتورة التجارية وقائمة التعبئة", "شهادة المنشأ", "الشهادات الصحية / النباتية للمنتجات الغذائية والفلاحية", "وثيقة النقل (سند الشحن، رسالة النقل الجوي أو CMR)", "التصريح الجمركي للتصدير"],
      ["معايير وشروط الدخول في بلد الوجهة", "قواعد إعادة عائدات التصدير عبر بنكك", "امتيازات محتملة من الاتفاقيات التجارية (يُتحقق منها لدى الهيئات الرسمية)"],
      ["ما هي السوق الأنسب لمنتجي؟", "ما هي الشهادات المطلوبة بالضبط لمنتجي وهذا البلد؟", "أي إنكوترم ووسيلة دفع لأول زبون؟"],
    ],
  },
  import: {
    fr: [
      ["Vous voulez faire entrer une marchandise en Algérie. L’essentiel est de vérifier les conditions applicables à votre produit avant de commander."],
      ["Vérifier votre statut d’importateur et l’activité au registre de commerce", "Identifier le classement tarifaire (code SH) du produit", "Vérifier normes, autorisations ou contrôles éventuels", "Sélectionner et vérifier le fournisseur", "Domicilier l’opération auprès de votre banque et choisir le paiement", "Organiser fret et assurance", "Dédouaner à l’arrivée"],
      ["Facture pro forma puis facture commerciale", "Document de transport (connaissement / LTA)", "Liste de colisage et certificat d’origine", "Certificats de conformité selon le produit", "Déclaration en douane d’importation"],
      ["Conditions spécifiques d’importation selon le produit", "Droits et taxes applicables (tarif douanier officiel)", "Exigences bancaires de domiciliation"],
      ["Mon produit est-il soumis à des conditions particulières ?", "Quel Incoterm est le plus avantageux pour moi ?", "Comment sécuriser le paiement au fournisseur ?"],
    ],
    en: [
      ["You want to bring goods into Algeria. The key is checking the conditions for your product before ordering."],
      ["Check your importer status and registered activity", "Identify the product’s HS tariff code", "Check standards, authorisations or controls", "Select and vet the supplier", "Domicile the operation with your bank and choose payment", "Arrange freight and insurance", "Clear customs on arrival"],
      ["Pro forma then commercial invoice", "Transport document (B/L / AWB)", "Packing list and certificate of origin", "Conformity certificates depending on product", "Import customs declaration"],
      ["Product-specific import conditions", "Applicable duties and taxes (official tariff)", "Bank domiciliation requirements"],
      ["Is my product subject to special conditions?", "Which Incoterm suits me best?", "How do I secure payment to the supplier?"],
    ],
    ar: [
      ["تريد إدخال بضاعة إلى الجزائر. الأهم هو التحقق من الشروط المطبقة على منتجك قبل الطلب."],
      ["تحقق من وضعك كمستورد والنشاط المسجل", "حدد التصنيف التعريفي (رمز SH) للمنتج", "تحقق من المعايير والتراخيص أو الرقابة", "اختر المورد وتحقق منه", "وطّن العملية لدى بنكك واختر وسيلة الدفع", "نظّم الشحن والتأمين", "قم بالجمركة عند الوصول"],
      ["الفاتورة الشكلية ثم التجارية", "وثيقة النقل (سند الشحن / رسالة النقل الجوي)", "قائمة التعبئة وشهادة المنشأ", "شهادات المطابقة حسب المنتج", "التصريح الجمركي للاستيراد"],
      ["شروط استيراد خاصة حسب المنتج", "الرسوم والضرائب المطبقة (التعريفة الرسمية)", "متطلبات التوطين البنكي"],
      ["هل يخضع منتجي لشروط خاصة؟", "أي إنكوترم هو الأفضل لي؟", "كيف أؤمّن الدفع للمورد؟"],
    ],
  },
  incoterm: {
    fr: [
      ["Vous hésitez sur l’Incoterm. Il définit qui paie le transport et l’assurance, et à quel moment le risque passe à l’acheteur."],
      ["FOB : le vendeur charge à bord, l’acheteur paie fret et assurance", "CIF : le vendeur paie aussi fret et assurance minimale jusqu’au port de destination", "Dans les deux cas, le risque passe à bord au départ", "Pour un premier export, FOB simplifie votre responsabilité ; CIF permet de proposer un prix « rendu port »"],
      ["Contrat ou bon de commande mentionnant l’Incoterm et la version (Incoterms® 2020)", "Police d’assurance en CIF", "Document de transport"],
      ["L’Incoterm doit être cohérent avec le moyen de paiement et les documents bancaires"],
      ["Qui maîtrise le mieux le transport : moi ou mon client ?", "Quel niveau d’assurance est souhaitable ?"],
    ],
    en: [
      ["You’re unsure about the Incoterm. It defines who pays freight and insurance, and when risk passes to the buyer."],
      ["FOB: seller loads on board, buyer pays freight and insurance", "CIF: seller also pays freight and minimum insurance to destination port", "In both, risk passes on board at departure", "For a first export, FOB limits your responsibility; CIF lets you quote a delivered-to-port price"],
      ["Contract or PO stating the Incoterm and version (Incoterms® 2020)", "Insurance policy under CIF", "Transport document"],
      ["The Incoterm must match the payment method and bank documents"],
      ["Who handles transport better: me or my client?", "What insurance level is advisable?"],
    ],
    ar: [
      ["أنت مترد في اختيار الإنكوترم. هو يحدد من يدفع النقل والتأمين ومتى تنتقل المخاطر إلى المشتري."],
      ["FOB: البائع يشحن على السفينة، والمشتري يدفع الشحن والتأمين", "CIF: البائع يدفع أيضًا الشحن وتأمينًا أدنى حتى ميناء الوصول", "في الحالتين تنتقل المخاطر على متن السفينة عند الانطلاق", "لأول تصدير، FOB يقلل مسؤوليتك؛ وCIF يسمح لك بعرض سعر حتى ميناء الوصول"],
      ["عقد أو طلب شراء يذكر الإنكوترم وطبعته (Incoterms® 2020)", "وثيقة التأمين في CIF", "وثيقة النقل"],
      ["يجب أن يتوافق الإنكوترم مع وسيلة الدفع والوثائق البنكية"],
      ["من يتحكم في النقل أفضل: أنا أم زبوني؟", "ما مستوى التأمين المناسب؟"],
    ],
  },
  partner: {
    fr: [
      ["Vous cherchez un partenaire ou un acheteur étranger fiable."],
      ["Préparer un catalogue FR/EN avec capacités et prix indicatifs", "Participer aux salons du secteur et missions commerciales", "Utiliser plateformes B2B et réseaux professionnels", "Vérifier chaque prospect (existence légale, références, solvabilité)", "Commencer par une commande test avec paiement sécurisé"],
      ["Fiche produit et catalogue", "Proposition commerciale / offre de prix", "Contrat définissant Incoterm, paiement et litiges"],
      ["Clauses de paiement et de règlement des litiges", "Conformité du produit aux exigences du pays du partenaire"],
      ["Comment vérifier la fiabilité d’un acheteur ?", "Quel paiement pour une première commande ?"],
    ],
    en: [
      ["You’re looking for a reliable foreign partner or buyer."],
      ["Prepare an FR/EN catalogue with capacity and indicative prices", "Attend sector fairs and trade missions", "Use B2B platforms and professional networks", "Vet each lead (legal existence, references, solvency)", "Start with a trial order and secure payment"],
      ["Product sheet and catalogue", "Commercial offer / quotation", "Contract defining Incoterm, payment and disputes"],
      ["Payment and dispute-resolution clauses", "Product compliance with the partner country"],
      ["How do I check a buyer’s reliability?", "Which payment for a first order?"],
    ],
    ar: [
      ["تبحث عن شريك أو مشترٍ أجنبي موثوق."],
      ["حضّر كتالوجًا بالفرنسية والإنجليزية مع القدرات والأسعار الإرشادية", "شارك في معارض القطاع والبعثات التجارية", "استعمل المنصات B2B والشبكات المهنية", "تحقق من كل زبون محتمل (الوجود القانوني، المراجع، الملاءة)", "ابدأ بطلبية تجريبية مع دفع آمن"],
      ["بطاقة المنتج والكتالوج", "عرض تجاري / عرض أسعار", "عقد يحدد الإنكوترم والدفع والنزاعات"],
      ["بنود الدفع وتسوية النزاعات", "مطابقة المنتج لمتطلبات بلد الشريك"],
      ["كيف أتحقق من موثوقية المشتري؟", "أي وسيلة دفع لأول طلبية؟"],
    ],
  },
  market: {
    fr: [
      ["Vous souhaitez entrer sur un nouveau marché."],
      ["Mesurer la demande (importations du pays pour votre produit)", "Analyser la concurrence et les prix", "Vérifier droits de douane, accords et normes", "Évaluer la logistique (distance, lignes, coûts)", "Tester par une prospection ciblée ou un salon"],
      ["Étude de marché synthétique", "Liste des certifications exigées par le pays"],
      ["Barrières non tarifaires (normes, enregistrements)", "Accords commerciaux applicables (à vérifier auprès des organismes officiels)"],
      ["Ce marché est-il prioritaire pour mon produit ?", "Quel budget prévoir pour la prospection ?"],
    ],
    en: [
      ["You want to enter a new market."],
      ["Measure demand (the country’s imports of your product)", "Analyse competition and prices", "Check duties, agreements and standards", "Assess logistics (distance, routes, costs)", "Test through targeted prospecting or a trade fair"],
      ["Short market study", "List of certifications required by the country"],
      ["Non-tariff barriers (standards, registrations)", "Applicable trade agreements (check with official bodies)"],
      ["Is this market a priority for my product?", "What prospecting budget should I plan?"],
    ],
    ar: [
      ["تريد دخول سوق جديدة."],
      ["قِس الطلب (واردات البلد من منتجك)", "حلّل المنافسة والأسعار", "تحقق من الرسوم والاتفاقيات والمعايير", "قيّم اللوجستيك (المسافة، الخطوط، التكاليف)", "اختبر عبر تنقيب موجّه أو معرض"],
      ["دراسة سوق مختصرة", "قائمة الشهادات المطلوبة في البلد"],
      ["العوائق غير الجمركية (المعايير، التسجيلات)", "الاتفاقيات التجارية المطبقة (يُتحقق منها لدى الهيئات الرسمية)"],
      ["هل هذه السوق أولوية لمنتجي؟", "ما ميزانية التنقيب التي يجب توقعها؟"],
    ],
  },
};

function guide(q: string, lang: Lang) {
  const g = G[intentOf(q)][lang];
  const t = T[lang];
  return t.h
    .map((h, i) => `${h}\n${g[i].map((l) => (i === 0 ? l : `- ${l}`)).join("\n")}`)
    .join("\n\n") + `\n\n${t.end}`;
}

export async function POST(req: Request) {
  let body: { question?: string; lang?: Lang; journey?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const question = (body.question || "").toString().trim().slice(0, 2000);
  if (question.length < 2) return NextResponse.json({ error: "empty" }, { status: 400 });
  const lang = detectLang(question, (["fr", "ar", "en"].includes(body.lang as string) ? body.lang : "fr") as Lang);

  supabase.from("assistant_messages").insert({ question, journey: body.journey?.slice(0, 40) ?? null, lang }).then(() => {}, () => {});

  const key = process.env.ANTHROPIC_API_KEY;
  if (key) {
    try {
      const client = new Anthropic({ apiKey: key });
      const msg = await client.messages.create({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
        max_tokens: 900,
        system: SYSTEM,
        messages: [{ role: "user", content: question }],
      });
      const text = msg.content
        .map((c) => (c.type === "text" ? c.text : ""))
        .join("")
        .trim();
      if (text) return NextResponse.json({ answer: text, source: "claude", lang });
    } catch (e) {
      console.error("anthropic_error", e);
    }
  }
  const gkey = process.env.GEMINI_API_KEY;
  if (gkey) {
    const models = [process.env.GEMINI_MODEL, "gemini-flash-latest", "gemini-2.5-flash"].filter(Boolean) as string[];
    for (const model of models) {
      try {
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": gkey },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM }] },
            contents: [{ role: "user", parts: [{ text: question }] }],
            generationConfig: { maxOutputTokens: 1200, temperature: 0.4 },
          }),
        });
        if (!r.ok) {
          console.error("gemini_error", model, r.status, (await r.text()).slice(0, 300));
          if (r.status === 404) continue; // model name not available, try next
          break; // quota / auth error → fallback guide
        }
        const d = await r.json();
        const text = (d?.candidates?.[0]?.content?.parts || [])
          .map((p: { text?: string }) => p.text || "")
          .join("")
          .replace(/^#+\s*/gm, "")
          .replace(/\*\*/g, "")
          .replace(/^\s*[*•]\s+/gm, "- ")
          .trim();
        if (text) return NextResponse.json({ answer: text, source: "gemini", lang });
        break;
      } catch (e) {
        console.error("gemini_exception", e);
        break;
      }
    }
  }

  return NextResponse.json({ answer: guide(question, lang), source: "guide", lang });
}

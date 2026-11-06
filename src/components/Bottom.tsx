"use client";
import { useEffect, useState } from "react";
import { Gauge, Scale, ClipboardList, Check, X, ArrowUpRight, Phone, MapPin, Globe2, MessageCircle, Building2, Truck, Users, ExternalLink, Loader2, Printer } from "lucide-react";
import { useLang } from "./LangProvider";
import { Kicker, PillButton, Section, Title } from "./ui";
import { supabase } from "@/lib/supabase";
import { ARTICLES, INCOTERMS, OFFICIAL_SOURCES, checklist } from "@/lib/content";
import { IMAGES, SITE, waLink } from "@/lib/site";

function Card({ icon: I, title, sub, children }: { icon: React.ElementType; title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="tilt glass-light flex h-full flex-col rounded-[28px] p-6 sm:p-7">
      <span className="grid h-11 w-11 place-items-center rounded-2xl gold-bg text-ink"><I size={19} /></span>
      <h3 className="mt-4 text-xl font-extrabold">{title}</h3>
      <p className="mt-1 text-sm text-muted">{sub}</p>
      <div className="mt-5 flex-1">{children}</div>
    </div>
  );
}

function Readiness() {
  const { t } = useLang();
  const Q = t.tools.questions;
  const [ans, setAns] = useState<(number | null)[]>(Array(Q.length).fill(null));
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState("");
  const [contact, setContact] = useState("");
  const [done, setDone] = useState<number | null>(null);

  const choose = (v: number) => {
    const a = [...ans]; a[step] = v; setAns(a);
    if (step < Q.length - 1) setStep(step + 1); else setStep(Q.length);
  };
  const compute = async () => {
    const score = Math.round((ans.reduce<number>((s, v) => s + (v ?? 0), 0) / (Q.length * 2)) * 100);
    setDone(score);
    supabase.from("readiness_results").insert({ score, answers: ans, target_country: country || null, contact: contact || null }).then(() => {}, () => {});
  };
  const reset = () => { setAns(Array(Q.length).fill(null)); setStep(0); setDone(null); };

  if (done !== null) {
    const color = done >= 75 ? "text-emerald-600" : done >= 45 ? "text-brand" : "text-red-600";
    return (
      <div>
        <p className="text-sm font-semibold text-muted">{t.tools.score}</p>
        <div className="mt-2 flex items-end gap-3">
          <span className={`text-6xl font-extrabold ${color}`}>{done}%</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-soft"><div className="h-full rounded-full bg-brand transition-all duration-700" style={{ width: `${done}%` }} /></div>
        <p className="mt-5 text-sm font-bold">{t.tools.recos}</p>
        <ul className="mt-2 space-y-2">
          {Q.map(([, reco], i) => (ans[i] ?? 0) < 2 && (
            <li key={i} className="flex gap-2 text-sm text-ink/80"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{reco}</li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={reset} className="rounded-full bg-soft px-4 py-2 text-sm font-semibold">{t.tools.again}</button>
          <a href={waLink(`${t.wa.msg} (Score : ${done}%${country ? ` — ${country}` : ""})`)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">{t.assistant.talk}</a>
        </div>
      </div>
    );
  }

  if (step >= Q.length) {
    return (
      <div className="space-y-3">
        <input className="field" placeholder={t.tools.country} value={country} maxLength={80} onChange={(e) => setCountry(e.target.value)} />
        <input className="field" placeholder={t.tools.contact} value={contact} maxLength={160} onChange={(e) => setContact(e.target.value)} />
        <PillButton onClick={compute} variant="brand">{t.tools.compute}</PillButton>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex gap-1">{Q.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand" : "bg-soft"}`} />)}</div>
      <p className="text-xs font-bold text-muted">{step + 1} / {Q.length}</p>
      <p className="mt-1 min-h-[72px] font-semibold leading-snug">{Q[step][0]}</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[[2, t.tools.yes], [1, t.tools.partly], [0, t.tools.no]].map(([v, l]) => (
          <button key={v as number} onClick={() => choose(v as number)} className={`rounded-xl px-3 py-3 text-sm font-bold transition ${ans[step] === v ? "bg-ink text-white" : "bg-soft hover:bg-ink hover:text-white"}`}>{l}</button>
        ))}
      </div>
      {step > 0 && <button onClick={() => setStep(step - 1)} className="mt-3 text-xs font-semibold text-muted hover:text-ink">←</button>}
    </div>
  );
}

function IncotermsTool() {
  const { t, lang } = useLang();
  const [sel, setSel] = useState(2);
  const it = INCOTERMS[sel];
  return (
    <div>
      <div className="flex flex-wrap gap-1.5" dir="ltr">
        {INCOTERMS.map((x, i) => (
          <button key={x.code} onClick={() => setSel(i)} className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${sel === i ? "gold-bg text-ink" : "bg-soft hover:bg-zinc-200"}`}>{x.code}</button>
        ))}
      </div>
      <p className="mt-4 font-bold">{it.code} — <span className="font-medium text-muted">{it.name[lang]}</span></p>
      <div className="mt-3 space-y-2 text-sm">
        <div className="rounded-xl bg-soft p-3"><p className="text-xs font-bold text-brand">{t.tools.seller}</p><p className="mt-0.5">{it.seller[lang]}</p></div>
        <div className="rounded-xl bg-soft p-3"><p className="text-xs font-bold">{t.tools.buyer}</p><p className="mt-0.5">{it.buyer[lang]}</p></div>
        <div className="rounded-xl bg-ink p-3 text-white"><p className="text-xs font-bold text-brand">{t.tools.risk}</p><p className="mt-0.5">{it.risk[lang]}</p></div>
      </div>
    </div>
  );
}

function DocsTool() {
  const { t, lang } = useLang();
  const op = "export" as const;
  const [product, setProduct] = useState("food");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const list = checklist(op, product, lang);
  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <div className="field flex items-center font-semibold">{t.hub.export}</div>
        <select className="field" value={product} onChange={(e) => setProduct(e.target.value)} aria-label={t.tools.product}>
          {Object.entries(t.tools.products).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <ul className="mt-4 space-y-1.5">
        {list.map((d) => (
          <li key={d}>
            <button onClick={() => setChecked({ ...checked, [d]: !checked[d] })} className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-start text-sm hover:bg-soft">
              <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${checked[d] ? "border-brand gold-bg text-ink" : "border-zinc-300"}`}>{checked[d] && <Check size={11} />}</span>
              <span className={checked[d] ? "text-muted line-through" : ""}>{d}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-[11px] text-muted">{t.tools.note}</p>
        <button onClick={() => window.print()} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-soft" aria-label="print"><Printer size={14} /></button>
      </div>
    </div>
  );
}

export function Tools() {
  const { t } = useLang();
  return (
    <Section id="tools" reveal>
      <Kicker>{t.tools.kicker}</Kicker>
      <Title a={t.tools.title} />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <Card icon={Gauge} title={t.tools.readiness} sub={t.tools.readinessSub}><Readiness /></Card>
        <Card icon={Scale} title={t.tools.incoterms} sub={t.tools.incotermsSub}><IncotermsTool /></Card>
        <Card icon={ClipboardList} title={t.tools.docs} sub={t.tools.docsSub}><DocsTool /></Card>
      </div>
    </Section>
  );
}

export function Knowledge() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", f); return () => window.removeEventListener("keydown", f);
  }, []);
  const a = open !== null ? ARTICLES[open] : null;
  return (
    <Section id="knowledge" className="bg-soft" reveal>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><Kicker>{t.knowledge.kicker}</Kicker><Title a={t.knowledge.title} /></div>
        <div className="flex flex-wrap gap-2">{t.knowledge.cats.map((c) => <span key={c} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold ring-1 ring-black/5">{c}</span>)}</div>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ARTICLES.map((art, i) => (
          <button key={i} onClick={() => setOpen(i)} className="tilt group overflow-hidden rounded-[28px] bg-white text-start ring-1 ring-ink/5">
            <div className="relative h-40 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={art.img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <span className="absolute start-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-bold">{t.knowledge.cats[art.cat]}</span>
            </div>
            <div className="p-5">
              <p className="font-bold leading-snug">{art.title[lang]}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">{art.excerpt[lang]}</p>
              <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">{t.knowledge.read} <ArrowUpRight size={14} /></p>
            </div>
          </button>
        ))}
      </div>
      {a && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4" onClick={() => setOpen(null)}>
          <article className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.img} alt="" className="h-52 w-full object-cover" />
            <div className="p-6 sm:p-8">
              <span className="rounded-full gold-bg px-3 py-1 text-xs font-bold text-ink">{t.knowledge.cats[a.cat]}</span>
              <h3 className="mt-4 text-2xl font-extrabold">{a.title[lang]}</h3>
              <div className="mt-4 space-y-3 leading-relaxed text-ink/80">{a.body.map((p, i) => <p key={i}>{p[lang]}</p>)}</div>
              <div className="mt-6 flex flex-wrap gap-3">
                <PillButton href={waLink(t.wa.msg)} target="_blank" variant="brand">{t.assistant.talk}</PillButton>
                <button onClick={() => setOpen(null)} className="rounded-full bg-soft px-5 py-2 text-sm font-semibold">{t.knowledge.close}</button>
              </div>
            </div>
          </article>
        </div>
      )}
    </Section>
  );
}

export function Updates() {
  const { t, lang } = useLang();
  return (
    <Section id="sources" reveal>
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <div><Kicker>{t.updates.kicker}</Kicker><Title a={t.updates.title} /><p className="mt-4 text-sm text-muted">{t.updates.sub}</p></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OFFICIAL_SOURCES.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-3 tilt rounded-2xl glass-light p-5 transition hover:bg-ink hover:text-white">
              <div><p className="font-bold">{s.name}</p><p className="mt-1 text-sm text-muted group-hover:text-white/70">{s.desc[lang]}</p></div>
              <ExternalLink size={16} className="mt-1 shrink-0 text-brand" />
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}

type Member = { id: string; kind: string; company: string; country: string | null; sector: string | null; products: string | null };

export function Network() {
  const { t } = useLang();
  const [kind, setKind] = useState<"exporter" | "importer" | "partner">("exporter");
  const [form, setForm] = useState({ company: "", contact_name: "", email: "", phone: "", country: "", sector: "", products: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    supabase.from("network_members").select("id,kind,company,country,sector,products").eq("approved", true).order("created_at", { ascending: false }).limit(12)
      .then(({ data }) => setMembers((data as Member[]) || []), () => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const { error } = await supabase.from("network_members").insert({ kind, ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim() || null])) });
    setStatus(error ? "err" : "ok");
    if (!error) setForm({ company: "", contact_name: "", email: "", phone: "", country: "", sector: "", products: "" });
  };

  const kinds = [
    { id: "exporter" as const, icon: Building2, txt: t.network.exporter },
    { id: "importer" as const, icon: Truck, txt: t.network.importer },
    { id: "partner" as const, icon: Globe2, txt: t.network.partner },
  ];
  const f = (k: keyof typeof form) => ({ value: form[k], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value }) });

  return (
    <section id="network" className="relative scroll-mt-20 overflow-hidden navy-mesh px-4 py-20 text-white sm:px-6 md:py-28">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={IMAGES.stacked} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-10" />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Kicker light>{t.network.kicker}</Kicker>
              <span className="rounded-full gold-bg px-3 py-1 text-xs font-bold text-ink">{t.network.free}</span>
            </div>
            <Title light a={t.network.title} />
            <p className="mt-5 max-w-xl leading-relaxed text-white/75">{t.network.sub}</p>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {t.network.benefits.map((b) => (
              <li key={b} className="glass rounded-2xl px-4 py-3 text-sm font-semibold">{b}</li>
            ))}
          </ul>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {kinds.map(({ id, icon: I, txt }) => (
            <button key={id} onClick={() => setKind(id)} className={`rounded-2xl p-6 text-start transition ${kind === id ? "gold-bg text-ink shadow-xl shadow-brand/20" : "glass hover:bg-white/15"}`}>
              <I size={22} />
              <p className="mt-4 text-lg font-bold">{txt[0]}</p>
              <p className={`mt-1 text-sm ${kind === id ? "text-ink/75" : "text-white/60"}`}>{txt[1]}</p>
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <form onSubmit={submit} className="gold-border rounded-[28px] bg-cream p-6 text-ink sm:p-8">
            <p className="text-xl font-extrabold">{t.network.join} — <span className="text-brand">{kinds.find((k) => k.id === kind)!.txt[0]}</span></p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <input required minLength={2} maxLength={160} className="field" placeholder={`${t.network.company} *`} {...f("company")} />
              <input required minLength={2} maxLength={120} className="field" placeholder={`${t.network.name} *`} {...f("contact_name")} />
              <input type="email" maxLength={160} className="field" placeholder={t.network.email} {...f("email")} />
              <input type="tel" maxLength={30} className="field" placeholder={t.network.phone} {...f("phone")} />
              <input maxLength={80} className="field" placeholder={t.network.country} {...f("country")} />
              <input maxLength={120} className="field" placeholder={t.network.sector} {...f("sector")} />
              <textarea rows={3} maxLength={1000} className="field sm:col-span-2" placeholder={t.network.products} {...f("products")} />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <PillButton type="submit" variant="dark" disabled={status === "sending"}>{status === "sending" ? t.common.sending : t.network.submit}</PillButton>
              {status === "ok" && <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600"><Check size={16} />{t.network.ok}</p>}
              {status === "err" && <p className="flex items-center gap-1.5 text-sm font-semibold text-red-600"><X size={16} />{t.common.error}</p>}
            </div>
          </form>
          <div className="glass rounded-[28px] p-6 sm:p-8">
            <p className="flex items-center gap-2 font-bold"><Users size={18} className="text-brand" />{t.network.directory}</p>
            {members.length === 0 ? (
              <p className="mt-6 text-sm text-white/60">{t.network.empty}</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {members.map((m) => (
                  <li key={m.id} className="rounded-xl bg-white/5 p-3">
                    <p className="text-sm font-bold">{m.company}</p>
                    <p className="text-xs text-white/60">{[m.sector, m.country].filter(Boolean).join(" • ")}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Booking() {
  const { t, lang } = useLang();
  const [topic, setTopic] = useState("export");
  const [duration, setDuration] = useState(30);
  const [form, setForm] = useState({ full_name: "", company: "", email: "", phone: "", preferred_date: "", preferred_time: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const today = new Date().toISOString().slice(0, 10);
  const f = (k: keyof typeof form) => ({ value: form[k], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value }) });
  const topics = t.booking.topics as Record<string, string>;

  const waText = `${lang === "ar" ? "السلام عليكم، أريد تأكيد طلب استشارة" : lang === "en" ? "Hello, I'd like to confirm a consultation request" : "Bonjour, je souhaite confirmer une demande de consultation"} :
• ${topics[topic]} (${duration} min)
• ${form.full_name}${form.company ? ` — ${form.company}` : ""}
• ${form.preferred_date} ${form.preferred_time}
${form.message ? `• ${form.message}` : ""}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const payload = { topic, duration, lang, ...Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim() || null])) };
    const { error } = await supabase.from("bookings").insert(payload);
    setStatus(error ? "err" : "ok");
  };

  return (
    <Section id="booking" reveal>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Kicker>{t.booking.kicker}</Kicker>
          <Title a={t.booking.title} />
          <div className="relative mt-8 overflow-hidden rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGES.cranes} alt="" loading="lazy" className="h-72 w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
            <div className="absolute bottom-5 start-5 end-5 text-white">
              <p className="text-2xl font-extrabold">{t.hero.gateway}</p>
              <p className="text-sm text-white/80">{t.hero.gatewaySub}</p>
            </div>
          </div>
        </div>
        <form onSubmit={submit} className="glass-light rounded-[28px] p-6 sm:p-8">
          <p className="text-sm font-bold">{t.booking.topic}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(topics).map(([k, v]) => (
              <button type="button" key={k} onClick={() => setTopic(k)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${topic === k ? "bg-ink text-white" : "bg-white ring-1 ring-ink/10 hover:ring-brand"}`}>{v}</button>
            ))}
          </div>
          <p className="mt-5 text-sm font-bold">{t.booking.duration}</p>
          <div className="mt-2 flex gap-2">
            {[30, 60].map((d) => (
              <button type="button" key={d} onClick={() => setDuration(d)} className={`rounded-full px-5 py-2 text-sm font-bold transition ${duration === d ? "gold-bg text-ink" : "bg-white ring-1 ring-ink/10 hover:ring-brand"}`}>{d} min</button>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="text-xs font-semibold text-muted">{t.booking.date}<input type="date" min={today} required className="field mt-1" {...f("preferred_date")} /></label>
            <label className="text-xs font-semibold text-muted">{t.booking.time}<input type="time" required className="field mt-1" {...f("preferred_time")} /></label>
            <input required minLength={2} maxLength={120} className="field" placeholder={`${t.booking.name} *`} {...f("full_name")} />
            <input required type="tel" minLength={6} maxLength={30} className="field" placeholder={`${t.booking.phone} *`} {...f("phone")} />
            <input maxLength={160} className="field" placeholder={t.booking.company} {...f("company")} />
            <input type="email" maxLength={160} className="field" placeholder={t.booking.email} {...f("email")} />
            <textarea rows={3} maxLength={2000} className="field sm:col-span-2" placeholder={t.booking.message} {...f("message")} />
          </div>
          <div className="mt-5">
            {status === "ok" ? (
              <div className="rounded-2xl bg-white p-4">
                <p className="text-sm font-semibold text-emerald-700">{t.booking.ok}</p>
                <a href={waLink(waText)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"><MessageCircle size={16} />{t.booking.wa}</a>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <PillButton type="submit" variant="brand" disabled={status === "sending"}>{status === "sending" ? t.common.sending : t.booking.submit}</PillButton>
                {status === "sending" && <Loader2 className="animate-spin text-brand" size={18} />}
                {status === "err" && <p className="text-sm font-semibold text-red-600">{t.common.error}</p>}
              </div>
            )}
          </div>
        </form>
      </div>
    </Section>
  );
}

export function Contact() {
  const { t } = useLang();
  return (
    <Section id="contact" className="bg-soft" reveal>
      <Kicker>{t.contact.kicker}</Kicker>
      <Title a={t.contact.title} />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <a href={`tel:${SITE.phoneIntl}`} className="tilt group glass-light rounded-[28px] p-6 transition hover:bg-ink hover:text-white">
          <Phone className="text-brand" />
          <p className="mt-6 text-sm text-muted group-hover:text-white/60">{t.contact.phone}</p>
          <p className="mt-1 text-2xl font-extrabold" dir="ltr">{SITE.phoneDisplay}</p>
          <p className="mt-1 text-sm font-semibold">Said Dellioua — DS EXPORT</p>
        </a>
        <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="tilt group relative overflow-hidden rounded-[28px] bg-ink p-6 text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMAGES.aerial} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-30 transition duration-500 group-hover:scale-105" />
          <div className="relative">
            <MapPin className="text-brand" />
            <p className="mt-6 text-sm text-white/70">{t.contact.address}</p>
            <p className="mt-1 text-2xl font-extrabold">DS EXPORT</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full gold-bg px-4 py-2 text-sm font-semibold text-ink">{t.contact.map} <ArrowUpRight size={14} /></span>
          </div>
        </a>
        <a href={SITE.spinetUrl} target="_blank" rel="noopener noreferrer" className="tilt group glass-light rounded-[28px] p-6 transition hover:bg-ink hover:text-white">
          <Globe2 className="text-brand" />
          <p className="mt-6 text-sm text-muted group-hover:text-white/60">Spinet</p>
          <p className="mt-1 text-2xl font-extrabold">{t.contact.profile}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand">spinet.app <ArrowUpRight size={14} /></p>
        </a>
      </div>
    </Section>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="navy-mesh border-t border-brand/30 px-4 pb-24 pt-16 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-4xl font-extrabold tracking-tight sm:text-6xl"><span className="gold-text">{t.hero.gateway}</span></p>
        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} DS EXPORT — Said Dellioua. {t.footer.rights}</p>
          <p className="font-semibold text-white/80">{t.footer.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

export function FloatingWA() {
  const { t } = useLang();
  return (
    <a href={waLink(t.wa.msg)} target="_blank" rel="noopener noreferrer"
      className="fixed bottom-5 end-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] py-3 ps-4 pe-5 font-semibold text-white shadow-xl shadow-black/20 ring-2 ring-white transition hover:scale-105">
      <MessageCircle size={20} /> <span className="hidden text-sm sm:inline">{t.wa.button}</span>
    </a>
  );
}

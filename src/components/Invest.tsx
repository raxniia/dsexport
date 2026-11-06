"use client";
import { useEffect, useState } from "react";
import { Handshake, Factory, PieChart, Truck, Sprout, Layers, Check, X, Lock, ExternalLink, MapPin, Globe2, Briefcase, MessageCircle } from "lucide-react";
import { useLang } from "./LangProvider";
import { Kicker, PillButton, Reveal } from "./ui";
import { supabase } from "@/lib/supabase";
import { IMAGES, waLink } from "@/lib/site";

type DealKey = "jv" | "offtake" | "equity" | "supply" | "industrial" | "other";
const DEAL_ICON: Record<DealKey, React.ElementType> = { jv: Handshake, offtake: Sprout, equity: PieChart, supply: Truck, industrial: Factory, other: Layers };
const AMOUNTS = ["lt100k", "100k-500k", "500k-2m", "2m-10m", "gt10m", "undisclosed"] as const;

type Project = { id: string; wilaya: string | null; sector: string; title: string; description: string | null; amount_range: string | null; deal_type: DealKey; stage: string | null };

export function Invest() {
  const { t, lang } = useLang();
  const v = t.invest;
  const [tab, setTab] = useState<"investor" | "project">("investor");
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [sentMsg, setSentMsg] = useState("");
  const emptyInv = { full_name: "", organization: "", country: "", email: "", phone: "", sectors: "", ticket: "undisclosed", deal_type: "jv", message: "" };
  const emptyPrj = { company: "", contact_name: "", email: "", phone: "", wilaya: "", sector: "", title: "", description: "", amount_range: "undisclosed", deal_type: "offtake", stage: "running" };
  const [inv, setInv] = useState(emptyInv);
  const [prj, setPrj] = useState(emptyPrj);

  useEffect(() => {
    supabase.from("investment_projects").select("id,wilaya,sector,title,description,amount_range,deal_type,stage")
      .eq("approved", true).order("created_at", { ascending: false }).limit(9)
      .then(({ data }) => setProjects((data as Project[]) || []), () => {});
  }, []);

  const clean = (o: Record<string, string>) => Object.fromEntries(Object.entries(o).map(([k, x]) => [k, x.trim() || null]));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const { error } = tab === "investor"
      ? await supabase.from("investor_profiles").insert({ ...clean(inv), lang })
      : await supabase.from("investment_projects").insert({ ...clean(prj), lang });
    setStatus(error ? "err" : "ok");
    if (!error) {
      const am = (x: string) => v.amounts[x as keyof typeof v.amounts] || x;
      const dl = (x: string) => v.deals[x as DealKey]?.[0] || x;
      setSentMsg(tab === "investor"
        ? `${v.tabInvestor} — DS EXPORT\n${v.f.name}: ${inv.full_name}${inv.organization ? ` (${inv.organization})` : ""}\n${v.f.country}: ${inv.country}\n${v.f.email}: ${inv.email}${inv.phone ? `\n${v.f.phone}: ${inv.phone}` : ""}\n${v.f.sectors}: ${inv.sectors || "-"}\n${v.f.ticket}: ${am(inv.ticket)}\n${v.f.dealType}: ${dl(inv.deal_type)}${inv.message ? `\n${inv.message}` : ""}`
        : `${v.tabProject} — DS EXPORT\n${v.f.company}: ${prj.company}\n${v.f.name}: ${prj.contact_name}\n${v.f.phone}: ${prj.phone}${prj.wilaya ? `\n${v.f.wilaya}: ${prj.wilaya}` : ""}\n${v.f.sector}: ${prj.sector}\n${v.f.title}: ${prj.title}\n${v.f.amount}: ${am(prj.amount_range)}\n${v.f.dealType}: ${dl(prj.deal_type)}${prj.description ? `\n${prj.description}` : ""}`);
      setInv(emptyInv); setPrj(emptyPrj);
    }
  };
  const fi = (k: keyof typeof emptyInv) => ({ value: inv[k], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setInv({ ...inv, [k]: e.target.value }) });
  const fp = (k: keyof typeof emptyPrj) => ({ value: prj[k], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setPrj({ ...prj, [k]: e.target.value }) });
  const deals = Object.keys(v.deals) as DealKey[];

  return (
    <section id="invest" className="relative scroll-mt-20 overflow-hidden bg-ink px-4 py-20 text-white sm:px-6 md:py-28">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={IMAGES.harbor} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink" />
      <div className="absolute -start-40 top-20 h-[28rem] w-[28rem] rounded-full bg-brand/15 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <Kicker light>{v.kicker}</Kicker>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl"><span className="gold-text">{v.title}</span></h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{v.sub}</p>
        </Reveal>

        {/* deal types */}
        <Reveal delay={80}><h3 className="mt-14 font-display text-xl font-semibold text-gold-light">{v.dealsTitle}</h3></Reveal>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {deals.filter((d) => d !== "other").map((d, i) => {
            const I = DEAL_ICON[d];
            return (
              <Reveal key={d} delay={i * 70}>
                <div className="glass tilt h-full rounded-3xl p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl gold-bg text-ink"><I size={19} /></span>
                  <p className="mt-4 font-display text-lg font-semibold leading-tight">{v.deals[d][0]}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{v.deals[d][1]}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* why + steps */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="gold-border h-full rounded-[28px] bg-white/5 p-7">
              <h3 className="font-display text-xl font-semibold">{v.whyTitle}</h3>
              <ul className="mt-5 space-y-3">
                {v.why.map((w) => (
                  <li key={w} className="flex gap-3 text-sm leading-relaxed text-white/80">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full gold-bg text-ink"><Check size={13} /></span>{w}
                  </li>
                ))}
              </ul>
              <a href="https://aapi.dz/en/accueil-2/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-light hover:underline">
                {v.aapi} <ExternalLink size={13} />
              </a>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="glass h-full rounded-[28px] p-7">
              <h3 className="font-display text-xl font-semibold">{v.stepsTitle}</h3>
              <ol className="mt-5 space-y-4">
                {v.steps.map(([h, d], i) => (
                  <li key={h} className="flex gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-brand/40 font-display text-lg font-bold text-gold-light">{i + 1}</span>
                    <div><p className="font-semibold">{h}</p><p className="text-sm text-white/65">{d}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>

        {/* board */}
        <Reveal delay={60}>
          <div className="mt-14 flex flex-wrap items-end justify-between gap-3">
            <h3 className="font-display text-2xl font-semibold">{v.board}</h3>
            <p className="inline-flex items-center gap-1.5 text-sm text-white/60"><Lock size={14} className="text-brand" />{v.anonymous}</p>
          </div>
        </Reveal>
        {projects.length === 0 ? (
          <Reveal><p className="glass mt-5 rounded-3xl p-6 text-white/70">{v.boardEmpty}</p></Reveal>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {projects.map((p) => {
              const I = DEAL_ICON[p.deal_type] || Layers;
              return (
                <div key={p.id} className="flex h-full flex-col rounded-3xl bg-cream p-5 text-ink">
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
                    <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-gold-light"><I size={12} />{v.deals[p.deal_type]?.[0]}</span>
                    {p.wilaya && <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1"><MapPin size={11} />{p.wilaya}</span>}
                  </div>
                  <p className="mt-3 font-display text-lg font-semibold leading-snug">{p.title}</p>
                  <p className="mt-1 text-xs font-semibold text-brand-dark">{p.sector}{p.amount_range ? ` • ${v.amounts[p.amount_range as keyof typeof v.amounts]}` : ""}</p>
                  {p.description && <p className="mt-2 line-clamp-4 text-sm text-ink/75">{p.description}</p>}
                  <a href={waLink(`${v.interested} — ${p.title}`)} target="_blank" rel="noopener noreferrer" className="mt-auto pt-4 text-sm font-semibold text-brand-dark hover:underline">{v.interested} →</a>
                </div>
              );
            })}
          </div>
        )}

        {/* forms */}
        <Reveal delay={60}>
          <form onSubmit={submit} className="gold-border mt-10 rounded-[28px] bg-cream p-6 text-ink sm:p-8">
            <div className="flex flex-wrap gap-2">
              {([["investor", v.tabInvestor, Globe2], ["project", v.tabProject, Briefcase]] as const).map(([k, l, I]) => (
                <button type="button" key={k} onClick={() => { setTab(k); setStatus("idle"); }}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${tab === k ? "bg-ink text-gold-light" : "bg-white ring-1 ring-ink/10 hover:ring-brand"}`}>
                  <I size={16} />{l}
                </button>
              ))}
            </div>

            {tab === "investor" ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <input required minLength={2} maxLength={120} className="field" placeholder={`${v.f.name} *`} {...fi("full_name")} />
                <input maxLength={160} className="field" placeholder={v.f.org} {...fi("organization")} />
                <input required minLength={2} maxLength={80} className="field" placeholder={`${v.f.country} *`} {...fi("country")} />
                <input required type="email" maxLength={160} className="field" placeholder={`${v.f.email} *`} {...fi("email")} />
                <input type="tel" maxLength={30} className="field" placeholder={v.f.phone} {...fi("phone")} />
                <input maxLength={300} className="field" placeholder={v.f.sectors} {...fi("sectors")} />
                <label className="text-xs font-semibold text-muted">{v.f.ticket}
                  <select className="field mt-1" {...fi("ticket")}>{AMOUNTS.map((a) => <option key={a} value={a}>{v.amounts[a]}</option>)}</select>
                </label>
                <label className="text-xs font-semibold text-muted">{v.f.dealType}
                  <select className="field mt-1" {...fi("deal_type")}>{deals.map((d) => <option key={d} value={d}>{v.deals[d][0]}</option>)}</select>
                </label>
                <textarea rows={3} maxLength={1500} className="field sm:col-span-2" placeholder={v.f.message} {...fi("message")} />
              </div>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <input required minLength={2} maxLength={160} className="field" placeholder={`${v.f.company} *`} {...fp("company")} />
                <input required minLength={2} maxLength={120} className="field" placeholder={`${v.f.name} *`} {...fp("contact_name")} />
                <input required type="tel" minLength={6} maxLength={30} className="field" placeholder={`${v.f.phone} *`} {...fp("phone")} />
                <input type="email" maxLength={160} className="field" placeholder={v.f.email} {...fp("email")} />
                <input maxLength={60} className="field" placeholder={v.f.wilaya} {...fp("wilaya")} />
                <input required maxLength={120} className="field" placeholder={`${v.f.sector} *`} {...fp("sector")} />
                <input required minLength={5} maxLength={200} className="field sm:col-span-2" placeholder={`${v.f.title} *`} {...fp("title")} />
                <label className="text-xs font-semibold text-muted">{v.f.amount}
                  <select className="field mt-1" {...fp("amount_range")}>{AMOUNTS.map((a) => <option key={a} value={a}>{v.amounts[a]}</option>)}</select>
                </label>
                <label className="text-xs font-semibold text-muted">{v.f.dealType}
                  <select className="field mt-1" {...fp("deal_type")}>{deals.map((d) => <option key={d} value={d}>{v.deals[d][0]}</option>)}</select>
                </label>
                <label className="text-xs font-semibold text-muted sm:col-span-2">{v.f.stage}
                  <select className="field mt-1" {...fp("stage")}>{(Object.keys(v.stages) as (keyof typeof v.stages)[]).map((s) => <option key={s} value={s}>{v.stages[s]}</option>)}</select>
                </label>
                <textarea rows={3} maxLength={1500} className="field sm:col-span-2" placeholder={v.f.description} {...fp("description")} />
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <PillButton type="submit" variant="dark" disabled={status === "sending"}>{status === "sending" ? t.common.sending : v.submit}</PillButton>
              {status === "ok" && <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700"><Check size={16} />{tab === "investor" ? v.okInvestor : v.okProject}</p>}
            </div>
            {status === "ok" && sentMsg && (
              <div className="mt-4 flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-emerald-600/20 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-ink/80">{v.waNote}</p>
                <a href={waLink(sentMsg)} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:brightness-95">
                  <MessageCircle size={16} />{v.waSend}
                </a>
              </div>
            )}
            <div className="hidden">
              {status === "err" && <p className="flex items-center gap-1.5 text-sm font-semibold text-red-600"><X size={16} />{t.common.error}</p>}
            </div>
            <p className="mt-4 text-xs text-muted">{v.disclaimer}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

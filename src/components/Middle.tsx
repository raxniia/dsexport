"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bot, Send, Loader2, MessageCircle, CalendarDays, Check, Info, Ship, PackageSearch, Compass, Handshake, Landmark } from "lucide-react";
import { useLang } from "./LangProvider";
import { Kicker, PillButton, Reveal, Section, Title } from "./ui";
import { IMAGES, waLink } from "@/lib/site";

const SERVICE_IMGS = [IMAGES.ship, IMAGES.cranes, IMAGES.aerial, IMAGES.harbor, IMAGES.stacked];
const SERVICE_ICONS = [Ship, PackageSearch, Compass, Handshake, Landmark];

export function Services() {
  const { t } = useLang();
  return (
    <Section id="services" className="bg-white">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Reveal>
          <Kicker>{t.services.kicker}</Kicker>
          <Title a={t.services.title1} b={t.services.title2} />
        </Reveal>
        <Reveal delay={120}><p className="max-w-sm text-muted">{t.services.sub}</p></Reveal>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-6">
        {t.services.items.map((s, i) => {
          const I = SERVICE_ICONS[i];
          const wide = true;
          return (
            <Reveal key={s.t} delay={i * 80} className={wide ? "md:col-span-3" : "md:col-span-2"}>
              <article className="tilt group relative h-full overflow-hidden rounded-3xl bg-ink text-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={SERVICE_IMGS[i]} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:scale-110 group-hover:opacity-30`} />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/30" />
                <div className={`relative flex h-full flex-col p-7 ${wide ? "min-h-[340px]" : "min-h-[320px]"}`}>
                  <div className="flex items-start justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl gold-bg text-ink"><I size={20} /></span>
                    <span className="font-display text-sm font-semibold text-white/40">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-2xl font-bold">{s.t}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{s.d}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {s.tags.map((tag) => <span key={tag} className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-1 text-[11px] text-gold-light">{tag}</span>)}
                    </div>
                    <a href="#booking" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-light opacity-80 transition group-hover:opacity-100">{t.services.all} <ArrowUpRight size={14} className="rtl:-scale-x-100" /></a>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
        <Reveal delay={400} className="md:col-span-6">
          <div className="gold-border flex flex-col items-center justify-between gap-4 rounded-3xl bg-cream p-6 sm:flex-row">
            <p className="font-display text-xl font-semibold">{t.assistant.expert}</p>
            <PillButton href="#booking" variant="brand">{t.services.all}</PillButton>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export function About() {
  const { t, lang } = useLang();
  return (
    <Section className="overflow-hidden">
      <div className="grid-lines absolute inset-0" />
      <div className="grid items-center gap-14 md:grid-cols-[.9fr_1.1fr]">
        <Reveal className="relative mx-auto w-full max-w-[400px]">
          <div className="absolute -start-5 -top-5 h-40 w-40 rounded-3xl border-2 border-brand/50" />
          <div className="absolute -bottom-5 -end-5 h-40 w-40 rounded-3xl gold-bg opacity-90" />
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-navy-3 to-ink shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(232,199,102,.3),transparent_60%)]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/said.webp" alt="Said Dellioua" loading="lazy" width={360} height={417} className="relative mx-auto mt-8 w-[88%]" />
          </div>
          <div className="glass-light absolute -end-4 top-10 animate-float rounded-2xl px-4 py-3">
            <p className="whitespace-nowrap font-display text-sm font-bold">DS <span className="gold-text">EXPORT</span></p>
            <p className="text-[11px] text-muted">DZ → World</p>
          </div>
        </Reveal>
        <div>
          <Reveal><Kicker>{t.about.kicker}</Kicker></Reveal>
          <Reveal delay={80}><Title a={t.about.title1} b={`${t.hero.name} ${lang === "ar" ? "؟" : "?"}`} /></Reveal>
          <Reveal delay={120}>
            <ul className="mt-6 space-y-2.5">
              {t.about.titles.map((ti, i) => (
                <li key={ti} className="flex items-start gap-3 rounded-2xl border-s-4 border-brand bg-white px-4 py-3 shadow-sm">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink font-display text-[11px] font-bold text-gold-light">{i + 1}</span>
                  <span className="font-display font-semibold leading-snug text-ink">{ti}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={160}><p className="mt-6 text-lg font-medium leading-relaxed text-ink">{t.about.lead}</p></Reveal>
          <Reveal delay={220}><p className="mt-4 leading-relaxed text-muted">{t.about.body}</p></Reveal>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {t.about.points.map((p, i) => (
              <Reveal as="li" key={p} delay={260 + i * 70}>
                <div className="flex items-center gap-3 rounded-2xl border border-ink/5 bg-white px-4 py-3.5 text-sm font-semibold shadow-sm">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full gold-bg text-ink"><Check size={14} /></span>{p}
                </div>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={500}>
            <div className="mt-9 flex flex-wrap gap-3">
              <PillButton href={waLink(t.wa.msg)} target="_blank" variant="dark">{t.about.cta}</PillButton>
              <PillButton href="#booking" variant="outline">{t.hero.book}</PillButton>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

type Msg = { role: "user" | "bot"; text: string };

function Answer({ text }: { text: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {text.split(/\n{2,}/).map((block, i) => {
        const lines = block.split("\n");
        const head = /^\d\.\s/.test(lines[0]) ? lines.shift() : null;
        return (
          <div key={i}>
            {head && <p className="mb-1.5 font-display font-semibold text-ink"><span className="me-1 inline-grid h-5 w-5 place-items-center rounded-full gold-bg text-[11px] text-ink">{head.slice(0, 1)}</span>{head.slice(2)}</p>}
            {lines.map((l, j) =>
              l.startsWith("- ") ? (
                <p key={j} className="flex gap-2 text-ink/80"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{l.slice(2)}</p>
              ) : (
                <p key={j} className="text-ink/80">{l.replace(/\*\*/g, "")}</p>
              ),
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Assistant() {
  const { t, lang, pending } = useLang();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const lastPending = useRef(0);

  const send = async (q: string, journey?: string) => {
    const question = q.trim();
    if (!question || loading) return;
    setMsgs((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question, lang, journey }) });
      const d = await r.json();
      setMsgs((m) => [...m, { role: "bot", text: d.answer || t.common.error }]);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: t.common.error }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pending && pending.n !== lastPending.current) {
      lastPending.current = pending.n;
      send(pending.q, pending.journey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" }); }, [msgs, loading]);

  return (
    <section id="assistant" className="navy-mesh relative scroll-mt-20 overflow-hidden px-4 py-20 text-white sm:px-6 md:py-28">
      <div className="grid-lines absolute inset-0 opacity-60" />
      <div className="absolute -end-32 top-10 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.25fr]">
        <div>
          <Reveal><Kicker light>{t.assistant.kicker}</Kicker></Reveal>
          <Reveal delay={80}><Title light a={t.assistant.title} /></Reveal>
          <Reveal delay={160}><p className="mt-6 leading-relaxed text-white/70">{t.assistant.sub}</p></Reveal>
          <Reveal delay={240}>
            <div className="mt-7 flex flex-wrap gap-2">
              {t.assistant.examples.map((e) => (
                <button key={e} onClick={() => send(e)} className="glass rounded-full px-4 py-2 text-sm transition hover:border-brand hover:text-gold-light">{e}</button>
              ))}
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="glass gold-border mt-9 rounded-3xl p-6">
              <p className="font-display text-lg font-semibold">{t.assistant.expert}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <PillButton href={waLink(t.wa.msg)} target="_blank" variant="brand">{t.assistant.talk}</PillButton>
                <a href="#booking" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold hover:bg-white/20"><CalendarDays size={16} />{t.hero.book}</a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="gold-border flex h-[620px] flex-col overflow-hidden rounded-[28px] bg-cream text-ink shadow-2xl shadow-black/40">
            <div className="flex items-center gap-3 bg-ink px-5 py-4 text-white">
              <span className="relative grid h-11 w-11 place-items-center rounded-2xl gold-bg text-ink">
                <Bot size={20} />
                <span className="absolute -bottom-0.5 -end-0.5 h-3 w-3 rounded-full border-2 border-ink bg-emerald-400" />
              </span>
              <div className="flex-1">
                <p className="font-display font-semibold">DS EXPORT • AI Trade Assistant</p>
                <p className="text-xs text-white/60">FR • العربية • EN</p>
              </div>
            </div>
            <div ref={box} className="flex-1 space-y-4 overflow-y-auto p-5">
              {msgs.length === 0 && (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <span className="mx-auto grid h-16 w-16 animate-float place-items-center rounded-3xl bg-ink text-gold-light"><Bot size={28} /></span>
                    <p className="mx-auto mt-5 max-w-xs text-sm text-muted">{t.assistant.placeholder}</p>
                  </div>
                </div>
              )}
              {msgs.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="flex justify-end"><div className="max-w-[85%] rounded-2xl rounded-se-sm bg-ink px-4 py-3 text-sm text-white">{m.text}</div></div>
                ) : (
                  <div key={i} className="flex gap-2">
                    <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl gold-bg text-ink"><Bot size={15} /></span>
                    <div className="max-w-[90%] rounded-2xl rounded-ss-sm bg-white p-4 shadow-sm ring-1 ring-ink/5">
                      <Answer text={m.text} />
                      <a href={waLink(t.wa.msg)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:brightness-95">
                        <MessageCircle size={14} /> {t.assistant.talk}
                      </a>
                    </div>
                  </div>
                ),
              )}
              {loading && <div className="flex items-center gap-2 text-sm text-muted"><Loader2 size={16} className="animate-spin text-brand" />{t.assistant.thinking}</div>}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-ink/5 bg-white p-3">
              <div className="flex items-end gap-2 rounded-2xl bg-cream p-2 ring-1 ring-ink/5 focus-within:ring-brand">
                <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={2} maxLength={2000}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                  placeholder={t.assistant.placeholder} className="flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none" />
                <button type="submit" disabled={loading || !input.trim()} aria-label={t.assistant.send}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-gold-light transition hover:bg-navy-2 disabled:opacity-40"><Send size={16} className="rtl:-scale-x-100" /></button>
              </div>
              <p className="mt-2 flex gap-1.5 px-1 text-[11px] leading-snug text-muted"><Info size={12} className="mt-0.5 shrink-0" />{t.assistant.disclaimer}</p>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Hub() {
  const { t, ask } = useLang();
  const Col = ({ title, items, img, kind }: { title: string; items: string[][]; img: string; kind: "export" }) => (
    <div className="glass-light overflow-hidden rounded-[28px]">
      <div className="relative h-56 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <span className={`absolute bottom-4 start-5 rounded-full px-4 py-1.5 font-display text-sm font-bold tracking-[0.2em] gold-bg text-ink`}>{title}</span>
      </div>
      <div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(([h, d], i) => (
          <button key={h} onClick={() => ask(`${title} — ${h} : ${d}`, kind)} className="group rounded-2xl bg-white p-4 text-start ring-1 ring-ink/5 transition duration-300 hover:-translate-y-0.5 hover:bg-ink hover:text-white">
            <p className="flex items-center justify-between text-sm font-semibold"><span><span className="font-display text-brand">{String(i + 1).padStart(2, "0")}</span> {h}</span><ArrowUpRight size={14} className="text-brand opacity-0 transition group-hover:opacity-100" /></p>
            <p className="mt-1 text-xs leading-relaxed text-muted group-hover:text-white/70">{d}</p>
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <Section className="bg-soft">
      <Reveal><Kicker>{t.hub.kicker}</Kicker><Title a={t.hub.title} /></Reveal>
      <div className="mt-12">
        <Reveal><Col title={t.hub.export} items={t.hub.exportItems} img={IMAGES.loaded} kind="export" /></Reveal>
      </div>
    </Section>
  );
}

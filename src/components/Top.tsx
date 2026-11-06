"use client";
import { useEffect, useState } from "react";
import { Menu, X, MessageCircle, Phone, MapPin, Globe2, Ship, PackageSearch, Handshake, FileSearch, Compass, Bot, Megaphone } from "lucide-react";
import { useLang } from "./LangProvider";
import { PillButton, Kicker, Reveal } from "./ui";
import { IMAGES, SITE, waLink } from "@/lib/site";
import type { Lang } from "@/lib/i18n";

const LANGS: { id: Lang; label: string }[] = [
  { id: "fr", label: "FR" },
  { id: "ar", label: "ع" },
  { id: "en", label: "EN" },
];

export function Nav() {
  const { t, lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links = [
    ["#home", t.nav.home], ["#bulletin", t.nav.bulletin], ["#invest", t.nav.invest], ["#services", t.nav.services], ["#assistant", t.nav.assistant],
    ["#events", t.nav.events], ["#knowledge", t.nav.knowledge], ["#network", t.nav.network], ["#contact", t.nav.contact],
  ];
  const dark = !scrolled && !open;
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <nav className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-3 py-2.5 transition-all duration-500 ${dark ? "glass" : "glass-light"}`}>
        <a href="#home" className="flex items-center gap-2.5 ps-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/icon-round.png" alt="" width={44} height={44} className="h-11 w-11 rounded-full shadow-md" />
          <span className={`font-display text-lg font-bold tracking-wide ${dark ? "text-white" : "text-ink"}`}>DS <span className="gold-text">EXPORT</span></span>
        </a>
        <ul className={`hidden items-center gap-6 text-[13px] font-medium lg:flex ${dark ? "text-white/85" : "text-ink/80"}`}>
          {links.map(([h, l]) => <li key={h}><a href={h} className="relative transition-colors hover:text-brand after:absolute after:-bottom-1 after:start-0 after:h-px after:w-0 after:bg-brand after:transition-all hover:after:w-full">{l}</a></li>)}
        </ul>
        <div className="flex items-center gap-2">
          <div className={`flex rounded-full p-1 text-xs font-bold ${dark ? "bg-white/10" : "bg-ink/5"}`}>
            {LANGS.map((l) => (
              <button key={l.id} onClick={() => setLang(l.id)} aria-label={l.id}
                className={`rounded-full px-2.5 py-1.5 transition-colors ${lang === l.id ? "gold-bg text-ink" : dark ? "text-white/70 hover:text-white" : "text-muted hover:text-ink"}`}>{l.label}</button>
            ))}
          </div>
          <a href="#booking" className="hidden rounded-full gold-bg px-5 py-2.5 text-[13px] font-semibold text-ink shine sm:inline-block">{t.nav.cta}</a>
          <button className={`grid h-10 w-10 place-items-center rounded-full lg:hidden ${dark ? "bg-white/10 text-white" : "bg-ink/5"}`} onClick={() => setOpen(!open)} aria-label="menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="glass-light mx-auto mt-2 max-w-6xl rounded-2xl p-3 lg:hidden">
          {links.map(([h, l]) => <a key={h} href={h} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 font-medium hover:bg-white">{l}</a>)}
          <a href="#booking" onClick={() => setOpen(false)} className="mt-2 block rounded-full gold-bg px-4 py-3 text-center font-semibold text-ink">{t.nav.cta}</a>
        </div>
      )}
    </header>
  );
}

function Routes() {
  // stylised trade routes from Algeria outward
  return (
    <svg viewBox="0 0 1200 700" className="pointer-events-none absolute inset-0 h-full w-full opacity-70" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="rg" x1="0" x2="1"><stop offset="0" stopColor="#e8c766" stopOpacity="0" /><stop offset=".5" stopColor="#e8c766" /><stop offset="1" stopColor="#e8c766" stopOpacity="0" /></linearGradient>
      </defs>
      {[
        "M600 420 C 480 300, 300 260, 120 300",
        "M600 420 C 700 260, 900 200, 1120 240",
        "M600 420 C 760 470, 950 560, 1150 600",
        "M600 420 C 520 520, 380 600, 160 640",
        "M600 420 C 620 300, 640 160, 700 60",
      ].map((d, i) => (
        <path key={i} d={d} fill="none" stroke="url(#rg)" strokeWidth="1.4" strokeDasharray="6 10" className="animate-dash" style={{ animationDelay: `${i * -1.2}s` }} />
      ))}
      <circle cx="600" cy="420" r="5" fill="#e8c766" />
      <circle cx="600" cy="420" r="5" fill="none" stroke="#e8c766" className="animate-pulse-ring" style={{ transformOrigin: "600px 420px" }} />
    </svg>
  );
}

export function Hero() {
  const { t, ask } = useLang();
  return (
    <section id="home" className="relative isolate min-h-[min(100svh,920px)] overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMAGES.port} alt="" className="kenburns h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/55 rtl:bg-gradient-to-l" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/60" />
      <div className="grid-lines absolute inset-0 -z-10" />
      <Routes />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-28 pt-32 sm:px-6 md:pt-40 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <Reveal><Kicker light>{t.hero.hello}</Kicker></Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 text-[42px] font-bold leading-[1.02] sm:text-6xl lg:text-7xl">
              {t.hero.gateway}
              <span className="mt-2 block gold-text text-[30px] sm:text-4xl lg:text-5xl">{t.hero.gatewaySub}</span>
            </h1>
          </Reveal>
          <Reveal delay={200}><p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">{t.hero.quote}</p></Reveal>
          <Reveal delay={300}>
            <div className="mt-9 flex flex-wrap gap-3">
              <PillButton onClick={() => ask(t.assistant.examples[0])} variant="brand"><span className="inline-flex items-center gap-2"><Bot size={16} />{t.hero.ask}</span></PillButton>
              <a href="#booking" className="glass inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">{t.hero.book}</a>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-10 flex flex-wrap gap-2">
              {t.hero.badges.map((b) => <span key={b} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80">{b}</span>)}
            </div>
          </Reveal>
        </div>

        <Reveal delay={250} className="relative mx-auto w-full max-w-[460px]">
          <div className="absolute -inset-6 rounded-[40px] bg-brand/20 blur-3xl" />
          <div className="gold-border relative overflow-hidden rounded-[32px] bg-gradient-to-b from-navy-3 to-ink">
            <div className="absolute inset-x-0 top-0 h-2/3 bg-[radial-gradient(circle_at_50%_30%,rgba(232,199,102,.35),transparent_65%)]" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/ds-export-logo-transparent.webp" alt="DS EXPORT" width={970} height={380} className="relative mx-auto w-[86%] pb-32 pt-16" />
            <div className="glass absolute inset-x-4 bottom-4 rounded-2xl p-4">
              <p className="font-display text-xl font-bold">{t.hero.name}</p>
              <p className="text-sm text-gold-light">{t.hero.role}</p>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-ink/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 text-sm sm:px-6">
          <div className="flex flex-wrap gap-5 text-white/70">
            <a href={`tel:${SITE.phoneIntl}`} className="inline-flex items-center gap-2 hover:text-gold-light"><Phone size={15} className="text-brand" /><span dir="ltr">{SITE.phoneDisplay}</span></a>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gold-light"><MapPin size={15} className="text-brand" />DS EXPORT</a>
            <a href={SITE.spinetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-gold-light"><Globe2 size={15} className="text-brand" />{t.hero.spinet}</a>
          </div>
          <a href={waLink(t.wa.msg)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-gold-light hover:text-white"><MessageCircle size={16} />WhatsApp</a>
        </div>
      </div>
    </section>
  );
}

export function Marquee() {
  const { t } = useLang();
  const items = [...t.marquee, ...t.marquee];
  return (
    <div className="relative z-10 overflow-hidden border-y border-brand/30 bg-navy-2 py-4 text-white" dir="ltr">
      <div className="marquee-track flex w-max animate-marquee items-center gap-12 whitespace-nowrap">
        {items.map((m, i) => (
          <span key={i} className="flex items-center gap-12 font-display text-lg font-semibold tracking-wide text-white/90 sm:text-xl">
            {m}
            <svg width="14" height="14" viewBox="0 0 24 24" className="text-brand"><path fill="currentColor" d="M12 0c.6 6.5 5.5 11.4 12 12-6.5.6-11.4 5.5-12 12-.6-6.5-5.5-11.4-12-12C6.5 11.4 11.4 6.5 12 0Z" /></svg>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Journey() {
  const { t, ask } = useLang();
  const icons = [Ship, PackageSearch, Handshake, FileSearch, Compass];
  return (
    <section className="relative px-4 py-20 sm:px-6 md:py-28">
      <div className="grid-lines absolute inset-0" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="text-center">
          <Kicker>{t.journey.kicker}</Kicker>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">{t.journey.title}</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">{t.journey.sub}</p>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.journey.options.map((o, i) => {
            const I = icons[i];
            return (
              <Reveal key={o.id} delay={i * 90}>
                <button onClick={() => ask(o.q, o.id)} className="tilt group glass-light flex h-full w-full flex-col items-start gap-8 rounded-3xl p-6 text-start">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-gold-light transition-colors group-hover:gold-bg group-hover:text-ink"><I size={20} /></span>
                  <span className="flex w-full items-end justify-between gap-2 font-display text-lg font-semibold leading-tight">
                    {o.label}
                    <span className="text-brand transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">→</span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductBand() {
  const { t } = useLang();
  const items = [...t.products.items, ...t.products.items];
  return (
    <div className="group relative z-10 flex items-stretch overflow-hidden gold-bg text-ink shadow-[0_10px_30px_-10px_rgba(201,162,39,.6)]" dir="ltr">
      <div className="relative z-20 hidden shrink-0 items-center gap-2 bg-ink px-5 font-display text-sm font-bold text-gold-light sm:flex">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/flags/dz.svg" width={24} height={18} alt="" className="h-[18px] w-6 rounded-[2px] object-cover" />
        <span className="whitespace-nowrap">{t.products.label.replace("🇩🇿", "").trim()}</span>
        <span className="absolute -right-3 top-0 h-full w-6 skew-x-[-12deg] bg-ink" />
      </div>
      <div className="relative flex-1 overflow-hidden py-3">
        <div className="marquee-rev flex w-max animate-marquee items-center gap-3 whitespace-nowrap group-hover:[animation-play-state:paused]">
          {items.map(([emoji, name], i) => (
            <a key={i} href={waLink(`${t.products.interest} ${name}`)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-full bg-white/35 py-1.5 ps-1.5 pe-4 font-display text-[15px] font-semibold ring-1 ring-ink/10 backdrop-blur transition hover:bg-ink hover:text-gold-light">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-base">{emoji}</span>
              {name}
            </a>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#c9a227] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#c9a227] to-transparent" />
      </div>
      <a href={waLink(t.products.ctaMsg)} target="_blank" rel="noopener noreferrer"
        className="relative z-20 flex shrink-0 items-center gap-2 bg-ink px-4 text-xs font-bold text-white transition hover:text-gold-light sm:px-5 sm:text-sm">
        <Megaphone size={16} className="text-brand" /><span className="hidden whitespace-nowrap sm:inline">{t.products.cta}</span>
      </a>
    </div>
  );
}

const FLAG_CODES = ["fr", "es", "it", "de", "be", "pt", "nl", "gb", "tr", "ru", "cn", "us", "ca", "br", "in", "sa", "ae", "qa", "kw", "jo", "eg", "tn", "ly", "mr", "sn", "ml", "ne", "ng", "ci", "cm"];

export function FlagsBand() {
  const { t, lang } = useLang();
  let names: Intl.DisplayNames | null = null;
  try { names = new Intl.DisplayNames([lang === "ar" ? "ar" : lang === "en" ? "en" : "fr"], { type: "region" }); } catch {}
  const loop = [...FLAG_CODES, ...FLAG_CODES];
  return (
    <div className="group relative z-10 flex items-stretch overflow-hidden border-b border-ink/10 bg-white" dir="ltr">
      <div className="relative z-20 hidden shrink-0 items-center bg-cream px-5 font-display text-sm font-bold text-ink sm:flex">
        <span className="whitespace-nowrap">{t.flags.label}</span>
      </div>
      <div className="relative flex-1 overflow-hidden py-2.5">
        <div className="flex w-max animate-marquee items-center gap-6 whitespace-nowrap group-hover:[animation-play-state:paused]" style={{ animationDuration: "70s" }}>
          {loop.map((c, i) => (
            <span key={i} className="flex items-center gap-2 text-sm font-medium text-ink/80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/flags/${c}.svg`} width={28} height={21} alt="" loading="lazy"
                className="h-[21px] w-7 rounded-[3px] object-cover shadow-sm ring-1 ring-ink/10" />
              {names?.of(c.toUpperCase()) || c.toUpperCase()}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />
      </div>
    </div>
  );
}

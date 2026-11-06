"use client";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { useLang } from "./LangProvider";
import { supabase } from "@/lib/supabase";
import { SEED_NEWS, orgName, type NewsItem } from "@/lib/news";

const CAT_STYLE: Record<NewsItem["category"], string> = {
  loi: "bg-red-500/90 text-white",
  procedure: "gold-bg text-ink",
  institution: "bg-violet-500/90 text-white",
  marche: "bg-teal-500/90 text-white",
  evenement: "bg-sky-500/90 text-white",
  operation: "bg-emerald-500/90 text-white",
  actualite: "bg-white/90 text-ink",
};

export function NewsTicker() {
  const { t, lang } = useLang();
  const [news, setNews] = useState<NewsItem[]>(SEED_NEWS);

  useEffect(() => {
    supabase
      .from("trade_news")
      .select("id,bulletin_date,published_at,organisme,category,title_fr,title_ar,title_en,source_label,url")
      .eq("published", true)
      .order("bulletin_date", { ascending: false }).order("published_at", { ascending: false })
      .limit(30)
      .then(({ data, error }) => {
        if (!error && data && data.length) setNews(data as NewsItem[]);
      }, () => {});
  }, []);

  const locale = lang === "ar" ? "ar-DZ" : lang === "en" ? "en-GB" : "fr-FR";
  const fmt = (d: string) => {
    try { return new Date(d + "T12:00:00").toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" }); } catch { return d; }
  };
  const org = (o: string) => orgName(o, lang);
  const title = (n: NewsItem) => (lang === "ar" ? n.title_ar : lang === "en" ? n.title_en : null) || n.title_fr;
  const loop = [...news, ...news];
  const duration = Math.max(40, news.length * 12);

  return (
    <div className="group relative z-10 flex items-stretch overflow-hidden border-y border-white/10 bg-[#071526] text-white" dir={lang === "ar" ? "rtl" : "ltr"} aria-label={t.news.label}>
      <div className="relative z-20 flex shrink-0 items-center gap-2 bg-red-600 px-3 font-display text-xs font-bold uppercase tracking-wider sm:px-5 sm:text-sm">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
        </span>
        <span className="whitespace-nowrap">{t.news.label}</span>
      </div>

      <div className="relative flex-1 overflow-hidden py-2.5" dir="ltr">
        <div className={`flex w-max items-center gap-10 whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] ${lang === "ar" ? "[animation-direction:reverse]" : ""}`}
          style={{ animationDuration: `${duration}s` }}>
          {loop.map((n, i) => (
            <a key={`${n.id}-${i}`} href={n.url} target="_blank" rel="noopener noreferrer" dir={lang === "ar" ? "rtl" : "ltr"}
              className="flex items-center gap-2.5 text-sm text-white/90 transition hover:text-gold-light">
              <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${CAT_STYLE[n.category] || CAT_STYLE.actualite}`}>
                {t.news.cats[n.category] || n.category}
              </span>
              <span className="font-semibold text-gold-light">{org(n.organisme)}</span>
              <span className="text-white/40">•</span>
              <span>{title(n)}</span>
              <span className="text-xs text-white/50">— {n.source_label}, {fmt(n.published_at)}</span>
              <ExternalLink size={12} className="text-white/40" />
            </a>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#071526] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#071526] to-transparent" />
      </div>

      <a href="#bulletin" className="relative z-20 hidden shrink-0 items-center bg-navy-2 px-4 text-xs font-semibold text-gold-light hover:text-white md:flex">
        {t.news.all}
      </a>
    </div>
  );
}

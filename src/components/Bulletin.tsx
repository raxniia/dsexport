"use client";
import { useEffect, useMemo, useState } from "react";
import { ExternalLink, MessageCircle, BadgeCheck, Newspaper, Info } from "lucide-react";
import { useLang } from "./LangProvider";
import { Kicker, Reveal } from "./ui";
import { supabase } from "@/lib/supabase";
import { SEED_NEWS, orgName, type NewsItem } from "@/lib/news";
import { waLink } from "@/lib/site";

type SectionKey = "loi" | "procedure" | "institution" | "marche";
const SECTION_OF: Record<NewsItem["category"], SectionKey> = {
  loi: "loi", procedure: "procedure", institution: "institution",
  marche: "marche", evenement: "marche", operation: "marche", actualite: "institution",
};
const ORDER: SectionKey[] = ["loi", "procedure", "institution", "marche"];

export function Bulletin() {
  const { t, lang } = useLang();
  const [items, setItems] = useState<NewsItem[]>(SEED_NEWS.map((n) => ({ ...n, bulletin_date: n.bulletin_date || n.published_at })));
  const [day, setDay] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("trade_news")
      .select("id,bulletin_date,published_at,organisme,category,title_fr,title_ar,title_en,summary_fr,summary_ar,summary_en,source_label,url,is_official")
      .eq("published", true)
      .order("bulletin_date", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(120)
      .then(({ data, error }) => { if (!error && data && data.length) setItems(data as NewsItem[]); }, () => {});
  }, []);

  const days = useMemo(() => Array.from(new Set(items.map((n) => n.bulletin_date || n.published_at))).slice(0, 7), [items]);
  const current = day && days.includes(day) ? day : days[0];
  const todays = items.filter((n) => (n.bulletin_date || n.published_at) === current);

  const locale = lang === "ar" ? "ar-DZ" : lang === "en" ? "en-GB" : "fr-FR";
  const fmt = (d: string, long = false) => {
    try { return new Date(d + "T12:00:00").toLocaleDateString(locale, long ? { weekday: "long", day: "numeric", month: "long", year: "numeric" } : { day: "numeric", month: "short" }); } catch { return d; }
  };
  const pick = (n: NewsItem, k: "title" | "summary") => {
    const v = (lang === "ar" ? n[`${k}_ar`] : lang === "en" ? n[`${k}_en`] : null) || n[`${k}_fr`];
    return v || "";
  };

  const shareText = `${t.bulletin.title} — ${current ? fmt(current, true) : ""}\n\n${todays.slice(0, 6).map((n) => `• ${pick(n, "title")}\n${n.url}`).join("\n\n")}`;

  return (
    <section id="bulletin" className="relative scroll-mt-24 bg-white px-4 py-20 sm:px-6 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <Kicker>{t.bulletin.latest}{current ? ` — ${fmt(current, true)}` : ""}</Kicker>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">{t.bulletin.title}</h2>
            <p className="mt-4 max-w-2xl text-muted">{t.bulletin.sub}</p>
          </Reveal>
          <Reveal delay={100}>
            <a href={waLink(shareText)} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 hover:brightness-95">
              <MessageCircle size={16} />{t.bulletin.share}
            </a>
          </Reveal>
        </div>

        {days.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {days.map((d) => (
              <button key={d} onClick={() => setDay(d)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${d === current ? "bg-ink text-gold-light" : "bg-cream ring-1 ring-ink/10 hover:ring-brand"}`}>
                {fmt(d)}
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {ORDER.map((sec) => {
            const list = todays.filter((n) => SECTION_OF[n.category] === sec);
            return (
              <Reveal key={sec}>
                <div className="glass-light h-full rounded-[28px] p-6">
                  <h3 className="font-display text-xl font-bold">{t.bulletin.sections[sec]}</h3>
                  {list.length === 0 ? (
                    <p className="mt-4 text-sm text-muted">{t.bulletin.empty}</p>
                  ) : (
                    <ul className="mt-4 space-y-4">
                      {list.map((n) => (
                        <li key={n.id} className="rounded-2xl bg-white p-4 ring-1 ring-ink/5">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                            <span className="rounded-full bg-ink px-2.5 py-1 text-gold-light">{orgName(n.organisme, lang)}</span>
                            {n.is_official ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700"><BadgeCheck size={12} />{t.bulletin.official}</span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-muted"><Newspaper size={12} />{t.bulletin.press}</span>
                            )}
                            <span className="text-muted">{fmt(n.published_at)}</span>
                          </div>
                          <p className="mt-2 font-display font-semibold leading-snug">{pick(n, "title")}</p>
                          {pick(n, "summary") && <p className="mt-1.5 text-sm leading-relaxed text-ink/75">{pick(n, "summary")}</p>}
                          <a href={n.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-dark hover:underline">
                            {t.bulletin.read} — {n.source_label} <ExternalLink size={12} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-6 flex items-center gap-1.5 text-xs text-muted"><Info size={13} />{t.bulletin.disclaimer}</p>
      </div>
    </section>
  );
}

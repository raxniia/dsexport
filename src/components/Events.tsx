"use client";
import { useEffect, useState } from "react";
import { CalendarDays, MapPin, X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useLang } from "./LangProvider";
import { Kicker, Reveal } from "./ui";
import { supabase } from "@/lib/supabase";

type Post = { id: string; event_date: string | null; title: string; location: string | null; body: string | null; cover_url: string | null; gallery: string[]; lang: "fr" | "ar" | "en" };

export function Events() {
  const { t, lang } = useLang();
  const [posts, setPosts] = useState<Post[]>([]);
  const [open, setOpen] = useState<Post | null>(null);
  const [photo, setPhoto] = useState(0);

  useEffect(() => {
    supabase.from("posts").select("id,event_date,title,location,body,cover_url,gallery,lang")
      .eq("published", true).order("event_date", { ascending: false }).order("created_at", { ascending: false }).limit(12)
      .then(({ data }) => setPosts((data as Post[]) || []), () => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    const f = (e: KeyboardEvent) => {
      const n = photos(open).length;
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setPhoto((p) => (p + 1) % n);
      if (e.key === "ArrowLeft") setPhoto((p) => (p - 1 + n) % n);
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [open]);

  const fmt = (d: string | null, l: string = lang) => {
    if (!d) return "";
    const locale = l === "ar" ? "ar-DZ" : l === "en" ? "en-GB" : "fr-FR";
    try { return new Date(d + "T12:00:00").toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }); } catch { return d; }
  };
  const photos = (p: Post) => [p.cover_url, ...(p.gallery || [])].filter(Boolean) as string[];

  if (posts.length === 0) return null; // section hidden until the first article is published

  return (
    <section id="events" className="relative scroll-mt-24 bg-white px-4 py-20 sm:px-6 md:py-28">
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <Kicker>{t.events.kicker}</Kicker>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">{t.events.title}</h2>
          <p className="mt-4 max-w-2xl text-muted">{t.events.sub}</p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => {
            const n = photos(p).length;
            return (
              <Reveal key={p.id} delay={(i % 3) * 80}>
                <button onClick={() => { setOpen(p); setPhoto(0); }} className="tilt group flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-cream text-start ring-1 ring-ink/5">
                  <div className="relative h-56 w-full overflow-hidden bg-ink">
                    {p.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.cover_url} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src="/brand/ds-export-logo-transparent.webp" alt="" className="mx-auto h-full w-4/5 object-contain" />
                    )}
                    {n > 1 && <span className="absolute end-3 top-3 inline-flex items-center gap-1 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-white"><Images size={12} />{n}</span>}
                  </div>
                  <div className="flex flex-1 flex-col p-5" dir={p.lang === "ar" ? "rtl" : "ltr"}>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold text-brand-dark">
                      {p.event_date && <span className="inline-flex items-center gap-1"><CalendarDays size={13} />{fmt(p.event_date, p.lang)}</span>}
                      {p.location && <span className="inline-flex items-center gap-1"><MapPin size={13} />{p.location}</span>}
                    </div>
                    <p className="mt-2 font-display text-lg font-semibold leading-snug">{p.title}</p>
                    {p.body && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/70">{p.body}</p>}
                    <span className="mt-auto pt-4 text-sm font-semibold text-brand-dark">{t.events.read} →</span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      {open && (() => {
        const list = photos(open);
        return (
          <div className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-3 sm:p-6" onClick={() => setOpen(null)}>
            <article className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white" onClick={(e) => e.stopPropagation()}>
              {list.length > 0 && (
                <div className="relative bg-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={list[photo]} alt="" className="max-h-[60vh] w-full object-contain" />
                  {list.length > 1 && (
                    <>
                      <button onClick={() => setPhoto((photo - 1 + list.length) % list.length)} className="absolute start-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink" aria-label="précédent"><ChevronLeft size={18} className="rtl:rotate-180" /></button>
                      <button onClick={() => setPhoto((photo + 1) % list.length)} className="absolute end-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink" aria-label="suivant"><ChevronRight size={18} className="rtl:rotate-180" /></button>
                      <span className="absolute bottom-3 start-1/2 -translate-x-1/2 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white">{photo + 1} / {list.length}</span>
                    </>
                  )}
                </div>
              )}
              {list.length > 1 && (
                <div className="flex gap-2 overflow-x-auto bg-ink px-3 pb-3">
                  {list.map((u, i) => (
                    <button key={u} onClick={() => setPhoto(i)} className={`shrink-0 overflow-hidden rounded-lg ring-2 ${i === photo ? "ring-brand" : "ring-transparent opacity-70"}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={u} alt="" className="h-14 w-20 object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <div className="p-6 sm:p-8" dir={open.lang === "ar" ? "rtl" : "ltr"}>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-brand-dark">
                  {open.event_date && <span className="inline-flex items-center gap-1.5"><CalendarDays size={15} />{fmt(open.event_date, open.lang)}</span>}
                  {open.location && <span className="inline-flex items-center gap-1.5"><MapPin size={15} />{open.location}</span>}
                </div>
                <h3 className="mt-3 text-2xl font-bold">{open.title}</h3>
                {open.body && <p className="mt-4 whitespace-pre-line leading-relaxed text-ink/80">{open.body}</p>}
                <button onClick={() => setOpen(null)} className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-soft px-5 py-2 text-sm font-semibold"><X size={15} />{t.events.close}</button>
              </div>
            </article>
          </div>
        );
      })()}
    </section>
  );
}

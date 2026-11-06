"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { dict, type Dict, type Lang } from "@/lib/i18n";

type Ctx = { lang: Lang; t: Dict; setLang: (l: Lang) => void; ask: (q: string, journey?: string) => void; pending: { q: string; journey?: string; n: number } | null };
const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  const [pending, setPending] = useState<Ctx["pending"]>(null);

  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("lang") as Lang | null;
      const saved = (q && dict[q] ? q : localStorage.getItem("ds-lang")) as Lang | null;
      if (saved && dict[saved]) setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("ds-lang", l); } catch {}
  };

  const ask = (q: string, journey?: string) => {
    setPending((p) => ({ q, journey, n: (p?.n || 0) + 1 }));
    document.getElementById("assistant")?.scrollIntoView({ behavior: "smooth" });
  };

  return <LangCtx.Provider value={{ lang, t: dict[lang], setLang, ask, pending }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useLang outside provider");
  return c;
}

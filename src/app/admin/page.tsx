"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, type Session } from "@supabase/supabase-js";
import {
  Users, CalendarDays, Globe2, Briefcase, Gauge, Bot, Newspaper, LogOut, RefreshCw, Download,
  Search, MessageCircle, Phone, Mail, Check, Trash2, Loader2, Lock, Eye, EyeOff,
} from "lucide-react";

// Same public Supabase project as the site. Data is protected by RLS:
// only signed-in users whose e-mail is in admin_emails can read it.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ejzixksomjkrzhnvfwif.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_DgNQiB04xrJa7q2LV1diuA_bn7_B853",
  { auth: { persistSession: true, storageKey: "ds-admin" } },
);

type Row = Record<string, unknown> & { id: string; created_at: string };
type TabKey = "network" | "bookings" | "investors" | "projects" | "readiness" | "assistant" | "news";

const TABS: { key: TabKey; table: string; label: string; icon: React.ElementType; cols: [string, string][]; flag?: { col: string; on: string; off: string } }[] = [
  { key: "network", table: "network_members", label: "Réseau", icon: Users, flag: { col: "approved", on: "Publié", off: "En attente" },
    cols: [["created_at", "Date"], ["kind", "Type"], ["company", "Entreprise"], ["contact_name", "Contact"], ["phone", "Téléphone"], ["email", "E-mail"], ["country", "Pays"], ["sector", "Secteur"], ["products", "Produits / besoins"]] },
  { key: "bookings", table: "bookings", label: "Rendez-vous", icon: CalendarDays,
    cols: [["created_at", "Reçu le"], ["status", "Statut"], ["full_name", "Nom"], ["company", "Entreprise"], ["phone", "Téléphone"], ["email", "E-mail"], ["topic", "Sujet"], ["duration", "Durée"], ["preferred_date", "Date souhaitée"], ["preferred_time", "Heure"], ["message", "Message"]] },
  { key: "investors", table: "investor_profiles", label: "Investisseurs", icon: Globe2,
    cols: [["created_at", "Date"], ["full_name", "Nom"], ["organization", "Organisation"], ["country", "Pays"], ["email", "E-mail"], ["phone", "Téléphone"], ["sectors", "Secteurs"], ["ticket", "Montant"], ["deal_type", "Partenariat"], ["message", "Message"]] },
  { key: "projects", table: "investment_projects", label: "Projets", icon: Briefcase, flag: { col: "approved", on: "Publié", off: "En attente" },
    cols: [["created_at", "Date"], ["title", "Projet"], ["company", "Entreprise"], ["contact_name", "Contact"], ["phone", "Téléphone"], ["email", "E-mail"], ["wilaya", "Wilaya"], ["sector", "Secteur"], ["amount_range", "Montant"], ["deal_type", "Partenariat"], ["stage", "Stade"], ["description", "Description"]] },
  { key: "readiness", table: "readiness_results", label: "Scores export", icon: Gauge,
    cols: [["created_at", "Date"], ["score", "Score"], ["target_country", "Pays visé"], ["contact", "Contact"]] },
  { key: "assistant", table: "assistant_messages", label: "Questions IA", icon: Bot,
    cols: [["created_at", "Date"], ["lang", "Langue"], ["journey", "Parcours"], ["question", "Question"]] },
  { key: "news", table: "trade_news", label: "Actualités", icon: Newspaper, flag: { col: "published", on: "En ligne", off: "Masqué" },
    cols: [["bulletin_date", "Bulletin"], ["category", "Catégorie"], ["organisme", "Organisme"], ["title_fr", "Titre"], ["source_label", "Source"], ["url", "Lien"]] },
];

const LABELS: Record<string, string> = {
  exporter: "Exportateur", importer: "Acheteur étranger", partner: "Partenaire",
  export: "Export", import: "Import", market: "Nouveau marché", opportunity: "Opportunité", admin: "Administratif", other: "Autre",
  jv: "Joint-venture", offtake: "Achat garanti", equity: "Participation", supply: "Approvisionnement", industrial: "Industriel",
  "lt100k": "< 100 k$", "100k-500k": "100–500 k$", "500k-2m": "0,5–2 M$", "2m-10m": "2–10 M$", "gt10m": "> 10 M$", undisclosed: "Non communiqué",
  idea: "Idée", running: "En activité", expansion: "Extension",
  new: "Nouveau", confirmed: "Confirmé", done: "Terminé", cancelled: "Annulé",
};

const fmtDate = (v: unknown) => {
  if (typeof v !== "string") return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return new Date(v + "T12:00:00").toLocaleDateString("fr-FR");
  const d = new Date(v);
  return isNaN(+d) ? v : d.toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};
const show = (k: string, v: unknown) => {
  if (v === null || v === undefined || v === "") return "—";
  if (k === "created_at" || k.endsWith("_date") || k === "published_at") return fmtDate(v);
  if (k === "duration") return `${v} min`;
  if (k === "score") return `${v} %`;
  if (typeof v === "string" && LABELS[v]) return LABELS[v];
  return String(v);
};
const waNum = (p: unknown) => {
  if (typeof p !== "string") return null;
  let d = p.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0") && d.length === 10) d = "213" + d.slice(1);
  return d.length >= 9 ? d : null;
};

function toCSV(rows: Row[], cols: [string, string][]) {
  const esc = (x: string) => `"${x.replace(/"/g, '""')}"`;
  const head = cols.map(([, l]) => esc(l)).join(";");
  const body = rows.map((r) => cols.map(([k]) => esc(show(k, r[k]))).join(";")).join("\n");
  return "﻿" + head + "\n" + body;
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!ready) return <div className="grid min-h-screen place-items-center bg-cream"><Loader2 className="animate-spin text-brand" /></div>;
  return session ? <Dashboard email={session.user.email || ""} /> : <Login />;
}

function Login() {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const redirect = `${window.location.origin}/admin`;
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
      if (error) setMsg({ ok: false, text: error.message.includes("confirm") ? "E-mail pas encore confirmé : ouvrez le lien reçu par e-mail." : "E-mail ou mot de passe incorrect." });
    } else if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password: pwd, options: { emailRedirectTo: redirect } });
      setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Compte créé. Ouvrez l’e-mail de confirmation, puis revenez ici pour vous connecter." });
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirect });
      setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Si ce compte existe, un e-mail de réinitialisation a été envoyé." });
    }
    setBusy(false);
  };

  return (
    <main className="navy-mesh grid min-h-screen place-items-center px-4 py-10 text-white">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[28px] bg-cream p-7 text-ink shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink font-display text-sm font-extrabold"><span className="gold-text">DS</span></span>
          <div><p className="font-display text-lg font-bold">DS EXPORT</p><p className="text-xs text-muted">Espace administrateur</p></div>
        </div>
        <h1 className="mt-6 text-xl font-bold">{mode === "login" ? "Connexion" : mode === "signup" ? "Créer le compte admin" : "Mot de passe oublié"}</h1>
        <div className="mt-4 space-y-3">
          <input required type="email" autoComplete="email" className="field" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          {mode !== "reset" && (
            <div className="relative">
              <input required minLength={8} type={showPwd ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="field pe-11" placeholder="Mot de passe (8 caractères min.)" value={pwd} onChange={(e) => setPwd(e.target.value)} />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted" aria-label="afficher">
                {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          )}
        </div>
        {msg && <p className={`mt-3 text-sm font-medium ${msg.ok ? "text-emerald-700" : "text-red-600"}`}>{msg.text}</p>}
        <button type="submit" disabled={busy} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 font-semibold text-gold-light disabled:opacity-60">
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
          {mode === "login" ? "Se connecter" : mode === "signup" ? "Créer le compte" : "Envoyer le lien"}
        </button>
        <div className="mt-4 flex flex-wrap justify-between gap-2 text-xs font-semibold text-brand-dark">
          {mode !== "login" && <button type="button" onClick={() => { setMode("login"); setMsg(null); }}>← Connexion</button>}
          {mode === "login" && <button type="button" onClick={() => { setMode("signup"); setMsg(null); }}>Première fois ? Créer le compte</button>}
          {mode === "login" && <button type="button" onClick={() => { setMode("reset"); setMsg(null); }}>Mot de passe oublié</button>}
        </div>
        <p className="mt-5 text-[11px] leading-relaxed text-muted">Accès réservé : seuls les e-mails autorisés par DS EXPORT voient les données.</p>
      </form>
    </main>
  );
}

function Dashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<TabKey>("network");
  const [data, setData] = useState<Partial<Record<TabKey, Row[]>>>({});
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [onlyPending, setOnlyPending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await Promise.all(TABS.map((t) =>
      supabase.from(t.table).select("*").order(t.key === "news" ? "bulletin_date" : "created_at", { ascending: false }).limit(1000)));
    const next: Partial<Record<TabKey, Row[]>> = {};
    res.forEach((r, i) => { next[TABS[i].key] = (r.data as Row[]) || []; });
    setData(next);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const conf = TABS.find((t) => t.key === tab)!;
  const rows = useMemo(() => {
    let r = data[tab] || [];
    if (onlyPending && conf.flag) r = r.filter((x) => !x[conf.flag!.col]);
    if (onlyPending && tab === "bookings") r = r.filter((x) => x.status === "new");
    if (q.trim()) {
      const s = q.toLowerCase();
      r = r.filter((x) => conf.cols.some(([k]) => String(x[k] ?? "").toLowerCase().includes(s)));
    }
    return r;
  }, [data, tab, q, onlyPending, conf]);

  const update = async (id: string, patch: Record<string, unknown>) => {
    const { error } = await supabase.from(conf.table).update(patch).eq("id", id);
    if (!error) setData((d) => ({ ...d, [tab]: (d[tab] || []).map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
    else alertMsg(error.message);
  };
  const remove = async (id: string) => {
    if (!window.confirm("Supprimer définitivement cette ligne ?")) return;
    const { error } = await supabase.from(conf.table).delete().eq("id", id);
    if (!error) setData((d) => ({ ...d, [tab]: (d[tab] || []).filter((x) => x.id !== id) }));
    else alertMsg(error.message);
  };
  const [err, setErr] = useState("");
  const alertMsg = (m: string) => { setErr(m); setTimeout(() => setErr(""), 5000); };

  const exportCSV = () => {
    const blob = new Blob([toCSV(rows, conf.cols)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ds-export-${conf.key}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const canDelete = ["network", "bookings", "investors", "projects"].includes(tab);
  const privateCount = (["network", "bookings", "investors", "projects", "readiness", "assistant"] as TabKey[]).reduce((n, k) => n + (data[k]?.length || 0), 0);

  return (
    <main className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-ink text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <a href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-2 font-display text-xs font-extrabold ring-1 ring-brand/50"><span className="gold-text">DS</span></span>
            <span className="font-display font-bold">Admin <span className="gold-text">DS EXPORT</span></span>
          </a>
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden text-white/60 sm:inline">{email}</span>
            <button onClick={load} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Actualiser">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button onClick={() => supabase.auth.signOut()} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 hover:bg-white/20"><LogOut size={15} />Sortir</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {!loading && privateCount === 0 && (
          <div className="mb-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            Aucune donnée visible. Si des inscriptions existent déjà, votre e-mail <b>{email}</b> n’est peut-être pas encore autorisé comme administrateur.
          </div>
        )}
        {err && <div className="mb-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{err}</div>}

        {/* stat cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {TABS.map((t) => {
            const I = t.icon;
            const list = data[t.key] || [];
            const pending = t.flag ? list.filter((x) => !x[t.flag!.col]).length : t.key === "bookings" ? list.filter((x) => x.status === "new").length : 0;
            return (
              <button key={t.key} onClick={() => { setTab(t.key); setQ(""); setOnlyPending(false); }}
                className={`rounded-2xl p-4 text-start transition ${tab === t.key ? "bg-ink text-white shadow-lg" : "bg-white ring-1 ring-ink/5 hover:ring-brand"}`}>
                <div className="flex items-center justify-between">
                  <I size={18} className={tab === t.key ? "text-gold-light" : "text-brand-dark"} />
                  {pending > 0 && <span className="rounded-full gold-bg px-2 py-0.5 text-[10px] font-bold text-ink">{pending} new</span>}
                </div>
                <p className="mt-3 font-display text-2xl font-bold">{list.length}</p>
                <p className={`text-xs ${tab === t.key ? "text-white/70" : "text-muted"}`}>{t.label}</p>
              </button>
            );
          })}
        </div>

        {/* toolbar */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <h1 className="me-auto font-display text-2xl font-bold">{conf.label}</h1>
          <label className="relative">
            <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted" />
            <input className="field w-64 ps-9 !py-2 text-sm" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          {(conf.flag || tab === "bookings") && (
            <button onClick={() => setOnlyPending(!onlyPending)} className={`rounded-full px-4 py-2 text-sm font-semibold ${onlyPending ? "bg-ink text-gold-light" : "bg-white ring-1 ring-ink/10"}`}>
              À traiter seulement
            </button>
          )}
          <button onClick={exportCSV} className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-ink/10 hover:ring-brand"><Download size={15} />Excel (CSV)</button>
        </div>

        {/* table */}
        <div className="mt-4 overflow-x-auto rounded-2xl bg-white ring-1 ring-ink/5">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-soft text-start text-xs uppercase tracking-wide text-muted">
              <tr>
                {conf.flag && <th className="px-3 py-3 text-start">Statut</th>}
                {conf.cols.map(([k, l]) => <th key={k} className="px-3 py-3 text-start">{l}</th>)}
                <th className="px-3 py-3 text-start">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={99} className="px-3 py-10 text-center text-muted"><Loader2 className="mx-auto animate-spin" /></td></tr>}
              {!loading && rows.length === 0 && <tr><td colSpan={99} className="px-3 py-10 text-center text-muted">Aucune donnée pour le moment.</td></tr>}
              {!loading && rows.map((r) => {
                const wa = waNum(r.phone);
                const mail = typeof r.email === "string" && r.email ? r.email : null;
                return (
                  <tr key={r.id} className="border-t border-ink/5 align-top hover:bg-cream/60">
                    {conf.flag && (
                      <td className="px-3 py-3">
                        <button onClick={() => update(r.id, { [conf.flag!.col]: !r[conf.flag!.col] })}
                          className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${r[conf.flag.col] ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {r[conf.flag.col] ? `✓ ${conf.flag.on}` : conf.flag.off}
                        </button>
                      </td>
                    )}
                    {conf.cols.map(([k]) => (
                      <td key={k} className="max-w-[260px] px-3 py-3">
                        {k === "status" && tab === "bookings" ? (
                          <select value={String(r.status || "new")} onChange={(e) => update(r.id, { status: e.target.value })} className="rounded-lg border border-ink/10 bg-white px-2 py-1 text-xs font-semibold">
                            {["new", "confirmed", "done", "cancelled"].map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}
                          </select>
                        ) : k === "url" ? (
                          <a href={String(r.url)} target="_blank" rel="noopener noreferrer" className="text-brand-dark underline">ouvrir</a>
                        ) : (
                          <span className={`block ${["message", "description", "products", "question", "title_fr"].includes(k) ? "line-clamp-3" : "truncate"}`} title={String(r[k] ?? "")}>{show(k, r[k])}</span>
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-3">
                      <div className="flex gap-1.5">
                        {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="grid h-8 w-8 place-items-center rounded-full bg-[#25D366] text-white" title="WhatsApp"><MessageCircle size={14} /></a>}
                        {typeof r.phone === "string" && r.phone && <a href={`tel:${r.phone}`} className="grid h-8 w-8 place-items-center rounded-full bg-ink text-white" title="Appeler"><Phone size={14} /></a>}
                        {mail && <a href={`mailto:${mail}`} className="grid h-8 w-8 place-items-center rounded-full bg-soft" title="E-mail"><Mail size={14} /></a>}
                        {tab === "bookings" && r.status !== "confirmed" && <button onClick={() => update(r.id, { status: "confirmed" })} className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-emerald-800" title="Confirmer"><Check size={14} /></button>}
                        {canDelete && <button onClick={() => remove(r.id)} className="grid h-8 w-8 place-items-center rounded-full bg-red-50 text-red-600" title="Supprimer"><Trash2 size={14} /></button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">{rows.length} ligne(s). « Publié » rend une inscription du réseau ou un projet visible sur le site (projets sans nom d’entreprise).</p>
      </div>
    </main>
  );
}

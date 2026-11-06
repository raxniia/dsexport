"use client";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "li" | "section" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { el.classList.add("in"); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { el.classList.add("in"); io.unobserve(el); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

export function Kicker({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${light ? "bg-white/5 text-gold-light ring-1 ring-white/15" : "bg-brand/10 text-brand-dark ring-1 ring-brand/25"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      {children}
    </div>
  );
}

export function Title({ a, b, light, className = "" }: { a: React.ReactNode; b?: React.ReactNode; light?: boolean; className?: string }) {
  return (
    <h2 className={`mt-4 text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl ${light ? "text-white" : "text-ink"} ${className}`}>
      {a} {b && <span className="gold-text">{b}</span>}
    </h2>
  );
}

export function PillButton({
  href, onClick, children, variant = "dark", type = "button", disabled, className = "", target,
}: {
  href?: string; onClick?: () => void; children: React.ReactNode; variant?: "dark" | "brand" | "light" | "outline";
  type?: "button" | "submit"; disabled?: boolean; className?: string; target?: string;
}) {
  const styles = {
    dark: "bg-ink text-white hover:bg-navy-2 shadow-lg shadow-ink/20",
    brand: "gold-bg text-ink shine shadow-lg shadow-brand/30 hover:brightness-105",
    light: "bg-white text-ink hover:bg-cream",
    outline: "border border-ink/20 text-ink hover:border-brand hover:bg-white",
  }[variant];
  const dot = variant === "brand" ? "bg-ink text-gold-light" : variant === "dark" ? "gold-bg text-ink" : "bg-ink text-white";
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <span className={`relative z-10 grid h-8 w-8 place-items-center rounded-full ${dot} transition-transform duration-300 group-hover:rotate-45 rtl:-scale-x-100`}>
        <ArrowUpRight size={16} />
      </span>
    </>
  );
  const cls = `group inline-flex items-center gap-3 rounded-full py-2 ps-5 pe-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 ${styles} ${className}`;
  if (href) return <a href={href} target={target} rel={target ? "noopener noreferrer" : undefined} className={cls}>{inner}</a>;
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{inner}</button>;
}

export function Section({ id, children, className = "", reveal }: { id?: string; children: React.ReactNode; className?: string; reveal?: boolean }) {
  return (
    <section id={id} className={`relative scroll-mt-24 px-4 py-20 sm:px-6 md:py-28 ${className}`}>
      {reveal ? <Reveal className="relative mx-auto max-w-6xl">{children}</Reveal> : <div className="relative mx-auto max-w-6xl">{children}</div>}
    </section>
  );
}

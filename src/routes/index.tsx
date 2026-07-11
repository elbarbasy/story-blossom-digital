import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Check, Star, Menu, X, Zap, Palette, Search, Smartphone, ShieldCheck, LifeBuoy,
  Rocket, ShoppingCart, LayoutDashboard, PenTool, Wrench, Users2, Database,
  MessageSquare, PhoneCall, Instagram, Linkedin, Github, Music2, ChevronDown, Sparkles,
  Globe, Code2,
} from "lucide-react";
import logoAsset from "@/assets/codestory-logo.asset.json";
import { useLang } from "@/i18n/LanguageContext";
import { LANGS, LANG_LABELS, type Lang } from "@/i18n/translations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeStory — Build Your Digital Success" },
      { name: "description", content: "CodeStory is a premium web development agency crafting modern, responsive, SEO-friendly websites, apps, and custom systems that grow your business." },
      { property: "og:title", content: "CodeStory — Build Your Digital Success" },
      { property: "og:description", content: "Premium web development agency: websites, landing pages, e-commerce, web apps, UI/UX and custom systems." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "CodeStory",
        slogan: "Build Your Digital Success",
        url: "/",
      }),
    }],
  }),
  component: LandingPage,
});

/* ---------- Small primitives ---------- */

function FadeUp({ children, delay = 0, y = 24, className = "" }: { children: React.ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function MagneticButton({
  children, variant = "primary", href = "#", className = "",
}: { children: React.ReactNode; variant?: "primary" | "ghost" | "outline"; href?: string; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const base = "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors";
  const styles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-deep shadow-[var(--shadow-lift)] hover:shadow-[var(--shadow-glow)]",
    outline: "border border-border bg-white/60 backdrop-blur text-ink hover:bg-white",
    ghost: "text-ink hover:bg-secondary",
  }[variant];

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </motion.a>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

/* ---------- Language toggle ---------- */

function LangToggle({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`inline-flex items-center gap-0.5 rounded-full border border-border bg-white/70 backdrop-blur p-0.5 ${compact ? "shadow-sm" : ""}`}>
      {LANGS.map((l: Lang) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-label={l === "en" ? "English" : "Bahasa Indonesia"}
          className={`relative rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
            lang === l ? "bg-primary text-primary-foreground" : "text-ink/60 hover:text-ink"
          }`}
        >
          {LANG_LABELS[l]}
        </button>
      ))}
    </div>
  );
}

/* ---------- Navbar ---------- */

function Navbar() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NAV = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.services, href: "#services" },
    { label: t.nav.portfolio, href: "#portfolio" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.faq, href: "#faq" },
    { label: t.nav.contact, href: "#contact" },
  ];

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
      <div className="container-1280">
        <nav className={`flex items-center justify-between gap-3 rounded-full border border-border/70 pl-3 pr-2 py-2 transition-all ${scrolled ? "glass shadow-[var(--shadow-soft)]" : "bg-white/50 backdrop-blur"}`}>
          <a href="#home" className="flex min-w-0 items-center gap-2 pl-1">
            <img src={logoAsset.url} alt="CodeStory" className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-lg object-cover" />
            <span className="truncate font-extrabold tracking-tight text-ink text-base sm:text-lg">
              Code<span className="text-primary">Story</span>
            </span>
          </a>
          <ul className="hidden lg:flex items-center gap-1">
            {NAV.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-4 py-2 text-sm font-medium text-ink/70 hover:text-ink hover:bg-secondary transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 shrink-0">
            <LangToggle />
            <div className="hidden sm:block">
              <MagneticButton href="#contact" className="!py-2.5 !px-5 whitespace-nowrap">
                {t.nav.cta} <ArrowRight className="h-4 w-4" />
              </MagneticButton>
            </div>
            <button onClick={() => setOpen((v) => !v)} className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-ink" aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="lg:hidden mt-2 rounded-3xl glass p-3 shadow-[var(--shadow-soft)]"
            >
              {NAV.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-sm font-medium text-ink/80 hover:bg-secondary">
                  {l.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)} className="mt-1 block text-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
                {t.nav.cta}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */

function BrowserMock({ children, url = "codestory.dev" }: { children: React.ReactNode; url?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white shadow-[var(--shadow-lift)] overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-secondary/70">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-auto rounded-md bg-white/80 border border-border px-3 py-0.5 text-[10px] text-muted-foreground">{url}</div>
      </div>
      {children}
    </div>
  );
}

function Hero() {
  const { t } = useLang();
  const wrap = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const rotX = useTransform(sy, [-1, 1], [6, -6]);
  const rotY = useTransform(sx, [-1, 1], [-8, 8]);

  return (
    <section id="home" ref={wrap} className="relative overflow-hidden pt-28 sm:pt-32 pb-16 sm:pb-24 bg-mesh-hero"
      onMouseMove={(e) => {
        const r = wrap.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
        my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
      }}
    >
      {/* blobs & grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/25 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute top-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-primary-deep/25 blur-3xl animate-blob" style={{ animationDelay: "-4s" }} />

      <div className="container-1280 relative grid lg:grid-cols-12 gap-10 sm:gap-12 items-center">
        <div className="lg:col-span-6">
          <FadeUp>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur px-3 py-1.5 text-xs font-medium text-ink/70">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> {t.hero.badge}
            </span>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
              {t.hero.titleLead}{" "}
              <span className="text-gradient-brand">{t.hero.titleHighlight}</span>{" "}
              {t.hero.titleTrail}
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-5 sm:mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t.hero.subtitle}
            </p>
          </FadeUp>
          <FadeUp delay={0.25}>
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton href="#contact">
                {t.hero.ctaPrimary} <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton href="#portfolio" variant="outline">
                {t.hero.ctaSecondary} <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
            </div>
          </FadeUp>
          <FadeUp delay={0.35}>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {["from-primary to-primary-deep","from-sky-400 to-primary","from-indigo-500 to-primary-deep","from-primary to-indigo-600"].map((g,i)=>(
                  <div key={i} className={`h-8 w-8 rounded-full bg-gradient-to-br ${g} ring-2 ring-white`} />
                ))}
              </div>
              <div><span className="font-semibold text-ink">{t.hero.clients}</span> {t.hero.clientsSub}</div>
            </div>
          </FadeUp>
        </div>

        {/* MacBook mockup */}
        <div className="lg:col-span-6 relative">
          <motion.div style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1200 }} className="relative">
            <div className="relative mx-auto max-w-[560px]">
              {/* screen */}
              <div className="rounded-[22px] bg-[#0F172A] p-2 shadow-[var(--shadow-glow)]">
                <div className="rounded-[16px] overflow-hidden bg-white">
                  <BrowserMock>
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-primary-deep" />
                          <div className="h-2.5 w-16 rounded bg-ink/80" />
                        </div>
                        <div className="flex gap-2">
                          <div className="h-2 w-8 rounded bg-muted-foreground/30" />
                          <div className="h-2 w-8 rounded bg-muted-foreground/30" />
                          <div className="h-2 w-14 rounded-full bg-primary" />
                        </div>
                      </div>
                      <div className="mt-6 grid grid-cols-5 gap-4">
                        <div className="col-span-3 space-y-3">
                          <div className="h-3 w-40 rounded bg-ink/80" />
                          <div className="h-6 w-64 rounded bg-gradient-to-r from-primary to-primary-deep" />
                          <div className="h-2 w-full rounded bg-muted" />
                          <div className="h-2 w-4/5 rounded bg-muted" />
                          <div className="mt-2 flex gap-2">
                            <div className="h-7 w-24 rounded-full bg-primary" />
                            <div className="h-7 w-20 rounded-full border border-border" />
                          </div>
                        </div>
                        <div className="col-span-2 aspect-square rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary-deep/20 border border-border" />
                      </div>
                      <div className="mt-5 grid grid-cols-3 gap-3">
                        {[0,1,2].map(i=>(
                          <div key={i} className="rounded-lg border border-border p-3">
                            <div className="h-6 w-6 rounded bg-primary/15" />
                            <div className="mt-2 h-2 w-16 rounded bg-ink/70" />
                            <div className="mt-1.5 h-1.5 w-full rounded bg-muted" />
                            <div className="mt-1 h-1.5 w-2/3 rounded bg-muted" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </BrowserMock>
                </div>
              </div>
              {/* base */}
              <div className="mx-auto h-3 w-full -mt-1 rounded-b-2xl bg-gradient-to-b from-[#0F172A] to-[#1e293b]" />
              <div className="mx-auto h-1 w-24 rounded-b-full bg-black/20" />
            </div>

            {/* floating cards */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute -left-6 top-16 hidden sm:block"
            >
              <div className="glass rounded-2xl p-3 shadow-[var(--shadow-lift)] animate-float">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 grid place-items-center text-primary"><Zap className="h-4 w-4" /></div>
                  <div>
                    <div className="text-xs text-muted-foreground">{t.hero.lighthouse}</div>
                    <div className="text-sm font-bold text-ink">98 / 100</div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30, y: -20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.75, duration: 0.8 }}
              className="absolute -right-4 bottom-10 hidden sm:block"
            >
              <div className="glass rounded-2xl p-3 shadow-[var(--shadow-lift)] animate-float" style={{ animationDelay: "-2s" }}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 grid place-items-center text-primary"><Search className="h-4 w-4" /></div>
                  <div>
                    <div className="text-xs text-muted-foreground">{t.hero.seo}</div>
                    <div className="text-sm font-bold text-ink">A+ Ranked</div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 hidden md:block"
            >
              <div className="glass rounded-2xl px-4 py-3 shadow-[var(--shadow-lift)]">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1.5">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary-deep ring-2 ring-white" />
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-sky-400 to-primary ring-2 ring-white" />
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-primary-deep ring-2 ring-white" />
                  </div>
                  <div className="text-xs"><span className="font-semibold text-ink">{t.hero.conversions.split(" ")[0]}</span> {t.hero.conversions.split(" ").slice(1).join(" ")}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Marquee ---------- */

const LOGOS = ["Northwind", "Lumen", "Vantage", "Orbita", "Meridian", "Helix", "Pixelform", "Fluxwave", "Kairo", "Novabank"];

function Marquee() {
  const { t } = useLang();
  return (
    <section className="py-16 border-y border-border bg-white">
      <div className="container-1280">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
          {t.marquee.label}
        </p>
        <div className="mt-8 relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex gap-16 animate-marquee w-max">
            {[...LOGOS, ...LOGOS].map((n, i) => (
              <div key={i} className="text-2xl font-extrabold tracking-tight text-ink/40 hover:text-ink transition-colors whitespace-nowrap">
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Statistics ---------- */

function Statistics() {
  const { t } = useLang();
  const stats = [
    { v: 250, s: "+", l: t.stats.projects },
    { v: 150, s: "+", l: t.stats.clients },
    { v: 98, s: "%", l: t.stats.satisfaction },
    { v: 24, s: "/7", l: t.stats.support },
  ];
  return (
    <section className="py-16 sm:py-24">
      <div className="container-1280">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="rounded-3xl border border-border bg-white p-5 sm:p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] transition-shadow">
                <div className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gradient-brand">
                  <Counter to={s.v} suffix={s.s} />
                </div>
                <div className="mt-2 text-xs sm:text-sm text-muted-foreground">{s.l}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */

const SERVICE_ICONS = [Globe, Rocket, ShoppingCart, LayoutDashboard, PenTool, Wrench, Users2, Database];

function Services() {
  const { t } = useLang();
  return (
    <section id="services" className="py-16 sm:py-24 bg-surface">
      <div className="container-1280">
        <FadeUp>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">{t.services.label}</span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">{t.services.title}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t.services.subtitle}</p>
          </div>
        </FadeUp>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.services.items.map((s, i) => {
            const Icon = SERVICE_ICONS[i] ?? Globe;
            return (
              <FadeUp key={s.title} delay={i * 0.04}>
                <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="group h-full rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] transition-shadow">
                  <div className="relative h-11 w-11 rounded-2xl bg-primary/10 grid place-items-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.services.learnMore} <ArrowRight className="h-4 w-4" />
                  </div>
                </motion.div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Why Choose Us ---------- */

const WHY_ICONS = [Zap, Palette, Search, Smartphone, ShieldCheck, LifeBuoy];

function WhyChoose() {
  const { t } = useLang();
  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="container-1280">
        <FadeUp>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">{t.why.label}</span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">{t.why.title}</h2>
          </div>
        </FadeUp>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.why.items.map((w, i) => {
            const Icon = WHY_ICONS[i] ?? Zap;
            return (
              <FadeUp key={w.title} delay={i * 0.05}>
                <div className="group relative h-full rounded-3xl border border-border bg-white p-7 overflow-hidden">
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-start gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-primary/10 grid place-items-center text-primary shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-ink">{w.title}</h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Process ---------- */

function Process() {
  const { t } = useLang();
  return (
    <section className="py-16 sm:py-24 bg-surface">
      <div className="container-1280">
        <FadeUp>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">{t.process.label}</span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">{t.process.title}</h2>
          </div>
        </FadeUp>
        <div className="mt-16 relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />
          <ul className="space-y-10">
            {t.process.items.map((p, i) => (
              <FadeUp key={p.t} delay={i * 0.04}>
                <li className={`relative md:grid md:grid-cols-2 md:gap-10 items-center ${i % 2 ? "md:[&>*:first-child]:col-start-2" : ""}`}>
                  <div className={`pl-12 md:pl-0 ${i % 2 ? "md:text-left md:pl-10" : "md:text-right md:pr-10"}`}>
                    <div className="text-xs font-semibold text-primary">{t.process.step} {String(i + 1).padStart(2, "0")}</div>
                    <h3 className="mt-1 text-2xl font-bold text-ink">{p.t}</h3>
                    <p className="mt-2 text-muted-foreground">{p.d}</p>
                  </div>
                  <div className="hidden md:block" />
                  <div className="absolute left-4 md:left-1/2 top-1.5 -translate-x-1/2">
                    <div className="h-8 w-8 rounded-full bg-white border-2 border-primary grid place-items-center shadow-[var(--shadow-soft)]">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    </div>
                  </div>
                </li>
              </FadeUp>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Portfolio ---------- */

const PROJECTS: { title: string; catIdx: number; hue: string }[] = [
  { title: "Northwind Corporate", catIdx: 1, hue: "from-primary to-primary-deep" },
  { title: "Lumen Launch", catIdx: 2, hue: "from-sky-400 to-primary" },
  { title: "Orbita Store", catIdx: 4, hue: "from-indigo-500 to-primary-deep" },
  { title: "Vantage Dashboard", catIdx: 3, hue: "from-primary to-indigo-600" },
  { title: "Meridian Studio", catIdx: 1, hue: "from-blue-500 to-primary-deep" },
  { title: "Helix Checkout", catIdx: 4, hue: "from-sky-500 to-indigo-600" },
];

function Portfolio() {
  const { t } = useLang();
  const cats = t.portfolio.cats;
  const [cat, setCat] = useState(0); // 0 = All
  const list = PROJECTS.filter(p => cat === 0 || p.catIdx === cat);
  return (
    <section id="portfolio" className="py-16 sm:py-24">
      <div className="container-1280">
        <FadeUp>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">{t.portfolio.label}</span>
              <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">{t.portfolio.title}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {cats.map((c, i) => (
                <button key={c} onClick={() => setCat(i)}
                  className={`rounded-full px-4 py-2 text-sm font-medium border transition-all ${cat === i ? "bg-ink text-white border-ink" : "bg-white text-ink/70 border-border hover:text-ink"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </FadeUp>

        <motion.div layout className="mt-14 grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.article layout key={p.title}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="group relative rounded-3xl border border-border bg-white p-6 overflow-hidden hover:shadow-[var(--shadow-lift)] transition-shadow"
              >
                <div className={`relative aspect-[16/10] rounded-2xl bg-gradient-to-br ${p.hue} p-5 overflow-hidden`}>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,white_0%,transparent_60%)] opacity-30" />
                  <div className="relative h-full w-full">
                    <BrowserMock url={`${p.title.toLowerCase().replace(/\s/g,"")}.com`}>
                      <div className="p-4 h-full bg-white">
                        <div className="h-2 w-24 rounded bg-ink/80" />
                        <div className="mt-2 h-4 w-40 rounded bg-gradient-to-r from-primary to-primary-deep" />
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div className="h-14 rounded-lg bg-secondary" />
                          <div className="h-14 rounded-lg bg-secondary" />
                          <div className="h-14 rounded-lg bg-secondary" />
                        </div>
                      </div>
                    </BrowserMock>
                    <div className="absolute -right-2 -bottom-2 w-24 rounded-[14px] border-4 border-ink bg-white overflow-hidden shadow-xl">
                      <div className="h-1 bg-ink" />
                      <div className="p-1.5">
                        <div className="h-1 w-10 rounded bg-ink/70" />
                        <div className="mt-1 h-6 rounded bg-gradient-to-br from-primary to-primary-deep" />
                        <div className="mt-1 h-1 w-full rounded bg-muted" />
                        <div className="mt-0.5 h-1 w-2/3 rounded bg-muted" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">{cats[p.catIdx]}</div>
                    <h3 className="text-lg font-bold text-ink">{p.title}</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-secondary grid place-items-center text-ink group-hover:bg-primary group-hover:text-white transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */

function Testimonials() {
  const { t } = useLang();
  const testis = t.testimonials.items;
  const [i, setI] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setI(v => (v + 1) % testis.length), 5000);
    return () => clearInterval(timer);
  }, [testis.length]);
  return (
    <section className="py-16 sm:py-24">
      <div className="container-1280">
        <FadeUp>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">{t.testimonials.label}</span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">{t.testimonials.title}</h2>
          </div>
        </FadeUp>
        <div className="mt-14 relative">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={i}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
                className="grid md:grid-cols-3 gap-5"
              >
                {[0,1,2].map(off => {
                  const item = testis[(i + off) % testis.length];
                  return (
                    <div key={off} className={`rounded-3xl border border-border p-8 ${off === 0 ? "bg-ink text-white" : "bg-white"}`}>
                      <div className="flex gap-0.5 text-primary">
                        {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                      </div>
                      <p className={`mt-5 text-lg leading-relaxed ${off === 0 ? "text-white/90" : "text-ink/85"}`}>"{item.quote}"</p>
                      <div className="mt-6 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-deep grid place-items-center text-white font-bold">
                          {item.name.split(" ").map(n=>n[0]).join("")}
                        </div>
                        <div>
                          <div className={`font-semibold ${off === 0 ? "text-white" : "text-ink"}`}>{item.name}</div>
                          <div className={`text-xs ${off === 0 ? "text-white/60" : "text-muted-foreground"}`}>{item.role}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-8 flex justify-center gap-2">
            {testis.map((_, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Slide ${k+1}`}
                className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-primary" : "w-4 bg-border"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

function FAQ() {
  const { t } = useLang();
  const faqs = t.faq.items;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-16 sm:py-24 bg-surface">
      <div className="container-1280 max-w-3xl">
        <FadeUp>
          <div className="text-center">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">{t.faq.label}</span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-ink">{t.faq.title}</h2>
          </div>
        </FadeUp>
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <FadeUp key={f.q} delay={i * 0.03}>
                <div className={`rounded-2xl border bg-white overflow-hidden transition-colors ${isOpen ? "border-primary/40" : "border-border"}`}>
                  <button onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                    <span className="font-semibold text-ink">{f.q}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }} className="overflow-hidden">
                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed">{f.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */

function FinalCTA() {
  const { t } = useLang();
  return (
    <section id="contact" className="py-16 sm:py-24">
      <div className="container-1280">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink p-6 sm:p-10 md:p-16 text-white">
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-primary/40 blur-3xl animate-blob" />
          <div className="absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-primary-deep/40 blur-3xl animate-blob" style={{ animationDelay: "-5s" }} />
          <div className="absolute inset-0 bg-grid opacity-[0.08]" />
          <div className="relative max-w-3xl">
            <FadeUp>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-3 py-1.5 text-xs font-medium text-white/80">
                <Code2 className="h-3.5 w-3.5" /> {t.cta.badge}
              </span>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="mt-6 text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.02em] leading-tight">
                {t.cta.titleLead}{" "}
                <span className="bg-gradient-to-r from-white via-white to-primary bg-clip-text text-transparent">{t.cta.titleHighlight}</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.15}>
              <p className="mt-5 text-base sm:text-lg text-white/70 max-w-xl">{t.cta.subtitle}</p>
            </FadeUp>
            <FadeUp delay={0.25}>
              <div className="mt-8 flex flex-wrap gap-3">
                <MagneticButton href="#" >
                  <PhoneCall className="h-4 w-4" /> {t.cta.primary}
                </MagneticButton>
                <MagneticButton href="#" variant="outline" className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                  <MessageSquare className="h-4 w-4" /> {t.cta.secondary}
                </MagneticButton>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border bg-white">
      <div className="container-1280 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <img src={logoAsset.url} alt="CodeStory" className="h-10 w-10 rounded-lg object-cover" />
            <span className="font-extrabold tracking-tight text-ink text-xl">
              Code<span className="text-primary">Story</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            {t.footer.tagline}
          </p>
          <div className="mt-6 flex gap-2">
            {[Instagram, Music2, Linkedin, Github].map((I, k) => (
              <a key={k} href="#" className="h-10 w-10 rounded-full bg-secondary grid place-items-center text-ink hover:bg-primary hover:text-primary-foreground transition-colors">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-ink">{t.footer.quickLinks}</div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="#services" className="hover:text-ink">{t.nav.services}</a></li>
            <li><a href="#portfolio" className="hover:text-ink">{t.nav.portfolio}</a></li>
            <li><a href="#faq" className="hover:text-ink">{t.nav.faq}</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-ink">{t.footer.contact}</div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>hello@codestory.dev</li>
            <li>+1 (415) 555-0123</li>
            <li>Remote — Worldwide</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-1280 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} CodeStory. {t.footer.rights}</div>
          <div className="flex gap-5"><a href="#" className="hover:text-ink">{t.footer.privacy}</a><a href="#" className="hover:text-ink">{t.footer.terms}</a></div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Scroll progress ---------- */

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const w = useSpring(scrollYProgress, { stiffness: 140, damping: 20 });
  return <motion.div style={{ scaleX: w, transformOrigin: "0 0" }} className="fixed left-0 top-0 z-[60] h-0.5 w-full bg-gradient-to-r from-primary to-primary-deep" />;
}

/* ---------- Page ---------- */

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Statistics />
        <Services />
        <WhyChoose />
        <Process />
        <Portfolio />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

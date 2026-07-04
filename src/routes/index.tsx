import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Check, Star, Menu, X, Zap, Palette, Search, Smartphone, ShieldCheck, LifeBuoy,
  Layout, Rocket, ShoppingCart, LayoutDashboard, PenTool, Wrench, Users2, Database,
  MessageSquare, PhoneCall, Instagram, Linkedin, Github, Music2, ChevronDown, Sparkles,
  Globe, Code2,
} from "lucide-react";
import logoAsset from "@/assets/codestory-logo.asset.json";

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

/* ---------- Navbar ---------- */

const NAV = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            <div className="hidden sm:block">
              <MagneticButton href="#contact" className="!py-2.5 !px-5 whitespace-nowrap">
                Free Consultation <ArrowRight className="h-4 w-4" />
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
                Free Consultation
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

      <div className="container-1280 relative grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6">
          <FadeUp>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 backdrop-blur px-3 py-1.5 text-xs font-medium text-ink/70">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Digital agency · Est. 2019
            </span>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.03em] leading-[1.02] text-ink">
              Build Websites That{" "}
              <span className="text-gradient-brand">Grow Your Business</span>{" "}
              Faster.
            </h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              We create modern, responsive, SEO-friendly websites that help businesses increase credibility and sales — from landing pages to full custom systems.
            </p>
          </FadeUp>
          <FadeUp delay={0.25}>
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton href="#contact">
                Start Your Project <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton href="#portfolio" variant="outline">
                View Portfolio <ArrowUpRight className="h-4 w-4" />
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
              <div><span className="font-semibold text-ink">150+ clients</span> shipping faster with CodeStory</div>
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
              <div className="mx-auto h-3 w-[110%] -mt-1 rounded-b-2xl bg-gradient-to-b from-[#0F172A] to-[#1e293b]" />
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
                    <div className="text-xs text-muted-foreground">Lighthouse</div>
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
                    <div className="text-xs text-muted-foreground">SEO score</div>
                    <div className="text-sm font-bold text-ink">A+ Ranked</div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 hidden md:block"
            >
              <div className="glass rounded-2xl px-4 py-3 shadow-[var(--shadow-lift)]">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1.5">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-primary-deep ring-2 ring-white" />
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-sky-400 to-primary ring-2 ring-white" />
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-primary-deep ring-2 ring-white" />
                  </div>
                  <div className="text-xs"><span className="font-semibold text-ink">+42%</span> conversions in 30 days</div>
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
  return (
    <section className="py-16 border-y border-border bg-white">
      <div className="container-1280">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
          Trusted by businesses worldwide
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
  const stats = [
    { v: 250, s: "+", l: "Projects Completed" },
    { v: 150, s: "+", l: "Happy Clients" },
    { v: 98, s: "%", l: "Client Satisfaction" },
    { v: 24, s: "/7", l: "Support" },
  ];
  return (
    <section className="py-24">
      <div className="container-1280">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="rounded-3xl border border-border bg-white p-8 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] transition-shadow">
                <div className="text-5xl font-extrabold tracking-tight text-gradient-brand">
                  <Counter to={s.v} suffix={s.s} />
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */

const SERVICES = [
  { icon: Globe, title: "Website Company Profile", desc: "Credible corporate presence that tells your story with clarity." },
  { icon: Rocket, title: "Landing Page", desc: "High-converting single pages engineered for campaigns and ads." },
  { icon: ShoppingCart, title: "E-Commerce", desc: "Fast, secure online stores with seamless checkout flows." },
  { icon: LayoutDashboard, title: "Web Application", desc: "Custom SaaS and internal tools built to scale with your team." },
  { icon: PenTool, title: "UI / UX Design", desc: "Beautiful, research-backed interfaces users love to use." },
  { icon: Wrench, title: "Website Maintenance", desc: "Updates, monitoring, and performance care — every month." },
  { icon: Users2, title: "CRM System", desc: "Own your pipeline with a tailored customer platform." },
  { icon: Database, title: "ERP System", desc: "Unify operations, finance, and logistics in one system." },
];

function Services() {
  return (
    <section id="services" className="py-24 bg-surface">
      <div className="container-1280">
        <FadeUp>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">Services</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">Everything you need to ship online.</h2>
            <p className="mt-4 text-lg text-muted-foreground">From a single landing page to a full enterprise platform — one team, end-to-end.</p>
          </div>
        </FadeUp>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => (
            <FadeUp key={s.title} delay={i * 0.04}>
              <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="group h-full rounded-3xl border border-border bg-white p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] transition-shadow">
                <div className="relative h-11 w-11 rounded-2xl bg-primary/10 grid place-items-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="h-4 w-4" />
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Why Choose Us ---------- */

const WHY = [
  { icon: Zap, title: "Fast Development", desc: "Agile sprints and modern tooling ship weeks — not months." },
  { icon: Palette, title: "Modern Design", desc: "Design language calibrated to your brand and audience." },
  { icon: Search, title: "SEO Ready", desc: "Technical SEO baked in from URL structure to Core Web Vitals." },
  { icon: Smartphone, title: "Mobile Responsive", desc: "Pixel-perfect on every device from 320px to 4K." },
  { icon: ShieldCheck, title: "Secure", desc: "SSL, hardening, and best-practice auth from day one." },
  { icon: LifeBuoy, title: "Lifetime Support", desc: "We stay with you long after launch — always on call." },
];

function WhyChoose() {
  return (
    <section id="about" className="py-24">
      <div className="container-1280">
        <FadeUp>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">Why CodeStory</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">The details that make the difference.</h2>
          </div>
        </FadeUp>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY.map((w, i) => (
            <FadeUp key={w.title} delay={i * 0.05}>
              <div className="group relative h-full rounded-3xl border border-border bg-white p-7 overflow-hidden">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-start gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-primary/10 grid place-items-center text-primary shrink-0">
                    <w.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink">{w.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Process ---------- */

const PROCESS = [
  { t: "Consultation", d: "We listen, understand your goals, and scope the project." },
  { t: "Wireframe", d: "Low-fidelity blueprints validate structure and flow." },
  { t: "UI Design", d: "High-fidelity screens crafted around your brand." },
  { t: "Development", d: "Clean, scalable code built with modern stacks." },
  { t: "Testing", d: "Cross-device, performance, and accessibility QA." },
  { t: "Deployment", d: "Zero-downtime launch on secure cloud infrastructure." },
  { t: "Maintenance", d: "Ongoing improvements, updates, and 24/7 support." },
];

function Process() {
  return (
    <section className="py-24 bg-surface">
      <div className="container-1280">
        <FadeUp>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">Our Process</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">A clear path from idea to launch.</h2>
          </div>
        </FadeUp>
        <div className="mt-16 relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />
          <ul className="space-y-10">
            {PROCESS.map((p, i) => (
              <FadeUp key={p.t} delay={i * 0.04}>
                <li className={`relative md:grid md:grid-cols-2 md:gap-10 items-center ${i % 2 ? "md:[&>*:first-child]:col-start-2" : ""}`}>
                  <div className={`pl-12 md:pl-0 ${i % 2 ? "md:text-left md:pl-10" : "md:text-right md:pr-10"}`}>
                    <div className="text-xs font-semibold text-primary">Step {String(i + 1).padStart(2, "0")}</div>
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

const CATS = ["All", "Company Profile", "Landing Page", "Web App", "E-Commerce"] as const;
type Cat = typeof CATS[number];

const PROJECTS: { title: string; cat: Exclude<Cat, "All">; hue: string }[] = [
  { title: "Northwind Corporate", cat: "Company Profile", hue: "from-primary to-primary-deep" },
  { title: "Lumen Launch", cat: "Landing Page", hue: "from-sky-400 to-primary" },
  { title: "Orbita Store", cat: "E-Commerce", hue: "from-indigo-500 to-primary-deep" },
  { title: "Vantage Dashboard", cat: "Web App", hue: "from-primary to-indigo-600" },
  { title: "Meridian Studio", cat: "Company Profile", hue: "from-blue-500 to-primary-deep" },
  { title: "Helix Checkout", cat: "E-Commerce", hue: "from-sky-500 to-indigo-600" },
];

function Portfolio() {
  const [cat, setCat] = useState<Cat>("All");
  const list = PROJECTS.filter(p => cat === "All" || p.cat === cat);
  return (
    <section id="portfolio" className="py-24">
      <div className="container-1280">
        <FadeUp>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">Portfolio</span>
              <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">Selected work.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATS.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className={`rounded-full px-4 py-2 text-sm font-medium border transition-all ${cat === c ? "bg-ink text-white border-ink" : "bg-white text-ink/70 border-border hover:text-ink"}`}>
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
                    <div className="text-xs text-muted-foreground">{p.cat}</div>
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

/* ---------- Pricing ---------- */

const PLANS = [
  {
    name: "Starter", price: "$1,499", tag: "Perfect for small brands",
    features: ["1 landing page", "Responsive design", "Basic SEO setup", "Contact form", "2 revision rounds", "30-day support"],
  },
  {
    name: "Business", price: "$4,999", tag: "Most popular", highlight: true,
    features: ["Up to 8 pages", "Custom UI/UX design", "Advanced SEO + analytics", "CMS integration", "5 revision rounds", "3-month support", "Speed optimization"],
  },
  {
    name: "Enterprise", price: "Custom", tag: "For scaling teams",
    features: ["Unlimited pages", "Custom web application", "CRM / ERP integration", "Dedicated PM & designer", "Unlimited revisions", "12-month SLA", "Security hardening"],
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-surface">
      <div className="container-1280">
        <FadeUp>
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">Pricing</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">Simple, transparent plans.</h2>
            <p className="mt-4 text-lg text-muted-foreground">Pick a plan that fits today. Scale up whenever you're ready.</p>
          </div>
        </FadeUp>
        <div className="mt-16 grid md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((p, i) => (
            <FadeUp key={p.name} delay={i * 0.08}>
              <motion.div whileHover={{ y: -6 }}
                className={`relative h-full rounded-3xl p-8 border transition-shadow ${p.highlight
                  ? "bg-ink text-white border-ink shadow-[var(--shadow-glow)]"
                  : "bg-white border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)]"}`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground text-xs font-semibold px-3 py-1">
                    Most popular
                  </div>
                )}
                <div className={`text-sm font-semibold ${p.highlight ? "text-primary/90" : "text-primary"}`}>{p.tag}</div>
                <h3 className="mt-2 text-2xl font-bold">{p.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight">{p.price}</span>
                  {p.price.startsWith("$") && <span className={p.highlight ? "text-white/60" : "text-muted-foreground"}>/ project</span>}
                </div>
                <ul className={`mt-6 space-y-3 text-sm ${p.highlight ? "text-white/85" : "text-ink/80"}`}>
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className={`h-5 w-5 shrink-0 ${p.highlight ? "text-primary" : "text-primary"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact"
                  className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                    p.highlight ? "bg-primary text-primary-foreground hover:bg-primary-deep"
                                : "bg-ink text-white hover:bg-ink/90"
                  }`}>
                  Get started <ArrowRight className="h-4 w-4" />
                </a>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Testimonials ---------- */

const TESTIS = [
  { name: "Amelia Chen", role: "CEO, Northwind", quote: "CodeStory rebuilt our platform in six weeks. Conversions jumped 42% and support tickets dropped." },
  { name: "Rafael Ortega", role: "Founder, Lumen", quote: "The design work is on another level. Every detail feels intentional — and it converts." },
  { name: "Priya Shah", role: "Product Lead, Orbita", quote: "Reliable, thoughtful, fast. They ship like an in-house team but with agency polish." },
  { name: "David Nakamura", role: "COO, Vantage", quote: "From wireframe to launch in under two months. They just get it." },
];

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % TESTIS.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="py-24">
      <div className="container-1280">
        <FadeUp>
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">Testimonials</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">Loved by teams that ship.</h2>
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
                  const t = TESTIS[(i + off) % TESTIS.length];
                  return (
                    <div key={off} className={`rounded-3xl border border-border p-8 ${off === 0 ? "bg-ink text-white" : "bg-white"}`}>
                      <div className={`flex gap-0.5 ${off === 0 ? "text-primary" : "text-primary"}`}>
                        {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                      </div>
                      <p className={`mt-5 text-lg leading-relaxed ${off === 0 ? "text-white/90" : "text-ink/85"}`}>"{t.quote}"</p>
                      <div className="mt-6 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-deep grid place-items-center text-white font-bold">
                          {t.name.split(" ").map(n=>n[0]).join("")}
                        </div>
                        <div>
                          <div className={`font-semibold ${off === 0 ? "text-white" : "text-ink"}`}>{t.name}</div>
                          <div className={`text-xs ${off === 0 ? "text-white/60" : "text-muted-foreground"}`}>{t.role}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-8 flex justify-center gap-2">
            {TESTIS.map((_, k) => (
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

const FAQS = [
  { q: "How long does a typical project take?", a: "Landing pages ship in 1–2 weeks. Company profiles run 3–4 weeks. E-commerce and web apps range from 6–12 weeks depending on scope." },
  { q: "Do you provide ongoing maintenance?", a: "Yes. Every plan includes launch support, and we offer monthly maintenance plans covering updates, backups, monitoring, and improvements." },
  { q: "Which technologies do you use?", a: "We build with modern, production-grade tools: Next.js, React, TypeScript, Tailwind CSS, and headless CMS platforms — always chosen to fit your goals." },
  { q: "Do you help with SEO and performance?", a: "Absolutely. SEO best practices and Core Web Vitals are part of every build, and we can run dedicated SEO campaigns after launch." },
  { q: "Can you work with our existing brand?", a: "Yes. We adapt to your brand or refresh it — many clients start with a light rebrand alongside the new website." },
  { q: "How do we start?", a: "Book a free consultation. We'll scope your project, share a roadmap and quote, and if it's a fit, we can start within a week." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 bg-surface">
      <div className="container-1280 max-w-3xl">
        <FadeUp>
          <div className="text-center">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">FAQ</span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">Answers, first.</h2>
          </div>
        </FadeUp>
        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => {
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
  return (
    <section id="contact" className="py-24">
      <div className="container-1280">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink p-10 sm:p-16 text-white">
          <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-primary/40 blur-3xl animate-blob" />
          <div className="absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-primary-deep/40 blur-3xl animate-blob" style={{ animationDelay: "-5s" }} />
          <div className="absolute inset-0 bg-grid opacity-[0.08]" />
          <div className="relative max-w-3xl">
            <FadeUp>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-3 py-1.5 text-xs font-medium text-white/80">
                <Code2 className="h-3.5 w-3.5" /> Let's build something great
              </span>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-[-0.02em] leading-tight">
                Ready to build your{" "}
                <span className="bg-gradient-to-r from-white via-white to-primary bg-clip-text text-transparent">website?</span>
              </h2>
            </FadeUp>
            <FadeUp delay={0.15}>
              <p className="mt-5 text-lg text-white/70 max-w-xl">Let's discuss your project today. Free 30-minute consultation, no strings attached.</p>
            </FadeUp>
            <FadeUp delay={0.25}>
              <div className="mt-8 flex flex-wrap gap-3">
                <MagneticButton href="#" >
                  <PhoneCall className="h-4 w-4" /> Free Consultation
                </MagneticButton>
                <MagneticButton href="#" variant="outline" className="!bg-white/10 !border-white/20 !text-white hover:!bg-white/20">
                  <MessageSquare className="h-4 w-4" /> WhatsApp
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
            Build Your Digital Success — websites, apps, and custom systems for ambitious teams.
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
          <div className="text-sm font-semibold text-ink">Quick Links</div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><a href="#services" className="hover:text-ink">Services</a></li>
            <li><a href="#portfolio" className="hover:text-ink">Portfolio</a></li>
            <li><a href="#pricing" className="hover:text-ink">Pricing</a></li>
            <li><a href="#faq" className="hover:text-ink">FAQ</a></li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold text-ink">Contact</div>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>hello@codestory.dev</li>
            <li>+1 (415) 555-0123</li>
            <li>Remote — Worldwide</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-1280 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} CodeStory. All rights reserved.</div>
          <div className="flex gap-5"><a href="#" className="hover:text-ink">Privacy</a><a href="#" className="hover:text-ink">Terms</a></div>
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
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

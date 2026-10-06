"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import {
  Truck, Package, MapPin, Warehouse, ShieldCheck, Route, Zap, Sparkles, ArrowRight,
  Eye, FlaskConical, UserCheck, Radar, Gauge,
} from "lucide-react";

/* ---------- hooks / helpers ---------- */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.15);
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${seen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} ${className}`}>
      {children}
    </div>
  );
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / 1600, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

const spot = (e: MouseEvent<HTMLDivElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
};

/* ---------- hero orbit graphic ---------- */
type OrbitNode = { icon: ReactNode; angle: number };

function Ring({ r, nodes, reverse }: { r: number; nodes: OrbitNode[]; reverse?: boolean }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className={`relative rounded-full border border-dashed border-violet-300/70 ${reverse ? "ab-spin-rev" : "ab-spin"}`} style={{ width: r * 2, height: r * 2 }}>
        {nodes.map((n, i) => (
          <div key={i} className="absolute left-1/2 top-1/2" style={{ transform: `translate(-50%,-50%) rotate(${n.angle}deg) translateY(-${r}px)` }}>
            <div style={{ transform: `rotate(${-n.angle}deg)` }}>
              <div className={reverse ? "ab-spin" : "ab-spin-rev"}>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-violet-600 shadow-[0_10px_30px_-8px_rgba(99,102,241,.55)] ring-1 ring-slate-200 transition-transform hover:scale-110">
                  {n.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Orbit() {
  const ic = "h-5 w-5";
  return (
    <div className="relative mx-auto h-[400px] w-[400px] origin-center scale-[.72] sm:scale-100">
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-violet-200/60 via-sky-100/60 to-transparent blur-2xl" />
      <Ring r={110} nodes={[{ icon: <Package className={ic} />, angle: 0 }, { icon: <MapPin className={ic} />, angle: 120 }, { icon: <Warehouse className={ic} />, angle: 240 }]} />
      <Ring r={180} reverse nodes={[{ icon: <ShieldCheck className={ic} />, angle: 60 }, { icon: <Route className={ic} />, angle: 180 }, { icon: <Zap className={ic} />, angle: 300 }]} />
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative">
          <span className="ab-ping absolute inset-0 rounded-3xl bg-violet-500/30" />
          <div className="relative grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-500 to-sky-500 text-white shadow-[0_20px_50px_-10px_rgba(99,102,241,.8)]">
            <Truck className="h-10 w-10" />
          </div>
        </div>
      </div>
      {/* floating glass chips */}
      <div className="ab-float absolute -left-2 top-10 rounded-2xl border border-slate-200 bg-white/90 px-3.5 py-2.5 shadow-xl shadow-slate-900/5 backdrop-blur">
        <div className="text-[10px] uppercase tracking-wider text-slate-400">ETA</div>
        <div className="text-sm font-semibold text-slate-900">12 min</div>
      </div>
      <div className="ab-float absolute -right-2 bottom-14 rounded-2xl border border-slate-200 bg-white/90 px-3.5 py-2.5 shadow-xl shadow-slate-900/5 backdrop-blur [animation-delay:1.5s]">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> SLA health</div>
        <div className="text-sm font-semibold text-slate-900">94 / 100</div>
      </div>
    </div>
  );
}

/* ---------- content (edit freely) ---------- */
const STATS = [
  { to: 13, label: "Build phases", icon: <Gauge className="h-4 w-4" /> },
  { to: 6, label: "What-if scenarios", icon: <FlaskConical className="h-4 w-4" /> },
  { to: 5, label: "Dispatch score factors", icon: <Radar className="h-4 w-4" /> },
  { to: 6, label: "User roles", icon: <UserCheck className="h-4 w-4" /> },
];

const VALUES = [
  { icon: <Eye className="h-5 w-5" />, title: "Explainable by default", desc: "Every dispatch, risk score and recommendation shows its reasoning. No black boxes." },
  { icon: <ShieldCheck className="h-5 w-5" />, title: "Reliable under failure", desc: "Idempotent payments, safe reservations and an outbox pattern so nothing is silently lost." },
  { icon: <FlaskConical className="h-5 w-5" />, title: "Simulate before you act", desc: "Test failures on a Digital Twin first. Production only changes through an explicit Apply Plan." },
  { icon: <UserCheck className="h-5 w-5" />, title: "Humans stay in control", desc: "Automation handles routine recovery and escalates the critical cases to a dispatcher." },
];

const JOURNEY = [
  { tag: "Phase 1-4", title: "Foundation", desc: "Multi-tenant auth, commerce, inventory reservations and payments." },
  { tag: "Phase 5-7", title: "Live operations", desc: "Fleet, explainable dispatch, real-time tracking and the SLA engine." },
  { tag: "Phase 8-9", title: "Intelligence", desc: "Self-healing recovery and versioned Digital Twin snapshots." },
  { tag: "Phase 10-13", title: "Simulation and launch", desc: "What-if simulator, Apply Plan, full test suite and free-tier deployment." },
];

const TECH = ["Next.js", "NestJS", "TypeScript", "Prisma", "PostgreSQL", "PostGIS", "Redis", "Cloudflare", "Supabase", "Vercel", "Docker", "GitHub Actions"];

/* ---------- main ---------- */
export default function AboutSection() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <style>{`
        @keyframes ab-spin { to { transform: rotate(360deg); } }
        @keyframes ab-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes ab-ping { 0% { transform: scale(1); opacity: .7; } 100% { transform: scale(1.9); opacity: 0; } }
        @keyframes ab-shimmer { to { background-position: 200% center; } }
        @keyframes ab-marq { to { transform: translateX(-50%); } }
        @keyframes ab-draw { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .ab-spin { animation: ab-spin 28s linear infinite; }
        .ab-spin-rev { animation: ab-spin 28s linear infinite reverse; }
        .ab-float { animation: ab-float 5s ease-in-out infinite; }
        .ab-ping { animation: ab-ping 2.4s ease-out infinite; }
        .ab-title { background-size: 200% auto; animation: ab-shimmer 6s linear infinite; }
        .ab-marq { animation: ab-marq 32s linear infinite; }
        .ab-marq:hover { animation-play-state: paused; }
        .ab-line { transform-origin: top; animation: ab-draw 1.6s ease-out both; }
        @media (prefers-reduced-motion: reduce) { .ab-spin,.ab-spin-rev,.ab-float,.ab-ping,.ab-title,.ab-marq,.ab-line { animation: none; } }
      `}</style>

      {/* background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
          backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse at 50% 20%, black 20%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at 50% 20%, black 20%, transparent 70%)" }} />
        <div className="ab-float absolute -left-32 top-0 h-96 w-96 rounded-full bg-violet-400/25 blur-[120px]" />
        <div className="ab-float absolute -right-32 top-40 h-96 w-96 rounded-full bg-sky-300/30 blur-[120px] [animation-delay:2s]" />
      </div>

      {/* HERO */}
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-24 lg:grid-cols-2 lg:pt-32">
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" /> About DeliveryOS
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl">
              We make logistics{" "}
              <span className="ab-title bg-gradient-to-r from-violet-600 via-sky-500 to-violet-600 bg-clip-text text-transparent">run itself</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              DeliveryOS is a control tower for delivery networks. It watches your fleet in real time, explains every decision, and lets you
              simulate failures before they reach your customers.
            </p>
          </Reveal>
          <Reveal delay={300} className="mt-9 flex flex-wrap gap-3">
            <button className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-all duration-700 group-hover/btn:left-full group-hover/btn:opacity-100" />
              <span className="relative">See how it works</span>
              <ArrowRight className="relative h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
            <button className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 hover:ring-slate-300">
              Read the docs
            </button>
          </Reveal>
        </div>
        <Reveal delay={200}><Orbit /></Reveal>
      </div>

      {/* STATS */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div onMouseMove={spot} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(99,102,241,.45)]">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(240px circle at var(--x,50%) var(--y,50%), rgba(139,92,246,.1), transparent 60%)" }} />
                <div className="relative">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-50 text-violet-600">{s.icon}</div>
                  <div className="mt-4 bg-gradient-to-br from-slate-900 to-violet-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                    <CountUp to={s.to} />
                  </div>
                  <div className="mt-1 text-sm text-slate-500">{s.label}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* VALUES */}
      <div className="mx-auto max-w-6xl px-6 py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">What we believe</h2>
          <p className="mt-4 text-slate-600">Four principles shape every feature we build.</p>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <div onMouseMove={spot} className="group relative h-full rounded-2xl bg-slate-200/70 p-px transition-all duration-500 hover:-translate-y-1">
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(260px circle at var(--x,50%) var(--y,50%), rgba(167,139,250,.9), transparent 60%)" }} />
                <div className="relative flex h-full gap-5 overflow-hidden rounded-[15px] bg-white p-7">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/30 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">{v.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* JOURNEY */}
      <div className="mx-auto max-w-4xl px-6 pb-28">
        <Reveal className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">The build journey</h2>
          <p className="mt-4 text-slate-600">From a secure foundation to a self-healing network.</p>
        </Reveal>
        <div className="relative mt-16">
          <div className="absolute left-4 top-0 h-full w-px bg-slate-200 lg:left-1/2" />
          <div className="ab-line absolute left-4 top-0 h-full w-px bg-gradient-to-b from-violet-500 via-sky-400 to-transparent lg:left-1/2" />
          <div className="space-y-12">
            {JOURNEY.map((j, i) => (
              <Reveal key={j.title} delay={i * 80}>
                <div className={`relative pl-12 lg:grid lg:grid-cols-2 lg:gap-16 lg:pl-0 ${i % 2 ? "" : ""}`}>
                  <span className="absolute left-4 top-6 grid h-4 w-4 -translate-x-1/2 place-items-center lg:left-1/2">
                    <span className="ab-ping absolute h-4 w-4 rounded-full bg-violet-400/50" />
                    <span className="relative h-3 w-3 rounded-full border-2 border-white bg-violet-600 shadow" />
                  </span>
                  <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(99,102,241,.4)] ${i % 2 ? "lg:col-start-2" : "lg:col-start-1 lg:text-right"}`}>
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-violet-700">{j.tag}</span>
                    <h3 className="mt-3 text-lg font-semibold text-slate-900">{j.title}</h3>
                    <p className="mt-1.5 text-sm text-slate-600">{j.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* TECH MARQUEE
      <div className="pb-24">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-slate-400">Built with</p>
        <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 15%, black 85%, transparent)" }}>
          <div className="ab-marq flex w-max gap-3">
            {[...TECH, ...TECH].map((t, i) => (
              <span key={i} className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-violet-300 hover:text-violet-700">{t}</span>
            ))}
          </div>
        </div>
      </div> */}

   
    </section>
  );
}
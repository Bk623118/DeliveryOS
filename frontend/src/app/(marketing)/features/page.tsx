"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { Route, Radar, ShieldAlert, HeartPulse, Boxes, FlaskConical, ArrowUpRight, Sparkles } from "lucide-react";

type Feature = {
  slug: string;
  icon: ReactNode;
  tag: string;
  title: string;
  desc: string;
  visual?: "bars" | "map" | "gauge" | "heal" | "twin" | "chart";
  wide?: boolean;
};

const FEATURES: Feature[] = [
  {
    slug: "explainable-smart-dispatch",
    icon: <Route className="h-5 w-5" />,
    tag: "Dispatch",
    title: "Explainable smart dispatch",
    desc: "Every assignment comes with a score breakdown across distance, ETA, workload, capacity and SLA. No black box, just clear reasons.",
    visual: "bars",
    wide: true,
  },
  {
    slug: "live-fleet-tracking",
    icon: <Radar className="h-5 w-5" />,
    tag: "Real-time",
    title: "Live fleet tracking",
    desc: "GPS, heartbeats and WebSocket events keep dispatchers and customers in sync, even after reconnects.",
    visual: "map",
  },
  {
    slug: "sla-risk-engine",
    icon: <ShieldAlert className="h-5 w-5" />,
    tag: "SLA",
    title: "SLA risk engine",
    desc: "Spot orders likely to miss their deadline early, with the contributing factors spelled out.",
    visual: "gauge",
  },
  {
    slug: "self-healing-recovery",
    icon: <HeartPulse className="h-5 w-5" />,
    tag: "Resilience",
    title: "Self-healing recovery",
    desc: "When a driver drops offline, affected orders are re-scored, reassigned and customers are notified automatically.",
    visual: "heal",
  },
  {
    slug: "versioned-network-snapshots",
    icon: <Boxes className="h-5 w-5" />,
    tag: "Digital Twin",
    title: "Versioned network snapshots",
    desc: "A safe copy of your live network that simulations can change freely without touching production.",
    visual: "twin",
  },
  {
    slug: "what-if-simulator-apply-plan",
    icon: <FlaskConical className="h-5 w-5" />,
    tag: "Simulation",
    title: "What-if simulator & Apply Plan",
    desc: "Test 30% driver loss or a warehouse shutdown, review the recovery plan, and apply it only if the live network version still matches.",
    visual: "chart",
    wide: true,
  },
];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

function Bars({ on }: { on: boolean }) {
  const rows = [
    ["Distance", 97],
    ["ETA", 92],
    ["Workload", 90],
    ["Capacity", 93],
    ["SLA", 90],
  ] as const;
  return (
    <div className="mt-5 space-y-2.5">
      {rows.map(([label, pct], i) => (
        <div key={label} className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="w-16 shrink-0">{label}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-400 transition-[width] duration-1000 ease-out"
              style={{ width: on ? `${pct}%` : "0%", transitionDelay: `${300 + i * 120}ms` }}
            />
          </div>
          <span className="w-8 text-right tabular-nums text-slate-700">{pct}</span>
        </div>
      ))}
    </div>
  );
}

function RouteMap() {
  return (
    <svg viewBox="0 0 300 90" className="mt-5 w-full">
      <defs>
        <pattern id="fo-g" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="rgba(15,23,42,.08)" />
        </pattern>
        <linearGradient id="fo-rg" x1="0" x2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <rect width="300" height="90" rx="10" fill="#f8fafc" /><rect width="300" height="90" rx="10" fill="url(#fo-g)" />
      <path id="fo-route" d="M20 65 C70 65 70 25 120 25 S190 70 230 45 S270 30 282 20" fill="none" stroke="url(#fo-rg)" strokeWidth="2.5" strokeLinecap="round" className="fo-dash" />
      <circle cx="20" cy="65" r="4" fill="#38bdf8" />
      <circle cx="282" cy="20" r="4" fill="#34d399" />
      <circle cx="282" cy="20" r="4" fill="#34d399" className="fo-ping" />
      <circle r="5" fill="#6366f1" stroke="#fff" strokeWidth="2" filter="drop-shadow(0 0 5px rgba(99,102,241,.7))">
        <animateMotion dur="5s" repeatCount="indefinite"><mpath href="#fo-route" /></animateMotion>
      </circle>
    </svg>
  );
}

function Gauge({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 120 72" className="mx-auto mt-4 h-24">
      <defs>
        <linearGradient id="fo-gg" x1="0" x2="1">
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f43f5e" />
        </linearGradient>
      </defs>
      <path d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke="rgba(15,23,42,.08)" strokeWidth="9" strokeLinecap="round" />
      <path d="M10 62 A50 50 0 0 1 110 62" pathLength={100} fill="none" stroke="url(#fo-gg)" strokeWidth="9" strokeLinecap="round"
        strokeDasharray="100" strokeDashoffset={on ? 28 : 100} style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1) .4s" }} />
      <text x="60" y="52" textAnchor="middle" fontSize="20" fontWeight="700" fill="#0f172a">72</text>
      <text x="60" y="66" textAnchor="middle" fontSize="7" letterSpacing="1.5" fill="#e11d48">HIGH RISK</text>
    </svg>
  );
}

function Heal() {
  const pill = "rounded-full px-2.5 py-1 font-medium ring-1";
  return (
    <div className="mt-5 flex items-center gap-2 text-[11px]">
      <span className={`${pill} bg-rose-50 text-rose-600 ring-rose-200`}>D-42 offline</span>
      <span className="h-px flex-1 animate-pulse border-t border-dashed border-slate-300" />
      <span className={`${pill} bg-amber-50 text-amber-600 ring-amber-200`}>Re-score</span>
      <span className="h-px flex-1 animate-pulse border-t border-dashed border-slate-300" />
      <span className={`${pill} bg-emerald-50 text-emerald-600 ring-emerald-200`}>D-18 ✓</span>
    </div>
  );
}

function Twin() {
  const g = "[transform-box:fill-box] transition-transform duration-500 ease-out";
  const d = "80,6 148,30 80,54 12,30";
  return (
    <svg viewBox="0 0 160 90" className="mx-auto mt-3 h-24">
      <g className={`${g} group-hover:translate-y-2`}><polygon points={d} transform="translate(0 30)" fill="rgba(56,189,248,.18)" stroke="rgba(56,189,248,.6)" /></g>
      <g className={`${g} group-hover:translate-y-0.5`}><polygon points={d} transform="translate(0 16)" fill="rgba(139,92,246,.25)" stroke="rgba(167,139,250,.7)" /></g>
      <g className={`${g} group-hover:-translate-y-2`}><polygon points={d} fill="rgba(167,139,250,.35)" stroke="#c4b5fd" /></g>
    </svg>
  );
}

function Chart({ on }: { on: boolean }) {
  const draw = (delay: number) => ({ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: `stroke-dashoffset 1.6s ease-out ${delay}s` });
  return (
    <svg viewBox="0 0 300 80" className="mt-5 w-full">
      <defs>
        <linearGradient id="fo-cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8b5cf6" stopOpacity=".35" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 70 C50 68 80 20 130 14 S220 10 300 8 V80 H0 Z" fill="url(#fo-cg)" opacity={on ? 1 : 0} style={{ transition: "opacity 1.2s ease 1s" }} />
      <path pathLength={1} d="M0 70 C50 68 80 20 130 14 S220 10 300 8" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" style={draw(0.3)} />
      <path pathLength={1} d="M0 70 C60 70 100 60 150 50 S240 34 300 30" fill="none" stroke="rgba(15,23,42,.3)" strokeWidth="1.5" strokeDasharray="4 4" />
      <text x="6" y="12" fontSize="8" fill="#7c3aed">Plan applied</text>
      <text x="6" y="24" fontSize="8" fill="#64748b">Before</text>
    </svg>
  );
}

function Visual({ v, on }: { v: NonNullable<Feature["visual"]>; on: boolean }) {
  if (v === "bars") return <Bars on={on} />;
  if (v === "map") return <RouteMap />;
  if (v === "gauge") return <Gauge on={on} />;
  if (v === "heal") return <Heal />;
  if (v === "twin") return <Twin />;
  return <Chart on={on} />;
}

function Card({ f, index }: { f: Feature; index: number }) {
  const [ref, seen] = useInView<HTMLDivElement>();

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      style={{ transitionDelay: `${index * 90}ms` }}
      className={`group relative rounded-2xl bg-slate-200/70 p-px transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(99,102,241,.45)] ${
        f.wide ? "lg:col-span-2" : ""
      } ${seen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
    >
      {/* glowing border that follows the cursor */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(260px circle at var(--x,50%) var(--y,50%), rgba(167,139,250,.9), transparent 60%)" }}
      />
      <div className="relative h-full overflow-hidden rounded-[15px] bg-white p-6">
        {/* inner spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(380px circle at var(--x,50%) var(--y,50%), rgba(139,92,246,.09), transparent 45%)" }}
        />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/30 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
              {f.icon}
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              {f.tag}
            </span>
          </div>
          <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-900">{f.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
          {f.visual && <Visual v={f.visual} on={seen} />}
          <Link
            href={`/features/${f.slug}`}
            className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-violet-600 transition-all duration-300 group-hover:gap-2 group-hover:text-violet-700"
          >
            Learn more
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesSection({ features = FEATURES }: { features?: Feature[] }) {
  return (
    <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32">
      <style>{`
        @keyframes fo-shimmer { to { background-position: 200% center; } }
        @keyframes fo-dash { to { stroke-dashoffset: -22; } }
        @keyframes fo-ring { 0% { transform: scale(1); opacity: .8; } 100% { transform: scale(5); opacity: 0; } }
        @keyframes fo-float { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-24px,0); } }
        .fo-title { background-size: 200% auto; animation: fo-shimmer 6s linear infinite; }
        .fo-dash { stroke-dasharray: 5 6; animation: fo-dash 1.4s linear infinite; }
        .fo-ping { transform-box: fill-box; transform-origin: center; animation: fo-ring 2s ease-out infinite; }
        .fo-blob { animation: fo-float 9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .fo-title, .fo-dash, .fo-ping, .fo-blob { animation: none; } }
      `}</style>

      {/* background: grid + glow blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        <div className="fo-blob absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-400/25 blur-[110px]" />
        <div className="fo-blob absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sky-300/30 blur-[120px] [animation-delay:3s]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            Operate. Simulate. Analyze. Recover.
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Everything your network needs to{" "}
            <span className="fo-title bg-gradient-to-r from-violet-600 via-sky-500 to-violet-600 bg-clip-text text-transparent">
              run itself
            </span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            Real-time tracking, explainable dispatch and a digital twin that lets you test failures before they happen.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Card key={f.slug} f={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
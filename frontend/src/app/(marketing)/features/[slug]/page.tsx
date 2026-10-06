"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useParams, notFound } from "next/navigation";
import { Route, Radar, ShieldAlert, HeartPulse, Boxes, FlaskConical, ArrowLeft, ArrowRight, Check, type LucideIcon } from "lucide-react";

type D = {
  slug: string; Icon: LucideIcon; tag: string; title: string; tagline: string; a: string; b: string;
  stats: [string, number, string][]; steps: [string, string][]; points: [string, string][]; code: string;
  viz: "bars" | "map" | "gauge" | "heal" | "twin" | "sim"; vizTitle: string;
};

const DATA: D[] = [
  {
    slug: "explainable-smart-dispatch", Icon: Route, tag: "Dispatch", a: "#8b5cf6", b: "#e879f9",
    title: "Explainable smart dispatch", tagline: "Every driver assignment ships with a score you can read, defend and replay. No black box.",
    stats: [["Scoring factors", 5, ""], ["Max score", 100, ""], ["Black boxes", 0, ""]],
    steps: [["All drivers", "Every driver in the tenant is considered."], ["Eligibility filter", "Offline, suspended, over-capacity or out-of-zone drivers drop out."], ["Weighted scoring", "Distance 30, ETA 25, workload 20, capacity 15, SLA 10."], ["Ranked winner", "Best candidate is assigned and the breakdown is saved."]],
    points: [["Normalized factors", "Each factor is scaled to its own range before weighting, so no single metric dominates."], ["Filter before score", "Ineligible drivers never reach scoring, which keeps results safe and fast."], ["Decisions persisted", "Score and reasons live on the Assignment record for later audit."], ["Deterministic ties", "Tie-breaking rules give the same answer every time."]],
    code: `{\n  "driverId": 42,\n  "score": 93,\n  "breakdown": {\n    "distance": 29, "eta": 23,\n    "workload": 18, "capacity": 14, "sla": 9\n  },\n  "reason": [\n    "Closest eligible driver",\n    "Low active workload",\n    "Sufficient vehicle capacity"\n  ]\n}`,
    viz: "bars", vizTitle: "Driver #42 score breakdown",
  },
  {
    slug: "live-fleet-tracking", Icon: Radar, tag: "Real-time", a: "#e879f9", b: "#34d399",
    title: "Live fleet tracking", tagline: "GPS pings, heartbeats and WebSocket events keep dispatchers and customers on the same page, even after a dropped connection.",
    stats: [["Warning after (s)", 60, "s"], ["Offline after (s)", 120, "s"], ["Live channels", 4, ""]],
    steps: [["Driver GPS", "The PWA sends location, speed and heading."], ["Tracking service", "Validates, stores with retention and publishes."], ["WebSocket event", "driver.location_updated fans out to subscribers."], ["Customer and dispatcher", "Maps move in real time. Reconnect refetches REST state first."]],
    points: [["Heartbeat watchdog", "Stale heartbeats raise a warning, then mark the driver offline and open an incident."], ["REST stays authoritative", "After any reconnect the client fetches truth, then resumes the stream."], ["Controlled retention", "High-frequency pings are cleaned up on a schedule, not kept forever."], ["Scoped channels", "operations, tracking, orders and notifications are isolated per tenant."]],
    code: `{\n  "driverId": 42,\n  "latitude": 28.4089,\n  "longitude": 77.3178,\n  "accuracy": 12,\n  "speed": 31,\n  "heading": 92,\n  "timestamp": "2026-10-05T10:31:22Z"\n}`,
    viz: "map", vizTitle: "Driver #42 en route",
  },
  {
    slug: "sla-risk-engine", Icon: ShieldAlert, tag: "SLA", a: "#f59e0b", b: "#f43f5e",
    title: "SLA risk engine", tagline: "Know which orders will miss their deadline before the customer does, and exactly why.",
    stats: [["Risk levels", 4, ""], ["Explained factors", 3, "+"], ["Surprises", 0, ""]],
    steps: [["Compute ETA", "Travel, warehouse delay, driver load and buffer."], ["Compare to deadline", "ETA is checked against the order SLA."], ["Classify risk", "LOW, MEDIUM, HIGH or CRITICAL."], ["Explain", "Contributing factors are listed in plain language."]],
    points: [["Rule-based ETA", "Transparent math you can tune, ready to swap for ML later."], ["Factor attribution", "Warehouse delay, driver workload and route length are called out separately."], ["Feeds Network Brain", "Risk counts drive health score and recommendation priority."], ["Triggers recovery", "Critical risk can start self-healing or alert a dispatcher."]],
    code: `Order #8291  HIGH RISK\n\nETA          6:42 PM\nSLA deadline 6:30 PM\n\nContributing factors\n + Warehouse processing delay\n + Driver workload\n + Long remaining route`,
    viz: "gauge", vizTitle: "Order #8291 risk score",
  },
  {
    slug: "self-healing-recovery", Icon: HeartPulse, tag: "Resilience", a: "#f43f5e", b: "#34d399",
    title: "Self-healing recovery", tagline: "A driver vanishes. DeliveryOS finds the affected orders, picks replacements, updates ETAs and tells customers, then escalates only if it must.",
    stats: [["Orders recovered", 6, ""], ["Replacement candidates", 8, ""], ["Assignment loops", 0, ""]],
    steps: [["Detect offline", "Heartbeat timeout opens a DRIVER_OFFLINE incident."], ["Find affected orders", "All active assignments of that driver are collected."], ["Re-score replacements", "The dispatch engine ranks eligible drivers."], ["Reassign and notify", "ETA, SLA and customer messages update automatically."]],
    points: [["Loop protection", "Max reassignment count and a recently-rejected exclusion list."], ["Revalidated live state", "Capacity and order state are rechecked before every move."], ["Every action recorded", "Automated changes are written to audit logs."], ["Human escalation", "No eligible driver means a dispatcher gets a clear task."]],
    code: `Incident INC-2041  DRIVER_OFFLINE\n\nAffected orders     6\nCandidates found    8\nReassigned          6\nETA recalculated    yes\nCustomers notified  6\n\nStatus: RESOLVED (auto)`,
    viz: "heal", vizTitle: "Automatic reassignment",
  },
  {
    slug: "versioned-network-snapshots", Icon: Boxes, tag: "Digital Twin", a: "#a78bfa", b: "#e879f9",
    title: "Versioned network snapshots", tagline: "A frozen copy of your live network that simulations can break freely. Production is never touched.",
    stats: [["Network version", 42, ""], ["Orders captured", 248, ""], ["Production writes", 0, ""]],
    steps: [["Live network", "Drivers, orders, inventory, routes and SLA state."], ["Snapshot", "State is captured with a network version number."], ["Digital Twin", "A sandboxed model is built from the snapshot."], ["Simulation", "Scenario changes are applied only to the twin."]],
    points: [["Versioned", "Every snapshot records the network version it came from."], ["Isolated by design", "Simulation tables are separate from production tables."], ["Change log", "SimulationChange stores before and after for each entity."], ["Tenant scoped", "Snapshots never cross tenant boundaries."]],
    code: `Snapshot   SNAP-1029\nCreated    10:30 AM\nVersion    42\n\nOrders       248\nDrivers       42\nWarehouses     5\n\nSimulation != Production`,
    viz: "twin", vizTitle: "Live network to twin",
  },
  {
    slug: "what-if-simulator-apply-plan", Icon: FlaskConical, tag: "Simulation", a: "#8b5cf6", b: "#f43f5e",
    title: "What-if simulator & Apply Plan", tagline: "Break the network on purpose, read the impact, then apply the recovery plan only if live state still matches.",
    stats: [["Scenarios", 6, ""], ["Apply safety checks", 3, ""], ["Stale plans applied", 0, ""]],
    steps: [["Pick scenario", "Driver loss, warehouse closed, 3x demand and more."], ["Simulate", "Runs on the digital twin, never on live data."], ["Review plan", "Impact numbers and ranked recommendations."], ["Apply with version check", "Live version must equal simulation version, then a transaction runs."]],
    points: [["Measurable output", "Affected orders, SLA risk, extra distance and expected delay."], ["Ranked recommendations", "CRITICAL to LOW, each with reasons."], ["Stale plan rejection", "Version 42 simulation against live 45 is refused. Re-simulate."], ["Audited apply", "Every applied plan is logged with actor and changes."]],
    code: `Simulation version  42\nLive version        45\n\n! Network changed since simulation.\n  Apply rejected.\n\n[ Re-Simulate ]`,
    viz: "sim", vizTitle: "Try it: drivers unavailable",
  },
];

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

function Count({ to, suffix, on }: { to: number; suffix: string; on: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!on) return; let raf = 0; const t0 = performance.now();
    const tick = (t: number) => { const p = Math.min((t - t0) / 1400, 1); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [on, to]);
  return <>{v}{suffix}</>;
}

function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => { const r = requestAnimationFrame(() => setM(true)); return () => cancelAnimationFrame(r); }, []);
  return m;
}

function Orbit({ d }: { d: D }) {
  const { Icon, a, b } = d;
  return (
    <div className="relative mx-auto h-72 w-72 sm:h-[24rem] sm:w-[24rem]">
      <div className="dos-spin absolute inset-0 rounded-full opacity-40" style={{ background: `conic-gradient(from 0deg, transparent 72%, ${a}88)`, maskImage: "radial-gradient(circle, transparent 30%, black 31%)", WebkitMaskImage: "radial-gradient(circle, transparent 30%, black 31%)" }} />
      {[1, 0.74, 0.48].map((s, i) => (
        <div key={i} className="absolute inset-0 m-auto rounded-full border border-dashed" style={{ width: `${s * 100}%`, height: `${s * 100}%`, borderColor: "rgba(255,255,255,.12)", animation: `dos-spin ${16 + i * 9}s linear infinite ${i % 2 ? "reverse" : "normal"}` }}>
          <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full" style={{ background: i % 2 ? b : a, boxShadow: `0 0 16px 2px ${i % 2 ? b : a}` }} />
        </div>
      ))}
      {[0, 1].map((i) => <span key={i} className="dos-ping absolute inset-0 m-auto h-24 w-24 rounded-3xl border" style={{ borderColor: a, animationDelay: `${i * 1.4}s` }} />)}
      <div className="dos-float absolute inset-0 m-auto flex h-24 w-24 items-center justify-center rounded-3xl text-white" style={{ background: `linear-gradient(135deg, ${a}, ${b})`, boxShadow: `0 0 60px ${a}88` }}>
        <Icon className="h-10 w-10" />
      </div>
    </div>
  );
}

function Viz({ d }: { d: D }) {
  const on = useMounted();
  const [pct, setPct] = useState(30);
  const { a, b } = d;
  if (d.viz === "bars")
    return (
      <div className="space-y-4">
        {([["Distance", 29, 30], ["ETA", 23, 25], ["Workload", 18, 20], ["Capacity", 14, 15], ["SLA", 9, 10]] as const).map(([l, v, m]) => (
          <div key={l} className="grid grid-cols-[5rem_1fr_3rem] items-center gap-3 text-sm">
            <span className="text-muted-foreground">{l}</span>
            <Progress value={on ? (v / m) * 100 : 0} className="h-2 bg-white/10 [&>*]:bg-gradient-to-r [&>*]:from-violet-500 [&>*]:to-fuchsia-400 [&>*]:duration-1000" />
            <span className="text-right tabular-nums">{v}/{m}</span>
          </div>
        ))}
        <div className="text-right text-4xl font-bold">93<span className="text-base text-muted-foreground">/100</span></div>
      </div>
    );
  if (d.viz === "map")
    return (
      <svg viewBox="0 0 320 150" className="w-full rounded-xl">
        <defs><pattern id="dg" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="rgba(255,255,255,.12)" /></pattern></defs>
        <rect width="320" height="150" fill="url(#dg)" />
        <path id="dr" d="M24 125 C80 125 70 45 130 45 S210 115 250 75 S290 38 300 26" fill="none" stroke={a} strokeWidth="3" strokeLinecap="round" className="dos-dash" />
        <circle cx="24" cy="125" r="5" fill={a} /><circle cx="300" cy="26" r="5" fill={b} /><circle cx="300" cy="26" r="5" fill={b} className="dos-ring" />
        <circle r="7" fill="#fff" stroke={a} strokeWidth="3"><animateMotion dur="6s" repeatCount="indefinite"><mpath href="#dr" /></animateMotion></circle>
      </svg>
    );
  if (d.viz === "gauge")
    return (
      <svg viewBox="0 0 120 80" className="mx-auto h-52">
        <defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
        <path d="M10 66 A50 50 0 0 1 110 66" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="9" strokeLinecap="round" />
        <path d="M10 66 A50 50 0 0 1 110 66" pathLength={100} fill="none" stroke="url(#gg)" strokeWidth="9" strokeLinecap="round" strokeDasharray="100" strokeDashoffset={on ? 28 : 100} style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(.2,.8,.2,1)" }} />
        <text x="60" y="56" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff">72</text>
        <text x="60" y="71" textAnchor="middle" fontSize="7" letterSpacing="1.5" fill={b}>HIGH RISK</text>
      </svg>
    );
  if (d.viz === "heal")
    return (
      <div className="flex items-center gap-3 py-8">
        <Badge variant="outline" className="dos-blink border-rose-400/50 bg-rose-500/10 px-3 py-1.5 text-rose-300">D-42 offline</Badge>
        <Separator className="dos-march h-px flex-1 bg-transparent" />
        <Badge variant="outline" className="border-amber-400/50 bg-amber-500/10 px-3 py-1.5 text-amber-300">Re-score 8</Badge>
        <Separator className="dos-march h-px flex-1 bg-transparent" />
        <Badge variant="outline" className="border-emerald-400/50 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">D-18 assigned</Badge>
      </div>
    );
  if (d.viz === "twin")
    return (
      <svg viewBox="0 0 200 150" className="mx-auto h-56">
        {[["LIVE", 100, "#34d399"], ["TWIN", 62, a], ["WHAT-IF", 24, b]].map(([l, y, c], i) => (
          <g key={l as string} className="dos-layer" style={{ animationDelay: `${i * 0.5}s` }}>
            <polygon points="100,0 190,30 100,60 10,30" transform={`translate(0 ${y})`} fill={`${c}2a`} stroke={c as string} strokeWidth="1.5" />
            <text x="100" y={(y as number) + 34} textAnchor="middle" fontSize="8" fill="#fff" letterSpacing="2">{l}</text>
          </g>
        ))}
      </svg>
    );
  const aff = Math.round(pct * 4.73), sla = Math.round(aff * 0.27), km = Math.round(pct * 6.1), dl = Math.round(pct * 0.9);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">Drivers unavailable <span className="text-3xl font-bold text-foreground tabular-nums">{pct}%</span></div>
      <Slider value={[pct]} max={80} step={1} onValueChange={(v) => setPct(typeof v === "number" ? v : v[0] ?? 0)} aria-label="Percent of drivers unavailable" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[["Drivers left", 100 - pct, ""], ["Affected orders", aff, ""], ["SLA risk", sla, ""], ["Extra distance", km, " km"]].map(([l, v, u]) => (
          <Card key={l as string} className="border-white/10 bg-white/5 p-4"><div className="text-2xl font-bold tabular-nums">{v}{u}</div><div className="text-xs text-muted-foreground">{l}</div></Card>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">Expected delay <b className="text-foreground">{dl} min</b>, based on 100 drivers and 500 orders.</p>
    </div>
  );
}

function Term({ code, a }: { code: string; a: string }) {
  const [n, setN] = useState(0);
  useEffect(() => { const t = setInterval(() => setN((x) => (x > code.length + 40 ? 0 : x + 2)), 40); return () => clearInterval(t); }, [code]);
  return <pre className="min-h-[15rem] overflow-x-auto rounded-xl bg-black/50 p-5 font-mono text-[13px] leading-relaxed ring-1 ring-white/10" style={{ color: a }}>{code.slice(0, n)}<span className="dos-blink">▍</span></pre>;
}

function Flow({ d }: { d: D }) {
  const [act, setAct] = useState(0);
  useEffect(() => { const t = setInterval(() => setAct((x) => (x + 1) % d.steps.length), 1800); return () => clearInterval(t); }, [d.steps.length]);
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {d.steps.map(([t, s], i) => (
        <Card key={t} className="relative overflow-hidden border-white/10 bg-white/[0.03] p-5 transition-all duration-500" style={{ borderColor: i === act ? d.a : undefined, boxShadow: i === act ? `0 0 40px -12px ${d.a}` : undefined }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white" style={{ background: i <= act ? `linear-gradient(135deg, ${d.a}, ${d.b})` : "rgba(255,255,255,.08)" }}>{i < act ? <Check className="h-4 w-4" /> : i + 1}</div>
          <h4 className="mt-4 font-semibold">{t}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{s}</p>
          {i === act && <div className="dos-bar absolute bottom-0 left-0 h-0.5" style={{ background: `linear-gradient(90deg, ${d.a}, ${d.b})` }} />}
        </Card>
      ))}
    </div>
  );
}

export default function FeaturePage() {
  const { slug } = useParams<{ slug: string }>();
  const i = DATA.findIndex((x) => x.slug === slug);
  const [statRef, statOn] = useInView<HTMLDivElement>();
  if (i < 0) notFound();
  const d = DATA[i], prev = DATA[(i + DATA.length - 1) % DATA.length], next = DATA[(i + 1) % DATA.length];

  return (
    <main className="dark relative isolate min-h-screen overflow-hidden bg-zinc-950 text-foreground selection:bg-violet-500/30 [-webkit-tap-highlight-color:transparent]">
      <style>{`
        @keyframes dos-spin{to{transform:rotate(360deg)}}
        @keyframes dos-ping{0%{transform:scale(1);opacity:.6}100%{transform:scale(4);opacity:0}}
        @keyframes dos-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes dos-aurora{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(50px,-30px,0) scale(1.15)}}
        @keyframes dos-shim{to{background-position:200% center}}
        @keyframes dos-dash{to{stroke-dashoffset:-22}}
        @keyframes dos-blink{50%{opacity:.25}}
        @keyframes dos-ring{0%{transform:scale(1);opacity:.8}100%{transform:scale(5);opacity:0}}
        @keyframes dos-layer{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes dos-march{to{background-position:24px 0}}
        @keyframes dos-bar{from{width:0}to{width:100%}}
        .dos-spin{animation:dos-spin 10s linear infinite}.dos-ping{animation:dos-ping 4s ease-out infinite}
        .dos-float{animation:dos-float 5s ease-in-out infinite}.dos-aur{animation:dos-aurora 16s ease-in-out infinite}
        .dos-title{background-size:200% auto;animation:dos-shim 6s linear infinite}
        .dos-dash{stroke-dasharray:5 6;animation:dos-dash 1.2s linear infinite}
        .dos-blink{animation:dos-blink 1.2s steps(2) infinite}
        .dos-ring{transform-box:fill-box;transform-origin:center;animation:dos-ring 2s ease-out infinite}
        .dos-layer{animation:dos-layer 3s ease-in-out infinite}
        .dos-march{background:repeating-linear-gradient(90deg,#64748b 0 6px,transparent 6px 12px);animation:dos-march 1s linear infinite}
        .dos-bar{animation:dos-bar 1.8s linear}
        @media (prefers-reduced-motion:reduce){.dos-spin,.dos-ping,.dos-float,.dos-aur,.dos-title,.dos-dash,.dos-blink,.dos-ring,.dos-layer,.dos-march,.dos-bar{animation:none}}
      `}</style>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "28px 28px", maskImage: "radial-gradient(ellipse at 50% 15%,black 15%,transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at 50% 15%,black 15%,transparent 70%)" }} />
        <div className="dos-aur absolute -left-32 -top-20 h-[28rem] w-[28rem] rounded-full blur-[140px]" style={{ background: `${d.a}44` }} />
        <div className="dos-aur absolute -right-32 top-72 h-[26rem] w-[26rem] rounded-full blur-[140px] [animation-delay:5s]" style={{ background: `${d.b}30` }} />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Button render={<Link href="/#features" />} variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> DeliveryOS</Button>
          <Badge variant="outline" className="gap-1.5 border-white/15"><d.Icon className="h-3.5 w-3.5" style={{ color: d.a }} />{d.tag}</Badge>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <section className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <h1 className="dos-title bg-clip-text text-5xl font-extrabold leading-[1.05] tracking-tight text-transparent sm:text-6xl" style={{ backgroundImage: `linear-gradient(90deg, #fff, ${d.a}, ${d.b}, #fff)` }}>{d.title}</h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">{d.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button render={<Link href="/register" />} size="lg" className="border-0 text-white" style={{ background: `linear-gradient(135deg, ${d.a}, ${d.b})` }}>Start with DeliveryOS</Button>
              <Button render={<Link href="/operations" />} size="lg" variant="outline" className="border-white/20 bg-transparent">Open control tower</Button>
            </div>
          </div>
          <Orbit d={d} />
        </section>

        <div ref={statRef} className="grid gap-4 sm:grid-cols-3">
          {d.stats.map(([l, v, u]) => (
            <Card key={l} className="border-white/10 bg-white/[0.03] p-6 backdrop-blur">
              <div className="text-5xl font-extrabold tabular-nums"><Count to={v} suffix={u} on={statOn} /></div>
              <div className="mt-2 text-sm text-muted-foreground">{l}</div>
            </Card>
          ))}
        </div>

        <Card className="mt-6 border-white/10 bg-white/[0.03] p-6 backdrop-blur sm:p-8">
          <Tabs defaultValue="preview">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><span className="dos-blink h-2 w-2 rounded-full bg-emerald-400" />{d.vizTitle}</div>
              <TabsList className="bg-white/5"><TabsTrigger value="preview">Live preview</TabsTrigger><TabsTrigger value="output">Raw output</TabsTrigger></TabsList>
            </div>
            <TabsContent value="preview" className="mt-6"><Viz d={d} /></TabsContent>
            <TabsContent value="output" className="mt-6"><Term code={d.code} a={d.a} /></TabsContent>
          </Tabs>
        </Card>

        <h2 className="mb-6 mt-20 text-2xl font-bold tracking-tight">How it works</h2>
        <Flow d={d} />

        <h2 className="mb-4 mt-20 text-2xl font-bold tracking-tight">Under the hood</h2>
        <Accordion defaultValue={[d.points[0][0]]} className="rounded-2xl border border-white/10 bg-white/[0.03] px-6">
          {d.points.map(([t, s]) => (
            <AccordionItem key={t} value={t} className="border-white/10 last:border-0">
              <AccordionTrigger className="text-base hover:no-underline">{t}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{s}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <nav className="mt-20 grid gap-4 sm:grid-cols-2" aria-label="More features">
          {[[prev, "Previous", ArrowLeft], [next, "Next", ArrowRight]].map(([n, l, Ar]) => {
            const f = n as D, A = Ar as LucideIcon;
            return (
              <Link key={f.slug} href={`/features/${f.slug}`} className="group">
                <Card className="flex-row items-center justify-between border-white/10 bg-white/[0.03] p-6 transition group-hover:bg-white/[0.07]">
                  <div><div className="text-xs text-muted-foreground">{l as string}</div><div className="mt-1 font-semibold">{f.title}</div></div>
                  <A className="h-5 w-5 transition group-hover:scale-125" style={{ color: f.a }} />
                </Card>
              </Link>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
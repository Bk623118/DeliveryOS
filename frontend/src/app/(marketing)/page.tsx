"use client";

import Image from "next/image";
import Link from "next/link";
import { Caveat, Poppins } from "next/font/google";
import {
  MapPin, Network, Box, RefreshCw, TriangleAlert, Zap, Truck, ShieldCheck, Cloud, Users,
  User, Building2, Target, ArrowRight, CircleCheck, type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import {
  animate, motion, useInView, useMotionValue, useReducedMotion, useSpring,
} from "framer-motion";

/* ------------------------- motion helpers ------------------------- */

type P = { children: ReactNode; className?: string };
const spring = { type: "spring", stiffness: 300, damping: 20 } as const;

/** Fade + slide-up when scrolled into view. */
function Reveal({ children, delay = 0, className = "" }: P & { delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Number that counts up once when visible. */
function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  useEffect(() => {
    if (!seen || !ref.current) return;
    const c = animate(0, to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix;
      },
    });
    return () => c.stop();
  }, [seen, to, decimals, suffix]);
  return <span ref={ref}>{(0).toFixed(decimals) + suffix}</span>;
}

/** Spring lift on hover / press. */
function Lift({ children, className = "" }: P) {
  return (
    <motion.div className={className} whileHover={{ y: -8, scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}>
      {children}
    </motion.div>
  );
}

/** 3D tilt that follows the cursor + spring lift. */
function Tilt({ children, className = "" }: P) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });
  const move = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 14);
  };
  const leave = () => {
    rx.set(0);
    ry.set(0);
  };
  return (
    <motion.div
      className={className}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      whileHover={{ y: -8 }}
      transition={spring}
      onMouseMove={move}
      onMouseLeave={leave}
    >
      {children}
    </motion.div>
  );
}

/** Button/element that is gently pulled toward the cursor. */
function Magnetic({ children, className = "", strength = 0.3 }: P & { strength?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  return (
    <motion.div
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word masked slide-up headline. */
function Words({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.2em] -mb-[0.35em] align-bottom">
          <motion.span
            className={`inline-block pb-[0.15em] ${className}`}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: delay + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </>
  );
}

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  size: 2 + (i % 3) * 2,
  dur: 9 + (i % 5) * 2,
  delay: -(i * 1.3),
}));

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });
const caveat = Caveat({ subsets: ["latin"], weight: ["500"], variable: "--font-caveat" });

/* ------------------------------ data ------------------------------ */

type Stat = { icon: LucideIcon; tint: string; title: string; sub: string; num?: { to: number; dec?: number; suf: string } };

const stats: Stat[] = [
  { icon: Truck, tint: "from-[#6C4DF6] to-[#8B6BFF]", title: "Real-time Tracking", sub: "< 2 min ETA updates" },
  { icon: ShieldCheck, tint: "from-[#2F6BFF] to-[#5B8CFF]", title: " Uptime", sub: "Production ready", num: { to: 99.9, dec: 1, suf: "%" } },
  { icon: Cloud, tint: "from-[#2F6BFF] to-[#5B8CFF]", title: "₹0 / month", sub: "Free tier deployment" },
  { icon: Users, tint: "from-[#6C4DF6] to-[#8B6BFF]", title: " Concurrent Users", sub: "Demo ready", num: { to: 10, suf: "+" } },
];

const features: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: MapPin, title: "Live Tracking", text: "Real-time fleet & order tracking with WebSockets" },
  { icon: Network, title: "Smart Dispatch", text: "Rule-based driver assignment (Explainable AI)" },
  { icon: Box, title: "Digital Twin", text: "Virtual copy of your network for simulation" },
  { icon: RefreshCw, title: "Self-Healing", text: "Detect, analyze, reassign, recover automatically" },
  { icon: TriangleAlert, title: "SLA Risk Engine", text: "Predict & prevent delays with intelligent alerts" },
  { icon: Zap, title: "Chaos Simulator", text: "Test your network under real-world failure scenarios" },
];

const roles: { name: string; icon: LucideIcon; color: string; bar: string; text: string }[] = [
  { name: "Customer", icon: MapPin, color: "text-emerald-500", bar: "bg-emerald-500", text: "Track orders, manage addresses, make payments" },
  { name: "Driver", icon: User, color: "text-blue-600", bar: "bg-blue-600", text: "Get deliveries, update location, earn more" },
  { name: "Warehouse", icon: Building2, color: "text-sky-600", bar: "bg-sky-600", text: "Manage inventory, pick & pack orders" },
  { name: "Dispatcher", icon: Target, color: "text-violet-600", bar: "bg-violet-600", text: "Optimize routes, solve issues, keep flow" },
  { name: "Admin", icon: Zap, color: "text-orange-500", bar: "bg-orange-500", text: "Full control, analytics, users, tenants & more" },
];

const heroChecks = ["Real-time Tracking", "Smart Dispatch", "Digital Twin", "Self-Healing"];

/* --------------------------- global motion CSS --------------------------- */

function MotionStyles() {
  return (
    <style>{`
      html{scroll-behavior:smooth;scroll-padding-top:80px}
      a:focus-visible,summary:focus-visible{outline:2px solid #8B6BFF;outline-offset:3px;border-radius:8px}
      @keyframes rise{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-560px);opacity:0}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
      @keyframes blob{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(40px,-30px) scale(1.15)}66%{transform:translate(-30px,25px) scale(.9)}}
      @keyframes ping2{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.6);opacity:0}}
      .btn-shine{position:relative;overflow:hidden}
      .btn-shine::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%);transform:translateX(-100%);transition:transform .7s}
      .btn-shine:hover::after{transform:translateX(100%)}
      @media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
    `}</style>
  );
}

/* -------------------------------- hero -------------------------------- */

function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#0A1030] text-white">
      <Image
        src="/hero-bg.png"
        alt=""
        fill
        priority
        quality={75}
        sizes="100vw"
        className="-z-30 hidden object-cover object-[48%_center] lg:block"
      />
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-[#0A1030] via-[#0A1030]/85 to-[#0A1030]/15 lg:bg-gradient-to-r lg:from-[#0A1030] lg:via-[#0A1030]/50 lg:to-transparent" />

      <div aria-hidden className="absolute inset-x-0 bottom-0 z-0 h-32 overflow-hidden lg:hidden">
        <Image
          src="/hero-mobile.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1030] via-[#0A1030]/30 to-transparent" />
      </div>

      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute bottom-0 rounded-full bg-[#8B6BFF]/70 shadow-[0_0_10px_#8B6BFF]"
            style={{ left: `${p.left}%`, width: p.size, height: p.size, animation: `rise ${p.dur}s ${p.delay}s linear infinite` }}
          />
        ))}
      </div>

      <p className={`${caveat.className} pointer-events-none absolute right-[4%] top-5 hidden -rotate-6 text-2xl leading-snug text-white/90 xl:block`}>
        From Warehouse
        <br />
        to Your Door
        <br />— Seamlessly
      </p>

      <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl flex-col justify-center gap-5 px-4 pt-12 pb-36 sm:px-6 sm:pb-40 lg:min-h-[560px] lg:py-12">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#4A55A0] bg-[#1B2160]/70 px-4 py-2 text-xs backdrop-blur sm:text-[13px]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8B6BFF]" />
            Autonomous Logistics &amp; Delivery Operations Platform
          </span>
        </Reveal>

        <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-[56px]">
          <Words text="Smarter Deliveries." />
          <br />
          <Words text="Stronger Operations." delay={0.35} className="bg-gradient-to-r from-[#8B6BFF] to-[#5B8CFF] bg-clip-text text-transparent" />
        </h1>

        <Reveal delay={200}>
          <p className="max-w-md text-[15px] leading-relaxed text-[#D6DAF0] sm:text-base">
            DeliveryOS is a full-stack, real-time logistics platform that operates, simulates, analyzes and
            automatically recovers your delivery network.
          </p>
        </Reveal>

        <Reveal delay={300} className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Magnetic className="block sm:inline-block">
            <Link
              href="/demo"
              className="btn-shine group inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#6C4DF6] px-7 py-3.5 text-base font-medium shadow-xl shadow-[#6C4DF6]/40 transition hover:-translate-y-1 hover:bg-[#5A3DE0] hover:shadow-[#6C4DF6]/60 sm:w-auto"
            >
              Explore Demo <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1.5" aria-hidden />
            </Link>
          </Magnetic>
          <Link
            href="/features"
            className="inline-flex items-center justify-center rounded-xl border border-white/40 px-7 py-3.5 text-base font-medium backdrop-blur transition hover:-translate-y-1 hover:border-white hover:bg-white/10"
          >
            View Features
          </Link>
        </Reveal>

        <Reveal delay={400}>
          <ul className="mt-1 flex max-w-xl flex-wrap gap-x-5 gap-y-3 text-xs text-[#D6DAF0]">
            {heroChecks.map((c) => (
              <li key={c} className="flex items-center gap-2 transition hover:text-white">
                <CircleCheck className="h-5 w-5 text-[#8B6BFF]" aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------- sections ---------------------------- */

function StatsStrip() {
  return (
    <section className="relative z-10 -mt-px border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-slate-200">
        {stats.map(({ icon: Icon, tint, title, sub, num }, i) => (
          <Reveal key={title} delay={i * 90}>
            <div className="group flex items-center gap-3.5 rounded-xl p-2 transition hover:bg-slate-50 lg:justify-center lg:px-6">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tint} shadow-lg transition duration-300 group-hover:-rotate-6 group-hover:scale-110`}>
                <Icon className="h-5 w-5 text-white" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0E1330]">
                  {num && <CountUp to={num.to} decimals={num.dec} suffix={num.suf} />}
                  {title}
                </p>
                <p className="text-[13px] text-slate-600">{sub}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="relative overflow-hidden bg-[#F6F8FF]">
      <div aria-hidden className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-[#6C4DF6]/10 blur-[90px]" style={{ animation: "blob 16s ease-in-out infinite" }} />
      <div className="relative mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 xl:grid-cols-6">
        {features.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 80} className="h-full">
            <Tilt className="group h-full rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 p-px transition-colors duration-300 hover:from-[#6C4DF6] hover:to-[#38BDF8] hover:shadow-2xl hover:shadow-[#6C4DF6]/25">
              <div className="h-full rounded-[15px] bg-white p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E2EAFF] transition duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#6C4DF6] group-hover:to-[#2F6BFF]">
                  <Icon className="h-5 w-5 text-[#2F6BFF] transition group-hover:text-white" aria-hidden />
                </div>
                <h3 className="mb-1.5 mt-4 text-[15px] font-semibold text-[#0E1330]">{title}</h3>
                <p className="text-[13px] leading-relaxed text-slate-600">{text}</p>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Roles() {
  return (
    <section id="about" className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-14 sm:px-8 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <Reveal>
          <span className="rounded-full bg-[#ECE8FF] px-3 py-1 text-xs font-medium text-[#4B32C8]">Built for Every Role</span>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-3xl font-bold leading-tight text-[#0E1330] sm:text-4xl">One Platform. Multiple Roles.</h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="max-w-md text-[15px] leading-relaxed text-slate-600">
            From customers to operations teams, DeliveryOS gives everyone the tools they need to move faster, work
            smarter and deliver better.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {roles.map(({ name, icon: Icon, color, bar, text }, i) => (
            <Reveal key={name} delay={i * 70} className="h-full">
              <Lift className="group relative h-full overflow-hidden rounded-xl border border-slate-200 bg-white p-3 transition-colors duration-300 hover:border-transparent hover:shadow-xl">
                <span className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${bar}`} />
                <Icon className={`h-5 w-5 transition duration-300 group-hover:scale-125 ${color}`} aria-hidden />
                <p className="mt-2 text-[13px] font-semibold text-[#0E1330]">{name}</p>
                <p className="mt-1 text-xs leading-snug text-slate-600">{text}</p>
              </Lift>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <Link
            href="#features"
            className="btn-shine group inline-flex items-center gap-2 rounded-xl bg-[#6C4DF6] px-5 py-3 text-sm font-medium text-white shadow-lg shadow-[#6C4DF6]/30 transition hover:-translate-y-1 hover:bg-[#5A3DE0]"
          >
            Explore All Features <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" aria-hidden />
          </Link>
        </Reveal>
      </div>

      <Reveal delay={150}>
        <div className="relative">
          <div aria-hidden className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#6C4DF6]/30 to-[#38BDF8]/30 blur-2xl lg:opacity-70" />
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src="/aerial-network.jpg"
              alt="Real-time network view of warehouses and delivery routes"
              width={1600}
              height={596}
              quality={90}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full"
            />
          </div>
          <div className="absolute -bottom-4 left-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-[#0E1330] shadow-xl" style={{ animation: "float 5s ease-in-out infinite" }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 rounded-full bg-emerald-500" style={{ animation: "ping2 1.6s infinite" }} />
              <span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            Live network
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------ page ------------------------------ */

export default function Home() {
  return (
    <main className={`${poppins.variable} ${caveat.variable} ${poppins.className} overflow-x-hidden bg-white text-[#0E1330]`}>
      <MotionStyles />
      <div aria-hidden className="h-[76px] sm:h-[72px]" />
      <Hero />
      <StatsStrip />
      <Features />
      <Roles />
    </main>
  );
}
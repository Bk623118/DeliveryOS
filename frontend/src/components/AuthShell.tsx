"use client";

import { useState, type InputHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Radar, TriangleAlert, Truck, type LucideIcon } from "lucide-react";

const A = "#6c4df6", B = "#5b8cff";

export const ROLE_HOME: Record<string, string> = {
  CUSTOMER: "/shop", DRIVER: "/driver", WAREHOUSE: "/warehouse",
  DISPATCHER: "/dispatcher", ADMIN: "/admin", OPS_MANAGER: "/operations",
};

// Backend sets the HttpOnly session cookie. Expects { success, data: { user: { role } } } or { success:false, error:{ message } }.
export async function authPost(path: string, body: unknown) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method: "POST", credentials: "include",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => null);
  if (!r.ok || !j?.success) throw new Error(j?.error?.message ?? "Something went wrong. Try again.");
  return j.data as { user: { role: string } };
}

export function Field({ label, icon: Icon, error, type = "text", ...p }: InputHTMLAttributes<HTMLInputElement> & { label: string; icon: LucideIcon; error?: string }) {
  const [show, setShow] = useState(false);
  const pw = type === "password";
  return (
    <label className="group block">
      <span className="mb-1.5 block text-sm text-muted-foreground transition-colors group-focus-within:text-violet-300">{label}</span>
      <span className="relative flex items-center">
        <Icon className="pointer-events-none absolute left-3 h-4 w-4 text-zinc-500 transition-all group-focus-within:scale-110 group-focus-within:text-violet-400" />
        <input
          {...p} type={pw && show ? "text" : type}
          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-10 text-sm outline-none transition placeholder:text-zinc-600 hover:border-white/25 focus:border-violet-400/70 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(139,92,246,.16)]"
        />
        {pw && (
          <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2 rounded-lg p-1.5 text-zinc-500 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-violet-400">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </span>
      {error && <span role="alert" className="mt-1 block text-xs text-rose-400">{error}</span>}
    </label>
  );
}

export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div role="alert" className="au-shake flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300">
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />{message}
    </div>
  );
}

export function Submit({ busy, children }: { busy: boolean; children: ReactNode }) {
  return (
    <Button type="submit" disabled={busy} size="lg"
      className="group relative h-11 w-full overflow-hidden rounded-xl border-0 text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_#8b5cf6] active:translate-y-0 disabled:opacity-70"
      style={{ background: `linear-gradient(135deg, ${A}, #e879f9)` }}>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative flex items-center gap-2">{busy && <Loader2 className="h-4 w-4 animate-spin" />}{children}</span>
    </Button>
  );
}

export function AuthShell({ title, sub, foot, children, wide = false }: { title: string; sub: string; foot: ReactNode; children: ReactNode; wide?: boolean }) {
  const spot = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <main className="dark relative isolate grid min-h-screen overflow-hidden bg-zinc-950 text-foreground selection:bg-violet-500/30 lg:grid-cols-[1.1fr_1fr]">
      <style>{`
        @property --au-angle{syntax:"<angle>";inherits:false;initial-value:0deg}
        @keyframes au-in{from{opacity:0;transform:translateY(18px) scale(.98)}to{opacity:1;transform:none}}
        @keyframes au-aur{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(50px,-30px,0) scale(1.15)}}
        @keyframes au-card-rotate{to{--au-angle:360deg}}
        @keyframes au-dash{to{stroke-dashoffset:-22}}
        @keyframes au-blink{50%{opacity:.25}}
        @keyframes au-ring{0%{transform:scale(1);opacity:.8}100%{transform:scale(4);opacity:0}}
        @keyframes au-shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
        .au-in{animation:au-in .7s cubic-bezier(.2,.8,.2,1) both}
        .au-aur{animation:au-aur 16s ease-in-out infinite}
        .au-card-aura{--au-angle:0deg;animation:au-card-rotate 8s linear infinite}
        .au-dash{stroke-dasharray:5 6;animation:au-dash 1.2s linear infinite}
        .au-blink{animation:au-blink 1.2s steps(2) infinite}
        .au-ring{transform-box:fill-box;transform-origin:center;animation:au-ring 2s ease-out infinite}
        .au-shake{animation:au-shake .35s}
        .au-card::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(380px circle at var(--x,50%) var(--y,0),rgba(139,92,246,.18),transparent 70%)}
        .au-card:hover::before{opacity:1}
        @media (prefers-reduced-motion:reduce){.au-in,.au-aur,.au-card-aura,.au-dash,.au-blink,.au-ring,.au-shake{animation:none}}
      `}</style>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "28px 28px", maskImage: "radial-gradient(ellipse at 30% 30%,black 15%,transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at 30% 30%,black 15%,transparent 70%)" }} />
        <div className="au-aur absolute -left-32 -top-20 h-[28rem] w-[28rem] rounded-full blur-[140px]" style={{ background: `${A}44` }} />
        <div className="au-aur absolute -right-32 bottom-0 h-[26rem] w-[26rem] rounded-full blur-[140px]" style={{ background: `${B}30` }} />
      </div>

      <aside className="hidden flex-col justify-between p-12 lg:flex xl:p-16">
        <Link href="/" className="flex w-fit items-center gap-2 text-lg font-bold transition hover:opacity-80">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-lg shadow-[#6c4df6]/30" style={{ background: `linear-gradient(135deg, ${A}, ${B})` }}><Truck className="h-5 w-5" /></span>
          DeliveryOS
        </Link>

        <div className="mx-auto w-full max-w-lg">
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9b8bff]">
            <span className="h-px w-6 bg-[#8b6bff]" />Your operations, in sync
          </p>
          <h2 className="max-w-md text-4xl font-extrabold leading-[1.1] tracking-tight xl:text-5xl">Operate. Simulate. Analyze. <span className="bg-gradient-to-r from-[#8b6bff] to-[#5b8cff] bg-clip-text text-transparent">Recover.</span></h2>
          <p className="mt-4 max-w-sm leading-7 text-slate-400">One control tower for orders, drivers and warehouses, with a plan ready when something breaks.</p>
          <svg viewBox="0 0 360 220" className="mt-8 w-full max-w-md" role="img" aria-label="Driver D-42 goes offline and D-18 takes over the route">
            <defs><pattern id="au-d" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="rgba(255,255,255,.1)" /></pattern></defs>
            <rect width="360" height="220" rx="16" fill="url(#au-d)" />
            <path id="au-p1" d="M30 180 C90 180 90 70 160 70 S270 120 330 40" fill="none" stroke={A} strokeWidth="2.5" strokeLinecap="round" className="au-dash" />
            <path id="au-p2" d="M30 180 C120 205 210 195 255 150 S315 110 330 40" fill="none" stroke={B} strokeWidth="2.5" strokeLinecap="round" className="au-dash" />
            <rect x="20" y="170" width="20" height="20" rx="5" fill={A} />
            <circle cx="330" cy="40" r="6" fill="#34d399" />
            <circle cx="160" cy="70" r="5" fill="#f43f5e" /><circle cx="160" cy="70" r="5" fill="#f43f5e" className="au-ring" />
            <text x="170" y="62" fontSize="10" fill="#fda4af" className="au-blink">D-42 offline</text>
            <circle r="6" fill="#fff" stroke={B} strokeWidth="3"><animateMotion dur="7s" repeatCount="indefinite"><mpath href="#au-p2" /></animateMotion></circle>
            <text x="150" y="212" fontSize="10" fill={B}>D-18 takes over</text>
          </svg>
        </div>

        <p className="text-sm text-slate-500">Real-time tracking <span className="px-2 text-slate-700">·</span> Explainable dispatch <span className="px-2 text-slate-700">·</span> Digital twin</p>
      </aside>

      <section className="flex items-center justify-center px-4 py-8 sm:px-8 sm:py-12 lg:bg-gradient-to-br lg:from-white/[0.025] lg:to-transparent">
        <div className={`au-in relative w-full ${wide ? "max-w-xl" : "max-w-md"} rounded-3xl p-px`}>
          <div
            aria-hidden="true"
            className="au-card-aura absolute inset-0 rounded-3xl opacity-90 blur-[5px]"
            style={{
              background: `conic-gradient(from var(--au-angle), transparent 0%, ${A} 8%, transparent 22%, transparent 58%, #e879f9 66%, transparent 80%)`,
            }}
          />
          <div onMouseMove={spot} className="au-card relative rounded-3xl border border-white/[0.12] bg-[#0d1430]/95 p-6 shadow-[0_24px_100px_-32px_rgba(0,0,0,.8)] backdrop-blur-xl transition-colors hover:border-white/20 sm:p-9">
            <Link href="/" className="mb-7 flex w-fit items-center gap-2.5 font-bold lg:hidden"><Radar className="h-5 w-5 text-violet-400" />DeliveryOS</Link>
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{sub}</p>
            <div className="mt-7">{children}</div>
            <p className="mt-6 text-center text-sm text-muted-foreground">{foot}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
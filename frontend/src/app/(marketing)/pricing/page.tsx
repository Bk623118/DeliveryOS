"use client";

import { useState, type MouseEvent } from "react";
import { Check, ArrowRight, Sparkles } from "lucide-react";

type Plan = {
  name: string;
  desc: string;
  monthly: number | null; // null = custom pricing
  features: string[];
  cta: string;
  popular?: boolean;
};

// Placeholder plans and prices: replace with your own.
const PLANS: Plan[] = [
  {
    name: "Starter",
    desc: "For small fleets trying out the platform.",
    monthly: 0,
    cta: "Start for free",
    features: ["Up to 10 drivers", "1 warehouse", "Live tracking", "Basic dispatch scoring", "Community support"],
  },
  {
    name: "Growth",
    desc: "For growing delivery networks that need intelligence.",
    monthly: 2999,
    cta: "Start 14-day trial",
    popular: true,
    features: ["Up to 100 drivers", "5 warehouses", "Explainable dispatch", "SLA risk engine", "Self-healing recovery", "Digital Twin and simulations", "Priority support"],
  },
  {
    name: "Enterprise",
    desc: "For multi-tenant operations with custom needs.",
    monthly: null,
    cta: "Talk to sales",
    features: ["Unlimited drivers and warehouses", "Multi-tenant isolation", "Chaos simulator", "Custom SLA rules", "Audit logs and SSO", "Dedicated support"],
  },
];

const YEARLY_DISCOUNT = 0.2;

function PlanCard({ plan, yearly }: { plan: Plan; yearly: boolean }) {
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  const price = plan.monthly === null ? null : Math.round(plan.monthly * (yearly ? 1 - YEARLY_DISCOUNT : 1));

  return (
    <div
      onMouseMove={onMove}
      className={`group relative overflow-hidden rounded-2xl p-px transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-28px_rgba(99,102,241,.4)] ${
        plan.popular ? "bg-slate-200/70 shadow-[0_30px_70px_-25px_rgba(99,102,241,.55)] lg:-my-4" : "bg-slate-200/70"
      }`}
    >
      {plan.popular && (
        <div className="absolute -inset-[100%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_290deg,#a78bfa_325deg,#38bdf8_360deg)]" />
      )}
      <div className="relative flex h-full flex-col overflow-hidden rounded-[15px] bg-white p-7">
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: "radial-gradient(360px circle at var(--x,50%) var(--y,50%), rgba(139,92,246,.09), transparent 45%)" }}
        />
        <div className="relative flex flex-1 flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
            {plan.popular && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                <Sparkles className="h-3 w-3" /> Most popular
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-500">{plan.desc}</p>

          <div className="mt-6 flex items-end gap-1.5">
            {/* key restarts the animation whenever billing changes */}
            <span key={`${plan.name}-${yearly}`} className="fp-pop text-4xl font-bold tracking-tight text-slate-900 tabular-nums">
              {price === null ? "Custom" : price === 0 ? "₹0" : `₹${price.toLocaleString("en-IN")}`}
            </span>
            {price !== null && price > 0 && <span className="pb-1 text-sm text-slate-500">/ month</span>}
          </div>
          <div className="mt-1 h-4 text-xs text-slate-400">
            {price !== null && price > 0 && yearly ? "Billed yearly" : ""}
          </div>

          <button
            className={`group/btn relative mt-6 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
              plan.popular
                ? "bg-gradient-to-r from-violet-500 to-sky-500 text-white shadow-[0_8px_30px_-8px_rgba(139,92,246,.8)] hover:shadow-[0_8px_40px_-4px_rgba(139,92,246,1)]"
                : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/30 opacity-0 transition-all duration-700 group-hover/btn:left-full group-hover/btn:opacity-100" />
            <span className="relative">{plan.cta}</span>
            <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </button>

          <ul className="mt-7 space-y-3 border-t border-slate-200 pt-6">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function PricingSection({ plans = PLANS }: { plans?: Plan[] }) {
  const [yearly, setYearly] = useState(true);

  return (
    <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32">
      <style>{`
        @keyframes fp-pop { from { opacity: 0; transform: translateY(8px) scale(.96); } to { opacity: 1; transform: none; } }
        @keyframes fp-float { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-24px,0); } }
        .fp-pop { animation: fp-pop .45s cubic-bezier(.2,.8,.2,1); }
        .fp-blob { animation: fp-float 9s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .fp-pop, .fp-blob { animation: none; } }
      `}</style>

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
        <div className="fp-blob absolute left-1/2 top-0 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-violet-400/25 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Simple pricing that{" "}
            <span className="bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">scales with you</span>
          </h2>
          <p className="mt-5 text-base text-slate-600">Start free, upgrade when your network grows. No hidden fees.</p>

          {/* billing toggle */}
          <div className="mt-9 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 p-1">
            {(["Monthly", "Yearly"] as const).map((label) => {
              const active = (label === "Yearly") === yearly;
              return (
                <button
                  key={label}
                  onClick={() => setYearly(label === "Yearly")}
                  className={`relative rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                    active ? "bg-gradient-to-r from-violet-500 to-sky-500 text-white shadow-lg shadow-violet-500/30" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {label}
                  {label === "Yearly" && (
                    <span className="ml-2 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                      -{YEARLY_DISCOUNT * 100}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <PlanCard key={p.name} plan={p} yearly={yearly} />
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">All prices in INR, excluding taxes. Cancel anytime.</p>
      </div>
    </section>
  );
}
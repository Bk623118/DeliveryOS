"use client";

/**
 * DeliveryOS â€” Contact Us (light SaaS look)
 * Next.js (App Router) + TypeScript + Tailwind. No extra dependencies.
 * Usage: app/contact/page.tsx -> import ContactUs from "@/components/ContactUsSaaS"; export default ContactUs;
 * Pass `onSubmit` to POST to your API; without it a 1.6s fake delay is used.
 */

import { useState, type FormEvent } from "react";

type Payload = { name: string; email: string; company: string; topic: string; message: string };
type Status = "idle" | "sending" | "sent";

const TOPICS = ["Order help", "Become a driver", "Warehouse setup", "Partnership", "Report a bug"];

const CHANNELS = [
  { title: "Customer support", value: "support@deliveryos.dev", note: "Typically replies within 15 min", tint: "bg-emerald-50 text-emerald-600", d: "M4 6h16v12H4zM4 7l8 6 8-6" },
  { title: "Sales and partnerships", value: "partners@deliveryos.dev", note: "Typically replies within 2 hours", tint: "bg-indigo-50 text-indigo-600", d: "M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" },
  { title: "Operations hotline", value: "+91 124 000 0000", note: "Staffed around the clock", tint: "bg-sky-50 text-sky-600", d: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" },
];

export default function ContactUs({ onSubmit }: { onSubmit?: (p: Payload) => Promise<void> }) {
  const empty: Payload = { name: "", email: "", company: "", topic: TOPICS[0], message: "" };
  const [form, setForm] = useState<Payload>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Payload, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [ticket, setTicket] = useState("");
  const [run, setRun] = useState(0);

  const set = (k: keyof Payload, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (form.name.trim().length < 2) e.name = "Enter your name so we know who to reply to.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email, like you@company.com.";
    if (form.message.trim().length < 10) e.message = "Add at least 10 characters so we can help properly.";
    setErrors(e);
    return !Object.keys(e).length;
  };

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    if (status === "sending" || !validate()) return;
    setStatus("sending");
    setRun((r) => r + 1);
    try {
      await (onSubmit ? onSubmit(form) : new Promise((r) => setTimeout(r, 1600)));
      setTicket("DOS-" + Math.floor(1000 + Math.random() * 9000));
      setStatus("sent");
    } catch {
      setStatus("idle");
      setErrors({ message: "Message not sent. Check your connection and try again." });
    }
  }

  return (
    <section className="cu relative isolate min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="cu-dots absolute inset-0 -z-20" />
      <div className="cu-wash absolute inset-x-0 top-0 -z-10 h-[520px]" />

      <div className="mx-auto max-w-6xl px-5 pb-24 pt-16 sm:px-8 lg:pt-24">
        {/* header */}
        <header className="cu-rise mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 shadow-sm">
            <i className="cu-live" /> All systems operational
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.05]">
            Talk to the team behind your deliveries
          </h1>
          <p className="mt-5 text-lg text-slate-600">
            Questions about an order, onboarding drivers or connecting your warehouses? Tell us what you need and the right person will reply by email.
          </p>
        </header>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          {/* left */}
          <div className="cu-rise space-y-4" style={{ animationDelay: ".12s" }}>
            {CHANNELS.map((c) => (
              <a
                key={c.title}
                href="#"
                className="cu-row group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
              >
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${c.tint}`}>
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={c.d} /></svg>
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">{c.title}</span>
                  <span className="block break-all text-slate-700">{c.value}</span>
                  <span className="mt-1 block text-sm text-slate-500">{c.note}</span>
                </span>
              </a>
            ))}

            <NetworkCard status={status} run={run} />
          </div>

          {/* right */}
          <div className="cu-rise" style={{ animationDelay: ".22s" }}>
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-9">
              <div className="cu-bar absolute inset-x-0 top-0 h-1" />
              {status === "sent" ? (
                <div className="cu-pop flex min-h-[470px] flex-col items-center justify-center text-center">
                  <svg viewBox="0 0 52 52" className="h-20 w-20">
                    <circle className="cu-ring" cx="26" cy="26" r="23" fill="#ecfdf5" stroke="#10b981" strokeWidth="2.5" />
                    <path className="cu-tick" d="M15 27l8 8 15-17" fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h2 className="mt-6 text-2xl font-bold">Message sent</h2>
                  <p className="mt-2 max-w-sm text-slate-600">
                    Your ticket is <b className="text-slate-900">{ticket}</b>. The {form.topic.toLowerCase()} team will reply to {form.email}.
                  </p>
                  <button
                    onClick={() => { setStatus("idle"); setForm(empty); }}
                    className="mt-8 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="space-y-5">
                  <div>
                    <h2 className="text-xl font-semibold">Send us a message</h2>
                    <p className="mt-1 text-sm text-slate-500">Fields marked optional can be skipped.</p>
                  </div>

                  <fieldset>
                    <legend className="mb-2 text-sm font-medium text-slate-700">What do you need help with?</legend>
                    <div className="flex flex-wrap gap-2">
                      {TOPICS.map((t) => (
                        <button
                          type="button"
                          key={t}
                          aria-pressed={form.topic === t}
                          onClick={() => set("topic", t)}
                          className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 ${
                            form.topic === t
                              ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" value={form.name} error={errors.name} onChange={(v) => set("name", v)} autoComplete="name" />
                    <Field label="Work email" type="email" value={form.email} error={errors.email} onChange={(v) => set("email", v)} autoComplete="email" />
                  </div>
                  <Field label="Company (optional)" value={form.company} onChange={(v) => set("company", v)} autoComplete="organization" />
                  <Field label="Message" textarea max={500} value={form.message} error={errors.message} onChange={(v) => set("message", v)} />

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="cu-btn relative w-full overflow-hidden rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 active:scale-[.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-wait disabled:bg-indigo-500"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {status === "sending" ? (<><i className="cu-spin" /> Sendingâ€¦</>) : "Send message"}
                    </span>
                  </button>
                  <p className="text-center text-xs text-slate-500">We only use your details to reply to this message.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, error, type = "text", textarea, max, autoComplete }: {
  label: string; value: string; onChange: (v: string) => void; error?: string; type?: string; textarea?: boolean; max?: number; autoComplete?: string;
}) {
  const id = "cu-" + label.replace(/[^a-z]/gi, "").toLowerCase();
  const cls =
    "cu-input w-full rounded-xl border bg-white px-4 pb-2.5 pt-6 text-base text-slate-900 outline-none transition placeholder-transparent focus:ring-4 " +
    (error ? "border-rose-400 focus:ring-rose-100" : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100");
  const shared = { id, value, placeholder: " ", autoComplete, "aria-invalid": !!error, "aria-describedby": error ? id + "-e" : undefined };
  return (
    <div>
      <div className="relative">
        {textarea ? (
          <textarea {...shared} rows={5} maxLength={max} onChange={(e) => onChange(e.target.value)} className={cls + " resize-none"} />
        ) : (
          <input {...shared} type={type} onChange={(e) => onChange(e.target.value)} className={cls} />
        )}
        <label htmlFor={id} className="cu-label pointer-events-none absolute left-4 top-4 origin-left text-slate-500">{label}</label>
        {max && <span className="absolute bottom-2.5 right-3 text-xs text-slate-400">{value.length}/{max}</span>}
      </div>
      {error && <p id={id + "-e"} role="alert" className="cu-shake mt-1.5 text-sm text-rose-600">{error}</p>}
    </div>
  );
}

/* compact live network card: drivers move; your message travels to the hub on submit */
function NetworkCard({ status, run }: { status: Status; run: number }) {
  const routes = [
    { id: "p1", d: "M40 40 Q120 80 190 90", dur: "5s" },
    { id: "p2", d: "M190 20 Q200 60 190 90", dur: "4s" },
    { id: "p3", d: "M340 45 Q270 55 190 90", dur: "6s" },
    { id: "p4", d: "M35 140 Q110 150 190 90", dur: "4s" },
  ];
  const nodes: [number, number, string][] = [[40, 40, "WH-01"], [190, 20, "WH-02"], [340, 45, "WH-03"], [35, 140, "You"]];
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-800">Live network</span>
        <span className="text-slate-500">
          {status === "sending" ? "Sending your messageâ€¦" : status === "sent" ? "Delivered to our team" : "3 drivers on the road"}
        </span>
      </div>
      <svg viewBox="0 0 380 170" className="h-auto w-full" role="img" aria-label="Animated map of warehouses and drivers">
        {routes.map((r) => (<path key={r.id} id={r.id} d={r.d} fill="none" stroke="#a5b4fc" strokeWidth="1.5" strokeDasharray="4 5" className="cu-dash" />))}
        <circle cx="190" cy="90" r="9" fill="#4f46e5" />
        <circle cx="190" cy="90" r="9" fill="none" stroke="#6366f1" className="cu-ping" />
        <circle cx="190" cy="90" r="9" fill="none" stroke="#6366f1" className="cu-ping d2" />
        {nodes.map(([x, y, t]) => (
          <g key={t}>
            <rect x={x - 8} y={y - 8} width="16" height="16" rx="4.5" fill="#fff" stroke={t === "You" ? "#10b981" : "#94a3b8"} strokeWidth="1.5" />
            <text x={x} y={y + 22} fill="#64748b" fontSize="9.5" textAnchor="middle">{t}</text>
          </g>
        ))}
        {routes.slice(0, 3).map((r, i) => (
          <circle key={r.id} r="3.8" fill={i === 1 ? "#f59e0b" : "#10b981"}>
            <animateMotion dur={r.dur} repeatCount="indefinite" begin={`${-i * 1.4}s`}><mpath href={"#" + r.id} /></animateMotion>
          </circle>
        ))}
        {status !== "idle" && (
          <circle key={run} r="6" fill="#4f46e5" stroke="#fff" strokeWidth="2">
            <animateMotion dur="1.4s" fill="freeze" repeatCount={status === "sending" ? "indefinite" : "1"}><mpath href="#p4" /></animateMotion>
          </circle>
        )}
        {status === "sent" && <circle cx="190" cy="90" r="9" fill="none" stroke="#10b981" strokeWidth="3" className="cu-ping" style={{ animationIterationCount: 3 }} />}
      </svg>
    </div>
  );
}


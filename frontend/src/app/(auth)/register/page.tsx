"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Lock, Mail, Phone, User } from "lucide-react";
import { AuthShell, Field, FormError, Submit, ROLE_HOME, authPost } from "@/components/AuthShell";

type Role = "CUSTOMER" | "DRIVER" | "WAREHOUSE";

const role: Role = "CUSTOMER";
const LEVELS = [["Too short", "bg-rose-500"], ["Weak", "bg-rose-500"], ["Okay", "bg-amber-400"], ["Good", "bg-emerald-400"], ["Strong", "bg-emerald-400"]];

export default function RegisterPage() {
  const router = useRouter();
  const [f, setF] = useState({ firstName: "", lastName: "", workspace: "", email: "", phone: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF((s) => ({ ...s, [k]: k === "workspace" ? e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") : e.target.value }));

  const score = useMemo(() => {
    const p = f.password;
    if (p.length < 8) return 0;
    return 1 + [/[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(p)).length;
  }, [f.password]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (f.password.length < 8) return setErr("Password must be at least 8 characters.");
    setErr(""); setBusy(true);
    try {
      await authPost("/auth/register", { ...f, role });
      router.push(ROLE_HOME[role] ?? "/shop");
      router.refresh();
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Something went wrong. Try again.");
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      sub="Join a workspace and start in minutes."
      wide
      foot={<>Already have an account? <Link href="/login" className="font-medium text-violet-300 underline-offset-4 transition hover:text-fuchsia-300 hover:underline">Sign in</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormError message={err} />

        <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          <Field label="First name" icon={User} autoComplete="given-name" value={f.firstName} onChange={set("firstName")} required />
          <Field label="Last name" icon={User} autoComplete="family-name" value={f.lastName} onChange={set("lastName")} required />
          <div className="sm:col-span-2">
            <Field label="Workspace" icon={Building2} placeholder="acme-logistics" value={f.workspace} onChange={set("workspace")} required />
          </div>
          <Field label="Email" icon={Mail} type="email" autoComplete="email" placeholder="you@company.com" value={f.email} onChange={set("email")} required />
          <Field label="Phone number" icon={Phone} type="tel" autoComplete="tel" placeholder="1234567890" value={f.phone} onChange={set("phone")} required />
          <div className="sm:col-span-2">
            <Field label="Password" icon={Lock} type="password" autoComplete="new-password" placeholder="At least 8 characters" value={f.password} onChange={set("password")} required />
            <div className="mt-2 flex items-center gap-1.5" aria-live="polite">
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${f.password && score >= n ? LEVELS[score][1] : "bg-white/10"}`} />
              ))}
              <span className="w-14 text-right text-xs text-muted-foreground">{f.password ? LEVELS[score][0] : ""}</span>
            </div>
          </div>
        </div>

        <Submit busy={busy}>{busy ? "Creating account…" : "Create account"}</Submit>
      </form>
    </AuthShell>
  );
}
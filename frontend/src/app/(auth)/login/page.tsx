"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { AuthShell, Field, FormError, Submit, ROLE_HOME, authPost } from "@/components/AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const { user } = await authPost("/auth/login", { email, password, remember });
      router.push(ROLE_HOME[user.role] ?? "/shop");
      router.refresh();
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Something went wrong. Try again.");
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      sub="Sign in to your DeliveryOS workspace."
      foot={<>New to DeliveryOS? <Link href="/register" className="font-medium text-violet-300 underline-offset-4 transition hover:text-fuchsia-300 hover:underline">Create an account</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormError message={err} />
        <Field label="Email" icon={Mail} type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Field label="Password" icon={Lock} type="password" autoComplete="current-password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-muted-foreground transition hover:text-foreground">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 cursor-pointer rounded accent-violet-500" />
            Keep me signed in
          </label>
          <Link href="/forgot-password" className="text-violet-300 underline-offset-4 transition hover:text-fuchsia-300 hover:underline">Forgot password?</Link>
        </div>
        <Submit busy={busy}>{busy ? "Signing in…" : "Sign in"}</Submit>
      </form>
    </AuthShell>
  );
}
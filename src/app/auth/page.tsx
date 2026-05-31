"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function InputField({
  id, label, type, value, onChange, placeholder, icon, rightSlot,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.15em]"
        style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-muted)" }}>
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={type === "password" ? "current-password" : "email"}
          required
          className="w-full pl-10 pr-10 py-3 rounded-[var(--radius-md)] text-sm transition-all duration-200 outline-none"
          style={{
            background: "var(--glass-bg-subtle)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.boxShadow = "var(--glow-sm)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.boxShadow = "none"; }}
        />
        {rightSlot && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightSlot}
          </span>
        )}
      </div>
    </div>
  );
}

export default function SignInPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const router = useRouter();

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message === "Invalid login credentials"
        ? "Incorrect email or password."
        : error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  async function handleGoogle() {
    setGLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); setGLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.35)", boxShadow: "0 0 28px rgba(124,58,237,0.22)" }}>
            <Zap size={22} style={{ color: "var(--color-accent-light)" }} />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Habit<span style={{ color: "var(--color-accent-light)" }}>Flow</span>
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Build habits that stick</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-[var(--radius-lg)] p-6 space-y-5"
          style={{ background: "var(--glass-bg-default)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid var(--glass-border)" }}>

          <div>
            <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Welcome back</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Sign in to your account</p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs px-3 py-2.5 rounded-lg" style={{ background: "rgba(244,63,94,0.10)", border: "1px solid rgba(244,63,94,0.25)", color: "#F43F5E" }}>
              {error}
            </p>
          )}

          {/* Email / Password form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <InputField id="email" label="Email" type="email" value={email} onChange={setEmail}
              placeholder="you@example.com" icon={<Mail size={15} />} />

            <InputField id="password" label="Password" type={showPw ? "text" : "password"}
              value={password} onChange={setPassword} placeholder="••••••••" icon={<Lock size={15} />}
              rightSlot={
                <button type="button" onClick={() => setShowPw((v) => !v)} className="focus:outline-none"
                  style={{ color: "var(--text-muted)" }} aria-label={showPw ? "Hide password" : "Show password"}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />

            <button type="submit" disabled={loading || !email || !password}
              className="w-full py-3 rounded-[var(--radius-md)] text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              style={{ background: "var(--color-accent)", boxShadow: loading || !email || !password ? "none" : "0 0 28px rgba(124,58,237,0.40)" }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#6D28D9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-accent)"; }}>
              {loading ? <span className="inline-flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in…</span> : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "var(--divider)" }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "var(--divider)" }} />
          </div>

          {/* Google */}
          <button onClick={handleGoogle} disabled={gLoading || loading}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 disabled:opacity-50"
            style={{ background: "var(--glass-bg-elevated)", border: "1px solid var(--glass-border-hover)", color: "var(--text-primary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.40)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--glass-border-hover)"; }}>
            {gLoading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>
        </div>

        {/* Footer link */}
        <p className="text-center text-xs mt-5" style={{ color: "var(--text-muted)" }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-semibold transition-colors"
            style={{ color: "var(--color-accent-light)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"; }}>
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

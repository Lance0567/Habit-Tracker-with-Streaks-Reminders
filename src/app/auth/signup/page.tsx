"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Mail, Lock, Eye, EyeOff, User, MailCheck } from "lucide-react";
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
  id, label, type, value, onChange, placeholder, icon, rightSlot, autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
  autoComplete?: string;
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
          autoComplete={autoComplete}
          required={id !== "name"}
          className="w-full pl-10 pr-10 py-3 rounded-[var(--radius-md)] text-sm transition-all duration-200 outline-none"
          style={{ background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.boxShadow = "var(--glow-sm)"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "var(--glass-border)"; e.currentTarget.style.boxShadow = "none"; }}
        />
        {rightSlot && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</span>
        )}
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [showCfm, setShowCfm]       = useState(false);
  const [loading, setLoading]       = useState(false);
  const [gLoading, setGLoading]     = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [emailSent, setEmailSent]   = useState(false);
  const router = useRouter();

  function validate(): string | null {
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirm) return "Passwords don't match.";
    return null;
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name.trim() || undefined },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message === "User already registered"
        ? "An account with this email already exists. Try signing in."
        : error.message);
      setLoading(false);
    } else if (data.session) {
      // Email confirmation disabled — signed in immediately
      router.push("/dashboard");
      router.refresh();
    } else {
      // Confirmation email sent
      setEmailSent(true);
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

  async function handleResend() {
    const supabase = createClient();
    await supabase.auth.resend({ type: "signup", email });
  }

  // ── Email confirmation sent state ──────────────────────────────────────────

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-sm text-center"
        >
          <div className="rounded-[var(--radius-lg)] p-8 space-y-5"
            style={{ background: "var(--glass-bg-default)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid var(--glass-border)" }}>

            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "rgba(16,185,129,0.14)", border: "1px solid rgba(16,185,129,0.30)" }}>
              <MailCheck size={28} style={{ color: "#10B981" }} />
            </div>

            <div>
              <h2 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>Check your email</h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                We sent a confirmation link to
              </p>
              <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--color-accent-light)" }}>
                {email}
              </p>
              <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
                Click the link in that email to activate your account.
                Check your spam folder if you don&apos;t see it.
              </p>
            </div>

            <button onClick={handleResend}
              className="text-xs font-medium transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--color-accent-light)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}>
              Didn&apos;t get it? Resend email
            </button>

            <div className="pt-1">
              <Link href="/auth" className="text-xs font-semibold"
                style={{ color: "var(--color-accent-light)" }}>
                ← Back to sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Sign-up form ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
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
            <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Create your account</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Free forever — no credit card needed</p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-xs px-3 py-2.5 rounded-lg"
                style={{ background: "rgba(244,63,94,0.10)", border: "1px solid rgba(244,63,94,0.25)", color: "#F43F5E" }}>
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <InputField id="name" label="Full Name (optional)" type="text" value={name} onChange={setName}
              placeholder="Jane Smith" icon={<User size={15} />} autoComplete="name" />

            <InputField id="email" label="Email" type="email" value={email} onChange={setEmail}
              placeholder="you@example.com" icon={<Mail size={15} />} autoComplete="email" />

            <InputField id="password" label="Password" type={showPw ? "text" : "password"}
              value={password} onChange={setPassword} placeholder="Min. 8 characters" icon={<Lock size={15} />}
              autoComplete="new-password"
              rightSlot={
                <button type="button" onClick={() => setShowPw((v) => !v)} className="focus:outline-none"
                  style={{ color: "var(--text-muted)" }} aria-label={showPw ? "Hide password" : "Show password"}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />

            <InputField id="confirm" label="Confirm Password" type={showCfm ? "text" : "password"}
              value={confirm} onChange={setConfirm} placeholder="Repeat password" icon={<Lock size={15} />}
              autoComplete="new-password"
              rightSlot={
                <button type="button" onClick={() => setShowCfm((v) => !v)} className="focus:outline-none"
                  style={{ color: "var(--text-muted)" }} aria-label={showCfm ? "Hide password" : "Show password"}>
                  {showCfm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />

            <button type="submit" disabled={loading || !email || !password || !confirm}
              className="w-full py-3 rounded-[var(--radius-md)] text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white"
              style={{ background: "var(--color-accent)", boxShadow: loading || !email || !password || !confirm ? "none" : "0 0 28px rgba(124,58,237,0.40)" }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#6D28D9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-accent)"; }}>
              {loading
                ? <span className="inline-flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating account…</span>
                : "Create Account"}
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
          Already have an account?{" "}
          <Link href="/auth" className="font-semibold"
            style={{ color: "var(--color-accent-light)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"; }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

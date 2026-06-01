"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Eye, EyeOff, MailCheck, ArrowLeft } from "lucide-react";
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
  id, label, type, value, onChange, rightSlot, autoComplete, required = true,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  rightSlot?: React.ReactNode;
  autoComplete?: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div className="relative" style={{ height: 56 }}>
      <motion.label
        htmlFor={id}
        animate={{
          y: floated ? 0 : 11,
          scale: floated ? 0.78 : 1,
          color: focused
            ? "var(--color-accent)"
            : floated
            ? "var(--text-secondary)"
            : "var(--text-muted)",
        }}
        initial={false}
        transition={{ duration: 0.14, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "absolute",
          left: 16,
          top: 9,
          fontSize: 13,
          fontWeight: 500,
          transformOrigin: "left top",
          pointerEvents: "none",
          zIndex: 1,
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        {label}
      </motion.label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=""
        autoComplete={autoComplete}
        required={required}
        className="absolute inset-0 w-full rounded-xl text-sm outline-none"
        style={{
          paddingLeft: 16,
          paddingRight: rightSlot ? "3rem" : 16,
          paddingTop: floated ? 22 : 14,
          paddingBottom: floated ? 8 : 14,
          transition: "padding-top 0.14s cubic-bezier(0.4,0,0.2,1), padding-bottom 0.14s cubic-bezier(0.4,0,0.2,1), border-color 0.14s, box-shadow 0.14s",
          background: "var(--glass-bg-subtle)",
          border: `1.5px solid ${focused ? "var(--color-accent)" : "var(--glass-border)"}`,
          boxShadow: focused ? "0 0 0 3px var(--color-accent-glow)" : "none",
          color: "var(--text-primary)",
        }}
      />

      {rightSlot && (
        <div className="absolute right-1.5 inset-y-0 flex items-center">
          {rightSlot}
        </div>
      )}
    </div>
  );
}

function EyeButton({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
      style={{ color: "var(--text-muted)" }}
      aria-label={show ? "Hide password" : "Show password"}
      onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
    >
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );
}

export default function SignUpPage() {
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [showCfm, setShowCfm]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [gLoading, setGLoading]   = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
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
      router.push("/dashboard");
      router.refresh();
    } else {
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

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Background: grid texture + ambient glow */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(124,58,237,0.16) 0%, rgba(124,58,237,0.05) 45%, transparent 70%)",
            filter: "blur(56px)",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {emailSent ? (
          <motion.div
            key="email-sent"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm text-center"
          >
            <div
              className="rounded-[var(--radius-lg)] p-8 space-y-5"
              style={{
                background: "var(--glass-bg-default)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid var(--glass-border)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{
                  background: "rgba(16,185,129,0.14)",
                  border: "1px solid rgba(16,185,129,0.30)",
                }}
              >
                <MailCheck size={28} style={{ color: "#10B981" }} />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                  Check your email
                </h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  We sent a confirmation link to
                </p>
                <p className="text-sm font-semibold mt-0.5" style={{ color: "var(--color-accent-light)" }}>
                  {email}
                </p>
                <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
                  Click the link in that email to activate your account. Check your spam folder if you don&apos;t see it.
                </p>
              </div>
              <button
                onClick={handleResend}
                className="text-xs font-medium transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--color-accent-light)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
              >
                Didn&apos;t get it? Resend email
              </button>
              <div className="pt-1">
                <Link href="/auth" className="text-xs font-semibold" style={{ color: "var(--color-accent-light)" }}>
                  ← Back to sign in
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="signup-form"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm"
          >
            {/* Back to home */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium mb-6 transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}
            >
              <ArrowLeft size={13} /> Home
            </Link>

            {/* Logo */}
            <div className="flex flex-col items-center gap-3 mb-8">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(124,58,237,0.18)",
                  border: "1px solid rgba(124,58,237,0.35)",
                  boxShadow: "0 0 28px rgba(124,58,237,0.22)",
                }}
              >
                <Zap size={22} style={{ color: "var(--color-accent-light)" }} />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                  Habit<span style={{ color: "var(--color-accent-light)" }}>Flow</span>
                </h1>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Build habits that stick
                </p>
              </div>
            </div>

            {/* Card */}
            <div
              className="rounded-[var(--radius-lg)] p-6 space-y-5"
              style={{
                background: "var(--glass-bg-default)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid var(--glass-border)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
              }}
            >
              <div>
                <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                  Create your account
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  Free forever — no credit card needed
                </p>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="text-xs px-3 py-2.5 rounded-lg"
                    style={{
                      background: "rgba(244,63,94,0.10)",
                      border: "1px solid rgba(244,63,94,0.25)",
                      color: "#F43F5E",
                    }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <form onSubmit={handleSignUp} className="space-y-4">
                <InputField
                  id="name"
                  label="Name (optional)"
                  type="text"
                  value={name}
                  onChange={setName}
                  autoComplete="name"
                  required={false}
                />

                <InputField
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                />

                <div className="space-y-1">
                  <InputField
                    id="password"
                    label="Password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={setPassword}
                    autoComplete="new-password"
                    rightSlot={<EyeButton show={showPw} onToggle={() => setShowPw((v) => !v)} />}
                  />
                  <p className="text-[11px] pl-1" style={{ color: "var(--text-muted)" }}>
                    Minimum 8 characters
                  </p>
                </div>

                <InputField
                  id="confirm"
                  label="Confirm password"
                  type={showCfm ? "text" : "password"}
                  value={confirm}
                  onChange={setConfirm}
                  autoComplete="new-password"
                  rightSlot={<EyeButton show={showCfm} onToggle={() => setShowCfm((v) => !v)} />}
                />

                <button
                  type="submit"
                  disabled={loading || !email || !password || !confirm}
                  className="w-full py-3 rounded-[var(--radius-md)] text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  style={{
                    background: "var(--color-accent)",
                    boxShadow: loading || !email || !password || !confirm ? "none" : "0 0 28px rgba(124,58,237,0.40)",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && email && password && confirm) e.currentTarget.style.background = "#6D28D9";
                  }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-accent)"; }}
                >
                  {loading
                    ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating account…
                      </span>
                    )
                    : "Create account"}
                </button>
              </form>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "var(--divider)" }} />
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "var(--divider)" }} />
              </div>

              <button
                onClick={handleGoogle}
                disabled={gLoading || loading}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 disabled:opacity-50"
                style={{
                  background: "var(--glass-bg-elevated)",
                  border: "1px solid var(--glass-border-hover)",
                  color: "var(--text-primary)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.40)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--glass-border-hover)"; }}
              >
                {gLoading
                  ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  : <GoogleIcon />}
                Continue with Google
              </button>
            </div>

            <p className="text-center text-xs mt-5" style={{ color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link
                href="/auth"
                className="font-semibold"
                style={{ color: "var(--color-accent-light)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.textDecoration = "none"; }}
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

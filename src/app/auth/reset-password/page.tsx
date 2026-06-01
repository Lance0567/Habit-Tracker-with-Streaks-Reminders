"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

function InputField({
  id, label, type, value, onChange, rightSlot,
}: {
  id: string; label: string; type: string; value: string; onChange: (v: string) => void; rightSlot?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className="relative" style={{ paddingTop: 10 }}>
      <label htmlFor={id} style={{
        position: "absolute", left: 14,
        top: floated ? 0 : "calc(50% + 5px)",
        transform: floated ? "translateY(-50%) scale(0.8)" : "translateY(-50%)",
        transformOrigin: "left center", transition: "all 0.18s ease",
        color: focused ? "var(--color-accent)" : "var(--text-muted)",
        fontSize: 13, fontWeight: 500, pointerEvents: "none", zIndex: 1,
        background: floated ? "var(--glass-bg-default)" : "transparent",
        padding: floated ? "0 4px" : "0", lineHeight: 1,
      }}>
        {label}
      </label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder="" required autoComplete="new-password"
        className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
        style={{
          background: "var(--glass-bg-subtle)",
          border: `1.5px solid ${focused ? "var(--color-accent)" : "var(--glass-border)"}`,
          boxShadow: focused ? "0 0 0 3px var(--color-accent-glow)" : "none",
          color: "var(--text-primary)",
          paddingRight: rightSlot ? "2.75rem" : "1rem",
        }}
      />
      {rightSlot && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ paddingTop: 10 }}>
          {rightSlot}
        </span>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [showCfm, setShowCfm]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
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
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] p-6 space-y-5"
          style={{ background: "var(--glass-bg-default)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid var(--glass-border)" }}>

          {done ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
                style={{ background: "rgba(16,185,129,0.14)", border: "1px solid rgba(16,185,129,0.30)" }}>
                <CheckCircle size={24} style={{ color: "#10B981" }} />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Password updated!</p>
                <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>Redirecting you to your dashboard…</p>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Set new password</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Choose a strong password for your account.</p>
              </div>

              {error && (
                <p className="text-xs px-3 py-2.5 rounded-lg"
                  style={{ background: "rgba(244,63,94,0.10)", border: "1px solid rgba(244,63,94,0.25)", color: "#F43F5E" }}>
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField id="password" label="New password (min. 8 characters)" type={showPw ? "text" : "password"}
                  value={password} onChange={setPassword}
                  rightSlot={
                    <button type="button" onClick={() => setShowPw((v) => !v)} className="focus:outline-none"
                      style={{ color: "var(--text-muted)" }}>
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  }
                />
                <InputField id="confirm" label="Confirm new password" type={showCfm ? "text" : "password"}
                  value={confirm} onChange={setConfirm}
                  rightSlot={
                    <button type="button" onClick={() => setShowCfm((v) => !v)} className="focus:outline-none"
                      style={{ color: "var(--text-muted)" }}>
                      {showCfm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  }
                />
                <button type="submit" disabled={loading || !password || !confirm}
                  className="w-full py-3 rounded-[var(--radius-md)] text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  style={{ background: "var(--color-accent)", boxShadow: !loading && password && confirm ? "0 0 28px rgba(124,58,237,0.40)" : "none" }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#6D28D9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-accent)"; }}>
                  {loading
                    ? <span className="inline-flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Updating…</span>
                    : "Update password"}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

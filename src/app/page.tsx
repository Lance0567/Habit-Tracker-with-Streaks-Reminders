"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  CheckCircle2,
  Flame,
  TrendingUp,
  ArrowRight,
  Shield,
  Cloud,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

// ── Mock data for the hero UI preview ────────────────────────────────────────

const MOCK_HABITS = [
  {
    name: "Morning Run",
    emoji: "🏃",
    color: "#10B981",
    streak: 14,
    done: true,
    pct: 92,
  },
  {
    name: "Read 30 min",
    emoji: "📚",
    color: "#06B6D4",
    streak: 7,
    done: false,
    pct: 78,
  },
  {
    name: "Meditate",
    emoji: "🧘",
    color: "#7C3AED",
    streak: 21,
    done: true,
    pct: 88,
  },
];

const FEATURES = [
  {
    icon: <CheckCircle2 size={22} />,
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
    title: "1-tap check-in",
    desc: "Mark a habit done in a single tap. No friction between intention and action.",
  },
  {
    icon: <Flame size={22} />,
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.12)",
    title: "Streak momentum",
    desc: "Visual streaks build accountability. Miss a day — the streak ends. That's the point.",
  },
  {
    icon: <TrendingUp size={22} />,
    color: "#06B6D4",
    bg: "rgba(6,182,212,0.12)",
    title: "Deep analytics",
    desc: "Heatmaps, completion rates, and weekly trends so you know exactly where you stand.",
  },
];

const TRUST = [
  { icon: <Shield size={16} />, text: "Your data, encrypted at rest" },
  { icon: <Cloud size={16} />, text: "Synced across every device" },
  { icon: <Sparkles size={16} />, text: "Free forever, no credit card" },
];

// ── Google SVG icon (inline, no external dep) ────────────────────────────────

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

// ── Habit card used in the hero preview ──────────────────────────────────────

function MockHabitCard({
  habit,
  delay,
}: {
  habit: (typeof MOCK_HABITS)[number];
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
      style={{
        background: "var(--glass-bg-default)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid var(--glass-border)",
      }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{
          background: `${habit.color}18`,
          border: `1px solid ${habit.color}35`,
        }}
      >
        {habit.emoji}
      </div>

      {/* Name + streak */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
          {habit.name}
        </p>
        <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
          <Flame size={10} style={{ color: habit.done ? "#F59E0B" : undefined }} />
          {habit.streak} day streak
        </p>
      </div>

      {/* Done pill */}
      <span
        className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
        style={
          habit.done
            ? {
                background: `${habit.color}18`,
                color: habit.color,
                border: `1px solid ${habit.color}35`,
              }
            : {
                background: "var(--glass-bg-subtle)",
                color: "var(--text-muted)",
                border: "1px solid var(--glass-border)",
              }
        }
      >
        {habit.done ? "✓ Done" : "Pending"}
      </span>
    </motion.div>
  );
}

// ── Main landing page ─────────────────────────────────────────────────────────

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [heatCells, setHeatCells] = useState<Array<{ filled: boolean; opacity: number }>>([]);
  useEffect(() => {
    setHeatCells(Array.from({ length: 21 }, () => ({
      filled: Math.random() > 0.25,
      opacity: 0.3 + Math.random() * 0.5,
    })));
  }, []);

  async function handleSignIn() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setLoading(false);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ color: "var(--text-primary)" }}>

      {/* ── Top nav ─────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(124,58,237,0.18)",
              border: "1px solid rgba(124,58,237,0.35)",
              boxShadow: "0 0 16px rgba(124,58,237,0.20)",
            }}
          >
            <Zap size={15} style={{ color: "var(--color-accent-light)" }} />
          </div>
          <span className="font-bold text-sm tracking-tight">
            Habit<span style={{ color: "var(--color-accent-light)" }}>Flow</span>
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            href="/auth"
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200"
            style={{
              background: "var(--glass-bg-default)",
              border: "1px solid var(--glass-border-hover)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--color-accent-light)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--glass-border-hover)";
            }}
          >
            Sign in <ArrowRight size={13} />
          </Link>
        </motion.div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-28 grid lg:grid-cols-2 gap-12 items-center">

        {/* Left: copy + CTA */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full mb-7"
            style={{
              background: "rgba(124,58,237,0.14)",
              border: "1px solid rgba(124,58,237,0.28)",
              color: "var(--color-accent-light)",
            }}
          >
            <Sparkles size={11} />
            Free · No credit card · Sync everywhere
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            Small habits.{" "}
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--color-accent-light) 0%, #9333EA 50%, #06B6D4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Significant results.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base leading-relaxed mb-8 max-w-md"
            style={{ color: "var(--text-secondary)" }}
          >
            HabitFlow tracks your daily habits with beautiful streaks, visual heatmaps,
            and deep analytics — all synced to the cloud so you never lose your progress.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-start gap-3"
          >
            {/* Primary: email sign-up */}
            <Link
              href="/auth/signup"
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-sm text-white transition-all duration-200"
              style={{
                background: "var(--color-accent)",
                boxShadow: "0 0 48px rgba(124,58,237,0.45), 0 4px 16px rgba(124,58,237,0.35)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#6D28D9"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--color-accent)"; }}
            >
              Get started free <ArrowRight size={15} />
            </Link>

            {/* Secondary: Google quick path */}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
              style={{ background: "var(--glass-bg-default)", border: "1px solid var(--glass-border-hover)", color: "var(--text-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--glass-border-hover)"; }}
            >
              {loading ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <GoogleIcon />}
              {loading ? "Redirecting…" : "Or continue with Google"}
            </button>

            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <Link href="/auth" className="font-semibold" style={{ color: "var(--color-accent-light)" }}>
                Sign in
              </Link>
            </p>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 mt-6"
          >
            {TRUST.map((t) => (
              <span
                key={t.text}
                className="flex items-center gap-1.5 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                {t.icon}
                {t.text}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right: mock app UI */}
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            {/* Mock app window */}
            <div
              className="rounded-3xl p-5 space-y-3"
              style={{
                background: "var(--glass-bg-subtle)",
                border: "1px solid var(--glass-border)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow:
                  "0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px var(--glass-border)",
              }}
            >
              {/* Fake window chrome */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 opacity-70" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-70" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 opacity-70" />
                <span
                  className="ml-auto text-xs font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Today&rsquo;s Habits
                </span>
              </div>

              {/* Stat pills */}
              <div className="flex gap-2 mb-2">
                {[
                  { label: "2 / 3 done", color: "#10B981" },
                  { label: "🔥 21d streak", color: "#F59E0B" },
                ].map((s) => (
                  <span
                    key={s.label}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: `${s.color}18`,
                      border: `1px solid ${s.color}30`,
                      color: s.color,
                    }}
                  >
                    {s.label}
                  </span>
                ))}
              </div>

              {/* Habit cards */}
              {MOCK_HABITS.map((h, i) => (
                <MockHabitCard key={h.name} habit={h} delay={0.5 + i * 0.12} />
              ))}

              {/* Mini heatmap strip */}
              <div className="pt-2">
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  Last 21 days
                </p>
                <div className="flex gap-1">
                  {heatCells.map((cell, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{
                        height: 8,
                        background: cell.filled
                          ? `rgba(124,58,237,${cell.opacity})`
                          : "var(--glass-bg-subtle)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Everything you need.
            <br />
            <span style={{ color: "var(--text-secondary)" }}>Nothing you don&rsquo;t.</span>
          </h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
            Designed to stay out of your way — open the app, check in, close it.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 rounded-3xl"
              style={{
                background: "var(--glass-bg-default)",
                border: "1px solid var(--glass-border)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: f.bg, color: f.color }}
              >
                {f.icon}
              </div>
              <h3
                className="font-semibold text-base mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl px-8 py-14 text-center"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.22) 0%, transparent 70%), var(--glass-bg-default)",
            border: "1px solid rgba(124,58,237,0.25)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Glow orb */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(124,58,237,0.30) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <h2
            className="relative text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Start building today.
          </h2>
          <p
            className="relative text-sm mb-8 max-w-sm mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            It takes 10 seconds to sign up. Your first habit check-in takes 1 tap.
          </p>

          <Link
            href="/auth/signup"
            className="relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-sm text-white transition-all duration-200"
            style={{ background: "var(--color-accent)", boxShadow: "0 0 48px rgba(124,58,237,0.50), 0 4px 16px rgba(124,58,237,0.35)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "#6D28D9"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--color-accent)"; }}
          >
            Create free account <ArrowRight size={15} />
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer
        className="border-t px-6 py-8"
        style={{ borderColor: "var(--divider)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(124,58,237,0.14)",
                border: "1px solid rgba(124,58,237,0.28)",
              }}
            >
              <Zap size={11} style={{ color: "var(--color-accent-light)" }} />
            </div>
            <span className="text-xs font-bold">
              Habit<span style={{ color: "var(--color-accent-light)" }}>Flow</span>
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Built with care. Free forever.
          </p>
        </div>
      </footer>
    </div>
  );
}

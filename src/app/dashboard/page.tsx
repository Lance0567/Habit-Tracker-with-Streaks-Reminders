"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { GlassCard } from "@/components/ui/GlassCard";
import { HabitGrid } from "@/components/habits/HabitGrid";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useHabits } from "@/hooks/useHabits";
import { useHabitStore } from "@/store/habitStore";
import { useLocalTime } from "@/hooks/useLocalTime";
import { Flame, CheckCircle, Target, TrendingUp } from "lucide-react";

// violet(0%) → cyan(50%) → emerald(100%)
function ringColor(pct: number): string {
  const stops = [
    { p: 0,   r: 0x7C, g: 0x3A, b: 0xED },
    { p: 0.5, r: 0x06, g: 0xB6, b: 0xD4 },
    { p: 1,   r: 0x10, g: 0xB9, b: 0x81 },
  ];
  const c = Math.max(0, Math.min(1, pct));
  const lo = c <= 0.5 ? stops[0] : stops[1];
  const hi = c <= 0.5 ? stops[1] : stops[2];
  const t = c <= 0.5 ? c / 0.5 : (c - 0.5) / 0.5;
  const hex = (v: number) => Math.round(v).toString(16).padStart(2, "0");
  return `#${hex(lo.r + (hi.r - lo.r) * t)}${hex(lo.g + (hi.g - lo.g) * t)}${hex(lo.b + (hi.b - lo.b) * t)}`;
}

function motivationalCopy(pct: number): string {
  if (pct === 0) return "Ready to build momentum?";
  if (pct < 0.5) return "Great start — keep going.";
  if (pct < 1) return "Almost there — finish strong.";
  return "Mission complete. Outstanding.";
}

export default function DashboardPage() {
  const { habits, completedToday, streaks, completionRates, isLoading, toggleLog } = useHabits();
  const { logs } = useHabitStore();
  const { formatted } = useLocalTime();

  const totalHabits = habits.length;
  const completedCount = completedToday.size;
  const pct = totalHabits === 0 ? 0 : completedCount / totalHabits;
  const overallRate = Math.round(pct * 100);
  const longestStreak = Object.values(streaks).reduce((a, b) => Math.max(a, b), 0);
  const avgRate =
    habits.length === 0
      ? 0
      : Math.round(
          Object.values(completionRates).reduce((a, b) => a + b, 0) / habits.length
        );

  const color = ringColor(pct);

  // Build week bar using real logs for all habits (not just top-4 trendData)
  const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0 … Sun=6
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - todayIdx);

  const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const weekDays = DAY_LABELS.map((label, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const dateStr = format(d, "yyyy-MM-dd");
    const done = new Set(logs.filter((l) => l.date === dateStr).map((l) => l.habitId)).size;
    const dayPct = totalHabits === 0 ? 0 : done / totalHabits;
    return { label, pct: dayPct, isToday: i === todayIdx, isPast: i < todayIdx };
  });

  const statItems = [
    {
      label: "Today",
      value: `${completedCount}/${totalHabits}`,
      sub: "completed",
      icon: <CheckCircle size={16} />,
      color: "#10B981",
    },
    {
      label: "Best Streak",
      value: `${longestStreak}d`,
      sub: "days in a row",
      icon: <Flame size={16} />,
      color: "#F59E0B",
    },
    {
      label: "Active",
      value: `${totalHabits}`,
      sub: "habits tracked",
      icon: <Target size={16} />,
      color: "#7C3AED",
    },
    {
      label: "Avg Rate",
      value: `${avgRate}%`,
      sub: "last 30 days",
      icon: <TrendingUp size={16} />,
      color: "#06B6D4",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="skeleton rounded-xl h-40" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton rounded-xl h-16" />
          ))}
        </div>
        <div className="skeleton rounded-xl h-28" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
                {formatted}
              </p>
              <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: "var(--text-primary)" }}>
                Today&apos;s Mission
              </h1>
              <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>{motivationalCopy(pct)}</p>
              <span
                className="inline-block text-xs font-mono px-2.5 py-1 rounded-full"
                style={{
                  background: "var(--glass-bg-subtle)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--divider)",
                }}
              >
                {totalHabits} active habits
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <ProgressRing value={overallRate} size={140} strokeWidth={8} color={color}>
                <span
                  className="text-3xl font-black tabular-nums"
                  style={{ color }}
                >
                  {overallRate}%
                </span>
              </ProgressRing>
              <p className="text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
                {completedCount} of {totalHabits}
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stat Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statItems.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.06, duration: 0.3 }}
          >
            <GlassCard
              className="p-3 flex items-center gap-3 border-l-4"
              style={{ borderColor: s.color } as React.CSSProperties}
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${s.color}20`, color: s.color }}
              >
                {s.icon}
              </span>
              <div className="min-w-0">
                <p className="text-lg font-bold tabular-nums leading-none" style={{ color: "var(--text-primary)" }}>
                  {s.value}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>{s.label}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* This Week */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.35 }}
      >
        <GlassCard className="p-4">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
            This Week
          </p>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span
                  className="text-xs font-semibold"
                  style={{ color: day.isToday ? "var(--text-primary)" : "var(--text-muted)" }}
                >
                  {day.label}
                </span>
                <div
                  className="w-full rounded-full overflow-hidden relative"
                  style={{ height: 40, background: "var(--divider)" }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-full"
                    style={{
                      height: `${Math.round(day.pct * 100)}%`,
                      background: day.isToday
                        ? color
                        : day.isPast && day.pct > 0
                        ? "var(--glass-border)"
                        : "transparent",
                      transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  />
                </div>
                <span
                  className="text-xs tabular-nums"
                  style={{ color: day.isToday ? "var(--text-secondary)" : "var(--text-muted)" }}
                >
                  {day.isToday || day.isPast ? `${Math.round(day.pct * 100)}%` : "—"}
                </span>
                {day.isToday && (
                  <span className="w-1 h-1 rounded-full" style={{ background: "var(--text-secondary)" }} />
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Habits */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>Today&apos;s Habits</h3>
          <motion.span
            className="text-xs font-bold px-2 py-0.5 rounded-full tabular-nums"
            animate={{ color, backgroundColor: `${color}25` }}
            transition={{ duration: 0.6 }}
          >
            {overallRate}%
          </motion.span>
        </div>
        <HabitGrid
          habits={habits}
          completedToday={completedToday}
          streaks={streaks}
          completionRates={completionRates}
          onToggle={toggleLog}
        />
      </motion.div>
    </div>
  );
}

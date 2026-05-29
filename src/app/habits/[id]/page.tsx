"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Flame, Target, TrendingUp, Calendar } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Spinner } from "@/components/ui/Spinner";
import { StreakBadge } from "@/components/habits/StreakBadge";
import { HeatMap } from "@/components/calendar/HeatMap";
import { useHabitStore } from "@/store/habitStore";
import { useHabitStats } from "@/hooks/useAnalytics";
import { getIcon } from "@/lib/icons";
import Link from "next/link";

interface StatItem {
  label: string;
  sub: string;
  value: string | number;
  Icon: LucideIcon;
  color: string;
}

export default function HabitDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { habits, isLoading } = useHabitStore();
  const habit = habits.find((h) => h.id === id) ?? habits[0];
  const stats = useHabitStats(id);
  const IconComponent = habit ? getIcon(habit.icon) : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={32} />
      </div>
    );
  }

  if (!habit || !stats || !IconComponent) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-white/40">Habit not found.</p>
        <GlassButton variant="secondary" onClick={() => router.push("/habits")}>
          Back to Habits
        </GlassButton>
      </div>
    );
  }

  const statItems: StatItem[] = [
    { label: "Current Streak",  sub: "days in a row",  value: `${stats.currentStreak}d`,    Icon: Flame,      color: "#F59E0B" },
    { label: "Completion Rate", sub: "last 30 days",   value: `${stats.completionRate30d}%`, Icon: TrendingUp, color: habit.color },
    { label: "Total Check-ins", sub: "all time",       value: stats.totalCompletions,        Icon: Target,     color: "#10B981" },
    { label: "Longest Streak",  sub: "personal best",  value: `${stats.longestStreak}d`,     Icon: Calendar,   color: "#06B6D4" },
  ];

  const iconBoxStyle = {
    backgroundColor: `${habit.color}22`,
    border: `1px solid ${habit.color}40`,
  };

  return (
    <div className="max-w-5xl w-full space-y-4">

      {/* ═══════════════════════════════════════
          MOBILE header  (< 768 px)
      ═══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:hidden"
      >
        <GlassCard className="relative overflow-hidden">
          {/* colour wash */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 10% 60%, ${habit.color}18 0%, transparent 65%)` }}
          />
          {/* top glow line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, ${habit.color}, ${habit.color}44 55%, transparent)`,
              boxShadow: `0 0 10px ${habit.color}55`,
            }}
          />
          <div className="relative p-4 flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1.5 glass rounded-lg border border-white/8 text-white/40 hover:text-white/75 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={15} />
            </button>

            {/* small ring + icon */}
            <div className="flex-shrink-0">
              <ProgressRing value={stats.completionRate30d} size={44} strokeWidth={3} color={habit.color}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={iconBoxStyle}>
                  <IconComponent size={12} color={habit.color} />
                </div>
              </ProgressRing>
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-bold text-white/90 truncate leading-snug">{habit.name}</h1>
              {habit.description && (
                <p className="text-[11px] text-white/38 truncate">{habit.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <StreakBadge count={stats.currentStreak} size="sm" />
              <Link href={`/habits/${habit.id}/edit`}>
                <GlassButton variant="secondary" size="sm">
                  <Edit size={13} />
                </GlassButton>
              </Link>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ═══════════════════════════════════════
          DESKTOP hero  (≥ 768 px)
      ═══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:block"
      >
        <GlassCard className="relative overflow-hidden">
          {/* ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 20% 80%, ${habit.color}16 0%, transparent 60%)` }}
          />
          {/* glowing top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(90deg, ${habit.color}, ${habit.color}50 55%, transparent)`,
              boxShadow: `0 0 16px ${habit.color}65`,
            }}
          />

          <div className="relative p-7">
            {/* top bar: back + actions */}
            <div className="flex items-center justify-between mb-7">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-white/35 hover:text-white/75 transition-colors group"
              >
                <span className="p-1.5 glass rounded-lg border border-white/8 group-hover:border-white/16 transition-colors">
                  <ArrowLeft size={15} />
                </span>
                <span className="text-sm font-medium">Back</span>
              </button>
              <div className="flex items-center gap-3">
                <StreakBadge count={stats.currentStreak} size="md" />
                <Link href={`/habits/${habit.id}/edit`}>
                  <GlassButton variant="secondary" size="sm">
                    <Edit size={14} /> Edit
                  </GlassButton>
                </Link>
              </div>
            </div>

            {/* identity: ring + name */}
            <div className="flex items-center gap-8">
              {/* Completion ring with habit icon nested inside */}
              <div className="flex-shrink-0">
                <ProgressRing value={stats.completionRate30d} size={132} strokeWidth={7} color={habit.color}>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${habit.color}22`,
                      border: `1px solid ${habit.color}44`,
                      boxShadow: `0 0 20px ${habit.color}30`,
                    }}
                  >
                    <IconComponent size={28} color={habit.color} />
                  </div>
                </ProgressRing>
              </div>

              {/* name + description + quick tags */}
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold text-white/92 leading-tight truncate">
                  {habit.name}
                </h1>
                {habit.description && (
                  <p className="text-base text-white/38 mt-1 truncate">{habit.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: `${habit.color}20`, color: habit.color }}
                  >
                    {stats.completionRate30d}% this month
                  </span>
                  <span
                    className="text-xs font-mono px-3 py-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.38)" }}
                  >
                    {stats.totalCompletions} total check-ins
                  </span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* ═══════════════════════════════════════
          STATS STRIP
      ═══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.07 }}
      >
        {/* Desktop: single horizontal band, colored numbers */}
        <GlassCard className="hidden md:grid grid-cols-4 divide-x divide-white/[0.05]">
          {statItems.map(({ label, sub, value, Icon, color }) => (
            <div key={label} className="flex flex-col items-center justify-center py-7 px-4 gap-0">
              <Icon size={14} style={{ color, marginBottom: 10, opacity: 0.8 }} />
              <p
                className="text-4xl font-black tabular-nums leading-none"
                style={{ color }}
              >
                {value}
              </p>
              <p className="text-xs font-semibold text-white/70 mt-2">{label}</p>
              <p className="text-[10px] text-white/28 mt-0.5">{sub}</p>
            </div>
          ))}
        </GlassCard>

        {/* Mobile: 2 × 2 grid, also colored numbers */}
        <div className="grid grid-cols-2 gap-2 md:hidden">
          {statItems.map(({ label, value, Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <GlassCard className="p-3 text-center">
                <Icon
                  size={13}
                  style={{ color, margin: "0 auto 6px", display: "block", opacity: 0.85 }}
                />
                <p
                  className="text-xl font-black tabular-nums leading-tight"
                  style={{ color }}
                >
                  {value}
                </p>
                <p className="text-[10px] text-white/40 mt-0.5 leading-tight">{label}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════
          ACTIVITY HEATMAP
      ═══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
      >
        <GlassCard className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-5">
            <h3 className="text-xs md:text-sm font-semibold text-white/50 uppercase tracking-wider">
              Activity — Past Year
            </h3>
            <span
              className="text-[10px] md:text-xs font-mono px-2 py-0.5 rounded-full"
              style={{ background: `${habit.color}18`, color: `${habit.color}cc` }}
            >
              {stats.totalCompletions} days logged
            </span>
          </div>
          <HeatMap days={stats.heatMap} color={habit.color} />
        </GlassCard>
      </motion.div>
    </div>
  );
}

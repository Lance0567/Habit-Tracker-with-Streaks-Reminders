"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { HabitGrid } from "@/components/habits/HabitGrid";
import { StreakBadge } from "@/components/habits/StreakBadge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Spinner } from "@/components/ui/Spinner";
import { useHabits } from "@/hooks/useHabits";
import { useLocalTime } from "@/hooks/useLocalTime";
import { Flame, CheckCircle, Target, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { habits, completedToday, streaks, completionRates, isLoading, toggleLog } = useHabits();
  const { formatted } = useLocalTime();

  const totalHabits = habits.length;
  const completedCount = completedToday.size;
  const overallRate = totalHabits === 0 ? 0 : Math.round((completedCount / totalHabits) * 100);
  const longestStreak = Object.values(streaks).reduce((a, b) => Math.max(a, b), 0);
  const avgRate =
    habits.length === 0
      ? 0
      : Math.round(
          Object.values(completionRates).reduce((a, b) => a + b, 0) / habits.length
        );

  const stats = [
    {
      label: "Today's Progress",
      value: `${completedCount}/${totalHabits}`,
      sub: "habits completed",
      icon: <CheckCircle size={18} />,
      color: "#10B981",
      extra: <ProgressRing value={overallRate} size={36} strokeWidth={3} color="#10B981" />,
    },
    {
      label: "Longest Streak",
      value: longestStreak,
      sub: "days in a row",
      icon: <Flame size={18} />,
      color: "#F59E0B",
      extra: <StreakBadge count={longestStreak} size="lg" />,
    },
    {
      label: "Active Habits",
      value: totalHabits,
      sub: "being tracked",
      icon: <Target size={18} />,
      color: "#7C3AED",
    },
    {
      label: "Avg Completion",
      value: `${avgRate}%`,
      sub: "last 30 days",
      icon: <TrendingUp size={18} />,
      color: "#06B6D4",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-1">
          {formatted}
        </p>
        <h2 className="text-2xl font-bold text-white/90">Today&apos;s Dashboard</h2>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
          >
            <GlassCard className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                >
                  {stat.icon}
                </span>
                {stat.extra}
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-white/90">{stat.value}</p>
                <p className="text-xs text-white/35 mt-0.5">{stat.sub}</p>
                <p className="text-xs font-medium text-white/50 mt-1">{stat.label}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-white/80">Today&apos;s Habits</h3>
          <span className="text-xs text-white/30">
            {completedCount} of {totalHabits} done
          </span>
        </div>
        <HabitGrid
          habits={habits}
          completedToday={completedToday}
          streaks={streaks}
          completionRates={completionRates}
          onToggle={toggleLog}
        />
      </div>
    </div>
  );
}

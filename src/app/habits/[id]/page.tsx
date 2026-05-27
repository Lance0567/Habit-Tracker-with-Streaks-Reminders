"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Flame, Target, TrendingUp, Calendar } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { Spinner } from "@/components/ui/Spinner";
import { StreakBadge } from "@/components/habits/StreakBadge";
import { HeatMap } from "@/components/calendar/HeatMap";
import { useHabitStore } from "@/store/habitStore";
import { useHabitStats } from "@/hooks/useAnalytics";
import { getIcon } from "@/lib/icons";
import Link from "next/link";

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

  const statCards = [
    { label: "Current Streak", value: `${stats.currentStreak}d`, icon: <Flame size={16} />, color: "#F59E0B" },
    { label: "Completion Rate", value: `${stats.completionRate30d}%`, icon: <TrendingUp size={16} />, color: habit.color },
    { label: "Total Check-ins", value: stats.totalCompletions, icon: <Target size={16} />, color: "#10B981" },
    { label: "Longest Streak", value: `${stats.longestStreak}d`, icon: <Calendar size={16} />, color: "#06B6D4" },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={() => router.back()}
          className="p-2 glass rounded-[var(--radius-md)] text-white/40 hover:text-white/80 transition-all border border-white/8"
        >
          <ArrowLeft size={16} />
        </button>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${habit.color}20`, border: `1px solid ${habit.color}30` }}
        >
          <IconComponent size={20} color={habit.color} />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white/90">{habit.name}</h2>
          <p className="text-sm text-white/35">{habit.description}</p>
        </div>
        <StreakBadge count={stats.currentStreak} size="md" />
        <Link href={`/habits/${habit.id}/edit`}>
          <GlassButton variant="secondary" size="sm">
            <Edit size={14} />
            Edit
          </GlassButton>
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <GlassCard className="p-4 text-center">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                style={{ backgroundColor: `${s.color}20`, color: s.color }}
              >
                {s.icon}
              </span>
              <p className="text-xl font-bold tabular-nums text-white/90">{s.value}</p>
              <p className="text-xs text-white/35 mt-0.5">{s.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <GlassCard className="p-5">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
          Activity — Past Year
        </h3>
        <HeatMap days={stats.heatMap} color={habit.color} />
      </GlassCard>
    </div>
  );
}

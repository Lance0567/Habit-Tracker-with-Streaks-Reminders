"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { GlassCard } from "@/components/ui/GlassCard";
import { Spinner } from "@/components/ui/Spinner";

const CompletionRateChart = dynamic(
  () => import("@/components/charts/CompletionRateChart").then((m) => ({ default: m.CompletionRateChart })),
  { ssr: false, loading: () => <div className="skeleton rounded-lg h-48" /> }
);
const StreakHistoryChart = dynamic(
  () => import("@/components/charts/StreakHistoryChart").then((m) => ({ default: m.StreakHistoryChart })),
  { ssr: false, loading: () => <div className="skeleton rounded-lg h-48" /> }
);
const CategoryBreakdown = dynamic(
  () => import("@/components/charts/CategoryBreakdown").then((m) => ({ default: m.CategoryBreakdown })),
  { ssr: false, loading: () => <div className="skeleton rounded-lg h-48" /> }
);
const TrendLineChart = dynamic(
  () => import("@/components/charts/TrendLineChart").then((m) => ({ default: m.TrendLineChart })),
  { ssr: false, loading: () => <div className="skeleton rounded-lg h-48" /> }
);
import { useGlobalAnalytics } from "@/hooks/useAnalytics";
import { useHabitStore } from "@/store/habitStore";
import { HABIT_COLORS } from "@/lib/constants";
import { TrendingUp, Flame, CheckCircle, Target } from "lucide-react";

type Period = "monthly" | "yearly";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const { isLoading } = useHabitStore();
  const {
    avgCompletionRate,
    bestStreak,
    totalHabits,
    completedTodayCount,
    weeklyData,
    monthlyData,
    yearlyData,
    yearlyAvgData,
    trendData,
    categoryStats,
    top4Habits,
  } = useGlobalAnalytics();

  const trendHabits = top4Habits.map((h, i) => ({
    key: h.id,
    color: HABIT_COLORS[i % HABIT_COLORS.length] ?? h.color,
    label: h.name,
  }));

  const headline = [
    { label: "Avg Completion", value: `${avgCompletionRate}%`, icon: <TrendingUp size={16} />, color: "#7C3AED" },
    { label: "Best Streak", value: `${bestStreak}d`, icon: <Flame size={16} />, color: "#F59E0B" },
    { label: "Total Habits", value: totalHabits, icon: <Target size={16} />, color: "#06B6D4" },
    { label: "Completed Today", value: `${completedTodayCount}/${totalHabits}`, icon: <CheckCircle size={16} />, color: "#10B981" },
  ];

  // Data and labels change based on selected period
  const completionChartData = period === "monthly" ? weeklyData : yearlyAvgData;
  const completionChartTitle = period === "monthly" ? "Weekly Completion Rate" : "Monthly Completion Rate";
  const completionChartSub = period === "monthly" ? "Last 12 weeks" : "Last 12 months";

  const barChartData = period === "monthly" ? monthlyData : yearlyData;
  const barChartTitle = "Total Completions";
  const barChartSub = period === "monthly" ? "Last 6 months" : "Last 12 months";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + toggle */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Analytics</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Your habit performance at a glance</p>
        </div>

        {/* Period toggle */}
        <div
          className="flex gap-1 p-1 rounded-xl"
          style={{
            background: "var(--glass-bg-subtle)",
            border: "1px solid var(--glass-border)",
          }}
        >
          {(["monthly", "yearly"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200"
              style={
                period === p
                  ? {
                      background: "var(--color-accent)",
                      color: "#ffffff",
                      boxShadow: "0 0 12px rgba(124,58,237,0.35)",
                    }
                  : {
                      color: "var(--text-muted)",
                    }
              }
            >
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Headline stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {headline.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <GlassCard className="p-4 flex items-center gap-3">
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${s.color}20`, color: s.color }}
              >
                {s.icon}
              </span>
              <div>
                <p className="text-xl font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>{s.value}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[
          {
            title: completionChartTitle,
            sub: completionChartSub,
            component: <CompletionRateChart data={completionChartData} />,
          },
          {
            title: barChartTitle,
            sub: barChartSub,
            component: <StreakHistoryChart data={barChartData} />,
          },
          {
            title: "Category Breakdown",
            sub: "Completion % by category (30d)",
            component: <CategoryBreakdown data={categoryStats} />,
          },
          {
            title: "Daily Habit Trends",
            sub: "This week at a glance",
            component: <TrendLineChart data={trendData} habits={trendHabits} />,
          },
        ].map(({ title, sub, component }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
          >
            <GlassCard className="p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</p>
              </div>
              {component}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

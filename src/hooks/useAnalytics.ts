import { useMemo } from "react";
import { useHabitStore } from "@/store/habitStore";
import {
  getCompletionRate,
  getHeatMapData,
  getOverallWeeklyData,
  getMonthlyCompletionData,
  getYearlyCompletionData,
  getYearlyAvgData,
  getThisWeekTrendData,
  getCategoryStats,
} from "@/lib/analytics";
import { calculateCurrentStreak, getLongestStreak } from "@/lib/streaks";

export function useHabitStats(habitId: string) {
  const { habits, logs } = useHabitStore();
  const habit = habits.find((h) => h.id === habitId);

  return useMemo(() => {
    if (!habit) return null;
    return {
      completionRate7d: getCompletionRate(logs, habit, 7),
      completionRate30d: getCompletionRate(logs, habit, 30),
      completionRate90d: getCompletionRate(logs, habit, 90),
      totalCompletions: logs.filter((l) => l.habitId === habitId).length,
      currentStreak: calculateCurrentStreak(logs, habit),
      longestStreak: getLongestStreak(logs, habit),
      heatMap: getHeatMapData(logs, habitId),
    };
  }, [habit, logs, habitId]);
}

export function useGlobalAnalytics() {
  const { habits, logs, categories } = useHabitStore();
  const activeHabits = useMemo(() => habits.filter((h) => !h.archived), [habits]);

  const avgCompletionRate = useMemo(() => {
    if (activeHabits.length === 0) return 0;
    return Math.round(
      activeHabits.reduce((acc, h) => acc + getCompletionRate(logs, h, 30), 0) /
        activeHabits.length
    );
  }, [activeHabits, logs]);

  const bestStreak = useMemo(
    () =>
      activeHabits.reduce(
        (max, h) => Math.max(max, calculateCurrentStreak(logs, h)),
        0
      ),
    [activeHabits, logs]
  );

  const weeklyData = useMemo(
    () => getOverallWeeklyData(activeHabits, logs),
    [activeHabits, logs]
  );

  const monthlyData = useMemo(
    () => getMonthlyCompletionData(activeHabits, logs),
    [activeHabits, logs]
  );

  const yearlyData = useMemo(
    () => getYearlyCompletionData(activeHabits, logs),
    [activeHabits, logs]
  );

  const yearlyAvgData = useMemo(
    () => getYearlyAvgData(activeHabits, logs),
    [activeHabits, logs]
  );

  const trendData = useMemo(
    () => getThisWeekTrendData(activeHabits, logs),
    [activeHabits, logs]
  );

  const categoryStats = useMemo(
    () => getCategoryStats(activeHabits, categories, logs),
    [activeHabits, categories, logs]
  );

  const completedTodayCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return new Set(logs.filter((l) => l.date === today).map((l) => l.habitId)).size;
  }, [logs]);

  return {
    avgCompletionRate,
    bestStreak,
    totalHabits: activeHabits.length,
    completedTodayCount,
    weeklyData,
    monthlyData,
    yearlyData,
    yearlyAvgData,
    trendData,
    categoryStats,
    top4Habits: activeHabits.slice(0, 4),
  };
}

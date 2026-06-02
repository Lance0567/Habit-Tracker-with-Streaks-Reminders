import { useMemo } from "react";
import { format } from "date-fns";
import { useHabitStore } from "@/store/habitStore";
import { calculateCurrentStreak } from "@/lib/streaks";
import { getCompletionRate } from "@/lib/analytics";

export function useHabits() {
  const { habits, logs, isLoading, toggleLog } = useHabitStore();
  const today = format(new Date(), "yyyy-MM-dd");

  const activeHabits = useMemo(
    () => habits.filter((h) => !h.archived),
    [habits]
  );

  const todayCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const log of logs) {
      if (log.date === today) counts[log.habitId] = log.completedCount;
    }
    return counts;
  }, [logs, today]);

  const completedToday = useMemo(() => {
    const set = new Set<string>();
    for (const habit of activeHabits) {
      if ((todayCounts[habit.id] ?? 0) >= habit.targetCount) set.add(habit.id);
    }
    return set;
  }, [activeHabits, todayCounts]);

  const streaks = useMemo(() => {
    const map: Record<string, number> = {};
    for (const h of activeHabits) {
      map[h.id] = calculateCurrentStreak(logs, h);
    }
    return map;
  }, [activeHabits, logs]);

  const completionRates = useMemo(() => {
    const map: Record<string, number> = {};
    for (const h of activeHabits) {
      map[h.id] = getCompletionRate(logs, h, 30);
    }
    return map;
  }, [activeHabits, logs]);

  return {
    habits: activeHabits,
    completedToday,
    todayCounts,
    streaks,
    completionRates,
    isLoading,
    toggleLog,
  };
}

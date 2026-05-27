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

  const completedToday = useMemo(() => {
    const set = new Set<string>();
    for (const log of logs) {
      if (log.date === today) set.add(log.habitId);
    }
    return set;
  }, [logs, today]);

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
    streaks,
    completionRates,
    isLoading,
    toggleLog,
  };
}

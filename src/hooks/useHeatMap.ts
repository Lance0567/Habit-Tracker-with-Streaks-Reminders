import { useMemo } from "react";
import { useHabitStore } from "@/store/habitStore";
import { getHeatMapData } from "@/lib/analytics";

export function useHeatMap(habitId: string) {
  const { habits, logs } = useHabitStore();
  const targetCount = useMemo(
    () => habits.find((h) => h.id === habitId)?.targetCount ?? 1,
    [habits, habitId]
  );
  return useMemo(() => getHeatMapData(logs, habitId, targetCount), [logs, habitId, targetCount]);
}

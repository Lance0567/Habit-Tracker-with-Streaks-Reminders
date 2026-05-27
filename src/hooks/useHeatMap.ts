import { useMemo } from "react";
import { useHabitStore } from "@/store/habitStore";
import { getHeatMapData } from "@/lib/analytics";

export function useHeatMap(habitId: string) {
  const { logs } = useHabitStore();
  return useMemo(() => getHeatMapData(logs, habitId), [logs, habitId]);
}

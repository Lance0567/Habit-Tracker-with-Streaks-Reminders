import { format, subDays, parseISO, differenceInDays } from "date-fns";
import type { Habit, HabitLog } from "@/types";

export function isHabitDueOnDate(habit: Habit, date: Date): boolean {
  const dow = date.getDay();
  switch (habit.frequency) {
    case "daily": return true;
    case "weekdays": return dow >= 1 && dow <= 5;
    case "weekends": return dow === 0 || dow === 6;
    case "custom": return (habit.customDays ?? []).includes(dow);
    default: return true;
  }
}

export function calculateCurrentStreak(logs: HabitLog[], habit: Habit): number {
  const logDates = new Set(
    logs.filter((l) => l.habitId === habit.id).map((l) => l.date)
  );
  let streak = 0;
  let d = new Date();

  const todayStr = format(d, "yyyy-MM-dd");
  if (!logDates.has(todayStr)) d = subDays(d, 1);

  for (let i = 0; i < 366; i++) {
    const dateStr = format(d, "yyyy-MM-dd");
    if (isHabitDueOnDate(habit, d)) {
      if (logDates.has(dateStr)) {
        streak++;
      } else {
        break;
      }
    }
    d = subDays(d, 1);
  }
  return streak;
}

export function getLongestStreak(logs: HabitLog[], habit: Habit): number {
  const logDates = new Set(
    logs.filter((l) => l.habitId === habit.id).map((l) => l.date)
  );
  if (logDates.size === 0) return 0;

  const sorted = Array.from(logDates).sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = parseISO(sorted[i - 1]);
    const curr = parseISO(sorted[i]);
    if (differenceInDays(curr, prev) === 1) {
      current++;
      if (current > longest) longest = current;
    } else {
      current = 1;
    }
  }
  return longest;
}

export function isCompletedToday(logs: HabitLog[], habitId: string): boolean {
  const today = format(new Date(), "yyyy-MM-dd");
  return logs.some((l) => l.habitId === habitId && l.date === today);
}

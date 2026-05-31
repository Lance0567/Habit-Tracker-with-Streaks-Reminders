import {
  format,
  subDays,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import type { Habit, HabitLog, Category, HeatMapDay } from "@/types";
import { isHabitDueOnDate } from "./streaks";

export function getCompletionRate(logs: HabitLog[], habit: Habit, days: number): number {
  const logDates = new Set(
    logs.filter((l) => l.habitId === habit.id).map((l) => l.date)
  );
  let due = 0;
  let done = 0;
  for (let i = 0; i < days; i++) {
    const d = subDays(new Date(), i);
    if (isHabitDueOnDate(habit, d)) {
      due++;
      if (logDates.has(format(d, "yyyy-MM-dd"))) done++;
    }
  }
  return due === 0 ? 0 : Math.round((done / due) * 100);
}

export function getHeatMapData(logs: HabitLog[], habitId: string): HeatMapDay[] {
  const logCounts = new Map<string, number>();
  for (const log of logs) {
    if (log.habitId === habitId) {
      logCounts.set(log.date, (logCounts.get(log.date) ?? 0) + log.completedCount);
    }
  }
  return Array.from({ length: 365 }, (_, i) => {
    const date = format(subDays(new Date(), 364 - i), "yyyy-MM-dd");
    const count = logCounts.get(date) ?? 0;
    const level = count === 0 ? 0 : count >= 4 ? 4 : count >= 3 ? 3 : count >= 2 ? 2 : 1;
    return { date, count, level: level as 0 | 1 | 2 | 3 | 4 };
  });
}

export function getOverallWeeklyData(
  habits: Habit[],
  logs: HabitLog[]
): { week: string; rate: number }[] {
  const logSet = new Set(logs.map((l) => `${l.habitId}:${l.date}`));
  return Array.from({ length: 12 }, (_, i) => {
    const weekIdx = 11 - i;
    const weekStart = startOfWeek(subDays(new Date(), weekIdx * 7));
    const weekEnd = endOfWeek(weekStart);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    let completed = 0;
    let expected = 0;
    for (const habit of habits) {
      for (const d of days) {
        if (isHabitDueOnDate(habit, d)) {
          expected++;
          if (logSet.has(`${habit.id}:${format(d, "yyyy-MM-dd")}`)) completed++;
        }
      }
    }
    return {
      week: `W${i + 1}`,
      rate: expected === 0 ? 0 : Math.round((completed / expected) * 100),
    };
  });
}

export function getMonthlyCompletionData(
  habits: Habit[],
  logs: HabitLog[]
): { name: string; streak: number }[] {
  const logSet = new Set(logs.map((l) => `${l.habitId}:${l.date}`));
  return Array.from({ length: 6 }, (_, i) => {
    const monthIdx = 5 - i;
    const d = subMonths(new Date(), monthIdx);
    const monthStart = startOfMonth(d);
    const monthEnd = endOfMonth(d);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    let completed = 0;
    for (const habit of habits) {
      for (const day of days) {
        if (isHabitDueOnDate(habit, day) && logSet.has(`${habit.id}:${format(day, "yyyy-MM-dd")}`)) {
          completed++;
        }
      }
    }
    return { name: format(monthStart, "MMM"), streak: completed };
  });
}

export function getYearlyAvgData(
  habits: Habit[],
  logs: HabitLog[]
): { week: string; rate: number }[] {
  const logSet = new Set(logs.map((l) => `${l.habitId}:${l.date}`));
  return Array.from({ length: 12 }, (_, i) => {
    const monthIdx = 11 - i;
    const d = subMonths(new Date(), monthIdx);
    const monthStart = startOfMonth(d);
    const monthEnd = endOfMonth(d);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    let completed = 0;
    let expected = 0;
    for (const habit of habits) {
      for (const day of days) {
        if (isHabitDueOnDate(habit, day)) {
          expected++;
          if (logSet.has(`${habit.id}:${format(day, "yyyy-MM-dd")}`)) completed++;
        }
      }
    }
    return {
      week: format(monthStart, "MMM"),
      rate: expected === 0 ? 0 : Math.round((completed / expected) * 100),
    };
  });
}

export function getYearlyCompletionData(
  habits: Habit[],
  logs: HabitLog[]
): { name: string; streak: number }[] {
  const logSet = new Set(logs.map((l) => `${l.habitId}:${l.date}`));
  return Array.from({ length: 12 }, (_, i) => {
    const monthIdx = 11 - i;
    const d = subMonths(new Date(), monthIdx);
    const monthStart = startOfMonth(d);
    const monthEnd = endOfMonth(d);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    let completed = 0;
    for (const habit of habits) {
      for (const day of days) {
        if (isHabitDueOnDate(habit, day) && logSet.has(`${habit.id}:${format(day, "yyyy-MM-dd")}`)) {
          completed++;
        }
      }
    }
    return { name: format(monthStart, "MMM"), streak: completed };
  });
}

export function getThisWeekTrendData(
  habits: Habit[],
  logs: HabitLog[]
): { day: string; [key: string]: number | string }[] {
  const logSet = new Set(logs.map((l) => `${l.habitId}:${l.date}`));
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const top4 = habits.slice(0, 4);

  return dayNames.map((day, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const dateStr = format(d, "yyyy-MM-dd");
    const entry: { day: string; [key: string]: number | string } = { day };
    for (const habit of top4) {
      entry[habit.id] = logSet.has(`${habit.id}:${dateStr}`) ? 1 : 0;
    }
    return entry;
  });
}

export function getCategoryStats(
  habits: Habit[],
  categories: Category[],
  logs: HabitLog[]
): { category: string; value: number }[] {
  return categories
    .map((cat) => {
      const catHabits = habits.filter((h) => h.categoryId === cat.id);
      if (catHabits.length === 0) return null;
      const rate = Math.round(
        catHabits.reduce((acc, h) => acc + getCompletionRate(logs, h, 30), 0) /
          catHabits.length
      );
      return { category: cat.name, value: rate };
    })
    .filter((x): x is { category: string; value: number } => x !== null);
}

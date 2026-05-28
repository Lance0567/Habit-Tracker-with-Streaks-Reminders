"use client";

import { useEffect, useRef } from "react";
import { useHabitStore } from "@/store/habitStore";
import { useUIStore } from "@/store/uiStore";
import { calculateCurrentStreak } from "@/lib/streaks";

const MILESTONES = [7, 14, 30, 100] as const;
const STORAGE_KEY = "habitflow_milestones_seen";

function getSeenKey(habitId: string, milestone: number) {
  return `${habitId}:${milestone}`;
}

function loadSeen(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markSeen(key: string) {
  const seen = loadSeen();
  seen.add(key);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(seen)));
  } catch { /* quota exceeded — ignore */ }
}

export function useMilestoneDetector() {
  const habits = useHabitStore((s) => s.habits);
  const logs = useHabitStore((s) => s.logs);
  const isLoading = useHabitStore((s) => s.isLoading);
  const setMilestoneModal = useUIStore((s) => s.setMilestoneModal);
  const prevStreaks = useRef<Record<string, number>>({});

  useEffect(() => {
    if (isLoading || habits.length === 0) return;

    const seen = loadSeen();

    for (const habit of habits) {
      if (habit.archived) continue;
      const streak = calculateCurrentStreak(logs, habit);
      const prev = prevStreaks.current[habit.id] ?? 0;

      for (const milestone of MILESTONES) {
        const key = getSeenKey(habit.id, milestone);
        if (streak >= milestone && prev < milestone && !seen.has(key)) {
          markSeen(key);
          setMilestoneModal({
            habitId: habit.id,
            habitName: habit.name,
            milestone,
            currentStreak: streak,
          });
          break;
        }
      }

      prevStreaks.current[habit.id] = streak;
    }
  }, [habits, logs, isLoading, setMilestoneModal]);
}

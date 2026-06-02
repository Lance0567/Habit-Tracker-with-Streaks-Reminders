"use client";

import { useEffect } from "react";
import { format } from "date-fns";
import { useHabitStore } from "@/store/habitStore";
import { useUIStore } from "@/store/uiStore";
import { calculateCurrentStreak } from "@/lib/streaks";

// Highest-first so we celebrate the biggest milestone reached
const MILESTONES = [100, 30, 14, 7] as const;
const STORAGE_KEY = "habitflow_milestones_seen";

function getSeenSet(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markSeen(key: string) {
  try {
    const seen = getSeenSet();
    seen.add(key);
    // Prune entries older than 7 days to prevent unbounded growth
    const cutoff = format(new Date(Date.now() - 7 * 86_400_000), "yyyy-MM-dd");
    const pruned = Array.from(seen).filter((k) => {
      const date = k.split(":")[2];
      return date ? date >= cutoff : false;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
  } catch { /* quota exceeded — ignore */ }
}

export function useMilestoneDetector() {
  const habits = useHabitStore((s) => s.habits);
  const logs = useHabitStore((s) => s.logs);
  const isLoading = useHabitStore((s) => s.isLoading);
  const setMilestoneModal = useUIStore((s) => s.setMilestoneModal);

  useEffect(() => {
    if (isLoading || habits.length === 0) return;

    const today = format(new Date(), "yyyy-MM-dd");
    const seen = getSeenSet();

    for (const habit of habits) {
      if (habit.archived) continue;
      const streak = calculateCurrentStreak(logs, habit);

      for (const milestone of MILESTONES) {
        const key = `${habit.id}:${milestone}:${today}`;
        if (streak >= milestone && !seen.has(key)) {
          markSeen(key);
          setMilestoneModal({
            habitId: habit.id,
            habitName: habit.name,
            milestone,
            currentStreak: streak,
          });
          return; // one modal at a time
        }
      }
    }
  }, [habits, logs, isLoading, setMilestoneModal]);
}

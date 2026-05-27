"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { useHabitStore } from "@/store/habitStore";
import { NotificationPanel } from "./NotificationPanel";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const habits = useHabitStore((s) => s.habits);

  const todayDow = new Date().getDay();
  const upcomingCount = habits.reduce((count, habit) => {
    if (habit.archived) return count;
    return (
      count +
      habit.reminders.filter(
        (r) => r.enabled && (r.days.length === 0 || r.days.includes(todayDow))
      ).length
    );
  }, 0);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 glass rounded-[var(--radius-md)] flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all border border-white/8"
        aria-label="Reminders"
      >
        <Bell size={16} />
        {upcomingCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent shadow-glow-sm" />
        )}
      </button>
      <NotificationPanel open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

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
        className="relative w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)] transition-all duration-200"
        style={{
          background: open ? "var(--color-accent)/15" : "var(--glass-bg-default)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: open
            ? "1px solid var(--color-accent)/40"
            : "1px solid var(--glass-border-hover)",
          color: open ? "var(--color-accent-light)" : "var(--text-secondary)",
          boxShadow: open ? "var(--glow-sm)" : "none",
        }}
        onMouseEnter={(e) => {
          if (!open) {
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.borderColor = "var(--glass-border-hover)";
            e.currentTarget.style.background = "var(--glass-bg-elevated)";
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.borderColor = "var(--glass-border-hover)";
            e.currentTarget.style.background = "var(--glass-bg-default)";
          }
        }}
        aria-label="Open reminders"
      >
        <Bell size={16} />
        {upcomingCount > 0 && (
          <span
            className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full flex items-center justify-center"
            style={{ background: "var(--color-accent)", boxShadow: "var(--glow-sm)" }}
          >
            <span style={{ fontSize: 7, color: "#fff", fontWeight: 700, lineHeight: 1 }}>
              {upcomingCount > 9 ? "9+" : upcomingCount}
            </span>
          </span>
        )}
      </button>
      <NotificationPanel open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

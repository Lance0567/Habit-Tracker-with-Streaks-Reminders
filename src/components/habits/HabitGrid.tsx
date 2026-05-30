"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { HabitCard } from "./HabitCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { useUIStore } from "@/store/uiStore";
import type { Habit } from "@/types";

interface HabitGridProps {
  habits: Habit[];
  completedToday: Set<string>;
  streaks: Record<string, number>;
  completionRates: Record<string, number>;
  onToggle?: (habitId: string) => void;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function HabitGrid({
  habits,
  completedToday,
  streaks,
  completionRates,
  onToggle,
}: HabitGridProps) {
  const setNewHabitOpen = useUIStore((s) => s.setNewHabitOpen);

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border)" }}
        >
          <span className="text-2xl">✦</span>
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No habits yet</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Start building your routine — create your first habit.</p>
        </div>
        <GlassButton variant="primary" size="sm" onClick={() => setNewHabitOpen(true)}>
          <Plus size={14} /> New Habit
        </GlassButton>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
    >
      {habits.map((habit) => (
        <motion.div key={habit.id} variants={item}>
          <HabitCard
            habit={habit}
            streak={streaks[habit.id] ?? 0}
            completedToday={completedToday.has(habit.id)}
            completionRate={completionRates[habit.id] ?? 0}
            onToggle={onToggle ? () => onToggle(habit.id) : undefined}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

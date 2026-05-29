"use client";

import { motion } from "framer-motion";
import { HabitListItem } from "./HabitListItem";
import type { Habit } from "@/types";

interface HabitListProps {
  habits: Habit[];
  completedToday: Set<string>;
  streaks: Record<string, number>;
  completionRates: Record<string, number>;
  onToggle?: (habitId: string) => void;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function HabitList({
  habits,
  completedToday,
  streaks,
  completionRates,
  onToggle,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-4xl mb-4">✦</p>
        <p className="text-white/40 text-sm">No habits yet. Create your first one.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-2"
    >
      {habits.map((habit) => (
        <motion.div key={habit.id} variants={item}>
          <HabitListItem
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

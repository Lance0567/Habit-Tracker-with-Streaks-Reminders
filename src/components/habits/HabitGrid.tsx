"use client";

import { motion } from "framer-motion";
import { HabitCard } from "./HabitCard";
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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
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

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { CheckInButton } from "./CheckInButton";
import { StreakBadge } from "./StreakBadge";
import { getIcon } from "@/lib/icons";
import type { Habit } from "@/types";

interface HabitListItemProps {
  habit: Habit;
  streak: number;
  completedToday: boolean;
  completionRate: number;
  onToggle?: () => void;
}

export function HabitListItem({
  habit,
  streak,
  completedToday,
  completionRate,
  onToggle,
}: HabitListItemProps) {
  const [checked, setChecked] = useState(completedToday);
  const [cardHovered, setCardHovered] = useState(false);
  const IconComponent = getIcon(habit.icon);

  const handleToggle = () => {
    setChecked((c) => !c);
    onToggle?.();
  };

  return (
    <GlassCard
      variant="default"
      className="px-4 py-3 relative overflow-hidden"
      style={{ borderColor: checked ? `${habit.color}30` : undefined }}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[var(--radius-lg)]"
        style={{
          background: `linear-gradient(90deg, ${habit.color}, transparent)`,
          boxShadow: checked ? `0 0 10px ${habit.color}` : "none",
          transition: "box-shadow 0.4s ease",
        }}
      />

      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: `${habit.color}20`,
            border: `1px solid ${habit.color}30`,
            boxShadow: checked ? `0 0 10px ${habit.color}40` : "none",
            transition: "box-shadow 0.4s ease",
          }}
        >
          <IconComponent size={16} color={habit.color} />
        </div>

        {/* Name + description */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/habits/${habit.id}`}
            title={habit.name}
            className="text-sm font-semibold truncate block transition-colors hover:opacity-80"
            style={{ color: "var(--text-primary)" }}
          >
            {habit.name}
          </Link>
          {habit.description && (
            <p className="text-xs truncate" title={habit.description} style={{ color: "var(--text-muted)" }}>{habit.description}</p>
          )}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <StreakBadge count={streak} size="sm" />
          <span className="text-xs tabular-nums w-9 text-right" style={{ color: "var(--text-muted)" }}>
            {Math.round(completionRate)}%
          </span>
          <CheckInButton
            checked={checked}
            onToggle={handleToggle}
            color={habit.color}
            size={36}
            cardHovered={cardHovered}
          />
        </div>
      </div>

      {/* Glow overlay on complete */}
      {checked && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[var(--radius-lg)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: `radial-gradient(circle at 90% 50%, ${habit.color}10 0%, transparent 60%)`,
          }}
        />
      )}
    </GlassCard>
  );
}

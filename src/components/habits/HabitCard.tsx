"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { CheckInButton } from "./CheckInButton";
import { StreakBadge } from "./StreakBadge";
import { getIcon } from "@/lib/icons";
import type { Habit } from "@/types";
import Link from "next/link";

interface HabitCardProps {
  habit: Habit;
  streak: number;
  completedToday: boolean;
  completionRate: number;
  onToggle?: () => void;
}

export function HabitCard({
  habit,
  streak,
  completedToday,
  completionRate,
  onToggle,
}: HabitCardProps) {
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
      className="p-5 flex flex-col gap-4 overflow-hidden relative"
      style={{
        borderColor: checked ? `${habit.color}30` : undefined,
      }}
      onMouseEnter={() => setCardHovered(true)}
      onMouseLeave={() => setCardHovered(false)}
    >
      {/* Color accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[var(--radius-lg)]"
        style={{
          background: `linear-gradient(90deg, ${habit.color}, transparent)`,
          boxShadow: checked ? `0 0 12px ${habit.color}` : "none",
          transition: "box-shadow 0.4s ease",
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: `${habit.color}20`,
              border: `1px solid ${habit.color}30`,
              boxShadow: checked ? `0 0 12px ${habit.color}40` : "none",
              transition: "box-shadow 0.4s ease",
            }}
          >
            <IconComponent size={18} color={habit.color} />
          </div>
          <div className="min-w-0">
            <Link
              href={`/habits/${habit.id}`}
              title={habit.name}
              className="text-sm font-semibold truncate block transition-colors hover:opacity-80"
              style={{ color: "var(--text-primary)" }}
            >
              {habit.name}
            </Link>
            {habit.description && (
              <p className="text-xs truncate mt-0.5" title={habit.description} style={{ color: "var(--text-muted)" }}>{habit.description}</p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <StreakBadge count={streak} size="sm" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <ProgressRing
          value={completionRate}
          size={40}
          strokeWidth={3}
          color={habit.color}
        >
          <span className="text-[9px] font-bold tabular-nums" style={{ color: "var(--text-secondary)" }}>
            {Math.round(completionRate)}%
          </span>
        </ProgressRing>

        <CheckInButton
          checked={checked}
          onToggle={handleToggle}
          color={habit.color}
          size={44}
          cardHovered={cardHovered}
        />
      </div>

      {/* Glow overlay on complete */}
      {checked && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[var(--radius-lg)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: `radial-gradient(circle at 80% 80%, ${habit.color}10 0%, transparent 60%)`,
          }}
        />
      )}
    </GlassCard>
  );
}

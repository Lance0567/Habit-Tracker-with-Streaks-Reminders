"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus } from "lucide-react";

interface CheckInButtonProps {
  checked: boolean;
  onToggle: () => void;
  color?: string;
  size?: number;
  cardHovered?: boolean;
  currentCount?: number;
  targetCount?: number;
}

export function CheckInButton({
  checked,
  onToggle,
  color = "#7C3AED",
  size = 48,
  cardHovered = false,
  currentCount = 0,
  targetCount = 1,
}: CheckInButtonProps) {
  const isMulti = targetCount > 1;
  const progress = isMulti ? Math.min(currentCount / targetCount, 1) : checked ? 1 : 0;
  const circumference = Math.PI * (size - 4);
  const dashOffset = circumference * (1 - progress);
  const partial = isMulti && currentCount > 0 && !checked;

  // Trigger a burst ring on each count increment
  const [burstKey, setBurstKey] = useState(0);
  const prevCountRef = useRef(currentCount);
  useEffect(() => {
    if (currentCount > prevCountRef.current) setBurstKey((k) => k + 1);
    prevCountRef.current = currentCount;
  }, [currentCount]);

  return (
    <motion.button
      onClick={onToggle}
      className="relative flex items-center justify-center rounded-full cursor-pointer focus:outline-none"
      style={{ width: size, height: size }}
      animate={{
        filter: checked
          ? `drop-shadow(0 0 10px ${color})`
          : partial
          ? `drop-shadow(0 0 6px ${color}60)`
          : cardHovered
          ? `drop-shadow(0 0 8px ${color}80)`
          : "none",
      }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label={
        checked
          ? "Uncheck habit"
          : isMulti
          ? `Check in (${currentCount}/${targetCount})`
          : "Check habit"
      }
    >
      {/* Track ring — background */}
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 4) / 2}
          fill="none"
          strokeWidth={2.5}
          strokeLinecap="round"
          style={{ stroke: cardHovered ? `${color}40` : "var(--ring-track)" }}
        />
      </svg>

      {/* Progress arc */}
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
        style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 4) / 2}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          opacity={progress > 0 ? 1 : 0}
          style={{ transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
      </svg>

      {/* Fill */}
      <motion.div
        className="absolute inset-1 rounded-full"
        animate={{
          backgroundColor: checked
            ? color
            : partial
            ? `${color}18`
            : cardHovered
            ? `${color}18`
            : "rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Content: check when done, count when partial, dim icon when idle */}
      <AnimatePresence mode="wait">
        {checked && (
          <motion.span
            key="check"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 30 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative z-10"
          >
            <Check size={size * 0.4} color="#fff" strokeWidth={3} />
          </motion.span>
        )}
        {partial && (
          <motion.span
            key="count"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative z-10 font-bold tabular-nums"
            style={{ fontSize: size * 0.3, color, lineHeight: 1 }}
          >
            {currentCount}
          </motion.span>
        )}
        {!checked && !partial && (
          <motion.span
            key="idle"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative z-10"
            style={{ opacity: 0.4 }}
          >
            {isMulti ? (
              <Plus size={size * 0.38} color={color} strokeWidth={2.5} />
            ) : (
              <Check size={size * 0.4} color={color} strokeWidth={3} />
            )}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Completion pulse wave */}
      <AnimatePresence>
        {checked && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: color }}
          />
        )}
      </AnimatePresence>

      {/* Per-tap burst ring for multi-target habits */}
      <AnimatePresence>
        {burstKey > 0 && (
          <motion.div
            key={burstKey}
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 0.85, opacity: 0.9 }}
            animate={{ scale: 1.7, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{ border: `2px solid ${color}` }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

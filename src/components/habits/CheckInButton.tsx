"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface CheckInButtonProps {
  checked: boolean;
  onToggle: () => void;
  color?: string;
  size?: number;
  cardHovered?: boolean;
}

export function CheckInButton({
  checked,
  onToggle,
  color = "#7C3AED",
  size = 48,
  cardHovered = false,
}: CheckInButtonProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="relative flex items-center justify-center rounded-full cursor-pointer focus:outline-none"
      style={{ width: size, height: size }}
      animate={{
        filter: checked
          ? `drop-shadow(0 0 10px ${color})`
          : cardHovered
          ? `drop-shadow(0 0 8px ${color}80)`
          : "none",
      }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label={checked ? "Uncheck habit" : "Check habit"}
    >
      {/* Track ring */}
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
          stroke={checked ? color : cardHovered ? `${color}80` : "rgba(255,255,255,0.12)"}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={Math.PI * (size - 4)}
          strokeDashoffset={checked ? 0 : Math.PI * (size - 4) * 0.25}
          style={{
            transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
            filter: "none",
          }}
        />
      </svg>

      {/* Fill */}
      <motion.div
        className="absolute inset-1 rounded-full"
        animate={{
          backgroundColor: checked ? color : cardHovered ? `${color}18` : "rgba(255,255,255,0.04)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Check icon */}
      <AnimatePresence>
        {checked && (
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 30 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative z-10"
          >
            <Check size={size * 0.4} color="#fff" strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Pulse wave on check */}
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
    </motion.button>
  );
}

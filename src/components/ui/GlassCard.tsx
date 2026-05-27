"use client";

import { clsx } from "clsx";
import { motion, HTMLMotionProps } from "framer-motion";

type Variant = "default" | "elevated" | "subtle";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: Variant;
  hover?: boolean;
  glow?: boolean;
  glowColor?: string;
}

const variantClasses: Record<Variant, string> = {
  default: "glass rounded-[var(--radius-lg)]",
  elevated: "glass-elevated rounded-[var(--radius-lg)]",
  subtle: "glass-subtle rounded-[var(--radius-md)]",
};

export function GlassCard({
  variant = "default",
  hover = false,
  glow = false,
  glowColor,
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={clsx(
        variantClasses[variant],
        hover && "cursor-pointer transition-all duration-250",
        glow && "glow-accent-sm",
        className
      )}
      whileHover={hover ? { y: -2, scale: 1.005 } : undefined}
      style={glowColor ? { boxShadow: `0 0 20px ${glowColor}40` } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

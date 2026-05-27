"use client";

import { clsx } from "clsx";
import { motion, HTMLMotionProps } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface GlassButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent/20 border border-accent/40 text-accent-light hover:bg-accent/30 hover:border-accent/70 shadow-glow-sm hover:shadow-glow",
  secondary:
    "glass border-white/10 text-white/80 hover:border-white/20 hover:text-white hover:bg-white/10",
  ghost:
    "bg-transparent border-transparent text-white/60 hover:text-white hover:bg-white/5",
  danger:
    "bg-rose/10 border border-rose/30 text-rose hover:bg-rose/20 hover:border-rose/60 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-[var(--radius-sm)]",
  md: "px-4 py-2 text-sm rounded-[var(--radius-md)]",
  lg: "px-6 py-3 text-base rounded-[var(--radius-lg)]",
};

export function GlassButton({
  variant = "secondary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: GlassButtonProps) {
  return (
    <motion.button
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      whileHover={disabled || loading ? {} : { y: -1 }}
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </motion.button>
  );
}

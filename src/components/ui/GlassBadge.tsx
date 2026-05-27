"use client";

import { clsx } from "clsx";

interface GlassBadgeProps {
  label: string;
  color?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}

export function GlassBadge({
  label,
  color = "#7C3AED",
  icon,
  size = "md",
  className,
}: GlassBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-medium rounded-full border",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs",
        className
      )}
      style={{
        backgroundColor: `${color}22`,
        borderColor: `${color}44`,
        color: color,
      }}
    >
      {icon && <span className="w-3 h-3">{icon}</span>}
      {label}
    </span>
  );
}

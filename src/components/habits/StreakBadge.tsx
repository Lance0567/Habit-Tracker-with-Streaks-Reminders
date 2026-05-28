"use client";

import { Flame } from "lucide-react";
import { clsx } from "clsx";

interface StreakBadgeProps {
  count: number;
  size?: "sm" | "md" | "lg";
}

function getGlowIntensity(count: number) {
  if (count >= 100) return { shadow: "0 0 6px rgba(245,158,11,0.95)", scale: 1.2 };
  if (count >= 30) return { shadow: "0 0 5px rgba(245,158,11,0.85)", scale: 1.1 };
  if (count >= 7) return { shadow: "0 0 4px rgba(245,158,11,0.7)", scale: 1.05 };
  return { shadow: "0 0 3px rgba(245,158,11,0.4)", scale: 1 };
}

export function StreakBadge({ count, size = "md" }: StreakBadgeProps) {
  const { shadow, scale } = getGlowIntensity(count);

  const sizeClasses = {
    sm: "gap-1 text-xs",
    md: "gap-1.5 text-sm",
    lg: "gap-2 text-base",
  };
  const iconSize = { sm: 12, md: 14, lg: 18 }[size];
  const containerSize = { sm: 16, md: 18, lg: 24 }[size];

  return (
    <div
      className={clsx("flex items-center font-semibold tabular-nums", sizeClasses[size])}
      style={{ flexShrink: 0 }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: containerSize,
          height: containerSize,
          flexShrink: 0,
        }}
      >
        <Flame
          size={iconSize}
          style={{
            color: "#F59E0B",
            filter: `drop-shadow(${shadow})`,
            transform: `scale(${scale})`,
            transition: "transform 0.3s ease",
          }}
        />
      </span>
      <span style={{ color: "#F59E0B", textShadow: "0 0 6px rgba(0,0,0,0.95)" }}>
        {count}
      </span>
    </div>
  );
}

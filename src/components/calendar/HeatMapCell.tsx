"use client";

import { useState } from "react";
import type { HeatMapDay } from "@/types";

interface HeatMapCellProps {
  day: HeatMapDay;
  color?: string;
  cellSize?: number;
  onHover?: (day: HeatMapDay | null, clientX: number, clientY: number) => void;
}

function getColor(level: 0 | 1 | 2 | 3 | 4, color: string): string {
  switch (level) {
    case 0: return "rgba(255,255,255,0.04)";
    case 1: return `${color}40`;
    case 2: return `${color}70`;
    case 3: return `${color}aa`;
    case 4: return color;
  }
}

export function HeatMapCell({ day, color = "#7C3AED", cellSize = 12, onHover }: HeatMapCellProps) {
  const [hovered, setHovered] = useState(false);
  const fill = getColor(day.level, color);

  return (
    <g
      onMouseEnter={(e) => { setHovered(true); onHover?.(day, e.clientX, e.clientY); }}
      onMouseLeave={() => { setHovered(false); onHover?.(null, 0, 0); }}
      onMouseMove={(e) => hovered && onHover?.(day, e.clientX, e.clientY)}
      style={{ cursor: "default" }}
    >
      <rect
        width={cellSize}
        height={cellSize}
        rx={2}
        fill={fill}
        style={{
          transition: "fill 0.2s ease",
          filter: day.level === 4 ? `drop-shadow(0 0 3px ${color})` : "none",
        }}
      />
      {hovered && (
        <rect
          width={cellSize}
          height={cellSize}
          rx={2}
          fill="rgba(255,255,255,0.08)"
        />
      )}
    </g>
  );
}

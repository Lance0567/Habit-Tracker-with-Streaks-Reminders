"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { HeatMapCell } from "./HeatMapCell";
import type { HeatMapDay } from "@/types";

interface HeatMapProps {
  days: HeatMapDay[];
  color?: string;
  cellSize?: number;
  gap?: number;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function HeatMap({ days, color = "#7C3AED", cellSize = 12, gap = 3 }: HeatMapProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stride = cellSize + gap;
  const [tooltip, setTooltip] = useState<{ day: HeatMapDay; x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleHover = (day: HeatMapDay | null, clientX: number, clientY: number) => {
    setTooltip(day ? { day, x: clientX, y: clientY } : null);
  };

  // Build 52-week grid
  const grid = useMemo(() => {
    const map = new Map(days.map((d) => [d.date, d]));
    const cols: HeatMapDay[][] = [];
    const today = new Date();
    const end = startOfWeek(today, { weekStartsOn: 0 });

    for (let w = 51; w >= 0; w--) {
      const weekStart = addDays(end, -w * 7);
      const col: HeatMapDay[] = [];
      for (let d = 0; d < 7; d++) {
        const date = format(addDays(weekStart, d), "yyyy-MM-dd");
        col.push(map.get(date) ?? { date, count: 0, level: 0 });
      }
      cols.push(col);
    }
    return cols;
  }, [days]);

  // Month labels
  const monthLabels = useMemo(() => {
    const labels: { x: number; label: string }[] = [];
    let lastMonth = -1;
    grid.forEach((col, i) => {
      const month = parseISO(col[0].date).getMonth();
      if (month !== lastMonth) {
        labels.push({ x: i * stride, label: MONTHS[month] });
        lastMonth = month;
      }
    });
    return labels;
  }, [grid, stride]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: 99999, behavior: "instant" });
  }, []);

  const svgWidth = 52 * stride;
  const svgHeight = 7 * stride;

  return (
    <div className="w-full overflow-x-auto" ref={scrollRef}>
      <div style={{ minWidth: svgWidth + 40 }}>
        {/* Month labels */}
        <svg width={svgWidth + 32} height={18} className="ml-8 mb-1">
          {monthLabels.map(({ x, label }) => (
            <text
              key={`${x}-${label}`}
              x={x}
              y={12}
              fontSize={10}
              fill="rgba(255,255,255,0.3)"
              fontFamily="var(--font-inter, system-ui)"
            >
              {label}
            </text>
          ))}
        </svg>

        <div className="flex gap-1">
          {/* Day labels */}
          <svg width={28} height={svgHeight}>
            {[1, 3, 5].map((d) => (
              <text
                key={d}
                x={0}
                y={d * stride + cellSize * 0.8}
                fontSize={9}
                fill="rgba(255,255,255,0.25)"
                fontFamily="var(--font-inter, system-ui)"
              >
                {DAYS[d]}
              </text>
            ))}
          </svg>

          {/* Grid */}
          <svg width={svgWidth} height={svgHeight}>
            {grid.map((col, ci) =>
              col.map((day, ri) => (
                <g key={day.date} transform={`translate(${ci * stride}, ${ri * stride})`}>
                  <HeatMapCell day={day} color={color} cellSize={cellSize} onHover={handleHover} />
                </g>
              ))
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 mt-3 ml-8">
          <span className="text-[10px] text-white/25 mr-1">Less</span>
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <svg key={level} width={cellSize} height={cellSize}>
              <rect
                width={cellSize}
                height={cellSize}
                rx={2}
                fill={
                  level === 0
                    ? "rgba(255,255,255,0.04)"
                    : level === 1 ? `${color}40`
                    : level === 2 ? `${color}70`
                    : level === 3 ? `${color}aa`
                    : color
                }
              />
            </svg>
          ))}
          <span className="text-[10px] text-white/25 ml-1">More</span>
        </div>
      </div>

      {/* Floating tooltip — rendered in document.body via portal to escape CSS transform ancestors */}
      {mounted && tooltip && createPortal(
        <div
          className="fixed z-[9999] pointer-events-none px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y - 48,
            transform: "translateX(-50%)",
            background: "rgba(14,9,36,0.97)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
          }}
        >
          <span className="text-white/45 mr-2">
            {format(parseISO(tooltip.day.date), "EEE, MMM d, yyyy")}
          </span>
          {tooltip.day.count === 0 ? (
            <span className="text-white/25">No completions</span>
          ) : (
            <span style={{ color }}>
              {tooltip.day.count} completion{tooltip.day.count !== 1 ? "s" : ""}
            </span>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

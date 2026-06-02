"use client";

import { useMemo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { getAggregateHeatMapData } from "@/lib/analytics";
import type { HabitLog, Habit } from "@/types";

interface DashboardHeatmapProps {
  logs: HabitLog[];
  habits: Habit[];
  accentColor: string;
}

const WEEKS = 12;
const CELL = 10;
const GAP = 2;
const STRIDE = CELL + GAP;

function buildGrid(): string[][] {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const gridStart = addDays(weekStart, -(WEEKS - 1) * 7);
  return Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) =>
      format(addDays(gridStart, w * 7 + d), "yyyy-MM-dd")
    )
  );
}

function getMonthLabels(grid: string[][]): { weekIdx: number; label: string }[] {
  const labels: { weekIdx: number; label: string }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < grid.length; w++) {
    const month = parseISO(grid[w][0]).getMonth();
    if (month !== lastMonth) {
      labels.push({ weekIdx: w, label: format(parseISO(grid[w][0]), "MMM") });
      lastMonth = month;
    }
  }
  return labels;
}

function cellFill(level: 0 | 1 | 2 | 3 | 4, color: string): string {
  if (level === 0) return "var(--heatmap-empty)";
  if (level === 1) return `${color}40`;
  if (level === 2) return `${color}70`;
  if (level === 3) return `${color}aa`;
  return color;
}

export function DashboardHeatmap({ logs, habits, accentColor }: DashboardHeatmapProps) {
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState<{
    x: number; y: number; date: string; label: string; color: string;
  } | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const grid = useMemo(() => buildGrid(), []);
  const monthLabels = useMemo(() => getMonthLabels(grid), [grid]);

  const aggregateMap = useMemo(() => {
    const data = getAggregateHeatMapData(logs, habits, WEEKS * 7);
    return new Map(data.map((d) => [d.date, d]));
  }, [logs, habits.length]);

  const gridW = WEEKS * STRIDE - GAP;

  function onEnter(e: React.MouseEvent, date: string, label: string, color: string) {
    setTooltip({ x: e.clientX, y: e.clientY, date, label, color });
  }
  function onLeave() { setTooltip(null); }

  return (
    <div
      className="rounded-[var(--radius-lg)] p-4"
      style={{
        background: "var(--glass-bg-default)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid var(--glass-border)",
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
        Last 12 Weeks
      </p>

      {/* Month labels */}
      <div className="relative mb-1" style={{ height: 14, width: gridW }}>
        {monthLabels.map(({ weekIdx, label }) => (
          <span
            key={`${weekIdx}-${label}`}
            className="absolute text-[9px] font-medium"
            style={{ left: weekIdx * STRIDE, color: "var(--heatmap-label)", lineHeight: "14px" }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${WEEKS}, ${CELL}px)`,
          gridTemplateRows: `repeat(7, ${CELL}px)`,
          gap: GAP,
          width: gridW,
        }}
      >
        {grid.flatMap((week, wi) =>
          week.map((date, di) => {
            const day = aggregateMap.get(date) ?? { date, count: 0, level: 0 as const };
            const isFuture = date > todayStr;
            const isToday = date === todayStr;
            return (
              <div
                key={date}
                style={{
                  gridColumn: wi + 1,
                  gridRow: di + 1,
                  width: CELL,
                  height: CELL,
                  borderRadius: 2,
                  background: isFuture ? "var(--heatmap-empty)" : cellFill(day.level, accentColor),
                  opacity: isFuture ? 0.25 : 1,
                  outline: isToday ? "1.5px solid rgba(255,255,255,0.55)" : "none",
                  outlineOffset: 1,
                }}
                onMouseEnter={(e) => {
                  if (isFuture) return;
                  const total = habits.length;
                  const label = day.count === 0
                    ? "No habits done"
                    : `${day.count} of ${total} habit${total !== 1 ? "s" : ""}`;
                  onEnter(e, date, label, day.count === 0 ? "var(--text-muted)" : accentColor);
                }}
                onMouseLeave={onLeave}
              />
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Less</span>
        {([0, 1, 2, 3, 4] as const).map((level) => (
          <div
            key={level}
            style={{ width: CELL, height: CELL, borderRadius: 2, background: cellFill(level, accentColor) }}
          />
        ))}
        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>More</span>
      </div>

      {/* Tooltip portal */}
      {mounted && tooltip && createPortal(
        <div
          className="fixed z-[9999] pointer-events-none px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y - 46,
            transform: "translateX(-50%)",
            background: "var(--glass-bg-elevated)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid var(--glass-border)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}
        >
          <span className="mr-2" style={{ color: "var(--text-muted)" }}>
            {format(parseISO(tooltip.date), "EEE, MMM d")}
          </span>
          <span style={{ color: tooltip.color }}>{tooltip.label}</span>
        </div>,
        document.body
      )}
    </div>
  );
}

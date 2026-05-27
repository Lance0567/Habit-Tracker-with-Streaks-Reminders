"use client";

import type React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  type TooltipProps,
} from "recharts";

const TOOLTIP_STYLE: React.CSSProperties = {
  background: "rgba(10, 7, 28, 0.97)",
  border: "1px solid rgba(124, 58, 237, 0.28)",
  borderRadius: 10,
  padding: "8px 12px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
};

const FALLBACK_DATA = [
  { day: "Mon", h1: 1, h2: 1, h3: 0, h4: 1 },
  { day: "Tue", h1: 0, h2: 1, h3: 1, h4: 1 },
  { day: "Wed", h1: 1, h2: 1, h3: 1, h4: 0 },
  { day: "Thu", h1: 1, h2: 0, h3: 1, h4: 1 },
  { day: "Fri", h1: 1, h2: 1, h3: 0, h4: 1 },
  { day: "Sat", h1: 0, h2: 1, h3: 1, h4: 1 },
  { day: "Sun", h1: 1, h2: 1, h3: 1, h4: 1 },
];

const FALLBACK_HABITS = [
  { key: "h1", color: "#F59E0B", label: "Morning Run" },
  { key: "h2", color: "#8B5CF6", label: "Meditate" },
  { key: "h3", color: "#3B82F6", label: "Read" },
  { key: "h4", color: "#06B6D4", label: "Water" },
];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE}>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginBottom: 6 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey as string} style={{ color: p.color as string, fontSize: 12, marginBottom: 2, fontWeight: 500 }}>
          {p.name}: {p.value ? "✓" : "✗"}
        </p>
      ))}
    </div>
  );
}

interface HabitLine {
  key: string;
  color: string;
  label: string;
}

interface Props {
  data?: { day: string; [key: string]: number | string }[];
  habits?: HabitLine[];
}

export function TrendLineChart({ data, habits }: Props) {
  const chartData = data && data.length > 0 ? data : FALLBACK_DATA;
  const lines = habits && habits.length > 0 ? habits : FALLBACK_HABITS;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[-0.1, 1.1]} ticks={[0, 1]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
          formatter={(value) => <span style={{ color: "rgba(255,255,255,0.4)" }}>{value}</span>}
        />
        {lines.map(({ key, color, label }) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            name={label}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 5, stroke: color, fill: color }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

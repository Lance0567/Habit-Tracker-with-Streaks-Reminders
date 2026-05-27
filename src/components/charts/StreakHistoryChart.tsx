"use client";

import type React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  type TooltipProps,
} from "recharts";

const TOOLTIP_STYLE: React.CSSProperties = {
  background: "rgba(10, 7, 28, 0.97)",
  border: "1px solid rgba(124, 58, 237, 0.28)",
  borderRadius: 10,
  padding: "8px 12px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
};

const FALLBACK = [
  { name: "Jan", streak: 14 }, { name: "Feb", streak: 21 },
  { name: "Mar", streak: 7 },  { name: "Apr", streak: 31 },
  { name: "May", streak: 18 }, { name: "Jun", streak: 45 },
];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE}>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#F59E0B", fontWeight: 600, fontSize: 12 }}>{payload[0].value} completions</p>
    </div>
  );
}

interface Props {
  data?: { name: string; streak: number }[];
}

export function StreakHistoryChart({ data }: Props) {
  const chartData = data && data.length > 0 ? data : FALLBACK;
  const maxVal = Math.max(...chartData.map((d) => d.streak));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="streak" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell
              key={`cell-${i}`}
              fill={entry.streak === maxVal ? "#F59E0B" : "#7C3AED"}
              opacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

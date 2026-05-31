"use client";

import type React from "react";
import { TrendingUp } from "lucide-react";
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
  background: "var(--popup-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--popup-border)",
  borderRadius: 10,
  padding: "8px 12px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
};

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE}>
      <p style={{ color: "var(--text-muted)", fontSize: 10, marginBottom: 6 }}>{label}</p>
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
  if (!habits || habits.length === 0 || !data || data.length === 0) {
    return (
      <div className="h-[220px] flex flex-col items-center justify-center gap-2">
        <TrendingUp size={28} style={{ color: "var(--text-muted)", opacity: 0.35 }} />
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>No data yet</p>
        <p className="text-xs" style={{ color: "var(--text-muted)", opacity: 0.6 }}>Add habits and check in to see daily trends</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--divider)" />
        <XAxis dataKey="day" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[-0.1, 1.1]} ticks={[0, 1]} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
          formatter={(value) => <span style={{ color: "var(--text-secondary)" }}>{value}</span>}
        />
        {habits.map(({ key, color, label }) => (
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

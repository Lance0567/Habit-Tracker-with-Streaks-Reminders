"use client";

import type React from "react";
import { BarChart2 } from "lucide-react";
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
      <p style={{ color: "var(--text-muted)", fontSize: 10, marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#F59E0B", fontWeight: 600, fontSize: 12 }}>{payload[0].value} completions</p>
    </div>
  );
}

interface Props {
  data?: { name: string; streak: number }[];
}

export function StreakHistoryChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[200px] flex flex-col items-center justify-center gap-2">
        <BarChart2 size={28} style={{ color: "var(--text-muted)", opacity: 0.35 }} />
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>No data yet</p>
        <p className="text-xs" style={{ color: "var(--text-muted)", opacity: 0.6 }}>Complete habits to see monthly totals</p>
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.streak));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--divider)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="streak" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={`cell-${i}`}
              fill={entry.streak === maxVal ? "#F59E0B" : "var(--color-accent)"}
              opacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

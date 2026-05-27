"use client";

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

const FALLBACK = [
  { name: "Jan", streak: 14 }, { name: "Feb", streak: 21 },
  { name: "Mar", streak: 7 },  { name: "Apr", streak: 31 },
  { name: "May", streak: 18 }, { name: "Jun", streak: 45 },
];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-elevated rounded-[var(--radius-md)] px-3 py-2 border border-white/10 text-xs">
      <p className="text-white/50 mb-1">{label}</p>
      <p className="text-amber font-semibold">{payload[0].value} completions</p>
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

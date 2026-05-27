"use client";

import type React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  { week: "W1", rate: 72 }, { week: "W2", rate: 85 }, { week: "W3", rate: 68 },
  { week: "W4", rate: 91 }, { week: "W5", rate: 78 }, { week: "W6", rate: 88 },
  { week: "W7", rate: 75 }, { week: "W8", rate: 93 }, { week: "W9", rate: 82 },
  { week: "W10", rate: 87 }, { week: "W11", rate: 90 }, { week: "W12", rate: 95 },
];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE}>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginBottom: 4 }}>{label}</p>
      <p style={{ color: "#A78BFA", fontWeight: 600, fontSize: 12 }}>{payload[0].value}% completed</p>
    </div>
  );
}

interface Props {
  data?: { week: string; rate: number }[];
}

export function CompletionRateChart({ data }: Props) {
  const chartData = data && data.length > 0 ? data : FALLBACK;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="rate"
          stroke="#7C3AED"
          strokeWidth={2}
          fill="url(#rateGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "#7C3AED", stroke: "#A78BFA", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

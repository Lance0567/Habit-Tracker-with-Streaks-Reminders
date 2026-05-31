"use client";

import type React from "react";
import { TrendingUp } from "lucide-react";
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
      <p style={{ color: "var(--color-accent-light)", fontWeight: 600, fontSize: 12 }}>{payload[0].value}% completed</p>
    </div>
  );
}

interface Props {
  data?: { week: string; rate: number }[];
}

export function CompletionRateChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[200px] flex flex-col items-center justify-center gap-2">
        <TrendingUp size={28} style={{ color: "var(--text-muted)", opacity: 0.35 }} />
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>No data yet</p>
        <p className="text-xs" style={{ color: "var(--text-muted)", opacity: 0.6 }}>Complete habits to see your weekly rate</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--divider)" />
        <XAxis dataKey="week" tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="rate"
          stroke="var(--color-accent)"
          strokeWidth={2}
          fill="url(#rateGrad)"
          dot={false}
          activeDot={{ r: 4, fill: "var(--color-accent)", stroke: "var(--color-accent-light)", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

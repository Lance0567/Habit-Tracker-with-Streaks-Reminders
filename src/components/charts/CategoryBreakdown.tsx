"use client";

import type React from "react";
import { Target } from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
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

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE}>
      <p style={{ color: "var(--text-muted)", fontSize: 10, marginBottom: 4 }}>{payload[0].payload.category}</p>
      <p style={{ color: "var(--color-accent-light)", fontWeight: 600, fontSize: 12 }}>{payload[0].value}%</p>
    </div>
  );
}

interface Props {
  data?: { category: string; value: number }[];
}

export function CategoryBreakdown({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[220px] flex flex-col items-center justify-center gap-2">
        <Target size={28} style={{ color: "var(--text-muted)", opacity: 0.35 }} />
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>No categories yet</p>
        <p className="text-xs" style={{ color: "var(--text-muted)", opacity: 0.6 }}>Add habits with categories to see breakdown</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="var(--divider)" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: "var(--text-muted)", fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Radar
          dataKey="value"
          stroke="var(--color-accent)"
          fill="var(--color-accent)"
          fillOpacity={0.2}
          strokeWidth={2}
          dot={{ fill: "var(--color-accent-light)", r: 3 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

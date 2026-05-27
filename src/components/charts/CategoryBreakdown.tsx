"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from "recharts";

const FALLBACK = [
  { category: "Health", value: 82 },
  { category: "Work", value: 75 },
  { category: "Mindfulness", value: 91 },
  { category: "Fitness", value: 68 },
];

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-elevated rounded-[var(--radius-md)] px-3 py-2 border border-white/10 text-xs">
      <p className="text-white/50">{payload[0].payload.category}</p>
      <p className="text-accent-light font-semibold">{payload[0].value}%</p>
    </div>
  );
}

interface Props {
  data?: { category: string; value: number }[];
}

export function CategoryBreakdown({ data }: Props) {
  const chartData = data && data.length > 0 ? data : FALLBACK;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Radar
          dataKey="value"
          stroke="#7C3AED"
          fill="#7C3AED"
          fillOpacity={0.2}
          strokeWidth={2}
          dot={{ fill: "#A78BFA", r: 3 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

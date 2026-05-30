"use client";

import { clsx } from "clsx";
import { DAYS_OF_WEEK } from "@/lib/constants";
import type { HabitFrequency } from "@/types";

interface FrequencySelectorProps {
  value: HabitFrequency;
  onChange: (v: HabitFrequency) => void;
  customDays?: number[];
  onCustomDaysChange?: (days: number[]) => void;
}

const freqOptions: { value: HabitFrequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
  { value: "custom", label: "Custom" },
];

export function FrequencySelector({
  value,
  onChange,
  customDays = [],
  onCustomDaysChange,
}: FrequencySelectorProps) {
  const toggleDay = (day: number) => {
    if (!onCustomDaysChange) return;
    const next = customDays.includes(day)
      ? customDays.filter((d) => d !== day)
      : [...customDays, day];
    onCustomDaysChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 flex-wrap">
        {freqOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={clsx(
              "px-4 py-2 text-sm rounded-[var(--radius-md)] border transition-all duration-200",
              value === opt.value
                ? "bg-accent/20 border-accent/50 text-accent-light shadow-glow-sm"
                : "glass border-[var(--glass-border)] text-[var(--text-muted)] hover:border-[var(--glass-border-hover)] hover:text-[var(--text-secondary)]"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {value === "custom" && (
        <div className="flex gap-2">
          {DAYS_OF_WEEK.map((day, i) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(i)}
              className={clsx(
                "w-10 h-10 text-xs font-medium rounded-full border transition-all duration-200",
                customDays.includes(i)
                  ? "bg-accent/25 border-accent/50 text-accent-light shadow-glow-sm"
                  : "glass border-[var(--glass-border)] text-[var(--text-muted)] hover:border-[var(--glass-border-hover)]"
              )}
            >
              {day[0]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

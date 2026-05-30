"use client";

import { Plus, Trash2, Clock } from "lucide-react";
import { GlassInput } from "@/components/ui/GlassInput";
import type { Reminder } from "@/types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  reminders: Reminder[];
  onChange: (reminders: Reminder[]) => void;
}

export function ReminderForm({ reminders, onChange }: Props) {
  function addReminder() {
    onChange([
      ...reminders,
      { id: crypto.randomUUID(), time: "09:00", days: [], enabled: true },
    ]);
  }

  function remove(id: string) {
    onChange(reminders.filter((r) => r.id !== id));
  }

  function updateTime(id: string, time: string) {
    onChange(reminders.map((r) => (r.id === id ? { ...r, time } : r)));
  }

  function toggleDay(id: string, dow: number) {
    onChange(
      reminders.map((r) => {
        if (r.id !== id) return r;
        const days = r.days.includes(dow)
          ? r.days.filter((d) => d !== dow)
          : [...r.days, dow];
        return { ...r, days };
      })
    );
  }

  function toggleEnabled(id: string) {
    onChange(reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <label
          className="text-xs font-semibold uppercase tracking-[0.2em] flex items-center gap-1.5"
          style={{ color: "var(--text-muted)" }}
        >
          <Clock size={11} /> Reminders
        </label>
        <button
          type="button"
          onClick={addReminder}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all duration-150 focus:outline-none"
          style={{
            background: "var(--glass-bg-subtle)",
            border: "1px solid var(--glass-border-hover)",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-accent-light)";
            e.currentTarget.style.borderColor = "var(--color-accent)";
            e.currentTarget.style.background = "rgba(124,58,237,0.10)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.borderColor = "var(--glass-border-hover)";
            e.currentTarget.style.background = "var(--glass-bg-subtle)";
          }}
        >
          <Plus size={11} /> Add
        </button>
      </div>

      {/* Empty state */}
      {reminders.length === 0 && (
        <p className="text-xs text-center py-3" style={{ color: "var(--text-muted)" }}>
          No reminders set
        </p>
      )}

      {/* Reminder rows */}
      {reminders.map((r) => (
        <div
          key={r.id}
          className="rounded-[var(--radius-md)] p-3 space-y-2.5 transition-all duration-200"
          style={{
            background: "var(--glass-bg-subtle)",
            border: `1px solid ${r.enabled ? "var(--glass-border-hover)" : "var(--glass-border)"}`,
            opacity: r.enabled ? 1 : 0.6,
          }}
        >
          {/* Time + on/off + delete */}
          <div className="flex items-center gap-2">
            <GlassInput
              type="time"
              value={r.time}
              onChange={(e) => updateTime(r.id, e.target.value)}
              className="flex-1 text-sm"
            />
            <button
              type="button"
              onClick={() => toggleEnabled(r.id)}
              className="text-xs px-2.5 py-1 rounded-md font-semibold transition-all duration-150 focus:outline-none flex-shrink-0"
              style={
                r.enabled
                  ? {
                      background: "rgba(124,58,237,0.15)",
                      border: "1px solid rgba(124,58,237,0.40)",
                      color: "var(--color-accent-light)",
                    }
                  : {
                      background: "var(--glass-bg-default)",
                      border: "1px solid var(--glass-border)",
                      color: "var(--text-muted)",
                    }
              }
            >
              {r.enabled ? "On" : "Off"}
            </button>
            <button
              type="button"
              onClick={() => remove(r.id)}
              className="p-1.5 rounded-lg transition-colors focus:outline-none flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F43F5E")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Day pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {DAY_LABELS.map((label, dow) => {
              const isOn = r.days.includes(dow);
              return (
                <button
                  key={dow}
                  type="button"
                  onClick={() => toggleDay(r.id, dow)}
                  className="w-8 h-7 rounded-md text-[10px] font-medium transition-all duration-150 focus:outline-none"
                  style={
                    isOn
                      ? {
                          background: "rgba(124,58,237,0.18)",
                          border: "1px solid rgba(124,58,237,0.45)",
                          color: "var(--color-accent-light)",
                        }
                      : {
                          background: "var(--glass-bg-default)",
                          border: "1px solid var(--glass-border)",
                          color: "var(--text-muted)",
                        }
                  }
                >
                  {label}
                </button>
              );
            })}
            {r.days.length === 0 && (
              <span className="text-[10px] ml-1" style={{ color: "var(--text-muted)" }}>
                Every day
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

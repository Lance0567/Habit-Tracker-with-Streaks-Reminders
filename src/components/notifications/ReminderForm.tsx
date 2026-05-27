"use client";

import { Plus, Trash2, Clock } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
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
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-white/50 uppercase tracking-wider flex items-center gap-1.5">
          <Clock size={11} /> Reminders
        </label>
        <GlassButton variant="ghost" size="sm" onClick={addReminder} type="button">
          <Plus size={12} /> Add
        </GlassButton>
      </div>

      {reminders.length === 0 && (
        <p className="text-xs text-white/25 text-center py-3">No reminders set</p>
      )}

      {reminders.map((r) => (
        <div
          key={r.id}
          className={`glass rounded-[var(--radius-md)] p-3 space-y-2.5 border transition-opacity ${
            r.enabled ? "border-white/10" : "border-white/5 opacity-60"
          }`}
        >
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
              className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                r.enabled
                  ? "border-accent/40 text-accent bg-accent/10"
                  : "border-white/10 text-white/35"
              }`}
            >
              {r.enabled ? "On" : "Off"}
            </button>
            <button
              type="button"
              onClick={() => remove(r.id)}
              className="text-danger/60 hover:text-danger transition-colors p-1"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {DAY_LABELS.map((label, dow) => (
              <button
                key={dow}
                type="button"
                onClick={() => toggleDay(r.id, dow)}
                className={`w-8 h-7 rounded-md text-[10px] font-medium transition-all border ${
                  r.days.includes(dow)
                    ? "bg-accent/20 border-accent/40 text-accent"
                    : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/50"
                }`}
              >
                {label}
              </button>
            ))}
            {r.days.length === 0 && (
              <span className="text-[10px] text-white/25 ml-1">Every day</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  X,
  Repeat,
  Briefcase,
  Sun,
  SlidersHorizontal,
  Bell,
  ChevronDown,
} from "lucide-react";
import { ReminderForm } from "@/components/notifications/ReminderForm";
import { useCategories } from "@/hooks/useCategories";
import { useHabitStore } from "@/store/habitStore";
import { useUIStore } from "@/store/uiStore";
import type { Habit, HabitFrequency, Reminder } from "@/types";
import { HABIT_COLORS } from "@/lib/constants";

const FREQ_OPTIONS: { value: HabitFrequency; icon: LucideIcon; label: string; sub: string }[] = [
  { value: "daily",    icon: Repeat,            label: "Daily",    sub: "Every day"  },
  { value: "weekdays", icon: Briefcase,          label: "Weekdays", sub: "Mon – Fri"  },
  { value: "weekends", icon: Sun,                label: "Weekends", sub: "Sat & Sun"  },
  { value: "custom",   icon: SlidersHorizontal,  label: "Custom",   sub: "You choose" },
];

const CUSTOM_DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

const COLOR_NAMES: Record<string, string> = {
  "#7C3AED": "Purple", "#06B6D4": "Cyan",   "#10B981": "Emerald", "#F59E0B": "Amber",
  "#F43F5E": "Rose",   "#EC4899": "Pink",   "#3B82F6": "Blue",    "#F97316": "Orange",
  "#8B5CF6": "Violet", "#14B8A6": "Teal",   "#84CC16": "Lime",    "#EF4444": "Red",
};

function HabitForm({ onClose }: { onClose: () => void }) {
  const { categories } = useCategories();
  const { addHabit } = useHabitStore();
  const addToast = useUIStore((s) => s.addToast);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [color, setColor] = useState("#7C3AED");
  const [frequency, setFrequency] = useState<HabitFrequency>("daily");
  const [customDays, setCustomDays] = useState<number[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [saving, setSaving] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [showReminders, setShowReminders] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const habit: Habit = {
        id: crypto.randomUUID(),
        name: name.trim(),
        description: description.trim(),
        categoryId,
        icon: "Star",
        color,
        frequency,
        customDays: frequency === "custom" ? customDays : undefined,
        targetCount: 1,
        unit: "times",
        reminders,
        archived: false,
        createdAt: now,
        updatedAt: now,
      };
      await addHabit(habit);
      addToast(`"${habit.name}" added`, "success");
      onClose();
    } catch {
      addToast("Failed to save habit. Please try again.", "error");
      setSaving(false);
    }
  };

  const toggleCustomDay = (idx: number) => {
    setCustomDays((prev) =>
      prev.includes(idx) ? prev.filter((d) => d !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="space-y-7 p-6 overflow-y-auto max-h-[80vh]">
      {/* Zone 1: Name Entry */}
      <div className="space-y-3">
        <div
          className="relative pb-2"
          style={{
            borderBottom: `2px solid ${color}`,
            filter: `drop-shadow(0 2px 8px ${color}55)`,
          }}
        >
          <input
            type="text"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && name.trim() && handleCreate()}
            placeholder="Name this habit..."
            maxLength={50}
            className="w-full bg-transparent border-none outline-none text-3xl font-black tracking-tight"
            style={{
              color: name ? color : "var(--text-muted)",
              caretColor: color,
            }}
          />
          {name.length > 35 && (
            <span
              className="absolute right-0 bottom-3 text-[10px] font-mono"
              style={{ color: name.length >= 50 ? "#F43F5E" : "var(--text-muted)" }}
            >
              {name.length}/50
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <motion.div
            animate={{ borderColor: color, color }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
            style={{ borderColor: color, color, background: `${color}12` }}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
            {name || "Your habit"} · {frequency}
          </motion.div>
          <button
            type="button"
            onClick={() => setShowDesc((v) => !v)}
            className="text-xs transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            {showDesc ? "− description" : "+ description"}
          </button>
        </div>

        <AnimatePresence>
          {showDesc && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this habit mean to you?"
                rows={2}
                className="w-full rounded-lg p-3 text-sm outline-none resize-none transition-colors mt-1"
                style={{
                  background: "var(--glass-bg-subtle)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-primary)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Zone 2: Color & Category */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Color</p>
          <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Habit colour">
            {HABIT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={COLOR_NAMES[c] ?? c}
                aria-pressed={color === c}
                className="rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1"
                style={{
                  aspectRatio: "1",
                  backgroundColor: c,
                  transform: color === c ? "scale(1.2)" : "scale(1)",
                  filter: color === c ? `drop-shadow(0 0 8px ${c})` : "none",
                  outline: color === c ? `2px solid ${c}` : "2px solid transparent",
                  outlineOffset: "2px",
                }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Category</p>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(isSelected ? null : cat.id)}
                  className="text-xs px-2.5 py-1 rounded-full transition-all duration-200 font-medium"
                  style={
                    isSelected
                      ? { background: `${cat.color}22`, border: `1px solid ${cat.color}`, color: cat.color }
                      : { background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }
                  }
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Zone 3: Frequency */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>Frequency</p>
        <div className="grid grid-cols-4 gap-2">
          {FREQ_OPTIONS.map(({ value, icon: Icon, label, sub }) => {
            const isSelected = frequency === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFrequency(value)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 text-center"
                style={{
                  background: isSelected ? `${color}18` : "var(--glass-bg-subtle)",
                  border: `1px solid ${isSelected ? color : "var(--glass-border)"}`,
                }}
              >
                <Icon size={18} style={{ color: isSelected ? color : "var(--text-muted)" }} />
                <span
                  className="text-xs font-semibold leading-none"
                  style={{ color: isSelected ? "var(--text-primary)" : "var(--text-secondary)" }}
                >
                  {label}
                </span>
                <span
                  className="text-[10px] leading-none"
                  style={{ color: isSelected ? `${color}cc` : "var(--text-muted)" }}
                >
                  {sub}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {frequency === "custom" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex gap-1.5 pt-1">
                {CUSTOM_DAY_LABELS.map((label, idx) => {
                  const isOn = customDays.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleCustomDay(idx)}
                      className="flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                      style={{
                        background: isOn ? `${color}30` : "var(--glass-bg-subtle)",
                        border: `1px solid ${isOn ? color : "var(--glass-border)"}`,
                        color: isOn ? color : "var(--text-muted)",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Zone 4: Reminders */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowReminders((v) => !v)}
          className="flex items-center justify-between w-full group"
        >
          <div className="flex items-center gap-2">
            <Bell size={13} style={{ color: "var(--text-muted)" }} className="group-hover:opacity-80 transition-opacity" />
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em] group-hover:opacity-80 transition-opacity"
              style={{ color: "var(--text-muted)" }}
            >
              Reminders
            </span>
            {reminders.length > 0 && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: `${color}25`, color }}
              >
                {reminders.length}
              </span>
            )}
          </div>
          <motion.div animate={{ rotate: showReminders ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
          </motion.div>
        </button>

        <AnimatePresence>
          {showReminders && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="pt-1">
                <ReminderForm reminders={reminders} onChange={setReminders} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Zone 5: CTA */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 rounded-xl text-sm font-semibold transition-colors"
          style={{
            background: "var(--glass-bg-subtle)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={!name.trim() || saving}
          className="flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed"
          style={
            name.trim()
              ? {
                  background: color,
                  color: "#ffffff",
                  boxShadow: `0 4px 16px ${color}55`,
                  border: "1px solid transparent",
                  opacity: saving ? 0.65 : 1,
                }
              : {
                  background: "var(--glass-bg-default)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--glass-border-hover)",
                  boxShadow: "none",
                  opacity: 1,
                }
          }
        >
          {saving ? "Creating…" : "Create Habit"}
        </button>
      </div>
    </div>
  );
}

export function NewHabitModal() {
  const open = useUIStore((s) => s.newHabitOpen);
  const setOpen = useUIStore((s) => s.setNewHabitOpen);
  const close = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            onClick={close}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
          >
            <div
              className="w-full max-w-lg rounded-2xl pointer-events-auto flex flex-col"
              style={{
                background: "var(--glass-bg-elevated)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                border: "1px solid var(--glass-border)",
                boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
                maxHeight: "90vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header — always visible, never scrolls */}
              <div
                className="flex items-center justify-between px-6 py-3 flex-shrink-0"
                style={{ borderBottom: "1px solid var(--divider)" }}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                  New Habit
                </span>
                <button
                  onClick={close}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ background: "var(--glass-bg-subtle)", color: "var(--text-muted)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                >
                  <X size={15} />
                </button>
              </div>

              <HabitForm onClose={close} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

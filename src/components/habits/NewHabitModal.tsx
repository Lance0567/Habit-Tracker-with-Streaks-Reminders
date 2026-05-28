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

function HabitForm({ onClose }: { onClose: () => void }) {
  const { categories } = useCategories();
  const { addHabit } = useHabitStore();

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
    onClose();
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
            className="w-full bg-transparent border-none outline-none text-3xl font-black tracking-tight"
            style={{
              color: name ? color : "rgba(255,255,255,0.15)",
              caretColor: color,
            }}
          />
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
            className="text-xs text-white/25 hover:text-white/55 transition-colors"
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
                className="w-full rounded-lg p-3 text-sm text-white/70 placeholder:text-white/20 outline-none resize-none transition-colors mt-1"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Zone 2: Color & Category */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">Color</p>
          <div className="grid grid-cols-4 gap-2">
            {HABIT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="rounded-full transition-all duration-200"
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">Category</p>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const isSelected = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(isSelected ? null : cat.id)}
                  className="text-xs px-2.5 py-1 rounded-full transition-all duration-200 font-medium"
                  style={{
                    background: isSelected ? `${cat.color}22` : "rgba(255,255,255,0.06)",
                    border: `1px solid ${isSelected ? cat.color : "rgba(255,255,255,0.10)"}`,
                    color: isSelected ? cat.color : "rgba(255,255,255,0.45)",
                  }}
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">Frequency</p>
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
                  background: isSelected ? `${color}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isSelected ? color : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <Icon size={18} style={{ color: isSelected ? color : "rgba(255,255,255,0.35)" }} />
                <span
                  className="text-xs font-semibold leading-none"
                  style={{ color: isSelected ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.45)" }}
                >
                  {label}
                </span>
                <span
                  className="text-[10px] leading-none"
                  style={{ color: isSelected ? `${color}cc` : "rgba(255,255,255,0.22)" }}
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
                        background: isOn ? `${color}30` : "rgba(255,255,255,0.05)",
                        border: `1px solid ${isOn ? color : "rgba(255,255,255,0.08)"}`,
                        color: isOn ? color : "rgba(255,255,255,0.28)",
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
            <Bell size={13} className="text-white/30 group-hover:text-white/55 transition-colors" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 group-hover:text-white/55 transition-colors">
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
            <ChevronDown size={14} className="text-white/25" />
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
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-white/40 hover:text-white/70 transition-colors"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          Cancel
        </button>
        <motion.button
          type="button"
          onClick={handleCreate}
          disabled={!name.trim() || saving}
          animate={{
            background: name.trim() ? color : "rgba(255,255,255,0.08)",
            filter: name.trim() ? `drop-shadow(0 4px 16px ${color}55)` : "none",
          }}
          transition={{ duration: 0.3 }}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Creating…" : "Create Habit"}
        </motion.button>
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
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
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
              className="relative w-full max-w-lg rounded-2xl pointer-events-auto"
              style={{
                background: "rgba(14, 9, 36, 0.96)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={close}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-white/30 hover:text-white/70 transition-colors"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <X size={15} />
              </button>

              <HabitForm onClose={close} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

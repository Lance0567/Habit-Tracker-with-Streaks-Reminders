"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ReminderForm } from "@/components/notifications/ReminderForm";
import { useCategories } from "@/hooks/useCategories";
import { useHabitStore } from "@/store/habitStore";
import type { Habit, HabitFrequency, Reminder } from "@/types";
import { HABIT_COLORS } from "@/lib/constants";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Repeat,
  Briefcase,
  Sun,
  SlidersHorizontal,
  Bell,
  ChevronDown,
} from "lucide-react";

const FREQ_OPTIONS: {
  value: HabitFrequency;
  icon: LucideIcon;
  label: string;
  sub: string;
}[] = [
  { value: "daily", icon: Repeat, label: "Daily", sub: "Every day" },
  { value: "weekdays", icon: Briefcase, label: "Weekdays", sub: "Mon – Fri" },
  { value: "weekends", icon: Sun, label: "Weekends", sub: "Sat & Sun" },
  { value: "custom", icon: SlidersHorizontal, label: "Custom", sub: "You choose" },
];

const CUSTOM_DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export default function NewHabitPage() {
  const router = useRouter();
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
    router.push("/habits");
  };

  const toggleCustomDay = (idx: number) => {
    setCustomDays((prev) =>
      prev.includes(idx) ? prev.filter((d) => d !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="max-w-xl space-y-8">
      {/* Zone 1: Name Entry */}
      <div className="space-y-6">
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => router.back()}
            className="p-2 rounded-[var(--radius-md)] text-white/40 hover:text-white/70 transition-colors"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            New Habit
          </span>
        </motion.div>

        {/* Giant name input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="space-y-3"
        >
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
              placeholder="Name this habit..."
              className="w-full bg-transparent border-none outline-none text-4xl font-black tracking-tight"
              style={{
                color: name ? color : "rgba(255,255,255,0.15)",
                caretColor: color,
              }}
            />
          </div>

          {/* Live preview chip + description toggle */}
          <div className="flex items-center gap-3 flex-wrap">
            <motion.div
              animate={{ borderColor: color, color }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
              style={{ borderColor: color, color, background: `${color}12` }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
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

          {/* Collapsible description */}
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
                  rows={3}
                  className="w-full rounded-lg p-3 text-sm text-white/70 placeholder:text-white/20 outline-none resize-none transition-colors mt-1"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.20)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Zone 2: Color & Category */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="grid grid-cols-2 gap-6"
      >
        {/* Color */}
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

        {/* Category */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            Category
          </p>
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
      </motion.div>

      {/* Zone 3: Frequency */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
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
                <Icon
                  size={18}
                  style={{ color: isSelected ? color : "rgba(255,255,255,0.35)" }}
                />
                <span
                  className="text-xs font-semibold leading-none"
                  style={{
                    color: isSelected ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.45)",
                  }}
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

        {/* Custom day toggles */}
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
      </motion.div>

      {/* Zone 4: Reminders */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
        className="space-y-2"
      >
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
      </motion.div>

      {/* Zone 5: CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="flex gap-3 pb-4"
      >
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-white/40 hover:text-white/70 transition-colors"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
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
      </motion.div>
    </div>
  );
}

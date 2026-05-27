"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput, GlassTextarea } from "@/components/ui/GlassInput";
import { FrequencySelector } from "@/components/habits/FrequencySelector";
import { CategoryFilter } from "@/components/categories/CategoryFilter";
import { ReminderForm } from "@/components/notifications/ReminderForm";
import { useCategories } from "@/hooks/useCategories";
import { useHabitStore } from "@/store/habitStore";
import type { Habit, HabitFrequency, Reminder } from "@/types";
import { HABIT_COLORS } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";

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

  return (
    <div className="max-w-xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={() => router.back()}
          className="p-2 glass rounded-[var(--radius-md)] text-white/40 hover:text-white/80 transition-all border border-white/8"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white/90">New Habit</h2>
          <p className="text-sm text-white/35">Build something that lasts</p>
        </div>
      </motion.div>

      <GlassCard className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Basic Info</h3>
        <GlassInput
          label="Habit Name"
          placeholder="Morning Run, Meditate, Read..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <GlassTextarea
          label="Description (optional)"
          placeholder="What does this habit mean to you?"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </GlassCard>

      <GlassCard className="p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Color</h3>
        <div className="flex flex-wrap gap-2">
          {HABIT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="w-8 h-8 rounded-full border-2 transition-all duration-200"
              style={{
                backgroundColor: c,
                borderColor: color === c ? "#fff" : "transparent",
                boxShadow: color === c ? `0 0 10px ${c}` : "none",
                transform: color === c ? "scale(1.15)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Category</h3>
        <CategoryFilter
          categories={categories}
          selected={categoryId}
          onSelect={setCategoryId}
        />
      </GlassCard>

      <GlassCard className="p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Frequency</h3>
        <FrequencySelector
          value={frequency}
          onChange={setFrequency}
          customDays={customDays}
          onCustomDaysChange={setCustomDays}
        />
      </GlassCard>

      <GlassCard className="p-5">
        <ReminderForm reminders={reminders} onChange={setReminders} />
      </GlassCard>

      <div className="flex gap-3">
        <GlassButton variant="secondary" onClick={() => router.back()} className="flex-1">
          Cancel
        </GlassButton>
        <GlassButton
          variant="primary"
          className="flex-1"
          disabled={!name.trim() || saving}
          onClick={handleCreate}
        >
          {saving ? "Creating…" : "Create Habit"}
        </GlassButton>
      </div>
    </div>
  );
}

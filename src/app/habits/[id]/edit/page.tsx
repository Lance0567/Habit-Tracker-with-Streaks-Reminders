"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput, GlassTextarea } from "@/components/ui/GlassInput";
import { Spinner } from "@/components/ui/Spinner";
import { FrequencySelector } from "@/components/habits/FrequencySelector";
import { CategoryFilter } from "@/components/categories/CategoryFilter";
import { useHabitStore } from "@/store/habitStore";
import { useCategories } from "@/hooks/useCategories";
import { HABIT_COLORS } from "@/lib/constants";
import type { Habit, HabitFrequency } from "@/types";

export default function EditHabitPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { habits, isLoading } = useHabitStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={32} />
      </div>
    );
  }

  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-white/40">Habit not found.</p>
        <GlassButton variant="secondary" onClick={() => window.history.back()}>
          Go Back
        </GlassButton>
      </div>
    );
  }

  return <EditForm habit={habit} />;
}

function EditForm({ habit }: { habit: Habit }) {
  const router = useRouter();
  const { categories } = useCategories();
  const { updateHabit, deleteHabit } = useHabitStore();

  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description);
  const [color, setColor] = useState(habit.color);
  const [categoryId, setCategoryId] = useState<string | null>(habit.categoryId);
  const [frequency, setFrequency] = useState<HabitFrequency>(habit.frequency);
  const [customDays, setCustomDays] = useState(habit.customDays ?? []);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateHabit({
      ...habit,
      name: name.trim(),
      description: description.trim(),
      color,
      categoryId,
      frequency,
      customDays: frequency === "custom" ? customDays : undefined,
      updatedAt: new Date().toISOString(),
    });
    router.push(`/habits/${habit.id}`);
  };

  const handleDelete = async () => {
    await deleteHabit(habit.id);
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
          <h2 className="text-2xl font-bold text-white/90">Edit Habit</h2>
          <p className="text-sm text-white/35">{habit.name}</p>
        </div>
      </motion.div>

      <GlassCard className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Basic Info</h3>
        <GlassInput label="Habit Name" value={name} onChange={(e) => setName(e.target.value)} />
        <GlassTextarea label="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
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
        <CategoryFilter categories={categories} selected={categoryId} onSelect={setCategoryId} />
      </GlassCard>

      <GlassCard className="p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Frequency</h3>
        <FrequencySelector value={frequency} onChange={setFrequency} customDays={customDays} onCustomDaysChange={setCustomDays} />
      </GlassCard>

      <div className="flex gap-3">
        <GlassButton variant="danger" className="flex-none" onClick={handleDelete} disabled={saving}>
          Delete
        </GlassButton>
        <GlassButton variant="secondary" onClick={() => router.back()} className="flex-1">
          Cancel
        </GlassButton>
        <GlassButton variant="primary" className="flex-1" onClick={handleSave} disabled={saving || !name.trim()}>
          {saving ? "Saving…" : "Save Changes"}
        </GlassButton>
      </div>
    </div>
  );
}
